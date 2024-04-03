import { useCookies } from "vue3-cookies";
import { ElMessageBox } from "element-plus";
import csrfFetch from "./csrfFetch";

const refreshJWT = () => {
  const { cookies } = useCookies();
  const jwt = cookies.get('user_token');
  const expireTimeStr = cookies.get('token_expire_at');
  const loginIdentity = cookies.get('login_identity');
  const userSyncedStr = cookies.get('user_synced');
  const userSynced = !!userSyncedStr && userSyncedStr.toString() === 'true';

  if(loginIdentity && userSynced && !jwt) {
    ElMessageBox.alert(t('user_sessions.expiredDesc'), t('user_sessions.expiredTitle'), {
      'show-close': false,
      confirmButtonText: t('user_sessions.reLogin'),
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
