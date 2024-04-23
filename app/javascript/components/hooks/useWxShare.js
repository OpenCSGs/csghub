import useWxSDK from "./useWxSDK.js"

const useWxShare = async(shareConfig) => {
  const { initConfig, setShareInfo } = useWxSDK()
  const shareUrl = window.location.href.split("#")[0];
  const getSignatureUrl = `/internal_api/wechat/signature-config?page_url=${shareUrl}`
  const response = await fetch(getSignatureUrl)
  if (response.ok) {
    response.json().then((data) => {
      initConfig(data).then(() => {
        setShareInfo({
          ...shareConfig,
          link: shareUrl,
        })
      })
    })
  } else {
    response.json().then((data) => {
      console.log('Wechat initialize error')
    })
  }
}

export default useWxShare