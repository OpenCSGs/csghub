import { useCookies } from 'vue3-cookies'
import { ElMessageBox } from 'element-plus'
import { user_sessions as sessions_en } from '../locales/en_js/user_sessions.js'
import { user_sessions as sessions_zh } from '../locales/zh_js/user_sessions.js'
import { logout } from './auth'
import { dialogState } from './dialogState'

const { cookies } = useCookies()

export const popupReloginDialog = () => {
  if (dialogState.isReloginDialogShowing) {
    return
  }
  
  dialogState.isReloginDialogShowing = true
  
  const currentURL = window.location.pathname + window.location.search + window.location.hash;
  cookies.set('previous_path', currentURL, '7d', '/', '', false, false);
  
  const sessionLocale = cookies.get('locale') === 'en' ? sessions_en : sessions_zh
  
  ElMessageBox.confirm(sessionLocale.expiredDesc, sessionLocale.expiredTitle, {
    showClose: true,
    closeOnClickModal: true,   
    closeOnPressEscape: true,
    confirmButtonText: sessionLocale.reLogin,
    cancelButtonText: sessionLocale.cancel
  }).then(() => {
    const previousPath = cookies.get('previous_path')
    logout()
    cookies.set('previous_path', previousPath, '7d', '/', '', false, false)
    window.location.href = '/login'
  }).catch(() => {
    logout()
    window.location.href = '/logout'
  }).finally(() => {
    dialogState.isReloginDialogShowing = false
  })
}
