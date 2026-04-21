<template>
  <ApiKeysManager
    :title="$t('organization.apiKeys.title')"
    :subtitle="$t('organization.apiKeys.subtitle')"
    :can-manage="role === 'admin'"
    :api-paths="apiPaths"
    :missing-path-message="$t('organization.apiKeys.missingOrgUuid')"
  />
</template>

<script setup>
  import { computed } from 'vue'
  import ApiKeysManager from '../shared/ApiKeysManager.vue'

  const props = defineProps({
    organizationRaw: {
      type: Object,
      required: true
    },
    role: {
      type: String,
      default: ''
    }
  })

  const apiPaths = computed(() => {
    const uuid = (props.organizationRaw?.namespace_uuid || '').toString().trim()
    if (!uuid) {
      return {
        list: '',
        create: '',
        updateBase: '',
        deleteBase: ''
      }
    }

    const base = `/namespaces/${uuid}/apikeys`
    return {
      list: base,
      create: base,
      updateBase: base,
      deleteBase: base
    }
  })
</script>
