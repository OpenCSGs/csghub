import { useCookies } from "vue3-cookies";
import { jwtDecode } from "jwt-decode";

const { cookies } = useCookies()

const refreshJWT = async () => {
  const jwt = cookies.get('user_token');
  const currentTime = Date.now()/1000;
  const loginIdentity = cookies.get('login_identity');

  if(loginIdentity) {
    if (jwt) {
      const jwtInfos = jwtDecode(jwt);
      const expireTime = jwtInfos.exp;
      if (currentTime >= expireTime) {
        await fetch('/internal_api/users/jwt_token', {method: 'PUT'})
      } else {
        // if user token will expire soon, refresh
        // if user token will not expire soon, do nothing
        const differenceInMinutes = Math.floor((expireTime - currentTime) / (60));
        if (differenceInMinutes < 120) {
          await fetch('/internal_api/users/jwt_token', {method: 'PUT'})
        }
      }
    } else {
      await fetch('/internal_api/users/jwt_token', {method: 'PUT'})
    }
  }
}

export default refreshJWT
