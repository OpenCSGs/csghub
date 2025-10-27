export const errors_page = {
  not_found: {
    title: '无法访问网页',
    desc: '抱歉，OpenCSG找不到该网页。该网页或许由于产品更新已被删除，或者您的网址不正确',
    back: '返回',
    home: '回到首页',
  },
  unauthorized: {
    title: '暂无权限',
    desc: '请联系管理员授权',
  },
  login_failed: {
    title: '登录失败',
    default_msg: '未知登录错误，请联系管理员',
    back_to_homepage: '回到首页',
    relogin: '重新登录',
  },
  serverError: {
    title: '服务器错误 {errorCode}'
  },
  conflict:{
    title:'资源冲突',
    decName:'用户名 {username} 已经存在',
    dec:'邮箱 {username} 已经存在',
    contact:'请尝试其他登录方式或联系 '
  }
}
