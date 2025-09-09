<template>
  <div
    class="w-full bg-gray-25 border-b border-gray-100 pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto"
    v-show=" isInitialized"
  >
    <div class="mx-auto page-responsive-width">
      <repo-header
        :avatar="repoDetailStore.avatar"
        :name="repoDetailStore.name"
        :nickname="repoDetailStore.nickname"
        :path="`${repoDetailStore.namespace || repoDetailStore.username}/${repoDetailStore.name}`"
        :hasLike="!!repoDetailStore.userLikes"
        :desc="repoDetailStore.description"
        :totalLikes="repoDetailStore.likes"
        :repo-id="repoDetailStore.id"
        :collectionsId="collectionsId"
        repo-type="collections"
      />
    </div>
  </div>
  <div class="mx-auto page-responsive-width !mt-[-40px] md:px-0 relative" v-if="!isDataLoading && isInitialized">
    <div
      class="max-w-[max-content] px-2 absolute top-0 right-0 md:relative md:pl-5 md:pb-4 z-10"
    >
      <CollectionsAddRepo
        v-if="showRepoList"
        :canManage="repoDetailStore.canManage"
        :collectionsId="collectionsId"
      />
    </div>
    <el-tabs
      v-model="activeName"
      class="demo-tabs"
      @tabClick="tabChange"
    >
      <el-tab-pane
        :label="$t('collections.details.tabProject')"
        name="page"
      >
        <div class="pt-[24px] px-2" v-if="activeName === 'page'">
          <div
            class="h-[520px] md:h-auto pt-[24px]"
            v-if="!showRepoList"
          >
            <div class="w-[480px] absolute left-1/2 -translate-x-1/2 md:hidden">
              <img
                class="w-full"
                src="/images/search_circle_bg.png"
              />
            </div>
            <div
              class="flex flex-col justify-center items-center relative pt-[220px] md:pt-5"
            >
              <div
                class="border border-gray-200 rounded-lg p-3 max-w-[max-content] mb-4"
              >
                <SvgIcon
                  name="collections"
                  width="24"
                />
              </div>
              <div class="test-[16px] leading-[24px]">
                {{ $t('collections.details.emptyCollection') }}
              </div>
              <div
                class="max-w-[300px] text-gray-600 text-sm text-center leading-[20px] font-light mb-6"
                :class="repoDetailStore.canManage ? '' : 'hidden'"
              >
                {{ $t('collections.details.tips') }}
              </div>
              <div class="flex gap-3">
                <CollectionsAddRepo
                  :canManage="repoDetailStore.canManage"
                  :collectionsId="collectionsId"
                />
              </div>
            </div>
          </div>
        </div>
        <CollectionsRepoList
          v-if="showRepoList && activeName === 'page'"
          :repositories="repoDetailStore.repositories"
          :collectionsId="collectionsId"
          :canManage="repoDetailStore.canManage"
        />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('collections.details.tabSettings')"
        name="settings"
        v-if="repoDetailStore.canManage"
      >
        <CollectionsSettings
          v-if="activeName === 'settings'"
          :collection="repoDetailStore"
          :collectionsId="collectionsId"
          :userName:="userName"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
  
  <LoadingSpinner 
    :loading="isDataLoading" 
    :text="$t('collections.loading')" 
  />
</template>
<script setup>
  import { ref, onBeforeMount, computed, provide, watch } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import CollectionsRepoList from './CollectionsRepoList.vue'
  import CollectionsSettings from './CollectionsSettings.vue'
  import CollectionsAddRepo from './CollectionsAddRepo.vue'
  import LoadingSpinner from '../shared/LoadingSpinner.vue'
  import { ElMessage } from 'element-plus'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import useFetchApi from '../../packs/useFetchApi'
  import { storeToRefs } from 'pinia'
  import { useRoute, useRouter } from 'vue-router'
  import { validateTab, ToNotFoundPage } from '../../packs/utils'

  const repoDetailStore = useRepoDetailStore()
  const { isInitialized } = storeToRefs(repoDetailStore)
  const router = useRouter()
  const route = useRoute()

  const props = defineProps({
    userName: String,
    collectionsId: String,
    path: String
  })

  const activeName = ref('page')
  
  const isDataLoading = ref(false)

  const showRepoList = computed(() => {
    return repoDetailStore.repositories?.length > 0
  })

  const isSameRepo = computed(() => {
    return (
      Number(props.collectionsId) === repoDetailStore.id &&
      repoDetailStore.repoType === 'collection'
    )
  })

  const validTabs = computed(() => {
    const tabs = ['page']
    if (repoDetailStore.canManage) {
      tabs.push('settings')
    }
    return tabs
  })

  const getDefaultTab = () => {
    return 'page'
  }

  const isValidTab = (tab) => {
    return validTabs.value.includes(tab)
  }

  // 监听路由变化，当用户使用浏览器前进/后退按钮时更新tab
  watch(() => route.query.tab, (newTab) => {
    const validatedTab = validateTab(newTab)
    if (validatedTab && isValidTab(validatedTab) && validatedTab !== activeName.value) {
      activeName.value = validatedTab
      // 路由变化时只更新tab，不重复获取数据
    }
  })

  const tabChange = async (tab) => {
    let tabName = validateTab(tab.paneName);
    
    if (!isValidTab(tabName)) {
      tabName = getDefaultTab();
      router.push({
        path: `/collections/${props.collectionsId}`,
        query: { tab: tabName }
      });
    }

    activeName.value = tabName;

    router.push({
      path: `/collections/${props.collectionsId}`,
      query: {
        tab: tabName
      }
    });
  }

  const fetchCollectionDetail = async () => {
    if (isDataLoading.value) {
      return false
    }
    
    isDataLoading.value = true
    
    const url = `/collections/${props.collectionsId}`
    
    try {
      const { response, data, error } = await useFetchApi(url).json()
      
      if (response.value.status === 404) {
        ToNotFoundPage()
        return false
      }
      
      if (error.value) {
        ElMessage.warning(error.value.msg)
        return false
      }
      
      if (!data.value) {
        return false
      }
      
      const repoData = data.value.data
      repoDetailStore.initialize(repoData, 'collection')
      return true
    } catch (error) {
      return false
    } finally {
      isDataLoading.value = false
    }
  }
  
  onBeforeMount(async () => {
    if (props.path) {
      activeName.value = props.path
    }

    // 处理URL query参数中的tab
    const params = new URLSearchParams(window.location.search)
    const urlTab = validateTab(params.get('tab'))
    if (urlTab && isValidTab(urlTab)) {
      activeName.value = urlTab
      router.push({
        path: `/collections/${props.collectionsId}`,
        query: { tab: urlTab }
      })
    } else {
      const defaultTab = getDefaultTab()
      activeName.value = defaultTab
      router.push({
        path: `/collections/${props.collectionsId}`,
        query: { tab: defaultTab }
      })
    }

    // 只在初始化时获取数据
    await fetchCollectionDetail()
  })

  provide('fetchCollectionDetail', fetchCollectionDetail)
</script>
