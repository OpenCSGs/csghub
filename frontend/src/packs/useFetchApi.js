import { createFetch } from '@vueuse/core'
import { useCookies } from 'vue3-cookies'
import { ElMessageBox } from 'element-plus'
import refreshJWT from './refreshJWT'

import { user_sessions as sessions_en } from '../locales/en_js/user_sessions.js'
import { user_sessions as sessions_zh } from '../locales/zh_js/user_sessions.js'

import { logout } from './auth'

const { cookies } = useCookies()

const popupReloginDialog = () => {
  const sessionLocale =
    cookies.get('locale') === 'en' ? sessions_en : sessions_zh
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

const acceptLanguage = () => {
  const currentLocale = cookies.get('locale')
  if (currentLocale === 'en') {
    return 'en-US'
  } else if (currentLocale === 'zh') {
    return 'zh-CN'
  } else {
    return 'zh-CN'
  }
}

const createFetchOptions = {
  async beforeFetch({ options }) {
    const loginIdentity = cookies.get('login_identity')
    if (loginIdentity) {
      await refreshJWT()
      const jwtToken = cookies.get('user_token')
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${jwtToken}`,
        'Accept-Language': acceptLanguage()
      }
    } else {
      options.headers = {
        ...options.headers,
        'Accept-Language': acceptLanguage()
      }
    }
    return { options }
  },

  // This callback is triggered for any non-2xx status code.
  // For known server errors (e.g., 401), the data will contain the server's error message,
  // such as {"msg":"unknown user, please login first"}.
  // For unknown server errors (e.g., 500), the data will be undefined,
  // and the error will contain the error information.
  // There are cases where the fetch fails but no response is received.
  onFetchError({ data, error, response }) {
    // there is case in which the fetch is error but the response is nil
    if (!response) {
      console.error('Fetch Error: No response received', data || error)
      return { error: data || error }
    }

    if (response.status === 401) {
      popupReloginDialog()
    } else {
      console.log('Fetch Error:', data || error)
      return { error: data || error }
    }
  }
}

// the return of useFetchApi will be an object which has attributes like: data, error, response
// data.value will be the truely response body, so if we have a response like:
// {"msg":"OK","data":null}
// data.value will be {"msg":"OK","data":null}
// data.value.data will be null, you should becareful to use data.value.data to get the truely data
export default createFetch({
  updateDataOnError: true,
  baseUrl: `${CSGHUB_SERVER}/api/v1`,
  combination: 'chain',
  options: createFetchOptions
})