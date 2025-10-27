export const errors_page = {
  not_found: {
    title: '無法存取網頁',
    desc: '抱歉，OpenCSG 找不到該網頁。該網頁或許由於產品更新已被刪除，或者您的網址不正確',
    back: '返回',
    home: '回到首頁',
  },
  unauthorized: {
    title: '暫無權限',
    desc: '請聯絡管理員授權',
  },
  login_failed: {
    title: '登入失敗',
    default_msg: '未知登入錯誤，請聯絡管理員',
    back_to_homepage: '回到首頁',
    relogin: '重新登入',
  },
  serverError: {
    title: '伺服器錯誤 {errorCode}'
  },
  conflict:{
    title: '資源衝突',
    decName: '用戶名 {username} 已經存在',
    dec: '電子郵件 {username} 已經存在',
    contact: '請嘗試其他登錄方式或聯繫 '
  }
}