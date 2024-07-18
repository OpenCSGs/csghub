<template>
  <div class="flex md:px-5 md:flex-col-reverse min-h-[calc(100vh-341px)]">
    <div class="max-w-[60%] sm:max-w-[100%] pt-4 pb-10 pr-5 sm:pr-0 break-words flex-1 border-t border-[#EBEEF5] md:border-t-0">
      <el-skeleton v-if="loading" class="mt-4" :rows="5" animated />
      <ParquetViewer v-if="previewData.data" :previewData="previewData.data" />
      <markdown-viewer
        :content="readmeContent"
        :setDefaultText="true"
        v-if="!loading"
      >
      </markdown-viewer>
    </div>
    <div class="w-[40%] sm:w-[100%] border-l border-[#EBEEF5] md:border-l-0 md:border-b md:w-full md:pl-0">
      <div class="p-[16px]">
        <div class="text-[#606266] text-base font-medium leading-[22px] md:pl-0">{{ $t('all.downloadCount') }}</div>
        <div class="text-[#303133] text-base font-semibold leading-6 mt-1 md:pl-0">{{ downloadCount }}</div>
      </div>
    <div 
      v-if="repoType == 'model'" 
      v-for="licenseTagInfo in licenseTagsInfo"
      class="flex flex-col gap-[16px] border-t border-[#EBEEF5] p-[16px]"
    >
      <div class="flex">
        <SvgIcon name="license" />
        <p class="ml-[8px] text-[16px] leading-[24px] text-[#344054]">License</p>
      </div>
      <div class="flex gap-[8px]">
        <div class="flex gap-[4px] px-[8px] py-[4px] border rounded-[16px]">
          <SvgIcon name="license" width="15" height="15" />
          <p class="text-[14px] leading-[20px] text-[#667085]">License: {{ licenseTagInfo.name }}</p>
        </div>
        <a :href="licenseTagInfo.url" target="_blank" class="flex w-[30px] h-[30px] border rounded-[8px] justify-center items-center">
          <SvgIcon name="top_right_arrow" />
        </a>
      </div>
      <div 
        class="text-[16px] leading-[24px] text-[#344054]"
        :class="showMoreLicenseDescButton(licenseTagInfo.desc.length) ? 'overflow-hidden text-ellipsis line-clamp-2 text-left': ''"
      >
      {{ licenseTagInfo.desc }}
      </div>
      <div 
        v-if="showMoreLicenseDesc(licenseTagInfo.desc.length)" 
        @click="moreLicenseDesc = true" 
        class="text-[12px] leading-[16px] text-[#223B99] cursor-pointer"
      >
        展开更多
      </div>
    </div>

      <QuestionAnswer v-if="inferenceStatus === 'RUNNING' && widgetType === 'generation'"
                      :namespacePath="namespacePath"
                      :currentBranch="currentBranch"
      />

      <SpaceRelationsCard v-if="relations['spaces'] && relations['spaces'].length !== 0"
                          :namespacePath="namespacePath"
                          :spaces="relations['spaces']"
      />

      <CodeRelationsCard v-if="relations['codes'] && relations['codes'].length !== 0"
                          :namespacePath="namespacePath"
                          :codes="relations['codes']"
      />

      <DatasetRelationsCard v-if="relations['datasets'] && relations['datasets'].length !== 0"
                            :namespacePath="namespacePath"
                            :datasets="relations['datasets']"
      />

      <ModelRelationsCard v-if="relations['models'] && relations['models'].length !== 0"
                          :namespacePath="namespacePath"
                          :models="relations['models']"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import MarkdownViewer from '../../components/shared/viewers/MarkdownViewer.vue'
  import QuestionAnswer from '../models/widgets/QuestionAnswer.vue';
  import ParquetViewer from '../../components/datasets/ParquetViewer.vue'
  import SpaceRelationsCard from '../application_spaces/SpaceRelationsCard.vue'
  import CodeRelationsCard from '../codes/CodeRelationsCard.vue';
  import DatasetRelationsCard from '../datasets/DatasetRelationsCard.vue';
  import ModelRelationsCard from '../models/ModelRelationsCard.vue';

  const props = defineProps({
    namespacePath: String,
    downloadCount: Number,
    currentBranch: String,
    widgetType: String,
    inferenceStatus: String,
    repoType: String,
    licenseTagsInfo: Object
  })

  const loading = ref(true)
  const readmeContent = ref('')
  const previewData = ref({})
  const relations = ref({})
  const moreLicenseDesc = ref(false)

  const showMoreLicenseDescButton = (length) => {
    return moreLicenseDesc.value == false && length >= 70
  }

  const showMoreLicenseDesc = (length) => {
    if (length < 70) {
      return false
    } else {
      return showMoreLicenseDescButton(length)
    }
  }

  const fetchData = async () => {
    const url = `/internal_api/${props.repoType}s/${props.namespacePath}/readme`

    fetch(url).then((response) => {
      response.json().then((data) => {
        readmeContent.value = data.readme
      }).catch((error) => {
        console.error(error)
      }).then(() => {
        loading.value = false
      })
    })
  }

  const fetchPreviewData = async () => {
    if (props.repoType !== 'dataset') {
      return
    }
    const url = `/internal_api/datasets/${props.namespacePath}/preview`

    fetch(url).then((response) => {
      if (!response.ok) {
        response.json().then((data) => {
          console.error(data.message)
        })
      } else {
        response.json().then((data) => {
          previewData.value = data
        })
      }
    }).catch((error) => {
      console.error(error)
    })
  }

  const fetchRepoRelations = async () => {
    const url = `/internal_api/${props.repoType}s/${props.namespacePath}/related_repos`
    fetch(url).then((response) => {
      if (!response.ok) {
        response.json().then((data) => {
          console.error(data.message)
        })
      } else {
        response.json().then((data) => {
          relations.value = data.relations
        })
      }
    }).catch((error) => {
      console.error(error)
    })
  }

  onMounted(() => {
    fetchData()
    fetchPreviewData()
    fetchRepoRelations()
  })
</script>
