<template>
  <div class="relative">
    <el-tabs
      v-model="activeName"
      :key="activeName"
      @tabClick="handleTabClick"
    >
      <!-- repo/endpoint summary -->
      <el-tab-pane
        :label="summaryLabel"
        name="summary"
        lazy
      >
        <slot name="summary"></slot>
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

      <!-- endpoint analysis -->
      <el-tab-pane
        v-if="repoType === 'endpoint'"
        :label="$t('all.analysis')"
        name="analysis"
        class="min-h-[300px]"
        lazy
      >
        <slot name="analysis"></slot>
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
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useRepoTabStore } from '../../stores/RepoTabStore'

  const { t } = useI18n()
  const { repoTab, setRepoTab } = useRepoTabStore()
  const router = useRouter()

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

  const activeName = ref(repoTab.tab)

  watch(activeName, (newTab) => {
    if (repoTab.tab !== newTab) {
      if(['summary', 'settings'].includes(newTab)) {
        fetchRepoDetail()
      }
    }
  })

  const handleTabClick = (tab) => {
    activeName.value = tab.paneName
    handleTabChange(tab.paneName)
    emit('tabChange', tab.paneName)
  }

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

  const handleTabChange = (tab, type) => {
    if (!isValidTab(tab)) {
      tab = getDefaultTab()
      router.replace({
        path: `/${props.repoType}s/${props.path}`,
        query: { tab }
      })
    }

    const params = new URLSearchParams(window.location.search)
    const urlTab = params.get('tab')
    if (tab === urlTab && type !== 'first') return

    setRepoTab({
      tab,
      actionName: 'files',
      // currentBranch: tab === 'files' ? repoTab.currentBranch : '',
      lastPath: ''
    })

    router.replace({
      path: props.repoType === 'mcp' ? `/${props.repoType}/servers/${props.path}` :  `/${props.repoType}s/${props.path}`,
      query: {
        tab
      }
    })
  }

  onMounted(() => {
    // const urlTab = route.query?.tab
    const params = new URLSearchParams(window.location.search)
    const urlTab = params.get('tab')
    if (urlTab && isValidTab(urlTab)) {
      handleTabChange(urlTab, 'first')
    } else {
      handleTabChange(getDefaultTab())
    }
    activeName.value = urlTab || getDefaultTab()
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
</style>
