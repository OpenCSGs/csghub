import { useCookies } from "vue3-cookies";
import { ElMessageBox } from "element-plus";
import csrfFetch from "./csrfFetch";
import { jwtDecode } from "jwt-decode";

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
  const currentTime = Date.now()/1000;
  const loginIdentity = cookies.get('login_identity');

  // user logged in
  if(loginIdentity) {
    if (jwt) {
      const jwtInfos = jwtDecode(jwt);
      const expireTime = jwtInfos.exp;
      if (currentTime >= expireTime) {
        // user token expired, relogin
        cookies.set('user_token_valid', false, 0)
        popupReloginDialog()
      } else {
        // if user token will expire soon, refresh
        // if user token will not expire soon, do nothing
        const differenceInMinutes = Math.floor((expireTime - currentTime) / (60));
        if (differenceInMinutes < 10) {
          console.log('refresh jwt')
          const options = {method: 'PUT'}
          csrfFetch('/internal_api/users/jwt_token', options)
        }
        cookies.set('user_token_valid', true, 0)
      }
    } else {
      popupReloginDialog()
    }
  } else {
    // if user not logged in but jwt is there, relogin
    // if user not logged in and jwt is not there, do nothing
    if (jwt) {
      popupReloginDialog()
    }
  }
}

export default refreshJWT
