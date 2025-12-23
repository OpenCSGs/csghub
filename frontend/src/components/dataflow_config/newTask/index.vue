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
      v-if="false"
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
    <div class="mainOption flex items-center justify-between mt-[10px]">
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
            <div v-if="item.type == 'search-select'" class="w-full">
              <el-select
                v-model="item.value"
                class="w-full"
                :placeholder="item.name"
                filterable
                allow-create
                default-first-option
                @change="handleSearchSelectChange($event, item)"
              >
                <el-option
                  v-for="selItem in getSearchSelectOptions(item)"
                  :key="selItem.key"
                  :label="selItem.label"
                  :value="selItem.key"
                />
              </el-select>
              <p v-if="isSearchingModel(item)" class="text-gray-400 text-xs mt-1">
                {{ t('dataPipelines.searchingModel') }}
              </p>
              <p class="text-gray-400 text-xs mt-1">
                {{ t('dataPipelines.searchSelectHint') }}
              </p>
            </div>
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
            <div v-if="item.type == 'select-model'" class="w-full">
              <el-select
                v-model="item.value"
                class="w-full"
                :placeholder="item.name"
                filterable
              >
                <el-option
                  v-for="selItem in getSearchSelectOptions(item)"
                  :key="selItem.key"
                  :label="selItem.label"
                  :value="selItem.key"
                />
                <template #footer>
                  <div @click.stop>
                    <CsgButton
                      class="btn btn-primary btn-sm"
                      :name="t('dataPipelines.moreModels')"
                      @click.stop="openModelDialog(item)"
                    />
                  </div>
                </template>
              </el-select>
              <p v-if="isSearchingModel(item)" class="text-gray-400 text-xs mt-1">
                {{ t('dataPipelines.searchingModel') }}
              </p>
            </div>
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
                        'LIST',
                        'search-select',
                        'select-model'
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
                    <div v-if="item.type == 'search-select'" class="w-full">
                      <el-select
                        v-model="item.value"
                        class="w-full"
                        :placeholder="item.name"
                        filterable
                        allow-create
                        default-first-option
                        @change="handleSearchSelectChange($event, item)"
                      >
                        <el-option
                          v-for="selItem in getSearchSelectOptions(item)"
                          :key="selItem.key"
                          :label="selItem.label"
                          :value="selItem.key"
                        />
                      </el-select>
                      <p v-if="isSearchingModel(item)" class="text-gray-500 text-xs mt-1">
                        {{ t('dataPipelines.searchingModel') }}
                      </p>
                      <p class="text-gray-400 text-xs mt-1">
                        {{ t('dataPipelines.searchSelectHint') }}
                      </p>
                    </div>
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
                  <div v-if="item.type == 'select-model'" class="w-full">
                    <el-select
                      v-model="item.value"
                      class="w-full"
                      :placeholder="item.name"
                      filterable
                    >
                      <el-option
                        v-for="selItem in getSearchSelectOptions(item)"
                        :key="selItem.key"
                        :label="selItem.label"
                        :value="selItem.key"
                      />
                      <template #footer>
                        <div class="p-2 border-t border-gray-200" @click.stop>
                          <CsgButton
                            class="btn btn-primary btn-md w-full"
                            :name="t('dataPipelines.moreModels')"
                            @click.stop="openModelDialog(item)"
                          />
                        </div>
                      </template>
                    </el-select>
                    <p v-if="isSearchingModel(item)" class="text-gray-500 text-xs mt-1">
                      {{ t('dataPipelines.searchingModel') }}
                    </p>
                  </div>
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

    <!-- 模型选择弹框 -->
    <el-dialog
      v-model="modelDialogVisible"
      :title="t('dataPipelines.selectModel')"
      width="80%"
      align-center
    >
      <div class="flex flex-col gap-4">
        <!-- 搜索框 -->
        <el-input
          v-model="modelSearchKeyword"
          :placeholder="t('dataPipelines.searchModelName')"
          :prefix-icon="Search"
          size="large"
          @change="searchModels"
          clearable
        />
        <!-- 验证状态提示 -->
        <div v-if="modelValidating" class="flex items-center justify-center py-3 bg-blue-50 border border-blue-200 rounded-md">
          <p class="text-blue-600 text-sm">
            {{ t('dataPipelines.searchingModel') }} {{ validatingModelName }}
          </p>
        </div>
        <!-- 模型列表 -->
        <div
          v-loading="modelListLoading"
          class="grid grid-cols-2 gap-x-[16px] gap-y-[16px] min-h-[400px]"
        >
          <div
            v-for="model in modelList"
            :key="model.id"
            @click="!modelValidating && selectModel(model)"
            :class="[
              'model-select-item',
              modelValidating ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            ]"
          >
            <ModelSelectItem
              :repo="model"
              repo-type="model"
            />
          </div>
        </div>
        <!-- 分页 -->
        <CsgPagination
          :perPage="modelPerPage"
          :currentPage="modelCurrentPage"
          @currentChange="handleModelPageChange"
          :total="modelTotal"
          style="margin: 0"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <CsgButton
            class="btn btn-secondary-gray btn-md whitespace-nowrap"
            @click="modelDialogVisible = false"
            :name="t('dataPipelines.cancel')"
          />
        </div>
      </template>
    </el-dialog>
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
  import { Search } from '@element-plus/icons-vue'
  import ModelSelectItem from './ModelSelectItem.vue'
  import CsgPagination from '../../shared/CsgPagination.vue'

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
  const taskUseType = ref(route.query.type ? route.query.type : 'tool')
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

  // 跟踪每个 search-select 的搜索状态
  const searchSelectLoadingMap = ref(new Map())

  // 模型选择弹框相关状态
  const modelDialogVisible = ref(false)
  const modelList = ref([])
  const modelListLoading = ref(false)
  const modelSearchKeyword = ref('')
  const modelCurrentPage = ref(1)
  const modelPerPage = ref(10)
  const modelTotal = ref(0)
  const currentSelectModelItem = ref(null)
  const modelValidating = ref(false)
  const validatingModelName = ref('')

  // 获取 search-select 的选项列表
  const getSearchSelectOptions = (item) => {
    const defaultOptions = Array.isArray(item.option_values) ? item.option_values : []
    // 如果当前值不在默认选项中，也添加到选项中（用于显示用户输入的值）
    if (item.value && !defaultOptions.find(opt => opt.key === item.value)) {
      return [
        ...defaultOptions,
        { key: item.value, label: item.value }
      ]
    }
    return defaultOptions
  }

  // 获取搜索状态
  const isSearchingModel = (item) => {
    const key = item.name || item.key || JSON.stringify(item)
    return searchSelectLoadingMap.value.get(key) || false
  }

  // 处理 search-select 的值变化
  const handleSearchSelectChange = async (value, item) => {
    if (!value) {
      item.value = ''
      return
    }

    const defaultOptions = Array.isArray(item.option_values) ? item.option_values : []
    const isInDefaultOptions = defaultOptions.some(opt => opt.key === value)

    // 如果值在默认选项中，直接使用
    if (isInDefaultOptions) {
      item.value = value
      return
    }

    // 如果值不在默认选项中，调用远程搜索接口验证
    // 设置搜索状态
    const key = item.name || item.key || JSON.stringify(item)
    searchSelectLoadingMap.value.set(key, true)
    
    try {
      const { data } = await useFetchApi(
        `/dataflow/model/check-model?model_name=${encodeURIComponent(value)}`
      )
        .get()
        .json()

      // 关闭搜索状态
      searchSelectLoadingMap.value.set(key, false)

      // 接口返回匹配到的模型名称，可能直接返回字符串，也可能是 { code: 200, data: "model_name" } 格式
      let matchedModelName = null
      if (typeof data.value === 'string') {
        matchedModelName = data.value
      } else if (data.value?.code === 200 && data.value?.data) {
        matchedModelName = data.value.data
      } else if (data.value?.data) {
        matchedModelName = data.value.data
      }

      if (matchedModelName && matchedModelName !== null) {
        // 验证通过，使用返回的模型全名称
        item.value = matchedModelName
        // 将新值添加到 option_values 中，以便下次可以直接选择
        if (!defaultOptions.find(opt => opt.key === matchedModelName)) {
          if (!Array.isArray(item.option_values)) {
            item.option_values = []
          }
          item.option_values.push({
            key: matchedModelName,
            label: matchedModelName
          })
        }
      } else {
        // 验证失败，提示用户并清空值
        ElMessage({
          message: t('dataPipelines.modelNotAvailable'),
          type: 'error'
        })
        item.value = ''
      }
    } catch (error) {
      // 关闭搜索状态
      searchSelectLoadingMap.value.set(key, false)
      console.error('Failed to check model:', error)
      ElMessage({
        message: t('dataPipelines.modelNotAvailable'),
        type: 'error'
      })
      item.value = ''
    }
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

  // 打开模型选择弹框
  const openModelDialog = (item) => {
    currentSelectModelItem.value = item
    modelDialogVisible.value = true
    modelSearchKeyword.value = ''
    modelCurrentPage.value = 1
    modelValidating.value = false
    validatingModelName.value = ''
    fetchModelList()
  }

  // 获取模型列表
  const fetchModelList = async () => {
    modelListLoading.value = true
    try {
      const searchParam = modelSearchKeyword.value ? `&search=${encodeURIComponent(modelSearchKeyword.value)}` : ''
      const url = `/dataflow/model/list-models?page=${modelCurrentPage.value}&per_page=${modelPerPage.value}${searchParam}`
      const { data, error } = await useFetchApi(url).get().json()
      
      if (error.value) {
        ElMessage({
          message: error.value.msg || t('dataPipelines.fetchModelListError'),
          type: 'error'
        })
        modelList.value = []
        modelTotal.value = 0
      } else {
        if (data.value && data.value.data && Array.isArray(data.value.data.models)) {
          data.value.data.models.forEach((item) => {
            if (item && typeof item === 'object') {
              const path = item.path || ''
              item.hf_path = path
              item.ms_path = path
              item.csg_path = path
              item.name = path
              item.nickname = path
            }
          })
          modelList.value = data.value.data.models
          modelTotal.value = data.value.data.total || 0
        } else {
          modelList.value = []
          modelTotal.value = 0
        }
      }
    } catch (error) {
      console.error('Failed to fetch model list:', error)
      ElMessage({
        message: t('dataPipelines.fetchModelListError'),
        type: 'error'
      })
      modelList.value = []
      modelTotal.value = 0
    } finally {
      modelListLoading.value = false
    }
  }

  // 搜索模型
  const searchModels = () => {
    modelCurrentPage.value = 1
    fetchModelList()
  }

  // 分页变化
  const handleModelPageChange = (page) => {
    modelCurrentPage.value = page
    fetchModelList()
  }

  // 选择模型
  const selectModel = async (model) => {
    // 正在验证中
    if (modelValidating.value) {
      return
    }
    
    if (!currentSelectModelItem.value) {
      return
    }

    const modelPath = model.path || model.name
    const modelLabel = model.nickname || model.name || modelPath

    // 设置验证状态（用于下拉框下方显示）
    const key = currentSelectModelItem.value.name || currentSelectModelItem.value.key || JSON.stringify(currentSelectModelItem.value)
    searchSelectLoadingMap.value.set(key, true)
    
    // 设置弹框中的验证状态
    modelValidating.value = true
    validatingModelName.value = modelPath

    try {
      // 先调用验证接口检查模型是否可用
      const { data } = await useFetchApi(
        `/dataflow/model/check-model?model_name=${encodeURIComponent(modelPath)}`
      )
        .get()
        .json()

      // 关闭验证状态
      searchSelectLoadingMap.value.set(key, false)
      modelValidating.value = false
      validatingModelName.value = ''

      // 接口返回匹配到的模型名称，可能直接返回字符串，也可能是 { code: 200, data: "model_name" } 格式
      let matchedModelName = null
      if (typeof data.value === 'string') {
        matchedModelName = data.value
      } else if (data.value?.code === 200 && data.value?.data) {
        matchedModelName = data.value.data
      } else if (data.value?.data) {
        matchedModelName = data.value.data
      }

      if (matchedModelName && matchedModelName !== null) {
        // 验证通过，使用返回的模型全名称
        currentSelectModelItem.value.value = matchedModelName

        // 将模型添加到 option_values 中（如果不存在）
        if (!Array.isArray(currentSelectModelItem.value.option_values)) {
          currentSelectModelItem.value.option_values = []
        }

        // 检查是否已存在，避免重复添加
        const exists = currentSelectModelItem.value.option_values.find(
          opt => opt.key === matchedModelName
        )

        if (!exists) {
          currentSelectModelItem.value.option_values.push({
            key: matchedModelName,
            label: modelLabel
          })
        }

        modelDialogVisible.value = false
      } else {
        // 验证失败，提示用户
        ElMessage({
          message: t('dataPipelines.modelNotAvailable'),
          type: 'error'
        })
      }
    } catch (error) {
      // 关闭验证状态
      searchSelectLoadingMap.value.set(key, false)
      modelValidating.value = false
      validatingModelName.value = ''
      console.error('Failed to check model:', error)
      ElMessage({
        message: t('dataPipelines.modelNotAvailable'),
        type: 'error'
      })
    }
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

  .model-select-item :deep(a) {
    pointer-events: none;
  }
</style>
