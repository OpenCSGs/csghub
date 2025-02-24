import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const useUserStore = defineStore('User', () => {
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

  const isLoggedIn = computed(() => username.value !== '')
  const isAdmin = computed(() => roles.value.includes('admin') || roles.value.includes('super_user'))
  const isSuperUser = computed(() => roles.value.includes('super_user'))

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
    isSuperUser
  }
})

export default useUserStore
