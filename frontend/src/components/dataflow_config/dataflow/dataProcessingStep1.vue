<template>
  <div>
    <el-form
      :model="subForm"
      :rules="rules"
      ref="ruleFormRef"
      label-position="top"
      style="padding: 0;"
    >
      <p class="text-gray-900 text-2xl font-medium">
        {{ pageMainTitle }}
      </p>
      <div class="p-[12px]">
        <el-row :gutter="20" class="border rounded-md p-[10px]">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item prop="project_name">
              <template #label>
                <p class="text-gray-500 text-xs mt-[12px]">{{ t("dataPipelines.taskName") }}</p>
              </template>
              <el-input
                v-model="subForm.project_name"
                :placeholder="`${t('dataPipelines.toInput')}${t('dataPipelines.taskName')}`"
                clearable
              >
                <!-- <template #prefix>
                  <SvgIcon
                    class="w-5 h-5 mx-2 text-gray-500"
                    name="server-fill"
                  />
                </template> -->
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item prop="owner">
              <template #label>
                <p class="text-gray-500 text-xs mt-[12px]">{{ t("collections.newCollection.owner") }}</p>
              </template>
              <el-select
                v-model="subForm.owner"
                :placeholder="t('dataPipelines.toSel') + t('collections.newCollection.owner')"
                style="width: 100%"
                @change="getSelListData(true)"
              >
                <el-option
                  v-for="item in namespaces()"
                  :key="item"
                  :label="item"
                  :value="item"
                />
                <!-- <el-option
                  label="z275748353"
                  value="z275748353"
                /> -->
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item prop="repo_id">
              <template #label>
                <p class="text-gray-500 text-xs mt-[12px]">{{ t('dataPipelines.dataSource') }}</p>
              </template>
              <el-select
                v-model="subForm.repo_id"
                :placeholder="t('dataPipelines.toSel')"
                clearable
                @change="fetchBranchList"
              >
                <el-option
                  v-for="item in dataSourceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.path"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item prop="branch">
              <template #label>
                <p class="text-gray-500 text-xs mt-[12px]">{{ t('dataPipelines.dataSourceBranch') }}</p>
              </template>
              <el-select
                v-model="subForm.branch"
                :placeholder="t('dataPipelines.toSel')"
                clearable
              >
              <el-option
                v-for="item in branchList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item prop="text_keys">
              <template #label>
                <p class="text-gray-500 text-xs mt-[12px]">{{ t("dataPipelines.processingText") }}</p>
              </template>
              <el-input
                v-model="subForm.text_keys"
                :placeholder="`${t('dataPipelines.toInput')}${t('dataPipelines.processingText')}`"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      
      <p class="text-gray-900 text-2xl font-medium my-2">
        {{ pageMainTitle }}
      </p>
      <div class="p-[12px]">
        <el-row :gutter="20" class="border rounded-md p-[10px]">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item>
              <template #label>
                <p class="text-gray-500 text-xs mt-[12px]">{{ t("dataPipelines.dataFlow") }}</p>
              </template>
              <el-select
                v-model="subForm.repo_id"
                style="width: 100%"
                :placeholder="t('dataPipelines.toSel') + t('dataPipelines.dataFlow')"
                :disabled="
                  taskUseType != 'tool' ||
                  (taskUseType == 'tool' && seltool.io_requirement != 'output_only')
                "
              >
                <el-option
                  v-for="item in dataSourceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.path"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item prop="name">
              <template #label>
                <p class="text-gray-500 text-xs mt-[12px]">{{ t("dataPipelines.taskTemplate") }}</p>
              </template>
              <el-select
                v-model="subForm.name"
                style="width: 100%"
                :placeholder="t('dataPipelines.toSel') + t('dataPipelines.taskTemplate')"
                @change="changeTemplate"
                :disabled="templateId"
              >
                <el-option
                  v-for="(item, index) in templateList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <div class="flex items-center justify-end gap-2 pt-5 bottomBtnGroup">
      <CsgButton
        class="btn btn-primary btn-md whitespace-nowrap mr-[5px]"
        v-loading="formLoading"
        @click="submit"
        :name="t('dataPipelines.nextStep')"
      />
      <CsgButton
        class="btn btn-secondary-gray btn-md whitespace-nowrap"
        @click="geback"
        :name="t('dataPipelines.cancel')"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, inject, computed, watch } from "vue";
import useFetchApi from "../../../packs/useFetchApi";
import { convertUtcToLocalTime } from "../../../packs/datetimeUtils";
import useUserStore from '../../../stores/UserStore.js'
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute()
const { t, locale } = useI18n();
const formLoading = ref(false);

const userStore = useUserStore()

const templateId = computed(() => route.query.templateId)
const templateName = computed(() => route.query.templateName)

// 模板名称到国际化key的映射
const templateNameMap = {
  "数据过滤": "dataFilter",
  "数据筛选": "dataSelection",
  "数据脱敏": "dataDesensitization",
  "语义去重": "semanticDeduplication",
  "质量评测": "qualityEvaluation",
};

const ruleFormRef = ref(null);
const subForm = inject("subForm", ref({ 
  project_name: '',
  dataset_path: '',
  export_path: '',
  text_keys: 'text',
  owner: '',
  repo_id: route.query.datasetPath || '',
  branch: '',
  name: route.query.templateId ? route.query.templateId * 1 : '',
  type: '',
  // selToolIndex: 0,
  process: [],
  dslText: ""
}))

// 动态页面大标题 - 根据选择的模板动态变化
const pageMainTitle = computed(() => {
  // 如果表单中已选择了模板
  const selectedTemplateName = subForm.value?.name;
  if (selectedTemplateName) {
    // 如果有对应的国际化key，使用国际化名称
    if (templateNameMap[selectedTemplateName]) {
      return t(`dataPipelines.${templateNameMap[selectedTemplateName]}`);
    }
    // 否则直接显示模板名称
    return selectedTemplateName;
  }
  
  // 使用URL参数中的模板名称
  if (templateName.value) {
    if (templateNameMap[templateName.value]) {
      return t(`dataPipelines.${templateNameMap[templateName.value]}`);
    }
    return templateName.value;
  }
  
  // 默认显示数据处理配置
  return t("dataPipelines.dataProcessingConfiguration");
});

const step = inject("step");
const rules = ref({
  project_name: [
    {
      required: true,
      message: `${t('dataPipelines.toInput')}${t('dataPipelines.taskName')}`,
      trigger: 'blur'
    }
  ],
  owner: [
    {
      required: true,
      message: `${t('dataPipelines.toSel')}${t('models.newModel.owner')}`,
      trigger: 'change'
    }
  ],
  repo_id: [
    {
      required: true,
      message: `${t('dataPipelines.toSel')}${t('dataPipelines.dataSource')}`,
      trigger: 'change'
    }
  ],
  branch: [
    {
      required: true,
      message: `${t('dataPipelines.toSel')}${t(
        'dataPipelines.dataSourceBranch'
      )}`,
      trigger: 'change'
    }
  ],
  text_keys: [
    {
      required: true,
      message: `${t('dataPipelines.toInput')}${t(
        'dataPipelines.processingText'
      )}`,
      trigger: 'blur'
    }
  ],
  name: [
    {
      required: true,
      message: `${t('dataPipelines.toSel')}${t(
        'dataPipelines.taskTemplate'
      )}`,
      trigger: 'change'
    }
  ]
})

const dataSourceList = ref([])
const branchList = ref([])
const templateList = ref([])

onMounted(() => {
  updateOwner()
  getTemplateData()
  // getToolsData()
  if (route.query.datasetPath) {
    if (!subForm.value.repo_id) {
      subForm.value.repo_id = route.query.datasetPath
    }
    fetchBranchList()
  }
  // changeTaskType()

  if (route.query.templateId) {
    getTemplatesDetalis()
  }
});

watch([() => userStore.username, () => route.query.datasetPath], () => {
  updateOwner()
})

// 监听路由参数 templateName 变化，更新模板选择
watch(() => route.query.templateName, (newTemplateName) => {
  if (newTemplateName && templateList.value.length > 0 && !templateId.value) {
    const matchedTemplate = templateList.value.find(
      (item) => item.name === newTemplateName
    )
    if (matchedTemplate) {
      subForm.value.name = matchedTemplate.name
      changeTemplate(matchedTemplate.name)
    }
  }
}, { immediate: false })

// 获取模版详情
const getTemplatesDetalis = async () => {
  const url = `/dataflow/algo_templates/${templateId.value}`
  const { data } = await useFetchApi(url).get().json();
  if (data.value) {
    const res = data.value.data
    subForm.value.name = res.name
    // subForm.value.type = res.type
    subForm.value.description = res.description
    subForm.value.dslText = res.dslText
    templateList.value = [{
      name: res.name,
      type: res.type,
    }]
  }
}

const fetchBranchList = async () => {
  const url = `datasets/${subForm.value.repo_id}/branches`
  const { data } = await useFetchApi(url).get().json()
  if (data.value && data.value.data) {
    branchList.value = data.value.data
  }
}

const getTemplateData = async () => {
  const url = '/dataflow/algo_templates?page=1&page_size=10000'
  const { data } = await useFetchApi(url).get().json()
  if (data.value) {
    templateList.value = data.value.data.templates
    
    // 如果有 templateName 参数，自动选择对应的模板（带校验）
    if (templateName.value && !templateId.value) {
      const matchedTemplate = templateList.value.find(
        (item) => item.name === templateName.value
      )
      if (matchedTemplate) {
        subForm.value.name = matchedTemplate.name
        changeTemplate(matchedTemplate.name)
      }
    }
  }
}

const changeTemplate = (e) => {
  const temp = templateList.value.filter((item) => item.name === e)[0]
  console.log(temp)

  subForm.value.type = temp.type || ''
  // subForm.value.name = temp.name
  subForm.value.dataset_path = temp.dataset_path || ''
  subForm.value.export_path = temp.export_path || ''
  subForm.value.dslText = temp.dslText || ''
  console.log(subForm.value)

}

const updateOwner = () => {
  subForm.value.owner = route.query.datasetPath
    ? route.query.datasetPath.split('/')[0]
    : userStore.username
  if (subForm.value.owner) {
    getSelListData()
  }
}

const namespaces = () => {
  let namespaces = userStore.orgs.map((org) => org.path)
  namespaces.unshift(userStore.username)
  return namespaces
}

const getSelListData = async (type) => {
  let url = `/user/${subForm.value.owner}/datasets?per=50&page=1`
  if (subForm.value.owner !== userStore.username) {
    url = `/organization/${subForm.value.owner}/datasets?current_user=${userStore.username}&per=50&page=1`
  }
  const { data } = await useFetchApi(url).get().json()
  if (data.value && data.value.data) {
    dataSourceList.value = data.value.data
    if (type) {
      subForm.value.repo_id = ''
    }
  } else {
    dataSourceList.value = []
    subForm.value.repo_id = ''
  }
}

const submit = async () => {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      // formLoading.value = true;
      step.value = 2;
    }
  });
};

const geback = () => {
  router.go(-1);
};
</script>
<style lang="less" scoped>
:deep(.settingsTableBtn) {
  .el-button {
    padding: 0 !important;
    margin-right: 20px !important;
    font-size: 14px !important;
    color: #667085 !important;
    font-weight: 400 !important;
    &:hover {
      color: #3250bd !important;
    }
  }
}

:deep(.tableCont) {
  .el-button--text {
    background: transparent !important;
  }
}

:deep(.el-form--inline) {
  .el-form-item {
    margin-right: 12px;
  }
}
.borderBox {
  border-radius: var(--spacing-lg, 12px);
  border: var(--spacing-none, 1px) solid
    var(--colors-gray-light-mode-200, #eaecf0);
  background: var(--Base-White, #fff);
  overflow: hidden;
}
:deep(.el-table__header) {
  background: var(--Gray-50, #f9fafb);
}
:deep(.el-table) {
  .el-table__cell {
    padding: 16px 24px;
  }
}
:deep(.tableCont) {
  .el-button--text {
    border: none;
  }
  .el-table__cell {
    font-size: 14px;
    color: #101828;
    font-weight: 400;
  }
}
:deep(.tableHeader) {
  font-size: 12px !important;
  font-weight: normal !important;
  color: #475467;
  padding: 12px 24px !important;
  border-bottom: 1px solid var(--colors-gray-light-mode-200, #eaecf0);
  background: var(--Gray-50, #f9fafb) !important;
}

:deep(.el-form) {
  padding: 15px;
}
</style>
