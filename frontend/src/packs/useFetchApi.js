import { createFetch } from '@vueuse/core'
import { useCookies } from 'vue3-cookies'
import { ElMessageBox } from "element-plus";
import refreshJWT from './refreshJWT'

import { user_sessions as sessions_en } from "../locales/en_js/user_sessions.js"
import { user_sessions as sessions_zh } from "../locales/zh_js/user_sessions.js"

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
  .finally(() => {
    clearCookies()
  })
}

const acceptLanguage = () => {
  const currentLocale = cookies.get('locale')
  if (currentLocale === 'en') {
    return 'en-US'
  } else if (currentLocale === 'zh') {
    return 'zh-CN'
  } else {
    return 'en-US'
  }
}

const useFetchApi = createFetch({
  updateDataOnError: true,
  baseUrl: `${CSGHUB_SERVER}/api/v1`,
  combination: 'chain',
  options: {
    async beforeFetch({ options }) {
      const loginIdentity = cookies.get('login_identity')
      if (loginIdentity) {
        await refreshJWT()
        const jwtToken = cookies.get('user_token')
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${jwtToken}`,
          'Accept-Language': acceptLanguage()
        }
      }
      return { options }
    },
    onFetchError({ data, error, response }) {
      // there is case in which the fetch is error but the response is nil
      if (!response) {
        console.error('Fetch Error: No response received', data || error);
        return { error: data || error };
      }

      if (response.status === 401) {
        popupReloginDialog();
      } else {
        console.log("Fetch Error:", data || error);
        return { error: data || error };
      }
    }
  }
})

const clearCookies = () => {
  cookies.keys().forEach((cookie) => {
    cookies.remove(cookie)
  })
  window.location.href = '/'
}

export default useFetchApi
