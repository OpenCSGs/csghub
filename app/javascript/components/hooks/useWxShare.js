import { useWxSDK } from "./useWxSDK.js"

export default useWxShare = (shareConfig) => {
  const { initConfig, setShareInfo } = useWxSDK()

  const shareUrl = window.location.href.split("#")[0];

  const getSignatureUrl = `/internal_api/wechat/signature-config?page_url=${shareUrl}`
  fetch(getSignatureUrl).then((config) => {
    // 调用后端接口获取config相关信息
    initConfig(config).then(() => {
      // 注入wx.config成功后，设置微信分享相关
      setShareInfo({
        ...shareConfig,
        link: shareUrl,
      });
    });
  });
}