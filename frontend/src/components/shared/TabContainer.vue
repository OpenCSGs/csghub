<template>
  <div class="relative repo-tabs-child">
    <el-tabs
      v-model="activeName"
      @tab-change="handleTabChange"
      :before-leave="handleBeforeLeave"
    >
      <!-- repo/endpoint summary -->
      <el-tab-pane
        v-if="repoType !== 'notebook'"
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
        v-if="repoType !== 'endpoint' && repoType !== 'notebook'"
        :label="$t('all.community')"
        name="community"
        class="min-h-[300px]"
        lazy
      >
        <slot name="community"></slot>
      </el-tab-pane>

      <!-- endpoint/notebook logs -->
      <el-tab-pane
        v-if="repoType === 'endpoint' || repoType === 'notebook'"
        :label="$t('all.logs')"
        name="logs"
        class="min-h-[300px]"
        lazy
      >
        <slot name="logs"></slot>
      </el-tab-pane>

       <!-- billing -->
       <el-tab-pane
        v-if="(repoType === 'endpoint' || repoType === 'space' || repoType === 'notebook') && settingsVisibility"
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
  import { validateTab, validateActionName, validateCommunityActionName } from '../../packs/utils'

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
    if (props.repoType === 'endpoint' || props.repoType === 'notebook') return false
    if (props.repoType === 'dataset' && !isLoggedIn.value) return false
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

  const validTabs = computed(() => {
    if (props.repoType === 'notebook') {
      // notebook 仅有 logs/billing/settings 三个 tab
      return ['logs', 'billing', 'settings']
    }
    
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
    if (props.repoType === 'notebook') {
      // notebook 类型默认显示 logs tab
      return 'logs'
    }
    return props.defaultTab || 'summary'
  }

  const isValidTab = (tab) => {
    return validTabs.value.includes(tab)
  }

  // 抽离URL参数验证和重置逻辑
  const validateAndResetUrlParams = () => {
    const params = new URLSearchParams(window.location.search)
    const urlTab = params.get('tab')
    const validatedTab = validateTab(urlTab)
    const urlActionName = params.get('actionName')
    const urlPath = params.get('path')
    const urlBranch = params.get('branch')
    const urlDiscussionId = params.get('discussionId')

    let needUpdateUrl = false
    let hasExtraKeys = false
    const query = {}

    // 处理空 tab 参数的情况
    if (!urlTab) {
      query.tab = getDefaultTab()
      needUpdateUrl = true
    }
    // 处理无效 tab 参数的情况
    else if (urlTab && validatedTab === 'summary' && urlTab !== 'summary') {
      query.tab = 'summary'
      needUpdateUrl = true
    }
    // 处理有效 tab 参数的情况
    else if (validatedTab && isValidTab(validatedTab)) {
      query.tab = validatedTab
    }

    // actionName 校验
    if (validatedTab === 'files') {
      const validatedAction = validateActionName(urlActionName)
      if (urlActionName && validatedAction === 'files' && urlActionName !== 'files') {
        query.actionName = 'files'
        needUpdateUrl = true
      } else if (urlActionName) {
        query.actionName = validatedAction
      }
    } else if (validatedTab === 'community') {
      const validatedAction = validateCommunityActionName(urlActionName)
      if (urlActionName && validatedAction === 'list' && urlActionName !== 'list') {
        query.actionName = 'list'
        needUpdateUrl = true
      } else if (urlActionName) {
        query.actionName = validatedAction
      }
      // detail 必须带合法 discussionId；否则退回 list 并移除 discussionId
      const discussionIdValid = /^\d+$/.test(urlDiscussionId || '')
      if ((query.actionName || validatedAction) === 'detail') {
        if (!discussionIdValid) {
          query.actionName = 'list'
          needUpdateUrl = true
        }
      } else {
        // 非 detail 时不应携带 discussionId
        if (urlDiscussionId) {
          needUpdateUrl = true
        }
      }
    }

    // files 且 actionName=commit 时：从 URL 移除 branch（仅动 URL）
    const isCommitDropBranch =
      validatedTab === 'files' && query.actionName === 'commit' && !!urlBranch
    if (isCommitDropBranch) {
      needUpdateUrl = true
    }

    // 根据当前 tab 计算白名单
    const allowedKeys = new Set(['tab'])
    if (validatedTab === 'files') {
      allowedKeys.add('actionName')
      allowedKeys.add('path')
      if (query.actionName !== 'commit') {
        allowedKeys.add('branch')
      }
    } else if (validatedTab === 'community') {
      allowedKeys.add('actionName')
      if ((query.actionName || urlActionName) === 'detail') {
        allowedKeys.add('discussionId')
      }
    }

    // 发现非白名单 key → 需要清理
    for (const k of params.keys()) {
      if (!allowedKeys.has(k)) {
        hasExtraKeys = true
        needUpdateUrl = true
        break
      }
    }

    // 如需更新 URL，按白名单重建 query
    if (needUpdateUrl) {
      // tab
      if (!query.tab) {
        if (validatedTab && isValidTab(validatedTab)) {
          query.tab = validatedTab
        } else {
          query.tab = getDefaultTab()
        }
      }

      // files/community 附加参数
      if (query.tab === 'files') {
        if (!query.actionName && urlActionName) {
          query.actionName = validateActionName(urlActionName)
        }
        if (urlPath) query.path = urlPath
        if (urlBranch && query.actionName !== 'commit') query.branch = urlBranch
      } else if (query.tab === 'community') {
        if (!query.actionName && urlActionName) {
          query.actionName = validateCommunityActionName(urlActionName)
        }
        const discussionIdValid = /^\d+$/.test(urlDiscussionId || '')
        if (query.actionName === 'detail' && discussionIdValid) {
          query.discussionId = urlDiscussionId
        }
      }

      // 仅做 URL 清理：commit 去 branch 或存在多余 key 时，不动 store
      if (isCommitDropBranch || hasExtraKeys) {
        router.replace({
          path: props.repoType === 'mcp' ? `/${props.repoType}/servers/${props.path}` : `/${props.repoType}s/${props.path}`,
          query
        })
        return true
      }

      // 其它情形维持原处理（同时更新状态）
      router.replace({
        path: props.repoType === 'mcp' ? `/${props.repoType}/servers/${props.path}` : `/${props.repoType}s/${props.path}`,
        query
      })
      setRepoTab({
        tab: query.tab || getDefaultTab(),
        actionName: query.actionName || 'files',
        lastPath: '',
        currentBranch: urlBranch || repoTab.currentBranch
      })
      activeName.value = query.tab || getDefaultTab()
      return true
    }

    return false
  }

  // 监听路由变化，当用户使用浏览器前进/后退按钮时更新tab
  watch(() => route.query, (newQuery) => {
    if (validateAndResetUrlParams()) {
      return 
    }
    
    const newTab = validateTab(newQuery.tab)
    
    // 处理tab切换的情况
    if (newTab && newTab !== activeName.value) {
      activeName.value = newTab
      
      if (newTab === 'files') {
        setRepoTab({
          tab: newTab,
          actionName: validateActionName(newQuery.actionName),
          lastPath: newQuery.path || '',
          currentBranch: newQuery.branch || repoTab.currentBranch
        })
      } else if (newTab === 'community') {
        setRepoTab({
          tab: newTab,
          communityActionName: validateCommunityActionName(newQuery.actionName),
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
    
    // 处理同一个tab内部参数变化的情况（继承自RepoTabs的逻辑）
    else if (newTab === activeName.value) {
      if (newTab === 'files') {
        const actionName = validateActionName(newQuery.actionName)
        const newPath = newQuery.path || ''
        const newBranch = newQuery.branch || repoTab.currentBranch
        
        // 只有当参数发生变化时才更新，避免不必要的更新
        if (actionName !== repoTab.actionName || 
            newPath !== repoTab.lastPath || 
            newBranch !== repoTab.currentBranch) {
          setRepoTab({
            tab: newTab,
            actionName: actionName,
            lastPath: newPath,
            currentBranch: newBranch
          })
        }
      } else if (newTab === 'community') {
        const actionName = validateCommunityActionName(newQuery.actionName)
        const discussionId = newQuery.discussionId || ''
        
        // 只有当参数发生变化时才更新
        if (actionName !== repoTab.communityActionName || 
            discussionId !== repoTab.discussionId) {
          setRepoTab({
            tab: newTab,
            communityActionName: actionName,
            discussionId: discussionId,
          })
        }
      }
    }
  }, { deep: true })

  const handleTabChange = (tab, type) => {
    const validatedTab = validateTab(tab)
    if (validatedTab !== tab) {
      router.push({
        path: `/${props.repoType}s/${props.path}`,
        query: { tab: validatedTab }
      })
      return
    }

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
      const validatedActionName = validateActionName(urlActionName)
      const currentTab = params.get('tab')
      
      // 如果当前在community tab，切换到files时重置为默认的files状态
      if (currentTab === 'community') {
        query.actionName = 'files'
        // 清除community相关的参数，使用默认的文件列表状态
        query.path = ''
        query.branch = repoTab.currentBranch || ''
      } else {
        // 保留URL中的actionName参数，如果没有则默认为'files'
        query.actionName = validatedActionName
        
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
        query.actionName = validateCommunityActionName(urlActionName)
      }
      
      const urlDiscussionId = params.get('discussionId')
      if (urlDiscussionId) query.discussionId = urlDiscussionId
    }

    setRepoTab({
      tab,
      actionName: tab === 'files' ? (query.actionName || 'files') : (tab === 'community' ? (query.actionName || 'list') : 'files'),
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
    // 先验证和重置URL参数
    if (validateAndResetUrlParams()) {
      return
    }
    
    const params = new URLSearchParams(window.location.search)
    const urlTab = validateTab(params.get('tab'))
    const urlActionName = params.get('actionName')
    const urlPath = params.get('path')
    const urlBranch = params.get('branch')
    const urlDiscussionId = params.get('discussionId')
    
    // 正常处理有效参数
    if (urlTab && isValidTab(urlTab)) {
      if (urlTab === 'files' && urlActionName) {
        setRepoTab({
          tab: urlTab,
          actionName: validateActionName(urlActionName),
          lastPath: urlPath || '',
          currentBranch: urlBranch || repoTab.currentBranch
        })
        activeName.value = urlTab
      } else if (urlTab === 'community') {
        setRepoTab({
          tab: urlTab,
          communityActionName: validateCommunityActionName(urlActionName),
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
