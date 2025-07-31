<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-[20px]">
      <SvgIcon
        class="w-5 h-5"
        name="dataflow_homeIcon"
      />
      <SvgIcon
        class="w-5 h-5 mx-2"
        name="dataflow_homeIcon_divider"
      />
      <p
        class="text-gray-700 text-sm font-medium cursor-pointer hover:text-brand-700"
        @click="navigateToPage"
      >
        {{ t('dataPipelines.algorithmTemplate') }}
      </p>
      <SvgIcon
        class="w-5 h-5 mx-2"
        name="dataflow_homeIcon_divider"
      />
      <p class="text-brand-700 text-sm font-medium">{{ title }}</p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">{{ title }}</p>
    <p class="text-gray-600 text-md font-light mt-[2px]">
      {{ t('dataPipelines.dataProcessingDescription') }}
    </p>
    <div class="mainOption mt-8 flex items-center justify-between">
      <el-form
        :model="subForm"
        ref="ruleFormRef"
        :rules="rules"
        label-width="auto"
        label-position="top"
        class="w-[640px] sm:w-full"
      >
        <el-form-item
          :label="t('dataPipelines.templateName')"
          prop="name"
        >
          <el-input
            style="width: 100%"
            v-model="subForm.name"
            @blur="validateTemplateNameOnBlur"
          />
        </el-form-item>
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
        <el-form-item :label="t('dataPipelines.templateDescription')">
          <el-input
            style="width: 100%"
            :rows="5"
            type="textarea"
            :autosize="false"
            v-model="subForm.description"
          />
        </el-form-item>
      </el-form>
    </div>
    <div
      class="flex items-start justify-between border-t border-gray-200 mt-6 pb-8 md:block md:border-none"
    >
      <div
        class="leftContBox border-r border-gray-200 w-[50%] pt-8 pr-8 md:w-full md:border-none md:p-0 md:mb-6"
      >
        <div class="borderBox">
          <div class="p-5">
            <p class="text-gray-900 text-lg font-medium">
              {{ t('dataPipelines.predefinedOperator') }}
            </p>
            <p class="text-gray-600 text-sm font-light mb-3">
              {{ t('dataPipelines.peratorTip') }}
            </p>
            <el-form
              :model="form"
              label-width="auto"
              label-position="top"
              @submit.prevent
            >
              <el-form-item
                :label="`${t('dataPipelines.search')}${t(
                  'dataPipelines.predefinedOperator'
                )}`"
              >
                <el-input
                  style="width: 100%"
                  v-model="form.searchStr"
                  @keyup.enter="searchListFun"
                  @clear="searchListFun"
                  :placeholder="`${t('dataPipelines.toInput')}${t(
                    'dataPipelines.operatorName'
                  )}`"
                  clearable
                />
              </el-form-item>
            </el-form>
          </div>
          <el-table
            :data="dataflowData"
            stripe
            max-height="500"
            class="rounded tableCont"
            :empty-text="t('dataPipelines.noData')"
            header-cell-class-name="tableHeader noBgHeader"
          >
            <el-table-column
              prop="name"
              :label="t('dataPipelines.predefinedOperator')"
              min-width="120"
            />
            <el-table-column
              prop="type"
              :label="t('dataPipelines.type')"
              min-width="100"
            />
            <el-table-column
              :label="t('dataPipelines.addOperator')"
              min-width="120"
              fixed="right"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.isOpen"
                  style="--el-switch-on-color: #3250bd"
                  @change="toggleOpen(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="pt-8 pl-8 w-[50%] md:w-full md:p-0">
        <div class="borderBox">
          <div class="py-5 px-6">
            <p class="text-lg text-gray-900 font-medium">
              {{ t('dataPipelines.myAlgorithmTemplate') }}
            </p>
          </div>
          <div class="flex flex-col dragCont">
            <el-table
              :data="tableData"
              row-key="name"
              class="rounded tableCont"
              :empty-text="t('dataPipelines.noData')"
              header-cell-class-name="tableHeader"
            >
              <el-table-column
                min-width="180"
                :label="t('dataPipelines.executionOrder')"
              >
                <template #default="{ $index }">
                  <div class="flex items-center justify-start gap-2.5">
                    <span>{{ $index + 1 }}</span>
                    <div
                      class="drag-handle"
                      @mousedown.stop=""
                    >
                      <SvgIcon
                        class="w-4 h-4"
                        name="dataflow_drag"
                      />
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                :label="t('dataPipelines.predefinedOperator')"
                width="200"
              />
              <el-table-column
                prop="type"
                :label="t('dataPipelines.operatorType')"
                width="200"
              />
              <el-table-column
                :label="t('dataPipelines.operatorConfiguration')"
                min-width="300"
              >
                <template #default="scope">
                  <div v-if="scope.row.params.length > 0">
                    <div
                      v-for="(item, paramIndex) in scope.row.params"
                      :key="paramIndex"
                      class="flex flex-col gap-3 p-1 typeItemCont"
                    >
                      <div v-if="item.type == 'from_2_to_20'">
                        <el-slider
                          v-model="scope.row.params[0].value"
                          size="small"
                          :min="2"
                          :max="scope.row.params[1].value"
                          style="width: 98%"
                        />
                        <p
                          class="text-gray-900 text-sm mt-3 mb-5"
                        >
                          {{ scope.row.params[0].name }}
                        </p>
                        <el-slider
                          v-model="scope.row.params[1].value"
                          size="small"
                          :min="scope.row.params[0].value"
                          :max="20"
                          style="width: 98%"
                        />
                        <p
                          class="text-gray-900 text-sm mt-3 mb-5"
                        >
                          {{ scope.row.params[1].name }}
                        </p>
                      </div>
                      <div
                        v-if="
                          [
                            'FLOAT',
                            'STRING',
                            'INTEGER',
                            'PositiveFloat',
                            'ClosedUnitInterval',
                            'LIST'
                          ].includes(item.type)
                        "
                      >
                        <el-select
                          v-if="
                            item.type == 'STRING' &&
                            Array.isArray(item.option_values)
                          "
                          v-model="item.value"
                          class="w-full"
                          :placeholder="item.name"
                        >
                          <el-option
                            v-for="selItem in item.option_values"
                            :key="selItem.key"
                            :label="selItem.label"
                            :value="selItem.key"
                          />
                        </el-select>
                        <el-input
                          v-if="
                            item.type == 'STRING' &&
                            !Array.isArray(item.option_values)
                          "
                          :placeholder="`${item.name}`"
                          style="width: 100%"
                          v-model="item.value"
                        />
                        <el-input
                          v-if="item.type == 'FLOAT'"
                          type="number"
                          :step="0.01"
                          :precision="2"
                          style="width: 100%"
                          v-model="item.value"
                        />
                        <el-input
                          v-if="item.type == 'INTEGER'"
                          type="number"
                          :min="0"
                          :precision="0"
                          :step="1"
                          style="width: 100%"
                          v-model="item.value"
                        />
                        <el-input
                          v-if="item.type == 'PositiveFloat'"
                          type="number"
                          :min="0"
                          style="width: 100%"
                          v-model="item.value"
                        />
                        <el-slider
                          v-if="item.type == 'ClosedUnitInterval'"
                          size="small"
                          v-model="item.value"
                          :min="0"
                          :max="1"
                          :step="0.01"
                          style="width: 98%"
                        />
                        <div
                          v-if="item.type == 'LIST'"
                          class="flex flex-wrap gap-2 tagInputCont"
                        >
                          <el-tag
                            v-for="tag in item.value"
                            :key="tag"
                            closable
                            :disable-transitions="false"
                            @close="removeTag(tag, item)"
                          >
                            {{ tag }}
                          </el-tag>
                          <el-input
                            ref="InputRef"
                            v-model="item.option_values"
                            :placeholder="item.name"
                            style="width: 100%"
                            @keyup.enter="handleInputConfirm(item)"
                          />
                        </div>
                        <p
                          class="text-gray-900 text-sm mt-3 mb-5"
                        >
                          {{ item.name }}
                        </p>
                      </div>
                      <el-checkbox
                        v-if="item.type == 'BOOLEAN'"
                        v-model="item.value"
                        :label="item.name"
                        class="block my-[10px]"
                      />
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="description"
                :label="t('dataPipelines.description')"
                min-width="240"
              />
              <el-table-column
                :label="t('dataPipelines.previewBefore')"
                min-width="240"
              >
                <template #default="scope">
                  <p class="text-gray-900 text-sm">
                    {{ scope.row.samples?.before }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                :label="t('dataPipelines.previewAfter')"
                min-width="240"
              >
                <template #default="scope">
                  <p class="text-gray-900 text-sm">
                    {{ scope.row.samples?.after }}
                  </p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-end gap-2 pt-8 bottomBtnGroup"
    >
      <CsgButton 
        class="btn btn-secondary-gray btn-md whitespace-nowrap"
        @click="geback"
        :name="t('dataPipelines.cancel')"
      />
      <CsgButton
        class="btn btn-primary btn-md whitespace-nowrap"
        @click="subTemplate"
        :name="t('dataPipelines.creationCompleted')"
      />
    </div>
  </div>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router'
  import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../../packs/useFetchApi'
  import zhOps from '../../../locales/zh_js/operator_zh.json'
  import enOps from '../../../locales/en_js/operator_en.json'
  import zhHantOps from '../../../locales/zh_hant_js/operator_zhHant.json'
  import Sortable from 'sortablejs'

  import { useI18n } from 'vue-i18n'

  const { t, locale } = useI18n()
  const dataflowOps = {
    zh: zhOps,
    en: enOps,
    zhHant: zhHantOps
  }

  const dataflowData = ref([])
  const dataflowDataAll = ref([])
  const form = ref({
    searchStr: ''
  })
  const subForm = ref({
    buildin: false,
    project_name: '',
    name: '',
    description: '',
    type: 'data_refine',
    process: []
  })
  const tableData = ref([])
  const existingTemplates = ref([])

  const router = useRouter()
  const route = useRoute()
  const index = computed(() => route.query.index)
  const isAdd = computed(() => route.query.type === 'add')
  const title = computed(() => {
    return route.query.type === 'add'
      ? `${t('dataPipelines.create')}${t('dataPipelines.algorithmTemplate')}`
      : `${t('dataPipelines.edit')}${t('dataPipelines.algorithmTemplate')}`
  })

  const navigateToPage = () => {
    router.push('/datapipelines/algTemplate')
  }
  const geback = () => {
    router.go(-1)
  }

  function toggleOpen(item) {
    if (item.isOpen) {
      tableData.value.push(item)
    } else {
      tableData.value = tableData.value.filter(
        (tableItem) => tableItem.key !== item.key
      )
    }
  }

  const handleInputConfirm = (item) => {
    if (item.option_values) {
      item.value.push(item.option_values)
    }
    item.option_values = ''
  }
  const removeTag = (tag, item) => {
    item.value.splice(item.value.indexOf(tag), 1)
  }

  const getTemplatesListFun = async () => {
    const url = '/dataflow/templates'
    const { data } = await useFetchApi(url).get().json()
    if (data.value) {
      const res = data.value
      // 保存现有模版列表用于重名验证
      existingTemplates.value = [...res]
      
      if (index.value !== null && res[index.value]) {
        subForm.value = {
          ...subForm.value,
          ...res[index.value]
        }
        tableData.value = [...res[index.value].process]
        let ops = dataflowOps[locale.value]
        tableData.value = tableData.value.map((item) => {
          if (ops.hasOwnProperty(item.name)) {
            const op = ops[item.name]
            if (Array.isArray(op.params) && op.params.length > 0) {
              const updatedParams = op.params.map(
                (paramsItem, paramsIndex) => {
                  return {
                    ...paramsItem,
                    value:
                      item.params[paramsIndex]?.value ?? paramsItem.value,
                    key: item.params[paramsIndex]?.name ?? paramsItem.name
                  }
                }
              )
              return {
                ...item,
                ...op,
                params: updatedParams,
                key: item.name
              }
            }
          }
          return {
            ...item,
            ...(ops.hasOwnProperty(item.name) ? ops[item.name] : item),
            key: item.name
          }
        })
      }
    }
    getOpsListFun()
  }

  const dataflowValues = (data) => {
    const result = []
    let ops = dataflowOps[locale.value]
    for (const key in data) {
      const mapper = data[key]
      let updatedParams = []
      if (Array.isArray(data[key].params) && data[key].params.length > 0) {
        updatedParams = data[key].params.map((paramsItem, paramsIndex) => {
          return {
            ...paramsItem,
            ...(ops[key]?.params[paramsIndex] || {}),
            key: paramsItem.name
          }
        })
      }
      result.push({
        ...(ops.hasOwnProperty(key) ? ops[key] : data[key]),
        key: key,
        isOpen: false,
        params: updatedParams
      })
    }

    return result
  }

  const getOpsListFun = async () => {
    const url = '/dataflow/ops'
    const { data } = await useFetchApi(url).get().json()
    if (data.value) {
      const res = data.value
      dataflowDataAll.value = dataflowValues(res)
      dataflowData.value = [...dataflowDataAll.value]
    }
    if (subForm.value.process.length > 0) {
      const processNames = subForm.value.process.map((item) => item.name)

      dataflowData.value.forEach((item) => {
        if (processNames.includes(item.key)) {
          item.isOpen = true
        }
      })
    }
  }
  const searchListFun = async () => {
    dataflowData.value = dataflowDataAll.value.filter((item) =>
      item.name.includes(form.value.searchStr)
    )
  }
  function overrideNameByKey(array) {
    return array.map((item) => {
      const newItem = {
        ...item,
        name: item.key
      }
      if (Array.isArray(item.params)) {
        newItem.params = item.params.map((param) => {
          return {
            ...param,
            name: param.key
          }
        })
      }
      return newItem
    })
  }

  const subTemplate = async () => {
    ruleFormRef.value.validate(async (valid, fields) => {
      if (valid) {
        if (tableData.value.length) {
          let params = {
            ...subForm.value,
            process: overrideNameByKey(tableData.value)
          }
          if (isAdd.value) {
            params.template_id = null
          }
          const options = {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
          }
          const url = '/dataflow/templates'
          const { data, error } = await useFetchApi(url, options).post().json()
          if (error.value) {
            ElMessage({
              message: `创建失败: ${error.value.msg}`,
              type: 'error'
            })
          } else {
            ElMessage({
              message: '创建成功',
              type: 'success'
            })
            window.location.href = '/datapipelines/algTemplate'
          }
        } else {
          ElMessage({
            message: `${t('dataPipelines.toSel')}${t(
              'dataPipelines.predefinedOperator'
            )}`,
            type: 'error'
          })
        }
      }
    })
  }

  // 验证模版名称是否重复
  const validateTemplateName = (rule, value, callback) => {
    if (!value) {
      callback()
      return
    }
    
    // 如果是编辑模式，排除当前编辑的模版
    const templatesToCheck = isAdd.value 
      ? existingTemplates.value 
      : existingTemplates.value.filter((_, idx) => idx !== parseInt(index.value))
    
    const isDuplicate = templatesToCheck.some(template => template.name === value.trim())
    
    if (isDuplicate) {
      callback(new Error(t('dataPipelines.templateNameExists')))
    } else {
      callback()
    }
  }

  // 模版名称失焦时验证
  const validateTemplateNameOnBlur = () => {
    if (ruleFormRef.value) {
      ruleFormRef.value.validateField('name')
    }
  }

  const ruleFormRef = ref(null)
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
        validator: validateTemplateName,
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
    getTemplatesListFun()
    const tableBody = document.querySelector(
      '.dragCont .el-table__body-wrapper tbody'
    )
    Sortable.create(tableBody, {
      animation: 300,
      handle: '.drag-handle',
      onEnd({ newIndex, oldIndex }) {
        const [removedItem] = tableData.value.splice(oldIndex, 1)
        tableData.value.splice(newIndex, 0, removedItem)
        console.log('newIndex===', newIndex)
        console.log('oldIndex===', oldIndex)
        console.log('removedItem===', removedItem)
      }
    })
  })
</script>
<style lang="less" scoped>
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
    white-space: nowrap;
    &.noBgHeader {
      background: transparent !important;
    }
  }

  .drag-handle {
    cursor: move;
    display: inline-block;
    width: 20px;
    text-align: center;
    color: #888;
    margin-right: 10px;
  }
  .optionBtn {
    border-radius: 8px;
    border: 1px solid #d0d5dd;
    background: #fff;
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    padding: 10px 14px;
    color: #344054;
    font-size: 14px;
    font-weight: 500;
  }
  :deep(.el-table) {
    .el-table__cell {
      z-index: 0 !important;
    }
  }
</style>
