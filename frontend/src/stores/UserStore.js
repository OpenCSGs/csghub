import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCookies } from 'vue3-cookies'

const persistKey = 'user-store'

const useUserStore = defineStore('User', () => {
  const { cookies } = useCookies()
  const username = ref('')
  const nickname = ref('')
  const email = ref('')
  const phone = ref('')
  const avatar = ref('')
  const uuid = ref('')
  const homepage = ref('')
  const bio = ref('')
  const roles = ref([])
  const orgs = ref([])
  const lastLoginTime = ref('')
  const initialized = ref(false)
  const timestamp = ref(Date.now())
  const csgPaginationPerpage = ref({})

  const canChangeUsernameCookie = ref(cookies.get('can_change_username') === 'true');

  const isLoggedIn = computed(() => uuid.value !== '')
  const isAdmin = computed(() => roles.value.includes('admin') || roles.value.includes('super_user'))
  const isSuperUser = computed(() => roles.value.includes('super_user'))
  const canChangeUsername = computed({
    get: () => isLoggedIn.value ? canChangeUsernameCookie.value : false,
    set: (value) => value
  })
  const hasEmail = computed(() => isLoggedIn.value && !!email.value )
  const actionLimited = computed(() => isLoggedIn.value && (!hasEmail.value || canChangeUsername.value))

  async function initialize(initialData) {
    username.value = initialData.username || ''
    nickname.value = initialData.nickname || ''
    email.value = initialData.email || ''
    phone.value = initialData.phone || ''
    avatar.value = initialData.avatar || ''
    uuid.value = initialData.uuid || ''
    homepage.value = initialData.homepage || ''
    bio.value = initialData.bio || ''
    roles.value = initialData.roles || []
    if (initialData.orgs) {
      orgs.value = initialData.orgs
    }
    lastLoginTime.value = initialData.lastLoginTime || ''
    initialized.value = true
  }

  const refreshCanChangeUsernameCookie = () => {
    canChangeUsernameCookie.value = cookies.get('can_change_username') === 'true'
  }

  const clearStore = () => {
    localStorage.removeItem(persistKey)
  }

  const updateInitalized = (initializedData) => {
    initialized.value = initializedData
  }

  const updateCsgPaginationPerpage = (pageType, perpage) => {
      csgPaginationPerpage.value[pageType] = perpage
  }

  return {
    username,
    nickname,
    email,
    phone,
    avatar,
    uuid,
    initialize,
    isLoggedIn,
    homepage,
    bio,
    roles,
    orgs,
    lastLoginTime,
    initialized,
    isAdmin,
    isSuperUser,
    canChangeUsername,
    actionLimited,
    hasEmail,
    refreshCanChangeUsernameCookie,
    clearStore,
    updateInitalized,
    timestamp,
    csgPaginationPerpage,
    updateCsgPaginationPerpage
  }
}, {
  persist: {
    key: persistKey
  }
})

export default useUserStore
