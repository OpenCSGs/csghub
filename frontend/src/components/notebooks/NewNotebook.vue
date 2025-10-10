<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon name="notebook_new" />
    </div>
    <h3 class="text-gray-700 text-xl font-medium mt-6 mb-2">
      {{ t('notebooks.new.title') }}
    </h3>
    <p class="text-gray-500 text-base font-normal md:text-center">
      {{ t('notebooks.new.desc') }}
    </p>
    <div class="mt-9">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        label-position="top"
        class="text-left w-full"
      >
        <!-- 名称行 -->
        <div class="w-full flex md:flex-col gap-[16px] items-center">
          <el-form-item
            class="w-full"
            :label="t('notebooks.new.name')"
            prop="title"
          >
            <el-input
              v-model="dataForm.title"
              :placeholder="t('all.pleaseInput', { value: t('notebooks.new.name') })"
              input-style="width: 100%"
            >
              <template #suffix>
                <el-tooltip
                  class="item"
                  effect="dark"
                  raw-content
                  :content="`
                  <p>${t('notebooks.new.tip')}</p>
                  <ul style='margin-left: 18px; list-style: disc; margin-top: 12px;'>
                    <li>${t('rule.lengthLimit', { min: 2, max: 70 })}</li>
                    <li>${t('rule.startWithLetter')}</li>
                    <li>${t('rule.endWithLetterOrNumber')}</li>
                    <li>${t('rule.onlyLetterNumberAndSpecialStr')}</li>
                    <li>${t('rule.specialStrNotTogether')}</li>
                  </ul>
                  `"
                  placement="top"
                >
                  <el-icon class="cursor-pointer hover:text-[var(--Brand-300)]"><Warning /></el-icon>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <!-- 集群 -->
        <el-form-item
          :label="t('notebooks.new.cluster')"
          class="w-full"
          prop="notebook_cluster"
        >
          <el-select
            v-model="dataForm.notebook_cluster"
            :placeholder="t('all.pleaseSelect', { value: t('notebooks.new.cluster') })"
            size="large"
            style="width: 100%"
            @change="fetchResources"
          >
            <el-option
              v-for="item in clusters"
              :key="item.cluster_id"
              :label="item.region"
              :value="item.cluster_id"
            />
          </el-select>
        </el-form-item>

        <!-- 资源 -->
        <el-form-item
          class="w-full"
          :label="t('notebooks.new.resource')"
          prop="resource"
        >
          <el-select
            v-model="dataForm.resource"
            :placeholder="t('all.pleaseSelect', { value: t('notebooks.new.resource') })"
            size="large"
            style="width: 100%"
          >
            <el-option-group
              v-for="group in resourcesOptions"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.name"
                :label="item.label"
                :value="`${item.id}/${item.order_detail_id}`"
                :disabled="!item.is_available"
              />
            </el-option-group>
          </el-select>
          <p class="text-gray-600 mt-[8px] font-light">
            {{ t('notebooks.new.resourceTip1') }}
          </p>
          <p class="text-gray-600 font-light">
            {{ t('notebooks.new.resourceTip2') }}
          </p>
        </el-form-item>

        <!-- 弹性副本 -->
        <div class="w-full flex md:flex-col gap-[16px] items-start">
          <el-form-item
            :label="t('notebooks.new.minReplicas')"
            class="w-full"
            prop="minReplicas"
          >
            <el-select
              v-model="dataForm.minReplicas"
              :placeholder="t('all.pleaseSelect', { value: t('notebooks.new.minReplicas') })"
              size="large"
              style="width: 100%"
            >
              <el-option
                v-for="item in minReplicaRanges"
                :disabled="item > dataForm.maxReplicas"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <p
              v-if="dataForm.minReplicas === 0"
              class="text-gray-600 font-light mt-2"
            >
              {{ t('notebooks.new.autoSleepTip') }}
            </p>
          </el-form-item>

          <el-form-item
            :label="t('notebooks.new.maxReplicas')"
            class="w-full"
            prop="maxReplicas"
          >
            <el-select
              v-model="dataForm.maxReplicas"
              :placeholder="t('all.pleaseSelect', { value: t('notebooks.new.maxReplicas') })"
              size="large"
              style="width: 100%"
              :disabled="true"
            >
              <el-option
                v-for="item in replicaRanges"
                :disabled="item < dataForm.minReplicas"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <p class="text-gray-600 font-light mt-2">
              {{ t('notebooks.new.maxReplicaFixedTip') }}
            </p>
          </el-form-item>
        </div>

        <!-- 预装镜像 -->
        <el-form-item
          :label="t('notebooks.new.runtimeFramework')"
          class="w-full"
          prop="runtime_framework_id"
        >
          <el-select
            v-model="dataForm.runtime_framework_id"
            :placeholder="t('all.pleaseSelect', { value: t('notebooks.new.runtimeFramework') })"
            size="large"
            style="width: 100%"
          >
            <el-option
              v-for="item in filteredRuntimeFrameworks"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
          <!-- <p 
            v-if="dataForm.resource && filteredRuntimeFrameworks.length === 0" 
            class="text-red-500 mt-2 font-light"
          >
            当前资源类型暂无可用的预装镜像
          </p> -->
        </el-form-item>

        <!-- 按钮 -->
        <div class="flex justify-end gap-4 mt-6">
          <el-form-item>
            <CsgButton
              class="btn btn-secondary-gray btn-md"
              :name="t('notebooks.new.cancel')"
              @click="handleCancel"
            />
          </el-form-item>
          <el-form-item>
            <CsgButton
              :loading="loading"
              class="btn btn-primary btn-md"
              :name="t('notebooks.new.create')"
              @click="createNotebook"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import useFetchApi from '../../packs/useFetchApi'
import { fetchResourcesInCategory } from '../shared/deploy_instance/fetchResourceInCategory.js'
import useUserStore from '../../stores/UserStore.js'
import { Warning } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const dataFormRef = ref()
const nameRule = inject('nameRule')
const loading = ref(false)

// 集群和资源数据
const clusters = ref([])
const resourcesOptions = ref([])
// 运行时框架版本选项
const runtimeFrameworkOptions = ref([])

const minReplicaRanges = [0, 1]
const replicaRanges = [1]

const dataForm = ref({
  title: '',
  notebook_cluster: '',
  resource: '',
  minReplicas: 1,
  maxReplicas: 1,
  runtime_framework_id: ''
})

const rules = ref({
  title: [
    { required: true, message: t('all.pleaseInput', { value: t('notebooks.new.name') }), trigger: 'blur' },
    { min: 2, max: 70, message: t('rule.lengthLimit', { min: 2, max: 70 }), trigger: 'blur' },
    // 以字母开头
    { pattern: /^[a-zA-Z]/, message: t('rule.startWithLetter'), trigger: 'blur' },
    // 以数字或字母结尾
    { pattern: /[a-zA-Z0-9]$/, message: t('rule.endWithLetterOrNumber'), trigger: 'blur' },
    // 只能包含字母、数字与-_.
    {
      pattern: /^[a-zA-Z0-9-_\.]+$/,
      message: t('rule.onlyLetterNumberAndSpecialStr'),
      trigger: 'blur'
    },
    // 特殊字符不能并列出现
    { pattern: /^(?!.*[-_.]{2,}).*$/, message: t('rule.specialStrNotTogether'), trigger: 'blur' },
    // 最终的正则规则
    { pattern: nameRule, message: t('rule.nameRule'), trigger: 'blur' }
  ],
  notebook_cluster: [
    {
      required: true,
      message: t('all.pleaseSelect', { value: t('notebooks.new.cluster') }),
      trigger: 'change'
    }
  ],
  resource: [
    { required: true, message: t('all.pleaseSelect', { value: t('notebooks.new.resource') }), trigger: 'change' }
  ],
  minReplicas: [
    { required: true, message: t('all.pleaseSelect', { value: t('notebooks.new.minReplicas') }), trigger: 'change' }
  ],
  maxReplicas: [
    { required: true, message: t('all.pleaseSelect', { value: t('notebooks.new.maxReplicas') }), trigger: 'change' }
  ],
  runtime_framework_id: [
    { required: true, message: t('all.pleaseSelect', { value: t('notebooks.new.runtimeFramework') }), trigger: 'change' }
  ]
})

// 获取集群列表
const fetchClusters = async () => {
  const { data, error } = await useFetchApi('/cluster').json()
  if (error.value) {
    ElMessage({ message: error.value.msg, type: 'warning' })
  } else {
    const body = data.value
    dataForm.value.notebook_cluster = body.data[0]?.cluster_id || ''
    clusters.value = body.data
    fetchResources()
  }
}

// 获取资源列表
const fetchResources = async () => {
  if (!dataForm.value.notebook_cluster) return

  const categoryResources = await fetchResourcesInCategory(dataForm.value.notebook_cluster, 5)
  const firstAvailableResource = categoryResources.flatMap(item => item.options).find((item) => item.is_available)
  resourcesOptions.value = categoryResources
  if (firstAvailableResource) {
    dataForm.value.resource = `${firstAvailableResource.id}/${firstAvailableResource.order_detail_id}`
  } else {
    dataForm.value.resource = ''
  }
  fetchRuntimeFrameworks()
}

// 获取运行时框架版本(deploy_type=5)
const fetchRuntimeFrameworks = async () => {
  try {
    const { data, error } = await useFetchApi(`/runtime_framework?deploy_type=5`).json()
    if (error?.value) {
      runtimeFrameworkOptions.value = []
      dataForm.value.runtime_framework_id = ''
      return
    }
    const body = data?.value || {}
    const frameworks = body.data || []
    
    runtimeFrameworkOptions.value = frameworks.map(framework => ({
      id: framework.id,
      label: `${framework.frame_version}`,
      frameVersion: framework.frame_version,
      frameName: framework.frame_name,
      computeType: framework.compute_type || ''
    }))
    
    // 获取数据后,自动选择匹配当前资源类型的第一个框架
    if (dataForm.value.resource && runtimeFrameworkOptions.value.length > 0) {
      const currentResource = resourcesOptions.value
        .flatMap(category => category.options)
        .find(item => `${item.id}/${item.order_detail_id}` === dataForm.value.resource)
      
      if (currentResource && currentResource.type) {
        const filtered = runtimeFrameworkOptions.value.filter(
          framework => framework.computeType === currentResource.type
        )
        if (filtered.length > 0) {
          dataForm.value.runtime_framework_id = filtered[0].id
        } else {
          dataForm.value.runtime_framework_id = ''
        }
      }
    }
  } catch (e) {
    console.error(t('notebooks.error.getRuntimeFrameworkFailed'), e)
    runtimeFrameworkOptions.value = []
    dataForm.value.runtime_framework_id = ''
  }
}

// 根据选中资源的类型过滤运行时框架
const filteredRuntimeFrameworks = computed(() => {
  if (!dataForm.value.resource) return []
  if (!resourcesOptions.value.length) return []
  if (!runtimeFrameworkOptions.value.length) return []
  
  // 从资源选项中找到当前选中的资源
  const currentResource = resourcesOptions.value
    .flatMap(category => category.options)
    .find(item => `${item.id}/${item.order_detail_id}` === dataForm.value.resource)
  
  if (!currentResource || !currentResource.type) return []
  
  // 根据资源的type属性过滤框架
  const filtered = runtimeFrameworkOptions.value.filter(
    framework => framework.computeType === currentResource.type
  )
  
  return filtered
})

// 监听资源变化,自动选择对应类型的第一个框架
watch(
  () => dataForm.value.resource,
  () => {
    const filtered = filteredRuntimeFrameworks.value
    if (filtered && filtered.length > 0) {
      // 有匹配的预装镜像,选择第一个
      dataForm.value.runtime_framework_id = filtered[0].id
    } else {
      // 没有匹配的预装镜像,清空选择
      dataForm.value.runtime_framework_id = ''
    }
  }
)

const createNotebook = () => {
  if (!dataForm.value) return
  dataFormRef.value.validate((valid) => {
    if (valid) {
      submitNotebookForm()
    }
  })
}

async function submitNotebookForm() {
  loading.value = true

  try {
    const resourceId = Number(dataForm.value.resource?.split('/')[0] || 0)
    const orderDetailId = Number(dataForm.value.resource?.split('/')[1] || 0)

    const params = {
      currentUser: userStore.username,
      deploy_name: dataForm.value.title,
      min_replica: parseInt(dataForm.value.minReplicas),
      order_detail_id: orderDetailId,
      resource_id: resourceId,
      runtime_framework_id: dataForm.value.runtime_framework_id
    }

    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }
    const { data, error } = await useFetchApi('/notebooks', options).post().json()

    if (error.value) {
      ElMessage.warning(error.value.msg)
    } else {
      ElMessage.success(t('notebooks.new.createSuccess'))
      const createdId = data?.value?.data?.id
      if (createdId) {
        window.location.href = `/notebooks/${createdId}`
      } else {
        // 若无返回 id，则回到列表页
        // window.location.pathname = '/notebooks'
      }
    }
  } catch (err) {
    console.error(t('notebooks.error.createNotebookFailed'), err)
    ElMessage.error(t('notebooks.error.createFailedRetry'))
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  window.history.back()
}

onMounted(() => {
  fetchClusters()
})
</script>

<style scoped>
:deep(.el-input) {
  height: 40px;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
}

:deep(.el-radio__input) {
  margin-top: 8px;
}

:deep(.el-radio__label) {
  color: #344054 !important;
  font-weight: 400;
}

:deep(.el-radio.is-bordered.is-checked) {
  border: 2px solid #3250bd;
}

:deep(.el-radio__input.is-checked .el-radio__inner) {
  background: #3250bd;
  border-color: #3250bd;
}

:deep(.el-select) {
  width: 240px;
  height: 40px;

  @media screen and (max-width: 768px) {
    width: 100%;
  }
}

:deep(.el-input .el-input__wrapper) {
  border-radius: var(--border-radius-md);
}

:deep(.cloud-resource-item .el-form-item__error) {
  margin-top: 0;
}
</style>
