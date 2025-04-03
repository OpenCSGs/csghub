<template>
  <div class="flex md:px-5 md:flex-col-reverse min-h-[calc(100vh-341px)]">
    <div class="max-w-[60%] sm:max-w-[100%] py-8 pr-6 sm:pr-0 break-words flex-1 md:border-t-0">
      <el-skeleton v-if="loading" class="mt-4" :rows="5" animated />
      <ParquetViewer
        v-if="datasetInfo"
        :datasetInfo="datasetInfo"
        :namespacePath="namespacePath" />
      <markdown-viewer
        :content="readmeContent"
        :setDefaultText="true"
        v-if="!loading"
      >
      </markdown-viewer>
    </div>
    <div class="w-[40%] sm:w-[100%] border-l border-gray-200 md:border-l-0 md:border-b md:w-full md:pl-0">
      <div class="pl-6 py-8">
        <div class="text-gray-700 text-base font-medium text-md leading-[22px] md:pl-0">{{ $t('all.downloadCount') }}</div>
        <div class="text-gray-700 text-base font-semibold leading-6 mt-1 md:pl-0">{{ downloadCount }}</div>
      </div>

      <div v-if="widgetType === 'generation' && endpoint?.status === 'Running'">
        <TestEndpoint
          :appEndpoint="appEndpoint"
          :modelId="namespacePath"
        />
        <div class="px-4 mb-4 flex justify-between items-center">
          <div 
            class="items-center rounded-md gap-1.5 flex cursor-pointer py-2 px-3 btn-tertiary-gray"
            @click="dialogVisibleCode = true" >
            <SvgIcon name="json" />
            <div class="text-gray-600 text-xs leading-[18px]">
              view code
            </div>
          </div>
          <div
            class="items-center gap-1.5 flex cursor-pointer"
            @click="dialogVisible = true"
          >
            <SvgIcon name="fullscreen" />
            <div class="text-gray-700 text-xs leading-[18px]">
              {{ $t('endpoints.playground.maximum') }}
            </div>
          </div>
        </div>
      </div>

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

      <PromptRelationsCard v-if="relations['prompts'] && relations['prompts'].length !== 0"
                          :namespacePath="namespacePath"
                          :prompts="relations['prompts']"
      />

      <ModelRelationsCard v-if="relations['models'] && relations['models'].length !== 0"
                          :namespacePath="namespacePath"
                          :models="relations['models']"
      />
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    fullscreen
    append-to-body
  >
    <TestEndpoint
      v-if="widgetType === 'generation' && endpoint?.status === 'Running'"
      :appEndpoint="appEndpoint"
      :modelId="namespacePath"
    />
  </el-dialog>
  <el-dialog
    v-model="dialogVisibleCode"
    :width="dialogWidth"
    append-to-body
  >
    <RepoSummaryApiExample
      :appEndpoint="appEndpoint"
      :modelId="namespacePath"
    />
  </el-dialog>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
  import MarkdownViewer from '../../components/shared/viewers/MarkdownViewer.vue'
  import ParquetViewer from '../../components/datasets/ParquetViewer.vue'
  import SpaceRelationsCard from '../application_spaces/SpaceRelationsCard.vue'
  import PromptRelationsCard from '../prompts/PromptRelationsCard.vue';
  import CodeRelationsCard from '../codes/CodeRelationsCard.vue';
  import DatasetRelationsCard from '../datasets/DatasetRelationsCard.vue';
  import ModelRelationsCard from '../models/ModelRelationsCard.vue';
  import TestEndpoint from '../endpoints/playground/TestEndpoint.vue'
  import RepoSummaryApiExample from './RepoSummaryApiExample.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import resolveContent from '../../packs/resolveContent'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    namespacePath: String,
    downloadCount: Number,
    currentBranch: String,
    widgetType: String,
    repoType: String
  })

  const { t } = useI18n()

  const dialogVisible = ref(false)
  const dialogVisibleCode = ref(false)
  const dialogWidth = ref('800');
  
  const loading = ref(true)
  const readmeContent = ref('')
  const rawReadmeContent = ref('')
  const relations = ref({})
  const endpoint = ref({})
  const datasetInfo = ref(null)

const handleResize = () => {
  const widthMap = { 640: '100%', 768: '500', 1024: '700' };
  dialogWidth.value = widthMap[Object.keys(widthMap).find(key => window.innerWidth <= key)] || '800';
};

const fetchData = async () => {
  const endpoints = {
    readme: `/${props.repoType}s/${props.namespacePath}/blob/README.md`,
    catalog: `datasets/${props.namespacePath}/dataviewer/catalog`,
    relations: `/${props.repoType}s/${props.namespacePath}/relations`,
  };

  const fetchEndpointData = async (url) => {
    const { error, data } = await useFetchApi(url).json();
    return { error, data };
  };

  const [readmeResponse, catalogResponse, relationsResponse] = await Promise.all([
    fetchEndpointData(endpoints.readme),
    props.repoType === 'dataset' ? fetchEndpointData(endpoints.catalog) : null,
    fetchEndpointData(endpoints.relations),
  ]);

  if (readmeResponse.data?.value) {
    rawReadmeContent.value = readmeResponse.data.value.data.content;
    resolveReadmeContent();
  }

  if (catalogResponse?.data?.value) {
    datasetInfo.value = catalogResponse.data.value.data.dataset_info;
  } else if (catalogResponse?.error?.value) {
    ElMessage.warning(catalogResponse.error.value.msg || t('all.fetchError'));
  }

  if (relationsResponse.data?.value) {
    relations.value = relationsResponse.data.value.data;
  }

  loading.value = false;
};

  const appEndpoint = computed(() => {
    if (!endpoint.value) return ''

    return `https://${endpoint.value.proxy_endpoint}`
  })

  const fetchEndpoint = async () => {
    const url = `/models/${props.namespacePath}/serverless`

    const { data } = await useFetchApi(url).json()

    if (data.value) {
      endpoint.value = data.value.data
    }
  }

  const resolveReadmeContent = () => {
    const content = resolveContent(`${props.repoType}s`, rawReadmeContent.value, props.namespacePath, props.currentBranch)
    readmeContent.value = content
  }

  watch(() => props.currentBranch, resolveReadmeContent)

  onMounted(() => {
    fetchData()
    if (props.repoType == 'model') {
      fetchEndpoint()
    }
    window.addEventListener('resize', handleResize);
    handleResize();
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
});
</script>
