import { useCookies } from "vue3-cookies";
import { ElMessage } from "element-plus";
const { cookies } = useCookies();
const jwt = cookies.get('user_token');

if(!jwt) {
  ElMessage({
    message: '用户权限未生效，请重新登录!',
    type: 'warning'
  });
}