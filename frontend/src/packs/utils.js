import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

export const btoa_utf8 = (value) => {
  return btoa(
    String.fromCharCode(...new TextEncoder('utf-8').encode(value))
  )
}

export const atob_utf8 = (value) => {
  const binaryString = atob(value)
  const bytes = new Uint8Array(binaryString.length)

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const decoder = new TextDecoder('utf-8')
  return decoder.decode(bytes)
}

export const createAndClickAnchor = (url, filename) => {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  window.URL.revokeObjectURL(url) // Clean up the URL object
}

export const isBlank = (value) => {
  if (!value) return true
  return value.trim() === ''
}

export const beiJingTimeParser = (utcTimeStr) => {
  if (!utcTimeStr) return

  const utcTime = new Date(utcTimeStr)
  return utcTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
}

export const ToLoginPage = () => {
  cookies.set('previous_path', window.location.pathname)
  window.location.href = '/login'
}