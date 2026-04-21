<template>
  <div
    class="flex justify-center md:flex-col rounded-md page-responsive-width bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="profileName"
    ></Menu>
    <div class="grow flex flex-col px-6 py-10 border-l md:border-l-0 min-h-[calc(100vh-153px)] md:min-h-0">
      <ApiKeysManager
        :title="$t('profile.apiKeys.title')"
        :subtitle="$t('profile.apiKeys.subtitle')"
        :can-manage="true"
        :api-paths="apiPaths"
        :missing-path-message="$t('apiKeys.missingUserName')"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import Menu from './Menu.vue'
  import ApiKeysManager from '../shared/ApiKeysManager.vue'
  import useUserStore from '../../stores/UserStore'

  const userStore = useUserStore()
  const { username: profileName, namespaces: userNamespaces, uuid: userUuid } = storeToRefs(userStore)
  const namespaceUuid = ref('')
  const refreshingUserInfo = ref(false)

  const resolveUserNamespaceUuid = (items) => {
    if (!Array.isArray(items)) return ''

    const target = items.find((item) => {
      const type = (item?.Type || item?.type || '').toString().toLowerCase()
      return type === 'user'
    })

    return target?.UUID || target?.uuid || ''
  }

  const syncUserNamespace = async () => {
    const cachedNamespaceUuid = resolveUserNamespaceUuid(userNamespaces.value)

    if (cachedNamespaceUuid) {
      namespaceUuid.value = cachedNamespaceUuid
      return
    }

    if (refreshingUserInfo.value || !userUuid.value) {
      namespaceUuid.value = ''
      return
    }

    refreshingUserInfo.value = true
    try {
      const refreshed = await userStore.fetchUserInfo()
      if (!refreshed) {
        namespaceUuid.value = ''
        return
      }

      namespaceUuid.value = resolveUserNamespaceUuid(userStore.namespaces) || ''
    } finally {
      refreshingUserInfo.value = false
    }
  }

  const apiPaths = computed(() => {
    const uuid = (namespaceUuid.value || '').trim()
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

  watch([userNamespaces, userUuid], () => {
    syncUserNamespace()
  })

  onMounted(() => {
    syncUserNamespace()
  })
</script>
