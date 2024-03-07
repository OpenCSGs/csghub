<template>
  <div class="flex min-h-[300px] md:px-5 md:flex-col-reverse">
    <div class="max-w-[60%] sm:max-w-[100%] pt-4 pb-10 pr-5 sm:pr-0 break-words flex-1 border-t border-[#EBEEF5] md:border-t-0">
      <el-skeleton v-if="loading" class="mt-4" :rows="5" animated />
      <MarkdownViewer
        :content="readmeContent"
        :setDefaultText="true"
        v-if="!loading"
      >
      </MarkdownViewer>
    </div>
    <div class="w-[40%] sm:w-[100%] border-l border-[#EBEEF5] md:border-l-0 md:border-b md:w-full md:pl-0">
      <div class="p-4">
        <div class="text-[#606266] text-base font-medium leading-[22px]">下载热度</div>
        <div class="text-[#303133] text-base font-semibold leading-6 mt-1">{{ downloadCount }}</div>
      </div>

      <QuestionAnswer v-if="inferenceStatus === 'RUNNING' && widgetType === 'generation'"
                      class="border-t border-[#EBEEF5] p-4"
                      :namespacePath="namespacePath"
                      :currentBranch="currentBranch"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import MarkdownViewer from '../../components/shared/viewers/MarkdownViewer.vue'
  import QuestionAnswer from './widgets/QuestionAnswer.vue';

  const props = defineProps({
    namespacePath: String,
    downloadCount: Number,
    currentBranch: String,
    widgetType: String,
    inferenceStatus: String
  })

  const loading = ref(true)
  const readmeContent = ref('')

  const fetchData = async () => {
    const url = `/internal_api/models/${props.namespacePath}/readme`

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

  onMounted(() => {
    fetchData()
  })
</script>
