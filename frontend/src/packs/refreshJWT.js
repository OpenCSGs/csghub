import { useCookies } from "vue3-cookies";
import { jwtDecode } from "jwt-decode";

const { cookies } = useCookies()

const refreshJWT = async () => {
  const jwt = cookies.get('user_token');
  const currentTime = Date.now()/1000;
  const loginIdentity = cookies.get('login_identity');

  // user logged in
  if(loginIdentity) {
    // jwt exists
    if (jwt) {
      const jwtInfos = jwtDecode(jwt);
      const expireTime = jwtInfos.exp;
      if (currentTime >= expireTime) {
        // user token expired, refresh token
        console.log('refresh jwt')
        const res = await fetch('/internal_api/users/jwt_token', {method: 'PUT'})
        res.json().then(data => { console.log(data.message) })
      } else {
        // if user token will expire soon, refresh
        // if user token will not expire soon, do nothing
        const differenceInMinutes = Math.floor((expireTime - currentTime) / (60));
        if (differenceInMinutes < 120) {
          console.log('refresh jwt')
          const res = await fetch('/internal_api/users/jwt_token', {method: 'PUT'})
          res.json().then(data => { console.log(data.message) })
        }
      }
    } else {
      console.log('refresh jwt')
      const res = await fetch('/internal_api/users/jwt_token', {method: 'PUT'})
      res.json().then(data => { console.log(data.message) })
    }
  }
}

export default refreshJWT
