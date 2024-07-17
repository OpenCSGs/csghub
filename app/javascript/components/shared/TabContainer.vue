<template>
  <div class="relative">
    <el-tabs
      v-model="activeName"
      :beforeLeave="handleTabLeave"
      @tabClick="handleTabClick"
    >
      <!-- repo/endpoint summary -->
      <el-tab-pane
        :label="summaryLabel"
        name="summary"
      >
        <slot name="summary"></slot>
      </el-tab-pane>

      <!-- repo files -->
      <el-tab-pane
        v-if="showFiles"
        :label="$t('all.files')"
        name="files"
      >
        <slot name="files"></slot>
      </el-tab-pane>

      <!-- repo community -->
      <el-tab-pane
        v-if="repoType !== 'endpoint' && !!localRepoId"
        :label="$t('all.community')"
        name="community"
        class="min-h-[300px]"
      >
        <slot name="community"></slot>
      </el-tab-pane>

      <!-- endpoint logs -->
      <el-tab-pane
        v-if="repoType === 'endpoint'"
        :label="$t('all.logs')"
        name="logs"
        class="min-h-[300px]"
      >
        <slot name="logs"></slot>
      </el-tab-pane>

      <!-- billing -->
      <el-tab-pane
        v-if="(repoType === 'endpoint' || repoType === 'space') && settingsVisibility"
        :label="$t('billing.billing')"
        name="billing"
        class="min-h-[300px]"
      >
        <slot name="billing"></slot>
      </el-tab-pane>

      <!-- repo settings -->
      <el-tab-pane
        v-if="settingsVisibility"
        :label="$t('all.settings')"
        name="settings"
        class="min-h-[300px]"
      >
        <slot name="settings"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import trackPageEvent from '../../packs/trackPageEvent'

  const { t } = useI18n()
  const nameMap = ref({ summary: 'card', files: 'file', community: 'comments' })

  const props = defineProps({
    defaultTab: String,
    settingsVisibility: Boolean,
    repoType: String,
    sdk: String,
    localRepoId: String,
    repo: Object
  })

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

  const activeName = ref(props.defaultTab)

  const emit = defineEmits(['tabChange'])

  const handleTabLeave = (tab) => {
    emit('tabChange', tab)
    return false
  }

  const handleTabClick = (tab) => {
    if (
      ['model', 'dataset', 'code', 'space'].includes(props.repoType) &&
      nameMap.value[tab.paneName]
    ) {
      trackPageEvent({
        id: `${props.repoType}-${nameMap.value[tab.paneName]}`,
        m: props.repoType
      })
    }
    if (tab.paneName === activeName.value) {
      emit('tabChange', tab.paneName)
    }
  }
</script>

<style>
  .el-tabs__header {
    margin-bottom: 0;
    z-index: 0;
  }

  .el-tabs__nav-wrap:after {
    height: 1px;
  }

  .el-tabs__nav-scroll {
    @media screen and (max-width: 768px) {
      padding-left: 20px;
    }
  }
</style>
