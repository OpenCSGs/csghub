import useFetchApi from '@/packs/useFetchApi'
import {
  formatSpaceResourcePriceLabel,
  getSpaceResourcePayModeCategory,
  enrichSpaceResourceWithPrice,
} from '@/packs/spaceResourcePrice.js'
import { useCookies } from 'vue3-cookies'
import { all as all_en } from "../../../locales/en_js/all.js"
import { all as all_zh } from "../../../locales/zh_js/all.js"
import { all as all_zh_hant } from "../../../locales/zh_hant_js/all.js"

const { cookies } = useCookies()
const defaultLanguage = ['zh', 'zh-cn', 'zh-CN', 'zh-tw'].includes(navigator.language) ? 'zh' : 'en';
const locale = cookies.get('locale') || defaultLanguage

let allLocale = ''
if (locale === 'zh') {
  allLocale = all_zh
} else if (locale === 'zhHant') {
  allLocale = all_zh_hant
} else {
  allLocale = all_en
}

const payModeI18n = { locale: allLocale }

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
    allGPUResources?.forEach((item) => {
      const category =
        getSpaceResourcePayModeCategory(item, payModeI18n) || 'Others'
      if (!categories[category]) {
        categories[category] = []
      }
      const priceLabel = formatSpaceResourcePriceLabel(item, payModeI18n)
      item.label =
        item.pay_mode == 'minute' ||
        item.pay_mode == 'month' ||
        item.pay_mode == 'year'
          ? `${item.name} ${priceLabel}`
          : item.name
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

export const fetchResourcesInType = async (clusterId, depployType = 1) => {
  const { data, error } = await useFetchApi(
    `/space_resources?cluster_id=${clusterId}&deploy_type=${depployType}`
  ).json()
  if (error.value) {
    ElMessage({ message: error.value.msg, type: 'warning' })
  } else {
    const body = data.value
    const allGPUResources = body.data
    if (!Array.isArray(allGPUResources)) {
      return [];
    }

    const result = [];

    allGPUResources.forEach(item => {
      const type = item.type.toUpperCase();

      let typeEntry = result.find(entry => entry.label === type);

      if (!typeEntry) {
        typeEntry = { label: type, options: [] };
        result.push(typeEntry);
      }
      typeEntry.options.push(
        enrichSpaceResourceWithPrice(
          {
            ...item,
            resources: item.resources ? JSON.parse(item.resources) : {},
          },
          payModeI18n
        )
      );
    });

    return result;
  }
}
