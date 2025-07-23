<template>
  <div class="py-[32px] md:px-[10px]">
    <template v-if="!loading">
      <!-- 讨论列表 -->
      <DiscussionCards
        v-if="communityActionName === 'list'"
        :cards="cards"
        @getDiscussion="getDiscussion"
        @updateDetails="updateDetails"
        @changeFlag="changeFlag"
        @showDiscussionDetail="showDiscussionDetail"
        @showNewDiscussion="showNewDiscussion">
      </DiscussionCards>
      
      <!-- 新建讨论 -->
      <NewCommunityDiscussion
        v-if="communityActionName === 'new'"
        :repoType="repoType"
        :repoPath="repoPath"
        @getDiscussion="getDiscussion"
        @changeFlag="changeFlag">
      </NewCommunityDiscussion>
      
      <!-- 讨论详情 -->
      <DiscussionDetails
        v-if="communityActionName === 'detail'"
        :discussionId="discussionId"
        :title="currentDiscussionTitle"
        :userName="currentDiscussionUserName"
        :createUserId="currentDiscussionCreateUserId"
        :time="currentDiscussionTime"
        :discussionData="currentDiscussionData"
        @getDiscussion="getDiscussion"
        @toggleDetails="toggleDetails"
        @refreshDiscussions="handleRefreshDiscussions">
      </DiscussionDetails>
    </template>
    <el-skeleton v-else class="mt-4" :rows="5" animated />
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { format } from 'timeago.js'
  import dayjs from 'dayjs'
  import DiscussionCards from './DiscussionCards.vue'
  import NewCommunityDiscussion from './NewCommunityDiscussion.vue'
  import DiscussionDetails from './DiscussionDetails.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { useRepoTabStore } from '../../stores/RepoTabStore'

  const props = defineProps({
    repoType: String,
    repoPath: String
  })

  const router = useRouter()
  const route = useRoute()
  const { repoTab, setRepoTab } = useRepoTabStore()
  
  const loading = ref(true)
  const cards = ref([])
  const lastCommentId = ref('')
  
  // 讨论详情相关数据
  const discussionId = ref('')
  const currentDiscussionTitle = ref('')
  const currentDiscussionUserName = ref('')
  const currentDiscussionCreateUserId = ref('')
  const currentDiscussionTime = ref('')
  const currentDiscussionData = ref(null)

  // 计算属性：从store获取社区操作状态
  const communityActionName = computed(() => {
    return repoTab.communityActionName || 'list'
  })

  // 监听路由变化
  watch(() => route.query, (newQuery) => {
    if (newQuery.tab === 'community') {
      const actionName = newQuery.actionName || 'list'
      const discussionIdParam = newQuery.discussionId || ''
      
      if (actionName !== repoTab.communityActionName || discussionIdParam !== repoTab.discussionId) {
        setRepoTab({
          communityActionName: actionName,
          discussionId: discussionIdParam
        })
        
        // 如果是详情页面，需要获取讨论详情数据
        if (actionName === 'detail' && discussionIdParam) {
          discussionId.value = discussionIdParam
          // 先尝试从cards中找到对应的讨论详情
          const discussion = cards.value.find(card => card.id.toString() === discussionIdParam)
          if (discussion) {
            setDiscussionDetailData(discussion)
          } else {
            // 如果cards中没有找到，则独立获取讨论详情
            fetchDiscussionDetail(discussionIdParam)
          }
        }
      }
      
      // 确保每次访问讨论列表页面时都获取最新数据
      if (actionName === 'list') {
        getDiscussion()
      }
    }
  }, { deep: true, immediate: true })

  // 独立获取讨论详情的函数
  const fetchDiscussionDetail = async (id) => {
    try {
      const { data, error } = await useFetchApi(`/discussions/${id}`).json()
      if (data.value) {
        const discussion = data.value.data
        setDiscussionDetailData(discussion)
        loading.value = false
      } else {
        ElMessage.error(error.value?.msg || '获取讨论详情失败')
        loading.value = false
        toggleDetails()
      }
    } catch (error) {
      ElMessage.error('获取讨论详情失败')
      loading.value = false
      toggleDetails()
    }
  }

  const setDiscussionDetailData = (discussion) => {
    currentDiscussionTitle.value = discussion.title
    currentDiscussionUserName.value = discussion.user.name
    currentDiscussionCreateUserId.value = discussion.user.id
    currentDiscussionTime.value = formatDate(discussion.created_at)
    currentDiscussionData.value = discussion
  }

  const formatDate = (date) => {
    if (!date) return ""
    
    try {
      const parsedTime = new Date(date)
      const now = new Date()
      const diffInDays = Math.abs(now - parsedTime) / (1000 * 60 * 60 * 24)
      
      if (diffInDays <= 7) {
        const locale = 'zh_CN'
        return format(parsedTime, locale)
      } else {
        return dayjs(parsedTime).format('YYYY-MM-DD')
      }
    } catch (error) {
      return dayjs(date).format('YYYY-MM-DD')
    }
  }

  const updateDetails = (card) => {
    lastCommentId.value = card.id
  }

  const changeFlag = (flag) => {
    const query = {
      tab: 'community',
      actionName: flag
    }
    
    setRepoTab({
      communityActionName: flag,
      discussionId: ''
    })
    
    router.push({
      path: router.currentRoute.value.path,
      query
    })
    
    // 如果切换到列表页面，重新获取讨论列表
    if (flag === 'list') {
      getDiscussion()
    }
  }

  const showDiscussionDetail = (discussion) => {
    const query = {
      tab: 'community',
      actionName: 'detail',
      discussionId: discussion.id.toString()
    }
    
    setRepoTab({
      communityActionName: 'detail',
      discussionId: discussion.id.toString()
    })
    
    discussionId.value = discussion.id.toString()
    setDiscussionDetailData(discussion)
    
    router.push({
      path: router.currentRoute.value.path,
      query
    })
  }

  const showNewDiscussion = () => {
    const query = {
      tab: 'community',
      actionName: 'new'
    }
    
    setRepoTab({
      communityActionName: 'new',
      discussionId: ''
    })
    
    router.push({
      path: router.currentRoute.value.path,
      query
    })
  }

  const toggleDetails = () => {
    const query = {
      tab: 'community',
      actionName: 'list'
    }
    
    setRepoTab({
      communityActionName: 'list',
      discussionId: ''
    })
    
    router.push({
      path: router.currentRoute.value.path,
      query
    })
  }

  const handleRefreshDiscussions = () => {
    getDiscussion()
    toggleDetails()
  }

  const getDiscussion = async () => {
    if (!props.repoPath || props.repoPath === '') {
      loading.value = false
      return
    }
    
    let discussionCreateEndpoint = `/${props.repoType}s/${props.repoPath}/discussions`
    if (props.repoType === 'mcp') {
      discussionCreateEndpoint = `/mcpserver/${props.repoPath}/discussions`
    }
    
    try {
      const { data, error } = await useFetchApi(discussionCreateEndpoint).json()
      if (data.value) {
        const discussions = data.value.data.discussions || []
        cards.value = discussions.sort((a, b) => b.id - a.id)
        loading.value = false
      } else {
        ElMessage({
          message: error.value.msg,
          type: 'warning'
        })
        loading.value = false
      }
    } catch (error) {
      loading.value = false
    }
  }

  onMounted(() => {
    // 从URL参数恢复状态
    const params = new URLSearchParams(window.location.search)
    
    const urlTab = params.get('tab')
    const urlActionName = params.get('actionName')
    const urlDiscussionId = params.get('discussionId')
    
    if (urlTab === 'community') {
      const actionName = urlActionName || 'list'
      
      setRepoTab({
        communityActionName: actionName,
        discussionId: urlDiscussionId || ''
      })
      
      if (actionName === 'detail' && urlDiscussionId) {
        discussionId.value = urlDiscussionId
        // 直接获取讨论详情，不依赖讨论列表
        fetchDiscussionDetail(urlDiscussionId)
        // 同时获取讨论列表（用于其他功能）
        getDiscussion()
      } else if (actionName === 'list') {
        // 确保列表页面一定会获取数据
        getDiscussion()
      }
    } else {
      // 默认情况下也获取讨论列表
      getDiscussion()
    }
  })
</script>
