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
      <div class="p-4">
        <div class="text-[#606266] text-base font-medium leading-[22px] md:pl-0">{{ $t('all.downloadCount') }}</div>
        <div class="text-[#303133] text-base font-semibold leading-6 mt-1 md:pl-0">{{ downloadCount }}</div>
      </div>

      <QuestionAnswer v-if="inferenceStatus === 'RUNNING' && widgetType === 'generation'"
                      class="border-t border-[#EBEEF5] p-4"
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
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import MarkdownViewer from '../../components/shared/viewers/MarkdownViewer.vue'
  import QuestionAnswer from '../models/widgets/QuestionAnswer.vue';
  import ParquetViewer from '../../components/datasets/ParquetViewer.vue'
  import SpaceRelationsCard from '../application_spaces/SpaceRelationsCard.vue'
  import CodeRelationsCard from '../codes/CodeRelationsCard.vue';

  const props = defineProps({
    namespacePath: String,
    downloadCount: Number,
    currentBranch: String,
    widgetType: String,
    inferenceStatus: String,
    repoType: String
  })

  const loading = ref(true)
  const readmeContent = ref('')
  const previewData = ref({})
  const relations = ref({})

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
