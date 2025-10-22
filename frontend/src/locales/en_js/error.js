export const errors_page = {
  not_found: {
    title: 'Page not found',
    desc: 'Sorry, OpenCSG could not find this web page. This web page may have been removed due to a product update, or your URL is incorrect.',
    back: 'Back',
    home: 'To homepage',
  },
  unauthorized: {
    title: 'Unauthorized',
    desc: 'Please contact the administrator for authorization',
  },
  login_failed: {
    title: 'Login failed',
    default_msg: 'Unknown login error, please contact the administrator',
    back_to_homepage: 'To homepage',
    relogin: 'Relogin',
  },
  serverError: {
    title: 'Server Error {errorCode}'
  },
  conflict:{
    title: 'Resource Conflict',
    decName: 'Username {username} already exists',
    dec: 'Email {username} already exists',
    contact: 'Please try another login method or contact support@opencsg.com'
  }
}