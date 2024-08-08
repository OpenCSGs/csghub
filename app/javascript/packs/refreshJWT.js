import { useCookies } from "vue3-cookies";
import { ElMessageBox } from "element-plus";
import csrfFetch from "./csrfFetch";

import { user_sessions as sessions_en } from "../../../config/locales/en_js/user_sessions.js"
import { user_sessions as sessions_zh } from "../../../config/locales/zh_js/user_sessions.js"

const { cookies } = useCookies()
const popupReloginDialog = () => {
  const sessionLocale = cookies.get('locale') === 'en' ? sessions_en : sessions_zh
  ElMessageBox.alert(sessionLocale.expiredDesc, sessionLocale.expiredTitle, {
    'show-close': false,
    confirmButtonText: sessionLocale.reLogin,
    callback: () => {
      window.location.href = "/logout?redirect_to=/login"
    }
  })
}

const refreshJWT = async () => {
  const jwt = cookies.get('user_token');
  const expireTime = cookies.get('token_expire_at');
  const loginIdentity = cookies.get('login_identity');

  const params = {
    user_token: jwt
  }
  const options = {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  }

  // user logged in
  if(loginIdentity) {
    csrfFetch('/internal_api/users/verify_jwt_token', options).then((res) => {
      if (!res.ok) {
        // user token invalid, relogin
        cookies.set('user_token_valid', false)
        popupReloginDialog()
      } else {
        // if current user and user token match, user token valid and will expire soon, refresh
        // if current user and user token match, user token valid and will not expire soon, do nothing
        // else if current user and user token do not match, relogin
        res.json().then((data) => {
          if(data.user_infos.uuid === loginIdentity) {
            cookies.set('user_token_valid', true)
            const currentTime = Date.now()/1000;
            const differenceInMinutes = Math.floor((expireTime - currentTime) / (60));
            if (differenceInMinutes < 10) {
              console.log('refresh jwt')
              const options = {method: 'PUT'}
              csrfFetch('/internal_api/users/jwt_token', options)
            }
          } else {
            popupReloginDialog()
          }
        })
      }
    })
  } else {
    // if user not logged in but jwt is there, relogin
    // if user not logged in and jwt is not there, do nothing
    if (jwt) {
      popupReloginDialog()
    }
  }
}

export default refreshJWT
