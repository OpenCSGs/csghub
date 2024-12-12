<template>
  <div class="sm:w-[100%] sm:mt-[36px] pt-4 pb-8 px-2">
    <!-- models -->
    <div v-if="hasModels">
      <h3 class="text-xl text-gray-700 flex items-center gap-[8px]">
        <SvgIcon
          name="models"
          width="18"
          height="18"
        />
        <span>{{ $t('organization.model') }}</span>
        <span class="text-gray-400 text-md leading-[24px]">{{ models.length }}</span>
      </h3>
      <div
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <div class="flex gap-2" v-for="model in models">
          <div class="flex w-full gap-2 group">
            <repo-item
              :repo="model"
              repo-type="model"
            ></repo-item>
            <SvgIcon class="cursor-pointer hidden group-hover:block" v-if="canManage" @click="removeRepo(model.id)" name="trash" />
          </div>
        </div>
      </div>
    </div>

    <!-- datasets -->
    <div class="mt-[32px]" v-if="hasDatasets">
      <h3 class="text-xl text-gray-700 flex items-center gap-[8px]">
        <SvgIcon
          name="datasets"
          width="18"
          height="18"
        />
        <span>{{ $t('organization.dataset') }}</span>
        <span class="text-gray-400 text-md leading-[24px]">{{ datasets.length }}</span>
      </h3>
      <div
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <div class="flex gap-2" v-for="dataset in datasets">
          <div class="flex w-full gap-2 group">
            <repo-item
              :repo="dataset"
              repo-type="dataset"
            ></repo-item>
            <SvgIcon class="cursor-pointer hidden group-hover:block" v-if="canManage" @click="removeRepo(dataset.id)" name="trash" />
          </div>
        </div>
      </div>
    </div>

    <!-- code repo -->
    <div class="mt-[32px]" v-if="hasCodes">
      <h3 class="text-xl text-gray-700 flex items-center gap-[8px]">
        <SvgIcon
          name="codes"
          width="18"
          height="18"
        />
        <span>{{ $t('organization.code') }}</span>
        <span class="text-gray-400 text-md leading-[24px]">{{ codes.length }}</span>
      </h3>
      <div
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <div class="flex gap-2" v-for="code in codes">
          <div class="flex w-full gap-2 group">
            <repo-item
              :repo="code"
              repo-type="code"
            ></repo-item>
            <SvgIcon class="cursor-pointer hidden group-hover:block" v-if="canManage" @click="removeRepo(code.id)" name="trash" />
          </div>
        </div>
      </div>
    </div>

    <!-- spaces -->
    <div class="mt-[32px]" v-if="hasSpaces">
      <h3 class="text-xl text-gray-700 flex items-center gap-[8px]">
        <SvgIcon
          name="spaces"
          width="18"
          height="18"
        />
        <span>{{ $t('organization.space') }}</span>
        <span class="text-gray-400 text-md leading-[24px]">{{ spaces.length }}</span>
      </h3>
      <div
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <div class="flex gap-2" v-for="space in spaces">
          <div class="flex w-full gap-2 group">
            <application-space-item
              :repo="space"
              repo-type="space"
              class="flex-grow"
            ></application-space-item>
            <SvgIcon class="cursor-pointer hidden group-hover:block" v-if="canManage" @click="removeRepo(space.id)" name="trash" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { computed, ref, onMounted } from 'vue'
  import RepoItem from '../shared/RepoItem.vue'
  import ApplicationSpaceItem from '../application_spaces/ApplicationSpaceItem.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const props = defineProps({
    repositories: Object,
    collectionsId: String,
    canManage: Boolean
  })

  const models = ref([])
  const datasets = ref([])
  const codes = ref([])
  const spaces = ref([])

  const hasModels = computed(() => models.value?.length > 0)
  const hasDatasets = computed(() => datasets.value?.length > 0)
  const hasCodes = computed(() => codes.value?.length > 0)
  const hasSpaces = computed(() => spaces.value?.length > 0)

 const removeRepo = async (id) => {
    try {
      await ElMessageBox.confirm(t('collections.edit.removeTips'), t('collections.edit.removeRepos'), {
        confirmButtonText: t('all.confirm'),
        cancelButtonText: t('all.cancel'),
        type: 'warning'
      })
      .then(() =>{
        removeRepoFromCollections(id)
      })
      .catch(() =>{
        console.log('cancel');
      })
    } catch (error) {
      console.log(error)
    }
  }

  const removeRepoFromCollections = async (id) => {
    const removeRepoData = {
      repo_ids: [id]
    }
    const options = { body: JSON.stringify(removeRepoData) }
    const url = `/collections/${props.collectionsId}/repos`
    const { error } = await useFetchApi(url, options).delete().json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    }else{
      ElMessage({ message: t('all.delSuccess'), type: 'success' })
      location.href = `/collections/${props.collectionsId}`
    }
  }
  onMounted(() => {
    props.repositories.forEach((item) => {
      item.downloads = item.download_count
      switch (item.repository_type) {
        case 'model':
          models.value.push(item)
          break
        case 'dataset':
          datasets.value.push(item)
          break
        case 'space':
          spaces.value.push(item)
          break
        case 'code':
          codes.value.push(item)
          break
      }
    })
  })
</script>
