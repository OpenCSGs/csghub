import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

const apiFetch = (url, options) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const headers = {
      'Authorization': `Bearer ${cookies.get('idToken')}`,
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    };
  
    // 合并选项
    const fetchOptions = {
      headers,
      ...options
    };
  
    return fetch(url, fetchOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .catch(error => {
        console.error(error);
        throw new Error('网络请求失败');
      });
  };
  
  export default apiFetch;