const csrfFetch = (url, options) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
  options.headers = { "X-CSRF-Token": csrfToken, ...options.headers };
  return fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
      return response.json();
  }).catch((error) => {
    console.error(error);
    throw new Error("网络请求失败");
  });
};

export default csrfFetch;
