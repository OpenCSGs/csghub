<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-5">
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
        {{ t('dataPipelines.dataProcessing') }}
      </p>
      <SvgIcon
        class="w-5 h-5 mx-2"
        name="dataflow_homeIcon_divider"
      />
      <p class="text-brand-700 text-sm font-medium">
        {{ t('dataPipelines.newTask') }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">
      {{ t('dataPipelines.newTask') }}
    </p>
    <p class="text-gray-600 text-md font-light mt-[2px]">
      {{ t('dataPipelines.dataProcessingDescription') }}
    </p>
    <el-radio-group
      v-model="taskUseType"
      class="mt-8"
      @change="changeTaskType"
    >
      <el-radio
        label="ops"
        size="large"
        >{{ $t('dataPipelines.taskType1') }}</el-radio
      >
      <el-radio
        label="tool"
        size="large"
        >{{ $t('dataPipelines.taskType2') }}</el-radio
      >
    </el-radio-group>
    <div class="mainOption flex items-center justify-between">
      <el-form
        ref="ruleFormRef"
        :model="form"
        :rules="rules"
        label-width="auto"
        label-position="top"
        class="w-[640px] sm:w-full"
      >
        <el-form-item
          :label="t('dataPipelines.taskName')"
          prop="project_name"
        >
          <el-input
            style="width: 100%"
            v-model="form.project_name"
          />
        </el-form-item>
        <el-form-item
          :label="t('models.newModel.owner')"
          prop="owner"
          class="w-full"
        >
          <el-select
            v-model="form.owner"
            :placeholder="t('all.select')"
            style="width: 100%"
            @change="getSelListData(true)"
          >
            <el-option
              v-for="item in namespaces()"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            taskUseType != 'tool' ||
            (taskUseType == 'tool' &&
              ['all', 'input_only'].includes(seltool.io_requirement))
          "
          :label="t('dataPipelines.dataSource')"
          prop="repo_id"
        >
          <el-select
            v-model="form.repo_id"
            style="width: 100%"
            :placeholder="t('dataPipelines.toSel')"
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
        <el-form-item
          v-if="
            taskUseType != 'tool' ||
            (taskUseType == 'tool' &&
              ['all', 'input_only'].includes(seltool.io_requirement))
          "
          :label="t('dataPipelines.dataSourceBranch')"
          prop="branch"
        >
          <el-select
            v-model="form.branch"
            style="width: 100%"
            :placeholder="t('dataPipelines.toSel')"
          >
            <el-option
              v-for="item in branchList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="taskUseType == 'ops'"
          :label="t('dataPipelines.processingText')"
          prop="text_keys"
        >
          <el-input
            style="width: 100%"
            v-model="form.text_keys"
          />
        </el-form-item>
        <el-form-item
          :label="t('dataPipelines.dataFlow')"
          v-if="
            taskUseType != 'tool' ||
            (taskUseType == 'tool' &&
              ['all', 'output_only'].includes(seltool.io_requirement))
          "
        >
          <el-select
            v-model="form.repo_id"
            style="width: 100%"
            :placeholder="t('dataPipelines.toSel')"
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
        <el-form-item
          v-if="taskUseType == 'ops'"
          :label="t('dataPipelines.taskTemplate')"
          prop="selTemplate"
        >
          <el-select
            v-model="form.selTemplate"
            style="width: 100%"
            :placeholder="t('dataPipelines.toSel')"
            @change="changeTemplate"
          >
            <el-option
              v-for="(item, index) in templateList"
              :key="index"
              :label="item.name"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="taskUseType == 'tool'"
          :label="t('dataPipelines.taskType2')"
          prop="selToolIndex"
        >
          <el-select
            v-model="form.selToolIndex"
            style="width: 100%"
            :placeholder="t('dataPipelines.toSel')"
            @change="changeTool"
          >
            <el-option
              v-for="(item, index) in toolListAll"
              :key="index"
              :label="t(`dataPipelines.${item.name}`)"
              :value="index"
            />
          </el-select>
        </el-form-item>
        <div v-if="taskUseType == 'tool'">
          <el-form-item
            v-for="(item, paramIndex) in seltool.params"
            :key="paramIndex"
            :label="item.name"
          >
            <el-slider
              v-if="item.type == 'from_2_to_20'"
              v-model="item.value"
              size="small"
              :min="2"
              :max="20"
              style="width: 98%"
            />
            <el-select
              v-if="item.type == 'STRING' && Array.isArray(item.option_values)"
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
              v-if="item.type == 'STRING' && !Array.isArray(item.option_values)"
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
              class="w-full flex flex-wrap gap-2 tagInputCont"
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
                v-model="item.tempVal"
                :placeholder="item.name"
                style="width: 100%"
                @keyup.enter="handleInputConfirm(item,'tempVal')"
              />
            </div>
            <el-checkbox
              v-if="item.type == 'BOOLEAN'"
              v-model="item.value"
              :label="item.name"
              class="block my-2.5"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div
      class="borderBox mt-0.5"
      v-if="taskUseType == 'ops'"
    >
      <div class="py-5 px-6 flex items-center justify-between">
        <p class="text-lg text-gray-900 font-medium">
          {{ t('dataPipelines.predefinedOperatorSelection') }}
        </p>
        <CsgButton
          class="btn btn-primary btn-md whitespace-nowrap"
          style="visibility: hidden"
          :name="t('dataPipelines.publishAsNewTemplate')"
        />
      </div>
      <div class="flex flex-col">
        <el-table
          :data="tableData"
          row-key="name"
          class="rounded tableCont"
          :empty-text="t('dataPipelines.noData')"
          header-cell-class-name="tableHeader"
        >
          <el-table-column
            min-width="120"
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
            :label="t('dataPipelines.enableOrNot')"
            width="150"
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.isOpen"
                style="--el-switch-on-color: #3250bd"
              />
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
                    <p class="text-gray-900 text-sm mt-3 mb-5">
                      {{ scope.row.params[0].name }}
                    </p>
                    <el-slider
                      v-model="scope.row.params[1].value"
                      size="small"
                      :min="scope.row.params[0].value"
                      :max="20"
                      style="width: 98%"
                    />
                    <p class="text-gray-900 text-sm mt-3 mb-5">
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
                        @keyup.enter="handleInputConfirm(item,'option_values')"
                      />
                    </div>
                    <p class="text-gray-900 text-sm mt-3 mb-5">
                      {{ item.name }}
                    </p>
                  </div>
                  <el-checkbox
                    v-if="item.type == 'BOOLEAN'"
                    v-model="item.value"
                    :label="item.name"
                    class="block my-2.5"
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
    <div
      class="flex items-center justify-end gap-2 pt-5 bottomBtnGroup"
    >
      <CsgButton
        class="btn btn-secondary-gray btn-md whitespace-nowrap"
        @click="geback"
        :name="t('dataPipelines.cancel')"
      />
      <CsgButton
        class="btn btn-primary btn-md whitespace-nowrap"
        @click="subJob"
        v-loading="subLoading"
        :name="t('dataPipelines.creationCompleted')"
      />
    </div>
  </div>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router'
  import { ref, onMounted, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import useUserStore from '../../../stores/UserStore.js'
  import useFetchApi from '../../../packs/useFetchApi'
  import zhOps from '../../../locales/zh_js/operator_zh.json'
  import enOps from '../../../locales/en_js/operator_en.json'
  import zhHantOps from '../../../locales/zh_hant_js/operator_zhHant.json'
  import Sortable from 'sortablejs'
  import { useI18n } from 'vue-i18n'

  const userStore = useUserStore()
  const { t, locale } = useI18n()
  const dataSourceList = ref([])
  const branchList = ref([])
  const templateList = ref([])
  const subLoading = ref(false)
  const dataflowOps = {
    zh: zhOps,
    en: enOps,
    zhHant: zhHantOps
  }
  const route = useRoute()
  const selTemplate = ref(
    route.query.templateId ? route.query.templateId * 1 : 0
  )
  const selToolName = ref(route.query.selToolName || '')
  const taskUseType = ref(route.query.type ? route.query.type : 'ops')
  const toolListAll = ref([])
  const seltool = ref({})
  const form = ref({
    project_name: '',
    dataset_path: '',
    export_path: '',
    text_keys: 'text',
    owner: '',
    repo_id: route.query.datasetPath || '',
    branch: '',
    selTemplate: route.query.templateId ? route.query.templateId * 1 : 0,
    selToolIndex: 0,
    process: []
  })
  const ruleFormRef = ref(null)
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
    selTemplate: [
      {
        required: true,
        message: `${t('dataPipelines.toSel')}${t(
          'dataPipelines.taskTemplate'
        )}`,
        trigger: 'change'
      }
    ],
    selToolIndex: [
      {
        required: true,
        message: `${t('dataPipelines.toSel')}${t('dataPipelines.taskType2')}`,
        trigger: 'change'
      }
    ]
  })
  const tableData = ref([])

  const router = useRouter()
  const navigateToPage = () => {
    router.push('/datapipelines')
  }
  const geback = () => {
    router.go(-1)
  }

  const updateOwner = () => {
    form.value.owner = route.query.datasetPath
      ? route.query.datasetPath.split('/')[0]
      : userStore.username
    if (form.value.owner) {
      getSelListData()
    }
  }

  const namespaces = () => {
    let namespaces = userStore.orgs.map((org) => org.path)
    namespaces.unshift(userStore.username)
    return namespaces
  }

  const handleInputConfirm = (item,type) => {
    if (item[type]) {
      item.value.push(item[type])
    }
    item[type] = ''
  }
  const removeTag = (tag, item) => {
    item.value.splice(item.value.indexOf(tag), 1)
  }

  const getSelListData = async (type) => {
    let url = `/user/${form.value.owner}/datasets?per=50&page=1`
    if (form.value.owner !== userStore.username) {
      url = `/organization/${form.value.owner}/datasets?current_user=${userStore.username}&per=50&page=1`
    }
    const { data } = await useFetchApi(url).get().json()
    if (data.value && data.value.data) {
      dataSourceList.value = data.value.data
      if (type) {
        form.value.repo_id = ''
      }
    } else {
      dataSourceList.value = []
      form.value.repo_id = ''
    }
  }
  const fetchBranchList = async () => {
    const url = `datasets/${form.value.repo_id}/branches`
    const { data } = await useFetchApi(url).get().json()
    if (data.value && data.value.data) {
      branchList.value = data.value.data
    }
  }

  watch([() => userStore.username, () => route.query.datasetPath], () => {
    updateOwner()
  })
  const changeTaskType = async () => {
    if (taskUseType.value === 'ops') {
      const tableBody = document.querySelector('.el-table__body-wrapper tbody')
      Sortable.create(tableBody, {
        handle: '.drag-handle',
        animation: 300,
        onEnd({ newIndex, oldIndex }) {
          const [removedItem] = tableData.value.splice(oldIndex, 1)
          tableData.value.splice(newIndex, 0, removedItem)
        }
      })
    }
  }
  const addTempValToListParams = (obj) => {
    if (Array.isArray(obj.params)) {
      obj.params.forEach((param) => {
        if (param.type === 'LIST') {
          param.tempVal = null
        }
      })
    }
  }

  const getToolsData = async () => {
    const url = '/dataflow/tools'
    const { data } = await useFetchApi(url).get().json()
    if (data.value) {
      const res = data.value
      let list = Object.values(res)
      toolListAll.value = list
      if (taskUseType.value === 'tool' && selToolName.value != '') {
        seltool.value =
          toolListAll.value.find((item) => item.name == selToolName.value) ||
          toolListAll.value[0]
        form.value.selToolIndex =
          toolListAll.value.findIndex(
            (item) => item.name === selToolName.value
          ) || 0
      } else {
        seltool.value = toolListAll.value[0]
      }
      addTempValToListParams(seltool.value)
    }
  }

  const getTemplateData = async () => {
    const url = '/dataflow/templates'
    const { data } = await useFetchApi(url).get().json()
    if (data.value) {
      templateList.value = data.value
      changeTemplate()
    }
  }
  const changeTemplate = () => {
    tableData.value = []
    let ops = dataflowOps[locale.value]
    tableData.value = templateList.value[form.value.selTemplate].process
    tableData.value = tableData.value.map((item) => {
      if (ops.hasOwnProperty(item.name)) {
        const op = ops[item.name]
        if (Array.isArray(op.params) && op.params.length > 0) {
          const updatedParams = op.params.map((paramsItem, paramsIndex) => {
            return {
              ...paramsItem,
              value: item.params[paramsIndex]?.value ?? paramsItem.value,
              key: item.params[paramsIndex]?.name ?? paramsItem.name
            }
          })

          return {
            ...item,
            ...op,
            params: updatedParams,
            key: item.name,
            isOpen: true
          }
        }
      }
      return {
        ...item,
        ...(ops.hasOwnProperty(item.name) ? ops[item.name] : item),
        key: item.name,
        isOpen: true
      }
    })
  }
  const changeTool = () => {
    seltool.value = toolListAll.value[form.value.selToolIndex]
    addTempValToListParams(seltool.value)
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

  const subJob = async () => {
    ruleFormRef.value.validate(async (valid, fields) => {
      if (valid && !subLoading.value) {
        subLoading.value = true
        let params = {}
        if (taskUseType.value == 'ops') {
          params = {
            ...params,
            ...templateList.value[form.value.selTemplate],
            ...form.value,
            process: overrideNameByKey([
              ...tableData.value.filter((item) => item.isOpen == true)
            ])
          }
        } else if (taskUseType.value == 'tool') {
          params = {
            ...params,
            ...seltool.value,
            ...form.value
          }
        }
        if (
          taskUseType.value != 'ops' ||
          (taskUseType.value == 'ops' && params.process.length)
        ) {
          const options = {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
          }
          const url = '/dataflow/jobs'
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
            window.location.href = '/datapipelines'
          }
          subLoading.value = false
        } else {
          ElMessage({
            message: `${t('dataPipelines.toSel')}${t(
              'dataPipelines.predefinedOperator'
            )}`,
            type: 'error'
          })
          subLoading.value = false
        }
      }
    })
  }

  onMounted(() => {
    updateOwner()
    getTemplateData()
    getToolsData()
    if (route.query.datasetPath) {
      if (!form.value.repo_id) {
        form.value.repo_id = route.query.datasetPath
      }
      fetchBranchList()
    }
    changeTaskType()
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
      color: #344054;
      font-weight: 400;
      z-index: 0;
    }
  }
  :deep(.tableHeader) {
    font-size: 14px !important;
    font-weight: normal !important;
    color: #475467;
    padding: 12px 24px !important;
    border-bottom: 1px solid var(--colors-gray-light-mode-200, #eaecf0);
    background: var(--Gray-50, #f9fafb) !important;
  }

  .drag-handle {
    cursor: move;
    display: inline-block;
    width: 20px;
    text-align: center;
    color: #888;
    margin-right: 10px;
  }
  .typeItemCont > * {
    margin-bottom: 12px;
  }

  .typeItemCont > *:last-child {
    margin-bottom: 0;
  }
</style>
