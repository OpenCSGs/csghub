<template>
  <div class="relative repo-tabs-child">
    <el-tabs
      v-model="activeName"
      @tab-change="handleTabChange"
      :before-leave="handleBeforeLeave"
    >
      <!-- repo/endpoint summary -->
      <el-tab-pane
        :label="summaryLabel"
        name="summary"
        lazy
      >
        <slot name="summary"></slot>
      </el-tab-pane>

      <!-- endpoint/space analysis -->
      <el-tab-pane
        v-if="repoType === 'endpoint' || repoType === 'space'"
        :label="$t('all.analysis')"
        name="analysis"
        class="min-h-[300px]"
        lazy
      >
        <slot name="analysis"></slot>
      </el-tab-pane>

      <!-- repo files -->
      <el-tab-pane
        v-if="showFiles"
        :label="$t('all.files')"
        name="files"
        lazy
      >
        <slot name="files"></slot>
      </el-tab-pane>

      <!-- mcp schema -->
      <el-tab-pane
        v-if="repoType === 'mcp'"
        :label="$t('all.schema')"
        name="schema"
        class="min-h-[300px]"
        lazy
      >
        <slot name="schema"></slot>
      </el-tab-pane>

      <!-- repo community -->
      <el-tab-pane
        v-if="repoType !== 'endpoint'"
        :label="$t('all.community')"
        name="community"
        class="min-h-[300px]"
        lazy
      >
        <slot name="community"></slot>
      </el-tab-pane>

      <!-- endpoint logs -->
      <el-tab-pane
        v-if="repoType === 'endpoint'"
        :label="$t('all.logs')"
        name="logs"
        class="min-h-[300px]"
        lazy
      >
        <slot name="logs"></slot>
      </el-tab-pane>

       <!-- billing -->
       <el-tab-pane
        v-if="(repoType === 'endpoint' || repoType === 'space') && settingsVisibility"
        :label="$t('billing.billing')"
        name="billing"
        class="min-h-[300px]"
        lazy
      >
        <slot name="billing"></slot>
      </el-tab-pane>

      <!-- repo settings -->
      <el-tab-pane
        v-if="settingsVisibility && repo.syncStatus !== 'pending'"
        :label="$t('all.settings')"
        name="settings"
        class="min-h-[300px]"
        lazy
      >
        <slot name="settings"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
  import { ref, computed, watch, inject, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useRepoTabStore } from '../../stores/RepoTabStore'

  const { t } = useI18n()
  const { repoTab, setRepoTab } = useRepoTabStore()
  const router = useRouter()
  const route = useRoute()

  const props = defineProps({
    defaultTab: String,
    settingsVisibility: Boolean,
    repoType: String,
    sdk: String,
    repo: Object,
    syncStatus: String,
    path: String
  })

  const emit = defineEmits(['tabChange'])
  const fetchRepoDetail = inject('fetchRepoDetail')

  const summaryLabel = computed(() => {
    if (props.repoType === 'space') {
      return t('application_spaces.app')
    } else if (props.repoType === 'endpoint') {
      return t('endpoints.summary')
    } else {
      return t('all.summary')
    }
  })

  const showFiles = computed(() => {
    if (props.repoType === 'endpoint') return false
    if (props.repoType === 'space' && props.sdk === 'nginx') return props.settingsVisibility

    return true
  });

  // 当前激活的tab名称
  const activeName = ref('summary')  // 默认值

  const handleBeforeLeave = (newTab, oldTab) => {
    // 在这里记录上一个 tab 的位置
    // setRepoTab({
    //   ...repoTab,
    //   previousTab: oldTab
    // })
    // return true
  }

  watch(activeName, (newTab) => {
    if (repoTab.tab !== newTab) {
      if(newTab === 'settings') {
        fetchRepoDetail()
      }
    }
  })

  const validTabs = computed(() => {
    const baseTabs = ['summary', 'files', 'billing', 'community', 'settings']
    
    if(props.repoType === 'endpoint') {
      baseTabs.push('logs')
    }
    if (props.repoType === 'endpoint' || props.repoType === 'space') {
      baseTabs.push('analysis')
    } 
    if (props.repoType === 'mcp') {
      baseTabs.push('schema')
    }
    
    return baseTabs
  })

  const getDefaultTab = () => {
    return props.defaultTab || 'summary'
  }

  const isValidTab = (tab) => {
    return validTabs.value.includes(tab)
  }

  // 监听路由变化，当用户使用浏览器前进/后退按钮时更新tab
  watch(() => route.query, (newQuery) => {
    const newTab = newQuery.tab
    if (newTab && isValidTab(newTab) && newTab !== activeName.value) {
      activeName.value = newTab // 立即更新 activeName
      
      // 如果是 files tab，处理 actionName 相关参数
      if (newTab === 'files') {
        setRepoTab({
          tab: newTab,
          actionName: newQuery.actionName || 'files',
          lastPath: newQuery.path || '',
          currentBranch: newQuery.branch || repoTab.currentBranch
        })
      } else if (newTab === 'community') {
        setRepoTab({
          tab: newTab,
          communityActionName: newQuery.actionName || 'list',
          discussionId: newQuery.discussionId || '',
        })
      } else {
        setRepoTab({
          tab: newTab,
          actionName: 'files',
          lastPath: ''
        })
      }
    }
  }, { deep: true })

  const handleTabChange = (tab, type) => {
    if (!isValidTab(tab)) {
      tab = getDefaultTab()
      router.push({
        path: `/${props.repoType}s/${props.path}`,
        query: { tab }
      })
      return
    }

    const params = new URLSearchParams(window.location.search)
    const urlTab = params.get('tab')

    const query = { tab }
    
    if (tab === 'files') {
      // 当切换到files tab时，需要确保有正确的actionName
      const urlActionName = params.get('actionName')
      const currentTab = params.get('tab')
      
      // 如果当前在community tab，切换到files时重置为默认的files状态
      if (currentTab === 'community') {
        query.actionName = 'files'
        // 清除community相关的参数，使用默认的文件列表状态
        query.path = ''
        query.branch = repoTab.currentBranch || ''
      } else {
        // 保留URL中的actionName参数，如果没有则默认为'files'
        query.actionName = urlActionName || 'files'
        
        const currentUrlPath = params.get('path')
        const urlBranch = params.get('branch')
        
        if (currentUrlPath) query.path = currentUrlPath
        if (urlBranch) query.branch = urlBranch
      }
    } else if (tab === 'community') {
      // 处理社区讨论的URL参数
      const urlActionName = params.get('actionName')
      const currentTab = params.get('tab')
      
      // 如果当前在files tab，切换到community时重置actionName
      if (currentTab === 'files' || !currentTab) {
        query.actionName = 'list'
      } else {
        // 如果已经在community tab，保留现有的actionName
        query.actionName = urlActionName || 'list'
      }
      
      const urlDiscussionId = params.get('discussionId')
      if (urlDiscussionId) query.discussionId = urlDiscussionId
    }

    setRepoTab({
      tab,
      actionName: tab === 'files' ? (query.actionName || 'files') : 'files',
      lastPath: tab === 'files' ? (query.path || '') : '',
      communityActionName: tab === 'community' ? (query.actionName || 'list') : 'list',
      discussionId: tab === 'community' ? (query.discussionId || '') : ''
    })

    router.push({
      path: props.repoType === 'mcp' ? `/${props.repoType}/servers/${props.path}` : `/${props.repoType}s/${props.path}`,
      query
    })
  }

  onMounted(() => {
    const params = new URLSearchParams(window.location.search)
    const urlTab = params.get('tab')
    const urlActionName = params.get('actionName')
    const urlPath = params.get('path')
    const urlBranch = params.get('branch')
    const urlDiscussionId = params.get('discussionId')
    
    if (urlTab && isValidTab(urlTab)) {
      // 如果有URL参数，直接设置状态
      if (urlTab === 'files' && urlActionName) {
        setRepoTab({
          tab: urlTab,
          actionName: urlActionName,
          lastPath: urlPath || '',
          currentBranch: urlBranch || repoTab.currentBranch
        })
        activeName.value = urlTab
      } else if (urlTab === 'community') {
        setRepoTab({
          tab: urlTab,
          communityActionName: urlActionName || 'list',
          discussionId: urlDiscussionId || '',
        })
        activeName.value = urlTab
      } else {
        activeName.value = urlTab
      }
    } else {
      // 使用props中的默认值
      const defaultTab = props.defaultTab || getDefaultTab()
      activeName.value = defaultTab
    }
  })
</script>

<style>
  .el-tabs__header {
    margin-bottom: 0;
    z-index: 0;
  }

  /* 修改选中的文字颜色 */
  .el-tabs__item.is-active {
    color: #223B99;
  }

  /* 修改选中标签的颜色 */
  .el-tabs__active-bar {
    background-color: #223B99;
  }

  /* 修改选项卡中的文字大小 */
  .el-tabs__item {
    font-size: 16px;
    font-weight: 400;
  }

  .el-tabs__item.is-top {
    color: #667085;
    font-weight: 400;
  }

  .el-tabs {
    color: #667085;
  }

  .el-tabs__nav-wrap:after {
    height: 0px;
  }

  .el-tabs__nav-scroll {
    @media screen and (max-width: 768px) {
      padding-left: 20px;
    }
  }

  .el-tabs__content {
    border: none;
  }

  .repo-tabs-child .el-tabs__content {
    min-height: 600px;
  }
</style>
