import { ElMessage } from 'element-plus'

export const showContextMessage = (error, t) => {
  let message = `${error.msg}`

  if (error.context && error.code) {
    const errorCode = error.code
    const errorCodeDocUrl = `https://opencsg.com/docs/csghub/101/function/other/error_codes#${errorCode.toLowerCase()}`
    const link = `<a href="${errorCodeDocUrl}" target="_blank" style="color: #409eff; text-decoration: none; border-bottom: 1px solid #409eff; transition: all 0.3s;">${errorCode}</a>`
    message = message.replace(errorCode, link)
  }

  if (error.context && Object.keys(error.context).length > 0) {
    const contextHtml = Object.entries(error.context)
      .map(([key, value]) => `
        <div style="margin-bottom: 8px; padding: 8px 12px; background: #fafbfc; border-left: 3px solid #e1e6f0; border-radius: 0 4px 4px 0;">
          <span style="font-weight: 600; color: #2c3e50; font-size: 13px;">${key}:</span>
          <span style="color: #5a6c7d; font-size: 13px; word-break: break-all; margin-left: 8px;">${value}</span>
        </div>
      `)
      .join('')

    const finalHtml = `
      <div style="max-width: 100%;>
        <div style="margin-bottom: 16px;">
          <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.5;">${message}</p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px;">
          <div style="display: flex; align-items: center; margin-bottom: 12px;">
            <span style="font-weight: 600; color: #4a5568; font-size: 13px;">${t('all.context')}:</span>
          </div>
          <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
            ${contextHtml}
          </div>
        </div>
      </div>
    `

    ElMessage({
      dangerouslyUseHTMLString: true,
      message: finalHtml,
      type: 'error',
      duration: 6000,
    })
  } else {
    ElMessage({
      message,
      type: 'error'
    })
  }
}
