<template>
  <div class="sm:w-[100%] sm:mt-[36px] pt-4 pb-8 px-2">
    <!-- models -->
    <div>
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon
          name="models"
          width="18"
          height="18"
        />
        <span>{{ $t('organization.model') }}</span>
        <span class="text-[#98A2B3] text-[16px] leading-[24px]">{{ models.length }}</span>
      </h3>
      <div
        v-if="hasModels"
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <div class="flex gap-2" v-for="model in models">
          <repo-item
            :repo="model"
            repo-type="model"
          ></repo-item>
          <SvgIcon class="cursor-pointer" v-if="settingsVisibility" @click="removeRepo(model.id)" name="trash" />
        </div>
      </div>
      <div
        v-else
        class="flex flex-wrap gap-4 mb-4 mt-[16px]"
      >
        {{ $t('all.noData') }}
      </div>
    </div>

    <!-- datasets -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon
          name="datasets"
          width="18"
          height="18"
        />
        <span>{{ $t('organization.dataset') }}</span>
        <span class="text-[#98A2B3] text-[16px] leading-[24px]">{{ datasets.length }}</span>
      </h3>
      <div
        v-if="hasDatasets"
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <div class="flex gap-2" v-for="dataset in datasets">
          <repo-item
            :repo="dataset"
            repo-type="dataset"
          ></repo-item>
          <SvgIcon class="cursor-pointer" v-if="settingsVisibility" @click="removeRepo(dataset.id)" name="trash" />
        </div>
      </div>
      <div
        v-else
        class="flex flex-wrap gap-4 mb-4 mt-[16px]"
      >
        {{ $t('all.noData') }}
      </div>
    </div>

    <!-- code repo -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon
          name="codes"
          width="18"
          height="18"
        />
        <span>{{ $t('organization.code') }}</span>
        <span class="text-[#98A2B3] text-[16px] leading-[24px]">{{ codes.length }}</span>
      </h3>
      <div
        v-if="hasCodes"
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <div class="flex gap-2" v-for="code in codes">
          <repo-item
            :repo="code"
            repo-type="code"
          ></repo-item>
          <SvgIcon class="cursor-pointer" v-if="settingsVisibility" @click="removeRepo(code.id)" name="trash" />
        </div>
      </div>
      <div
        v-else
        class="flex flex-wrap gap-4 mb-4 mt-[16px]"
      >
        {{ $t('all.noData') }}
      </div>
    </div>

    <!-- spaces -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon
          name="spaces"
          width="18"
          height="18"
        />
        <span>{{ $t('organization.space') }}</span>
        <span class="text-[#98A2B3] text-[16px] leading-[24px]">{{ spaces.length }}</span>
      </h3>
      <div
        v-if="hasSpaces"
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <div class="flex gap-2" v-for="space in spaces">
          <application-space-item
            :repo="space"
            repo-type="space"
          ></application-space-item>
          <SvgIcon class="cursor-pointer" v-if="settingsVisibility" @click="removeRepo(space.id)" name="trash" />
        </div>
      </div>
      <div
        v-else
        class="flex flex-wrap gap-4 mb-4 mt-[16px]"
      >
        {{ $t('all.noData') }}
      </div>
    </div>
  </div>
</template>
<script setup>
  import { computed, ref, onMounted, inject } from 'vue'
  import RepoItem from '../shared/RepoItem.vue'
  import ApplicationSpaceItem from '../application_spaces/ApplicationSpaceItem.vue'
  import jwtFetch from '../../packs/jwtFetch'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const props = defineProps({
    repositories: Object,
    collectionsId: String,
    settingsVisibility: Boolean
  })

  const csghubServer = inject('csghubServer')
  
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
    const options = { method: "DELETE", body: JSON.stringify(removeRepoData) }
    const url = `${csghubServer}/api/v1/collections/${props.collectionsId}/repos`
    const response = await jwtFetch(url, options)
      if (!response.ok) {
      return response.json().then((data) => {
        ElMessage({ message: data.msg, type: 'warning' })
      })
    } else {
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
