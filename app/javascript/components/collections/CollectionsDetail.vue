<template>
  <div class="w-full bg-[#FCFCFD] pt-9 pb-[60px] xl:px-10 md:px-0 md:pb-6 md:h-auto">
    <div class="mx-auto max-w-[1280px]">
      <repo-header
        v-if="collectionData"
        :name="collectionData.name"
        :nickname="collectionData.nickname"
        :path="`${collectionData.username}/${collectionData.name}`"
        :hasLike="false"
        :desc="collectionData.description"
        :totalLikes="collectionData.likes"
        repo-type="collections"
      />
    </div>
  </div>
  <div class="mx-auto max-w-[1280px] mt-[-40px] xl:px-10 md:px-0 relative">
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
        <div class="pt-[24px]">
          <div
            class="h-[480px] md:h-auto pt-[24px]"
            v-if="!showRepoList"
          >
            <div class="w-[480px] absolute left-1/2 -translate-x-1/2 md:hidden">
              <img
                class="w-full"
                src="/images/search_circle_bg.png"
              />
            </div>
            <div class="flex flex-col justify-center items-center relative pt-[220px] md:pt-5">
              <div class="border border-[#EAECF0] rounded-[10px] p-3 max-w-[max-content] mb-4">
                <SvgIcon
                  name="collections"
                  width="24"
                />
              </div>
              <div class="test-[16px] leading-[24px]">
                {{ $t('collections.details.emptyCollection') }}
              </div>
              <div
                class="max-w-[300px] text-[#475467] text-[14px] text-center leading-[20px] font-light mb-6"
              >
                {{ $t('collections.details.tips') }}
              </div>
              <div class="flex gap-3">
                <CollectionsAddRepo
                  :settingsVisibility="settingsVisibility"
                  :collectionsId="collectionsId"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="max-w-[max-content]">
          <CollectionsAddRepo
            v-if="showRepoList"
            :settingsVisibility="settingsVisibility"
            :collectionsId="collectionsId"
          />
        </div>
        <CollectionsRepoList
          v-if="showRepoList"
          :repositories="collectionData.repositories"
        />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('collections.details.tabSettings')"
        name="setting"
        v-if="settingsVisibility"
      >
        <CollectionsSettings
          v-if="collectionData"
          :collection="collectionData"
          :collectionsId="collectionsId"
          :userName:="userName"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
  import { ref, inject, onBeforeMount, computed } from 'vue'
  import RepoHeader from '../shared/RepoHeader.vue'
  import CollectionsRepoList from './CollectionsRepoList.vue'
  import CollectionsSettings from './CollectionsSettings.vue'
  import CollectionsAddRepo from './CollectionsAddRepo.vue'
  import { ElMessage } from 'element-plus'

  import jwtFetch from '../../packs/jwtFetch'
  const csghubServer = inject('csghubServer')

  //   const perPage = ref(10)
  //   const currentPage = ref(1)
  //   const totalCollections = ref(0)
  const collectionData = ref()

  const props = defineProps({
    userName: String,
    collectionsId: String,
    path: String
  })

  const activeName = ref('page')

  const settingsVisibility = computed(() => {
    if (collectionData.value) {
      return props.userName === collectionData.value.username
    } else {
      return false
    }
  })

  const showRepoList = computed(() => {
    return collectionData.value?.repositories?.length > 0
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

  const fetchCollectionDetail = async (childCurrent) => {
    if (childCurrent) {
      currentPage.value = childCurrent
    }
    const url = `${csghubServer}/api/v1/collections/${props.collectionsId}`
    const res = await jwtFetch(url)
    if (!res.ok) {
      const { msg } = await res.json()
      ElMessage({ message: msg, type: 'warning' })
    } else {
      const { data } = await res.json()
      console.log(data)
      collectionData.value = data.data || []
    }
  }
  onBeforeMount(() => {
    if (props.path) {
      activeName.value = props.path
    }
    console.log(props.path)
    console.log(props.collectionsId)
    fetchCollectionDetail()
  })
</script>
