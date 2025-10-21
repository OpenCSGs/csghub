import { useCookies } from "vue3-cookies";
import { jwtDecode } from "jwt-decode";
import { popupReloginDialog } from './authDialog'

const { cookies } = useCookies()

const refreshJWT = async () => {
  const jwt = cookies.get('user_token');
  const currentTime = Date.now()/1000;
  const loginIdentity = cookies.get('login_identity');

  if(loginIdentity) {
    if (jwt) {
      try {
        const jwtInfos = jwtDecode(jwt);
        const expireTime = jwtInfos.exp;
        if (currentTime >= expireTime) {
          const response = await fetch('/internal_api/users/jwt_token', {method: 'PUT'})
          if (!response.ok) {
            throw new Error('Token refresh failed')
          }
        } else {
          const differenceInMinutes = Math.floor((expireTime - currentTime) / (60));
          if (differenceInMinutes < 120) {
            const response = await fetch('/internal_api/users/jwt_token', {method: 'PUT'})
            if (!response.ok) {
              throw new Error('Token refresh failed')
            }
          }
        }
      } catch (error) {
        popupReloginDialog()
      }
    } else {
      try {
        const response = await fetch('/internal_api/users/jwt_token', {method: 'PUT'})
        if (!response.ok) {
          throw new Error('Token refresh failed')
        }
      } catch (error) {
        popupReloginDialog()
      }
    }
  }
}

export default refreshJWT
