import { useCookies } from 'vue3-cookies'
import { ElMessageBox } from 'element-plus'
import { logout } from './auth'
import { user_sessions as sessions_en } from '../locales/en_js/user_sessions.js'
import { user_sessions as sessions_zh } from '../locales/zh_js/user_sessions.js'

const { cookies } = useCookies()

export const popupReloginDialog = () => {
  const sessionLocale = cookies.get('locale') === 'en' ? sessions_en : sessions_zh
  ElMessageBox.confirm(sessionLocale.expiredDesc, sessionLocale.expiredTitle, {
    'show-close': false,
    'confirmButtonText': sessionLocale.reLogin,
    'cancelButtonText': sessionLocale.cancelLogin
  })
    .then(() => {
      window.location.href = '/logout?redirect_to=/login'
    })
    .catch(() => {
      window.location.href = '/logout'
    })
    .finally(() => {
      logout()
    })
}


