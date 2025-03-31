<template>
  <div class="flex gap-1">
    <el-tooltip
      :content="$t('repo.source.needSync')"
      placement="top"
    >
      <SvgIcon v-if="!!needSyncIcon" :name="needSyncIcon" />
    </el-tooltip>
    <el-tooltip
      :content="syncTooltip"
      placement="top"
    >
      <SvgIcon v-if="!!sourceIcon && !needSyncIcon" :name="sourceIcon" />
    </el-tooltip>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    source: String,
    syncStatus: String,
    httpCloneUrl: {
      type: String,
      default: ''
    }
  })

  const needSyncIcon = computed(() => {
    if (props.source !== 'opencsg') return ''

    return props.syncStatus !== 'completed'
      && !!props.httpCloneUrl
      ? 'repo_opencsg_need_sync'
      : ''
  })

  const sourceIcon = computed(() => {
    if (props.source !== 'opencsg') return ''

    return props.syncStatus === 'completed'
      ? 'repo_opencsg_completed'
      : 'repo_opencsg_sync'
  })

  const syncTooltip = computed(() => {
    if (props.source !== 'opencsg') return ''

    return props.syncStatus === 'completed'
      ? t('repo.source.syncCompleted')
      : t('repo.source.remoteResource')
  })
</script>