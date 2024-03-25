import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

const jwtFetch = (url, options) => {
  const jwtToken = cookies.get('user_token')
  options.headers = { "Authorization": `Bearer ${jwtToken}`, ...options.headers };
  return fetch(url, options)
};

export default jwtFetch;