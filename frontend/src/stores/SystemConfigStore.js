import { defineStore } from 'pinia'
import { ref } from 'vue'

// const persistKey = 'system-config'

const useSystemConfigStore = defineStore('SystemConfig', () => {
  const initialized = ref(false)
  const featureFlags = ref({})
  const generalConfigs = ref({})
  const licenseInfo = ref([])
  const hotModels = ref([])
  const hotDatasets = ref([])
  const hotSpaces = ref([])
  const customers = ref([])
  const latestNews = ref([])
  const computingPartners = ref([])
  const bannerConfig = ref([])
  const timestamp = ref(Date.now())

  async function initialize(initialData) {
    initialized.value = true
    featureFlags.value = initialData.feature_flags || {}
    generalConfigs.value = initialData.general_configs || {}
    licenseInfo.value = initialData.license_info || []
    hotModels.value = initialData.hot_models || []
    hotDatasets.value = initialData.hot_datasets || []
    hotSpaces.value = initialData.hot_spaces || []
    customers.value = initialData.customers || []
    latestNews.value = initialData.latest_news || []
    computingPartners.value = initialData.computing_partners || []
    bannerConfig.value = initialData.banner_config || []
  }

  return {
    initialize,
    initialized,
    featureFlags,
    generalConfigs,
    licenseInfo,
    hotModels,
    hotDatasets,
    hotSpaces,
    customers,
    latestNews,
    computingPartners,
    bannerConfig,
    timestamp
  }
})

export default useSystemConfigStore