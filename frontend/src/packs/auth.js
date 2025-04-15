import useUserStore from '@/stores/UserStore'
import { useCookies } from 'vue3-cookies'

const DOMAINS = [
  { path: '/', domain: 'localhost' },
]

const clearCookies = () => {
  const { cookies } = useCookies()
  const cookieKeys = cookies.keys()

  cookieKeys.forEach((cookieName) => {
    if (cookieName === 'locale') return

    cookies.remove(cookieName)

    DOMAINS.forEach(({ path, domain }) => {
      cookies.remove(cookieName, path, domain)
    })
  })
}

const clearUserStore = () => {
  const userStore = useUserStore()
  userStore.clearStore()
}

const logout = () => {
  try {
    clearUserStore()
    clearCookies()

    return { success: true }
  } catch (error) {
    console.error('logout error:', error)
    return { success: false, error }
  }
}

export { clearCookies, clearUserStore, logout }
