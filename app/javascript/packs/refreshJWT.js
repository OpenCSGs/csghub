import { useCookies } from "vue3-cookies";
import { ElMessageBox } from "element-plus";
import csrfFetch from "./csrfFetch";

import { user_sessions as sessions_en } from "../../../config/locales/en_js/user_sessions.js"
import { user_sessions as sessions_zh } from "../../../config/locales/zh_js/user_sessions.js"

const refreshJWT = () => {
  const { cookies } = useCookies();
  const jwt = cookies.get('user_token');
  const expireTime = cookies.get('token_expire_at');
  const loginIdentity = cookies.get('login_identity');
  const sessionLocale = cookies.get('locale') === 'en' ? sessions_en : sessions_zh

  if(loginIdentity && !jwt) {
    ElMessageBox.alert(sessionLocale.expiredDesc, sessionLocale.expiredTitle, {
      'show-close': false,
      confirmButtonText: sessionLocale.reLogin,
      callback: () => {
        window.location.href = "/logout?redirect_to=/login"
      },
    })
  } else if (expireTime) {
    const currentTime = Date.now()/1000;
    const differenceInMinutes = Math.floor((expireTime - currentTime) / (60));
    console.log(expireTime)
    console.log(currentTime)
    console.log(differenceInMinutes)
    if (differenceInMinutes < 10) {
      console.log('refresh jwt')
      const options = {method: 'PUT'}
      csrfFetch('/internal_api/users/jwt_token', options)
    }
  }
}

export default refreshJWT
