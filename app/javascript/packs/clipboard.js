import { ElMessage } from 'element-plus'
import { useCookies } from "vue3-cookies"

export const copyToClipboard = async (textToCopy) => {
  const { cookies } = useCookies()

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy)
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = textToCopy
      textArea.style.position = "absolute"
      textArea.style.left = "-999999px"
      document.body.prepend(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }
    ElMessage({
      message: cookies.get('locale') === 'en' ? 'Copied!' : '复制成功!',
      type: 'success'
    })
  } catch (error) {
    console.error(error)
  }
}
