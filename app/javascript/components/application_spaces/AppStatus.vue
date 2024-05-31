<template>
  <BuildStatus
    v-if="statusType === 'build'"
    :statusName="appStatusDisplayName"
  />
  <SuccessStatus
    v-if="statusType === 'success'"
    :statusName="appStatusDisplayName"
  />
  <WarningStatus
    v-if="statusType === 'warning'"
    :statusName="appStatusDisplayName"
  />
  <ErrorStatus
    v-if="statusType === 'error'"
    :statusName="appStatusDisplayName"
  />
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

  const { t } = useI18n()

  const spaceResourceDisplayNameWithString = () => {
    switch (props.spaceResource) {
      case 'CPU basic · 2 vCPU · 16 GB':
        return ' (CPU)'
      case 'NVIDIA T4 · 4 vCPU · 16 GB':
        return ' (GPU)'
      case 'NVIDIA A10G · 4 vCPU · 16 GB':
        return ' (GPU)'
      case 'NVIDIA A10G · 12 vCPU · 46 GB':
        return ' (GPU)'
      default:
        return ''
    }
  }

  const spaceResourceDisplayName = computed(() => {
    try {
      const resource = JSON.parse(props.spaceResource)
      if (resource && resource['gpu']) {
        return `(GPU ${resource['gpu']['type']})`
      } else if (resource && resource['cpu']) {
        return `(CPU ${resource['cpu']['type']})`
      } else {
        return ''
      }
    } catch (e) {
      return spaceResourceDisplayNameWithString()
    }
  })

  const appStatusDisplayName = computed(() => {
    switch (props.appStatus) {
      case 'NoAppFile':
      case 'NoNGINXConf':
        return t('application_spaces.status.noAppfile')
      case 'Building':
        return t('application_spaces.status.building')
      case 'Deploying':
        return t('application_spaces.status.deploying')
      case 'Starup':
        return t('application_spaces.status.startup')
      case 'Running':
        return t('application_spaces.status.running') + spaceResourceDisplayName.value
      case 'Sleeping':
        return t('application_spaces.status.sleeping')
      case 'Stopped':
        return t('application_spaces.status.stopped')
      case 'BuildingFailed':
        return t('application_spaces.status.buildingFailed')
      case 'DeployFailed':
        return t('application_spaces.status.deployFailed')
      case 'RuntimeError':
        return t('application_spaces.status.runtimeError')
      default:
        return '未知'
    }
  })

  const statusType = computed(() => {
    switch (props.appStatus) {
      case 'Building':
      case 'Deploying':
      case 'Starup':
        return 'build'
      case 'Running':
        return 'success'
      case 'NoAppFile':
      case 'NoNGINXConf':
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
