import { useCookies } from "vue3-cookies";
import { ElMessageBox } from "element-plus";
import csrfFetch from "./csrfFetch";

import { user_sessions as sessions_en } from "../../../config/locales/en_js/user_sessions.js"
import { user_sessions as sessions_zh } from "../../../config/locales/zh_js/user_sessions.js"

const refreshJWT = () => {
  const { cookies } = useCookies();
  const jwt = cookies.get('user_token');
  const expireTimeStr = cookies.get('token_expire_at');
  const loginIdentity = cookies.get('login_identity');
  const userSyncedStr = cookies.get('user_synced');
  const userSynced = !!userSyncedStr && userSyncedStr.toString() === 'true';
  const sessionLocale = cookies.get('locale') === 'en' ? sessions_en : sessions_zh

  if(loginIdentity && userSynced && !jwt) {
    ElMessageBox.alert(sessionLocale.expiredDesc, sessionLocale.expiredTitle, {
      'show-close': false,
      confirmButtonText: sessionLocale.reLogin,
      callback: () => {
        window.location.href = "/logout"
      },
    })
  } else if (expireTimeStr) {
    const expireTime = new Date(expireTimeStr);
    const currentTime = new Date();
    const differenceInMinutes = Math.floor((expireTime - currentTime) / (1000 * 60));
    if (differenceInMinutes < 10) {
      const options = {method: 'PUT'}
      csrfFetch('/internal_api/users/jwt_token', options)
    }
  }
}

export default refreshJWT
