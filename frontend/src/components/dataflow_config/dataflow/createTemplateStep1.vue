<template>
  <div>
    <el-form
      :model="subForm"
      :rules="rules"
      ref="formData"
      label-width="auto"
      label-position="top"
    >
      <p class="text-gray-900 text-2xl font-medium">
        {{ title }}
      </p>
      <p class="text-gray-600 text-md font-light mt-[2px]">
        {{ t('dataPipelines.dataProcessingDescription') }}
      </p>
      <div class="mt-8">
        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item
              :label="t('dataPipelines.templateName')"
              prop="name"
            >
              <el-input
                v-model="subForm.name"
                :placeholder="`${t('dataPipelines.toInput')}${t(
                  'dataPipelines.templateName'
                )}`"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item
              :label="t('dataPipelines.taskType')"
              prop="type"
            >
              <el-select
                v-model="subForm.type"
                style="width: 100%"
                :placeholder="t('dataPipelines.toSel')"
              >
                <el-option
                  :label="t('dataPipelines.data_refine')"
                  value="data_refine"
                />
                <el-option
                  :label="t('dataPipelines.data_generation')"
                  value="data_generation"
                />
                <el-option
                  :label="t('dataPipelines.data_enhancement')"
                  value="data_enhancement"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item :label="t('dataPipelines.templateDescription')">
              <el-input
                v-model="subForm.description"
                type="textarea"
                clearable
                :rows="5"
                :autosize="false"
              >
              </el-input>
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
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, inject, computed } from "vue"
import { ElMessage } from "element-plus"
import useFetchApi from "../../../packs/useFetchApi"
import { convertUtcToLocalTime } from "../../../packs/datetimeUtils"
import { useI18n } from "vue-i18n"

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const formLoading = ref(false)

const formData = ref(null)
const subForm = inject("subForm", ref({ 
  name: "", 
  type: "data_refine", 
  description: "",
  dslText: ""
}))
const step = inject("step", ref(1))
const templateId = computed(() => route.query.templateId)
const type = computed(() => route.query.type)
const title = computed(() => {
  return route.query.type === 'add'
    ? `${t('dataPipelines.create')}${t('dataPipelines.algorithmTemplate')}`
    : route.query.type === 'copy'
    ? `${t('dataPipelines.copy')}${t('dataPipelines.algorithmTemplate')}`
    : `${t('dataPipelines.edit')}${t('dataPipelines.algorithmTemplate')}`
})
const existingTemplates = ref([])

const rules = ref({
  name: [
    {
      required: true,
      message: `${t('dataPipelines.toInput')}${t(
        'dataPipelines.templateName'
      )}`,
      trigger: 'blur'
    },
    {
      // validator: validateTemplateName,
      trigger: 'blur'
    }
  ],
  type: [
    {
      required: true,
      message: `${t('dataPipelines.toSel')}${t('dataPipelines.taskType')}`,
      trigger: 'change'
    }
  ]
})



onMounted(() => {
  if (templateId.value) {
    getTemplatesDetalis()
  }
});

// 验证模版名称是否重复
// const validateTemplateName = (rule, value, callback) => {
//   if (!value) return callback();
//   const templates = existingTemplates.value || [];
//   const isDuplicate = templates.some(t => t.name === value.trim());
//   isDuplicate 
//     ? callback(new Error(t('dataPipelines.templateNameExists'))) 
//     : callback();
// }

// 模版名称失焦时验证
const validateTemplateNameOnBlur = () => {
  if (formData.value) {
    formData.value.validateField('name')
  }
}

// 获取模版详情
const getTemplatesDetalis = async () => {
  const url = `/dataflow/algo_templates/${templateId.value}`
  const { data } = await useFetchApi(url).get().json();
  if (data.value) {
    const res = data.value.data
    subForm.value.name = type.value === 'copy' ? `${res.name}_${t('dataPipelines.copy')}` : res.name
    subForm.value.type = res.type
    subForm.value.description = res.description
    subForm.value.dslText = res.dslText
  }
}

const submit = async () => {
  formData.value.validate(async (valid, fields) => {
    console.log(valid, "validvalidvalidvalid");
    if (valid) {
      // formLoading.value = true;
      step.value = 2;
      console.log(step.value, "tep.valuetep.valuetep.valuetep.valuetep.value");
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
