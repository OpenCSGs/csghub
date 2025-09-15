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
        <CollectionsRepoCard
          v-for="model in models"
          :key="model.id"
          :repo="model"
          :can-manage="canManage"
          @update:remark="updateRemark"
          @remove="removeRepo"
        >
          <template #item>
            <repo-item :repo="model" repo-type="model" />
          </template>
        </CollectionsRepoCard>
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
        <CollectionsRepoCard
          v-for="dataset in datasets"
          :key="dataset.id"
          :repo="dataset"
          :can-manage="canManage"
          @update:remark="updateRemark"
          @remove="removeRepo"
        >
          <template #item>
            <repo-item :repo="dataset" repo-type="dataset" />
          </template>
        </CollectionsRepoCard>
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
        <CollectionsRepoCard
          v-for="code in codes"
          :key="code.id"
          :repo="code"
          :can-manage="canManage"
          @update:remark="updateRemark"
          @remove="removeRepo"
        >
          <template #item>
            <repo-item :repo="code" repo-type="code" />
          </template>
        </CollectionsRepoCard>
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
        <CollectionsRepoCard
          v-for="space in spaces"
          :key="space.id"
          :repo="space"
          :can-manage="canManage"
          @update:remark="updateRemark"
          @remove="removeRepo"
        >
          <template #item>
            <application-space-item :repo="space" repo-type="space" class="flex-grow" />
          </template>
        </CollectionsRepoCard>
      </div>
    </div>

    <!-- mcps -->
    <div class="mt-[32px]" v-if="hasMcps">
      <h3 class="text-xl text-gray-700 flex items-center gap-[8px]">
        <SvgIcon
          name="space_mcp"
          width="18"
          height="18"
        />
        <span>{{ $t('mcps.title') }}</span>
        <span class="text-gray-400 text-md leading-[24px]">{{ mcps.length }}</span>
      </h3>
      <div
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <CollectionsRepoCard
          v-for="mcp in mcps"
          :key="mcp.id"
          :repo="mcp"
          :can-manage="canManage"
          @update:remark="updateRemark"
          @remove="removeRepo"
        >
          <template #item>
            <mcp-item :mcp="mcp" :showRightIcons="false" />
          </template>
        </CollectionsRepoCard>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { computed, ref, onMounted, inject } from 'vue'
  import RepoItem from '../shared/RepoItem.vue'
  import ApplicationSpaceItem from '../application_spaces/ApplicationSpaceItem.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import McpItem from '../mcp/McpItem.vue'
  import CollectionsRepoCard from './CollectionsRepoCard.vue'
  import useRepoDetailStore from '@/stores/RepoDetailStore'

  const { t } = useI18n()
  const props = defineProps({
    repositories: Object,
    collectionsId: String,
    canManage: Boolean
  })

  const repoDetailStore = useRepoDetailStore()
  const models = ref([])
  const datasets = ref([])
  const codes = ref([])
  const spaces = ref([])
  const mcps = ref([])

  const hasModels = computed(() => models.value?.length > 0)
  const hasDatasets = computed(() => datasets.value?.length > 0)
  const hasCodes = computed(() => codes.value?.length > 0)
  const hasSpaces = computed(() => spaces.value?.length > 0)
  const hasMcps = computed(() => mcps.value?.length > 0)

  const fetchCollectionDetail = inject('fetchCollectionDetail')

  const updateRemark = async (params) => {
    const remarkData ={
      remark: params.remark
    }
    const options = { body: JSON.stringify(remarkData) }
    const { data, error } = await useFetchApi(
      `/collections/${props.collectionsId}/repos/${params.id}`,
      options
    ).put().json()
    if (error.value) {
      ElMessage.warning(error.value.msg)
    } else {
      ElMessage.success(t('all.updateSuccess'))
      repoDetailStore.clearStore()
      fetchCollectionDetail()
    }
  }
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
      ElMessage.warning(error.value.msg)
    }else{
      ElMessage.success(t('all.delSuccess'))
      repoDetailStore.clearStore()
      fetchCollectionDetail()
    }
  }
  onMounted(() => {
    props.repositories.forEach((item) => {
      item.downloads = item.download_count
      Object.assign(item, {
        showRemarkInput: false
      })
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
        case 'mcpserver':
          mcps.value.push(item)
          break
      }
    })
  })
</script>
