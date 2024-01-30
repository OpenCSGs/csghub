import { ElMessage } from 'element-plus'

export const copyToClipboard = async (textToCopy) => {
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
      message: '复制成功！',
      type: 'success'
    })
  } catch (error) {
    console.error(error)
  }
}
