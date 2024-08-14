import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

const jwtFetch = (url, options = {}, forceLogin = false) => {
  const jwtToken = cookies.get('user_token')
  const jwtTokenValid = cookies.get('user_token_valid')
  if (forceLogin && !jwtToken) {
    window.location.href = "/login"
  }
  options.headers = options.headers || {}
  if (jwtToken && jwtTokenValid === 'true') {
    options.headers = { "Authorization": `Bearer ${jwtToken}`, ...options.headers };
  }
  return fetch(url, options)
};

export default jwtFetch;