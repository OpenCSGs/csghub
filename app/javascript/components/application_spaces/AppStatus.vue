<template>
  <BuildStatus v-if="statusType === 'build'" :statusName="appStatusDisplayName" />
  <SuccessStatus v-if="statusType === 'success'" :statusName="appStatusDisplayName" />
  <WarningStatus v-if="statusType === 'warning'" :statusName="appStatusDisplayName" />
  <ErrorStatus v-if="statusType === 'error'" :statusName="appStatusDisplayName" />
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import BuildStatus from './BuildStatus.vue'
  import WarningStatus from './WarningStatus.vue'
  import ErrorStatus from './ErrorStatus.vue'
  import SuccessStatus from './SuccessStatus.vue'

  const props = defineProps({
    appStatus: String
  })

  const { t } = useI18n();

  const appStatusDisplayName = computed(() => {
    switch(props.appStatus) {
      case 'NoAppFile':
        return t('application_spaces.status.noAppfile')
      case 'Building':
        return t('application_spaces.status.building')
      case 'Deploying':
        return t('application_spaces.status.deploying')
      case 'Starup':
        return t('application_spaces.status.startup')
      case 'Running':
        return t('application_spaces.status.running')
      case 'Sleeping':
        return t('application_spaces.status.sleeping')
      case 'Stopped':
        return t('application_spaces.status.stopped')
      case 'Building Failed':
        return t('application_spaces.status.buildingFailed')
      case 'Deploy Failed':
        return t('application_spaces.status.deployFailed')
      case 'Runtime Error':
        return t('application_spaces.status.runtimeError')
      default:
        return '未知'
    }
  })

  const statusType = computed(() => {
    switch(props.appStatus) {
      case 'Building':
      case 'Deploying':
      case 'Starup':
        return 'build'
      case 'Running':
        return 'success'
      case 'NoAppFile':
      case 'Sleeping':
      case 'Stopped':
        return 'warning'
      case 'Building Failed':
      case 'Deploy Failed':
      case 'Runtime Error':
        return 'error'
      default:
        return 'Unknown'
    }
  })
</script>