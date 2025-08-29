<template>
  <div class="py-[32px] md:px-[10px]">
    <template v-if="!isDataLoading">
      <DiscussionCards
        v-if="communityActionName === 'list'"
        :cards="cards"
        @getDiscussion="getDiscussion"
        @updateDetails="updateDetails"
        @changeFlag="changeFlag"
        @showDiscussionDetail="showDiscussionDetail"
        @showNewDiscussion="showNewDiscussion">
      </DiscussionCards>
      
      <NewCommunityDiscussion
        v-if="communityActionName === 'new'"
        :repoType="repoType"
        :repoPath="repoPath"
        @getDiscussion="getDiscussion"
        @changeFlag="changeFlag">
      </NewCommunityDiscussion>
      
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
    <LoadingSpinner 
      :loading="isDataLoading" 
      :text="$t('repo.loadingCommunity')" 
    />
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
  import LoadingSpinner from '../shared/LoadingSpinner.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { useRepoTabStore } from '../../stores/RepoTabStore'
  import { validateCommunityActionName, ToNotFoundPage } from '../../packs/utils'

  const props = defineProps({
    repoType: String,
    repoPath: String
  })

  const router = useRouter()
  const route = useRoute()
  const { repoTab, setRepoTab } = useRepoTabStore()
  
  const cards = ref([])
  const lastCommentId = ref('')
  
  const discussionId = ref('')
  const currentDiscussionTitle = ref('')
  const currentDiscussionUserName = ref('')
  const currentDiscussionCreateUserId = ref('')
  const currentDiscussionTime = ref('')
  const currentDiscussionData = ref(null)

  const isDataLoading = ref(false)

  const getDiscussion = async () => {
    isDataLoading.value = true
    if (!props.repoPath || props.repoPath === '') {
      isDataLoading.value = false
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
      } else {
        ElMessage({
          message: error.value.msg,
          type: 'warning'
        })
      }
    } catch (error) {
    } finally {
      isDataLoading.value = false
    }
  }

  const communityActionName = computed(() => {
    return repoTab.communityActionName || 'list'
  })

  // 监听路由变化
  watch([() => route.query, () => props.repoPath], ([newQuery, newPath]) => {
    if (newQuery.tab === 'community' && newPath) {
      const actionName = validateCommunityActionName(newQuery.actionName)
      const discussionIdParam = newQuery.discussionId || ''
      
      if (actionName !== repoTab.communityActionName || discussionIdParam !== repoTab.discussionId) {
        setRepoTab({
          communityActionName: actionName,
          discussionId: discussionIdParam
        })
        
        if (actionName === 'detail' && discussionIdParam) {
          discussionId.value = discussionIdParam
          const discussion = cards.value.find(card => card.id.toString() === discussionIdParam)
          if (discussion) {
            setDiscussionDetailData(discussion)
          } else {
            fetchDiscussionDetail(discussionIdParam)
          }
        }
      }
      
      if (actionName === 'list') {
        getDiscussion()
      }
    }
  }, { deep: true, immediate: false })

  const fetchDiscussionDetail = async (id) => {
    isDataLoading.value = true
    try {
      const { response, data, error } = await useFetchApi(`/discussions/${id}`).json()

      if (response?.value?.status === 404) {
        ToNotFoundPage()
        return
      }

      if (data.value) {
        const discussion = data.value.data
        setDiscussionDetailData(discussion)
      } else {
        ElMessage.error(error.value?.msg || '')
        toggleDetails()
      }
    } catch (error) {
      toggleDetails()
    } finally {
      isDataLoading.value = false
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
    const validatedFlag = validateCommunityActionName(flag)
    const query = {
      tab: 'community',
      actionName: validatedFlag
    }
    
    setRepoTab({
      communityActionName: validatedFlag,
      discussionId: ''
    })
    
    router.push({
      path: router.currentRoute.value.path,
      query
    })
    
    if (validatedFlag === 'list') {
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

  onMounted(() => {
    const params = new URLSearchParams(window.location.search)
    
    const urlTab = params.get('tab')
    const urlActionName = params.get('actionName')
    const urlDiscussionId = params.get('discussionId')
    
    if (urlTab === 'community') {
      const actionName = validateCommunityActionName(urlActionName)
      
      setRepoTab({
        communityActionName: actionName,
        discussionId: urlDiscussionId || ''
      })
      
      if (actionName === 'detail' && urlDiscussionId) {
        discussionId.value = urlDiscussionId
        fetchDiscussionDetail(urlDiscussionId)
      } else if (actionName === 'list') {
        getDiscussion()
      }
    }
  })
</script>
