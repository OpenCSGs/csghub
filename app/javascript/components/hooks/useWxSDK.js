// import wx from 'weixin-js-sdk'

export default useWxSDK = () => {
  const initConfig = (configInfo, shareInfo) => {
    wx.config({
      debug: true,
      appId: configInfo.app_id,
      timestamp: configInfo.timestamp,
      nonceStr: configInfo.noncestr,
      signature: configInfo.signature,
      jsApiList: [
        'chooseImage',
        'uploadImage',
        'previewImage',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'chooseWXPay',
      ]
    })
    wx.ready(() => {
      wx.onMenuShareTimeline({
        title: `${shareInfo.title}: ${shareInfo.desc}`, // 分享标题
        link: shareInfo.link, // 分享链接，可以不是当前页面，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'https://stg.opencsg.com/wechat_share_logo.png',
        success: function () {
          // 用户确认分享后执行的回调函数
          console.log('yes, share moment ok')
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
          console.log('yes, cancel share moment')
        },
      })

      wx.onMenuShareAppMessage({
        title: shareInfo.title, // 分享标题
        desc: shareInfo.desc,
        link: shareInfo.link, // 分享链接，可以不是当前页面，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: 'https://stg.opencsg.com/wechat_share_logo.png',
        type: 'link', // 分享类型,music、video或link，不填默认为link
        success: function () {
          // 用户确认分享后执行的回调函数
          console.log('yes, share app msg ok')
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
          console.log('yes, cancel share app msg')
        },
      })
    })
    wx.error(function(res){
      console.log(`WX config error: ${res}`)
    })
  }

  return { initConfig }
}