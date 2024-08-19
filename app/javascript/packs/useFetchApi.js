import { createFetch } from '@vueuse/core'
import { useCookies } from 'vue3-cookies'
import { ElMessageBox } from "element-plus";
import refreshJWT from './refreshJWT'

import { user_sessions as sessions_en } from "../../../config/locales/en_js/user_sessions.js"
import { user_sessions as sessions_zh } from "../../../config/locales/zh_js/user_sessions.js"

const { cookies } = useCookies()

const popupReloginDialog = () => {
  const sessionLocale = cookies.get('locale') === 'en' ? sessions_en : sessions_zh
  ElMessageBox.confirm(sessionLocale.expiredDesc, sessionLocale.expiredTitle, {
    'show-close': false,
    confirmButtonText: sessionLocale.reLogin,
    cancelButtonText: sessionLocale.cancelLogin,
  })
  .then(() => {
    window.location.href = "/logout?redirect_to=/login"
  })
  .catch(() => {
    window.location.href = "/logout"
  })
}

const useFetchApi = createFetch({
  updateDataOnError: true,
  baseUrl: `${CSGHUB_SERVER}/api/v1`,
  combination: 'chain',
  options: {
    async beforeFetch({ options }) {
      await refreshJWT()

      const loginIdentity = cookies.get('login_identity')
      const jwtToken = cookies.get('user_token')

      // if user is login send the request with jwt token no matter what the status of the token
      // and handle the error if its failed
      if (loginIdentity) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${jwtToken}`
        }
      }

      return { options }
    },
    onFetchError({ data, error, response }) {
      if (response.status === 401) {
        popupReloginDialog()
      } else if (response.status === 404) {
        window.location.href = "/errors/not-found"
      } else {
        console.log('Fetch Error:', data || error)
        return { error: data || error }
      }
    }
  }
})

export default useFetchApi
