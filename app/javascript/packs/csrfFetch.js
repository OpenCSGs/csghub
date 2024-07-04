const csrfFetch = (url, options={}) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
  options.headers = { "X-CSRF-Token": csrfToken, ...options.headers };
  return fetch(url, options)
};

export default csrfFetch;
