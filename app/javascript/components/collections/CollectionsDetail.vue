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
        :label="'项目'"
        name="page"
      >
        <div class="pt-[24px]">项目项目</div>
      </el-tab-pane>
      <el-tab-pane
        :label="'设置'"
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
  import CollectionsSettings from './CollectionsSettings.vue'

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
      collectionData.value = data.data
      console.log(collectionData.value.likes)
      //   totalCollections.value = data.total
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
