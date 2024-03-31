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
    appStatus: String,
    spaceResource: String
  })

  const { t } = useI18n();

  const spaceResourceDisplayName = computed(() => {
    switch(props.spaceResource) {
      case 'CPU basic · 2 vCPU · 16GB':
        return ' (CPU)'
      case 'NVIDIA T4 · 4 vCPU · 15 GB':
        return ' (T4)'
      case 'NVIDIA A10G · 4 vCPU · 15 GB':
        return ' (A10)'
      case 'NVIDIA A10G · 12 vCPU · 46 GB':
        return ' (A10)'
      default:
        return ''
    }
  })

  const appStatusDisplayName = computed(() => {
    switch(props.appStatus) {
      case 'NoAppFile':
        return t('application_spaces.status.noAppfile')
      case 'Building':
        return t('application_spaces.status.building') + spaceResourceDisplayName.value
      case 'Deploying':
        return t('application_spaces.status.deploying') + spaceResourceDisplayName.value
      case 'Starup':
        return t('application_spaces.status.startup') + spaceResourceDisplayName.value
      case 'Running':
        return t('application_spaces.status.running') + spaceResourceDisplayName.value
      case 'Sleeping':
        return t('application_spaces.status.sleeping') + spaceResourceDisplayName.value
      case 'Stopped':
        return t('application_spaces.status.stopped') + spaceResourceDisplayName.value
      case 'BuildingFailed':
        return t('application_spaces.status.buildingFailed') + spaceResourceDisplayName.value
      case 'DeployFailed':
        return t('application_spaces.status.deployFailed') + spaceResourceDisplayName.value
      case 'RuntimeError':
        return t('application_spaces.status.runtimeError') + spaceResourceDisplayName.value
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
      case 'BuildingFailed':
      case 'DeployFailed':
      case 'RuntimeError':
        return 'error'
      default:
        return 'Unknown'
    }
  })
</script>