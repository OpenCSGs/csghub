export const usePermissionCheck = (response) => {
  if (response.status === 401) {
    window.location.href = '/errors/unauthorized'
    return false
  }
  return true
}
