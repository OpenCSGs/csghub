export const usePermissionCheck = (response) => {
  if (response.status === 403) {
    window.location.href = '/errors/unauthorized'
    return false
  }
  return true
}
