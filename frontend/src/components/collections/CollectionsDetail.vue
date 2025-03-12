<template>
  <div
    class="w-full bg-gray-25 border-b border-gray-100 pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto"
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
  <div class="mx-auto page-responsive-width mt-[-40px] md:px-0 relative">
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
      :beforeLeave="handleTabLeave"
      @tabClick="tabChange"
    >
      <el-tab-pane
        :label="$t('collections.details.tabProject')"
        name="page"
      >
        <div class="pt-[24px] px-2">
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
          v-if="showRepoList"
          :repositories="repoDetailStore.repositories"
          :collectionsId="collectionsId"
          :canManage="repoDetailStore.canManage"
        />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('collections.details.tabSettings')"
        name="setting"
        v-if="repoDetailStore.canManage"
      >
        <CollectionsSettings
          :collection="repoDetailStore"
          :collectionsId="collectionsId"
          :userName:="userName"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
  import { ref, onBeforeMount, computed } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import CollectionsRepoList from './CollectionsRepoList.vue'
  import CollectionsSettings from './CollectionsSettings.vue'
  import CollectionsAddRepo from './CollectionsAddRepo.vue'
  import { ElMessage } from 'element-plus'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import useFetchApi from '../../packs/useFetchApi'
  import { storeToRefs } from 'pinia'

  const repoDetailStore = useRepoDetailStore()
  const { isInitialized } = storeToRefs(repoDetailStore)

  const props = defineProps({
    userName: String,
    collectionsId: String,
    path: String
  })

  const activeName = ref('page')

  const showRepoList = computed(() => {
    return repoDetailStore.repositories?.length > 0
  })

  const isSameRepo = computed(() => {
    return (
      Number(props.collectionsId) === repoDetailStore.id &&
      repoDetailStore.repoType === 'collection'
    )
  })

  const handleTabLeave = (tab) => {
    tabChange(tab)
    return false
  }

  const tabChange = (tab) => {
    switch (tab.paneName) {
      case 'page':
        location.href = `/collections/${props.collectionsId}`
        break
      case 'setting':
        location.href = `/collections/${props.collectionsId}/setting`
        break
      default:
        location.href = `/collections/${props.collectionsId}/${tab.paneName}`
        break
    }
  }

  const fetchCollectionDetail = async () => {
    const url = `/collections/${props.collectionsId}`
    const { data, error } = await useFetchApi(url).json()
    if (error.value) {
      ElMessage.warning(error.value.msg)
    } else {
      const repoData = data.value.data
      repoDetailStore.initialize(repoData, 'collection')
    }
  }
  onBeforeMount(() => {
    if (props.path) {
      activeName.value = props.path
    }
    if (!isSameRepo.value || (isSameRepo.value && !isInitialized.value)) {
      fetchCollectionDetail()
    }
  })
</script>
