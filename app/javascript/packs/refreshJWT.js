import { useCookies } from "vue3-cookies";
import { ElMessageBox } from "element-plus";
import csrfFetch from "./csrfFetch";

import { user_sessions as sessions_en } from "../../../config/locales/en_js/user_sessions.js"
import { user_sessions as sessions_zh } from "../../../config/locales/zh_js/user_sessions.js"

const refreshJWT = async () => {
  const { cookies } = useCookies();
  const jwt = cookies.get('user_token');
  const expireTime = cookies.get('token_expire_at');
  const loginIdentity = cookies.get('login_identity');
  const sessionLocale = cookies.get('locale') === 'en' ? sessions_en : sessions_zh

  const params = {
    user_token: jwt
  }
  const options = {
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  }

  if(loginIdentity) {
    csrfFetch('/internal_api/users/verify_jwt_token', options).then((res) => {
      if (!res.ok) {
        cookies.set('user_token_valid', false)
        ElMessageBox.alert(sessionLocale.expiredDesc, sessionLocale.expiredTitle, {
          'show-close': false,
          confirmButtonText: sessionLocale.reLogin,
          callback: () => {
            window.location.href = "/logout?redirect_to=/login"
          }
        })
      } else {
        cookies.set('user_token_valid', true)
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
    })
  }
}

export default refreshJWT
