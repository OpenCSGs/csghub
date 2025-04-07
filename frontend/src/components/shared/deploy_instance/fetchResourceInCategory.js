import { useFetchApi } from '../../../packs/useFetchApi'
import { useCookies } from 'vue3-cookies'
import { all as all_en } from "../../../locales/en_js/all.js"
import { all as all_zh } from "../../../locales/zh_js/all.js"

const { cookies } = useCookies()
const defaultLanguage = ['zh', 'zh-cn', 'zh-CN', 'zh-tw'].includes(navigator.language) ? 'zh' : 'en';
const locale = cookies.get('locale') || defaultLanguage
const allLocale = locale === 'en' ? all_en : all_zh

const payModeMapping = {
  free: allLocale.free,
  minute: allLocale.minutePay,
  month: allLocale.yearMonthPay,
  year: allLocale.yearMonthPay
}

export const fetchResourcesInCategory = async (clusterId, depployType = 1) => {
  const { data, error } = await useFetchApi(
    `/space_resources?cluster_id=${clusterId}&deploy_type=${depployType}`
  ).json()
  if (error.value) {
    ElMessage({ message: error.value.msg, type: 'warning' })
  } else {
    const body = data.value
    const allGPUResources = body.data
    const categories = {}
    // Category data
    allGPUResources.forEach((item) => {
      const category = payModeMapping[item.pay_mode] || 'Others'
      if (!categories[category]) {
        categories[category] = []
      }
      if (item.pay_mode == 'minute') {
        item.label = `${item.name} ${(item.price / 100).toFixed(2)}${allLocale.hourUnit}`
      } else if (item.pay_mode == 'month') {
        item.label = `${item.name} ${(item.price / 100).toFixed(2)}${allLocale.monthUnit}`
      } else if (item.pay_mode == 'year') {
        item.label = `${item.name} ${(item.price / 100).toFixed(2)}${allLocale.yearUnit}`
      } else {
        item.label = item.name
      }
      categories[category].push(item)
    })
    // Generate formatted options
    const options = Object.keys(categories).map((category) => ({
      label: category,
      options: categories[category]
    }))
    return options
  }
}
