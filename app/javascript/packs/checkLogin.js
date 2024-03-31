import { useCookies } from "vue3-cookies";
import { ElMessage } from "element-plus";
const { cookies } = useCookies();
const jwt = cookies.get('user_token');
const login_identity = cookies.get('login_identity');
const user_synced = cookies.get('user_synced')

const userSynced = !!user_synced && user_synced.toString() === true

if(login_identity && userSynced && !jwt) {
  ElMessage({
    message: '用户权限未生效，请重新登录!',
    type: 'warning'
  });
}