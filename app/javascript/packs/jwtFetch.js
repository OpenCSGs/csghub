import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

const jwtFetch = (url, options = {}, forceLogin = false) => {
  const jwtToken = cookies.get('user_token')
  if (forceLogin && !jwtToken) {
    window.location.href = "/login"
  }
  options.headers = options.headers || {}
  if (jwtToken) {
    options.headers = { "Authorization": `Bearer ${jwtToken}`, ...options.headers };
  }
  return fetch(url, options)
};

export default jwtFetch;