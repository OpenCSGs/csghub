import useFetchApi from "@/packs/useFetchApi";
import { useCookies } from "vue3-cookies";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

const { cookies } = useCookies()

const defaultLanguage = ["zh", "zh-cn", "zh-CN", "zh-tw"].includes(
  navigator.language
)
  ? "zh"
  : "en";

const lan = cookies.get('locale') || defaultLanguage;
dayjs.extend(relativeTime);
dayjs.locale(lan=='en'?'en':'zh-cn');

export function timeSince(dateString) {
  return dayjs(dateString).fromNow();
}

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

export const ToNotFoundPage = () => {
  setTimeout(() => {
    location.replace('/errors/not-found')
  }, 300)
}

export const ToUnauthorizedPage = () => {
  setTimeout(() => {
    location.replace('/errors/unauthorized')
  }, 300)
}

export const randomUUID = () => {
  const hexDigits = '0123456789abcdef'
  let uuid = ''

  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-'
    } else if (i === 14) {
      uuid += '4'
    } else if (i === 19) {
      uuid += hexDigits[Math.floor(Math.random() * 4) + 8]
    } else {
      uuid += hexDigits[Math.floor(Math.random() * 16)]
    }
  }
  return uuid
}

export const safeJsonParse = (str) => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return null
  }
}

export const formatAmount = (amount) => {
  return parseFloat(amount / 100).toFixed(2)
}

// repo-detail 相关，query参数的校验，返回规范化后的参数对象，用于repo-detail组件
export const validateTab = (tab, setRepoTab = null) => {
  const validTabs = ['summary', 'files', 'analysis', 'logs', 'schema', 'community', 'billing', 'settings']
  const isValid = validTabs.includes(tab)
  
  if (!isValid && setRepoTab) {
    // 当tab无效时，重置相关字段
    setRepoTab({
      lastPath: '',
      actionName: 'files',
      currentPath: ''
    })
  }
  
  return isValid ? tab : 'summary'
}

export const validateActionName = (actionName) => {
  const validActionNames = ['files', 'blob', 'new_file', 'edit_file', 'commits', 'commit', 'upload_file']
  return validActionNames.includes(actionName) ? actionName : 'files'
}

export const validateCommunityActionName = (communityActionName) => {
  const validCommunityActionNames = ['list', 'new', 'detail']
  return validCommunityActionNames.includes(communityActionName) ? communityActionName : 'list'
}
