import { useCookies } from "vue3-cookies";
import { ElMessage } from "element-plus";
import csrfFetch from "./csrfFetch";
const { cookies } = useCookies();
const jwt = cookies.get('user_token');
const loginIdentity = cookies.get('login_identity');
const userSyncedStr = cookies.get('user_synced');
const userSynced = !!userSyncedStr && userSyncedStr.toString() === 'true';

if(loginIdentity && userSynced && !jwt) {
  ElMessage({
    message: '用户权限未生效，请重新登录!',
    type: 'warning'
  });
} else {
  const expireTimeStr = cookies.get('token_expire_at');
  const expireTime = new Date(expireTimeStr);
  const currentTime = new Date();
  const differenceInMilliseconds = expireTime - currentTime;
  let differenceInMinutes = differenceInMilliseconds / 1000 / 60;
  if (differenceInMinutes < 10) {
    const options = {method: 'PUT'}
    csrfFetch('/internal_api/users/jwt_token', options)
  }
}
