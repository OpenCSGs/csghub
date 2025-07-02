<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon
        name="space_mcp"
        width="36"
        height="36"
      />
    </div>
    <h3 class="text-gray-700 text-xl font-medium mt-6 mb-3">
      {{ t('mcps.deploy.title') }}
    </h3>
    <p class="text-gray-500 text-md font-regular md:text-center">
      {{ t('application_spaces.new.subTitle1') }}
    </p>
    <p class="text-gray-500 text-md font-regular md:text-center">
      {{
        $t('mcps.deploy.subTitle2', {
          mcpPath: `${namespace}/${mcpServerName}`
        })
      }}
    </p>
    <div class="mt-9">
      <el-form
        ref="dataFormRef"
        :model="dataForm"
        :rules="rules"
        class="w-full flex flex-col gap-[14px]"
        label-position="top"
      >
        <div class="w-full flex md:flex-col gap-4 items-center">
          <div class="w-full flex md:flex-col gap-4 items-center">
            <el-form-item
              :label="t('application_spaces.new.owner')"
              prop="owner"
              class="w-full"
            >
              <el-select
                v-model="dataForm.owner"
                :placeholder="t('all.select')"
                size="large"
                style="width: 100%"
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
              class="w-full"
              :label="t('application_spaces.new.spaceEnName')"
              prop="name"
            >
              <el-input
                v-model="dataForm.name"
                :placeholder="
                  t('all.pleaseInput', {
                    value: t('application_spaces.new.spaceEnName')
                  })
                "
                input-style="width: 100%"
              >
                <template #suffix>
                  <el-tooltip
                    class="item"
                    effect="dark"
                    raw-content
                    :content="`
                  <p>${t('application_spaces.new.tip')}</p>
                  <ul style='margin-left: 18px; list-style: disc; margin-top: 12px;'>
                    <li>${t('rule.lengthLimit', { min: 2, max: 64 })}</li>
                    <li>${t('rule.startWithLetter')}</li>
                    <li>${t('rule.endWithLetterOrNumber')}</li>
                    <li>${t('rule.onlyLetterNumberAndSpecialStr')}</li>
                    <li>${t('rule.specialStrNotTogether')}</li>
                  </ul>
                  `"
                    placement="top"
                  >
                    <el-icon
                      class="cursor-pointer hover:text-[var(--Brand-300)]"
                      ><Warning
                    /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </div>
        </div>

        <div class="w-full flex md:flex-col gap-4 items-center justify-between">
          <el-form-item
            class="w-full"
            :label="t('application_spaces.new.nickname')"
            prop="nickname"
          >
            <el-input
              v-model="dataForm.nickname"
              :placeholder="
                t('all.pleaseInput', {
                  value: t('application_spaces.new.nickname')
                })
              "
            />
          </el-form-item>
          <el-form-item
            label="License"
            prop="license"
            class="w-full"
          >
            <el-select
              v-model="dataForm.license"
              :placeholder="t('all.select')"
              size="large"
              style="width: 100%"
            >
              <el-option
                v-for="item in licenses"
                :key="item[0]"
                :label="item[1]"
                :value="item[0]"
              />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item
          class="w-full"
          :label="t('application_spaces.new.description')"
          prop="desc"
        >
          <el-input
            v-model="dataForm.desc"
            :rows="6"
            type="textarea"
            :placeholder="
              t('all.pleaseInput', {
                value: t('application_spaces.new.description')
              })
            "
          />
        </el-form-item>

        <el-divider class="!my-[18px]" />
        <el-form-item
          :label="t('application_spaces.new.cluster')"
          class="w-full"
          prop="space_cluster"
        >
          <el-select
            v-model="dataForm.space_cluster"
            :placeholder="
              t('all.pleaseSelect', {
                value: t('application_spaces.new.cluster')
              })
            "
            size="large"
            style="width: 100%"
            @change="fetchSpaceResources"
          >
            <el-option
              v-for="item in spaceClusters"
              :key="item.cluster_id"
              :label="item.region"
              :value="item.cluster_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="w-full !mb-0"
          :label="$t('application_spaces.new.cloudResource')"
        >
          <el-select
            v-model="dataForm.cloud_resource"
            :placeholder="
              t('all.pleaseSelect', {
                value: t('application_spaces.new.cloudResource')
              })
            "
            size="large"
            style="width: 100%"
          >
            <el-option-group
              v-for="group in spaceResources"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.name"
                :label="item.label"
                :value="item.id"
                :disabled="!item.is_available"
              />
            </el-option-group>
          </el-select>
          <p class="text-gray-600 mt-2 font-light">
            {{ $t('application_spaces.new.cloudResourceDesc1') }}
          </p>
          <p class="text-gray-600 font-light">
            {{ $t('application_spaces.new.cloudResourceDesc2') }}
          </p>
        </el-form-item>
        <el-divider class="my-[18px]" />
        <div v-if="mcpEnv.length > 0">
          <p class="text-gray-600 mb-4 font-light">
            {{ $t('mcps.deploy.envDesc') }}
          </p>
          <el-form-item
            v-for="envKey in mcpEnv"
            :label="envKey"
            :key="envKey"
            :prop="envKey"
          >
            <el-input
              v-model="dataForm[envKey]"
              size="large"
              class="flex-1"
            ></el-input>
          </el-form-item>
          <el-divider class="my-[18px]" />
        </div>
        <el-form-item class="w-full">
          <PublicAndPrivateRadioGroup
            v-model="dataForm.visibility"
            :publicDesc="t('application_spaces.new.publicDesc')"
            :privateDesc="t('application_spaces.new.privateDesc')"
          />
        </el-form-item>
        <div class="flex justify-end">
          <el-form-item>
            <CsgButton
              :loading="loading"
              @click="handleSubmit"
              class="btn btn-primary btn-md"
              :name="t('application_spaces.new.create')"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, inject, computed } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import useFetchApi from '../../packs/useFetchApi'
  import useUserStore from '../../stores/UserStore'
  import PublicAndPrivateRadioGroup from '../shared/form/PublicAndPrivateRadioGroup.vue'

  const props = defineProps({
    licenses: Array,
    namespace: String,
    mcpServerName: String
  })

  const userStore = useUserStore()
  const dataFormRef = ref(null)
  const { t } = useI18n()
  const nameRule = inject('nameRule')
  const mcpEnv = ref([])

  const dataForm = ref({
    owner: '',
    license: props.licenses[0][0],
    visibility: 'public'
  })
  const payModeMapping = {
    free: t('all.free'),
    minute: t('all.minutePay'),
    month: t('all.yearMonthPay'),
    year: t('all.yearMonthPay')
  }
  const loading = ref(false)

  const rulesStaticObj = {
    owner: [
      {
        required: true,
        message: t('all.pleaseSelect', {
          value: t('application_spaces.new.owner')
        }),
        trigger: 'change'
      }
    ],
    name: [
      {
        required: true,
        message: t('all.pleaseInput', {
          value: t('application_spaces.new.name')
        }),
        trigger: 'blur'
      },
      {
        min: 2,
        max: 64,
        message: t('rule.lengthLimit', { min: 2, max: 64 }),
        trigger: 'blur'
      },
      {
        pattern: /^[a-zA-Z]/,
        message: t('rule.startWithLetter'),
        trigger: 'blur'
      },
      {
        pattern: /[a-zA-Z0-9]$/,
        message: t('rule.endWithLetterOrNumber'),
        trigger: 'blur'
      },
      {
        pattern: /^[a-zA-Z0-9-_\.]+$/,
        message: t('rule.onlyLetterNumberAndSpecialStr'),
        trigger: 'blur'
      },
      {
        pattern: /^(?!.*[-_.]{2,}).*$/,
        message: t('rule.specialStrNotTogether'),
        trigger: 'blur'
      },
      { pattern: nameRule, message: t('rule.nameRule'), trigger: 'blur' }
    ],
    license: [
      {
        required: true,
        message: t('all.pleaseSelect', {
          value: t('application_spaces.new.license')
        }),
        trigger: 'change'
      }
    ]
  }
  const rules = ref(rulesStaticObj)

  const namespaces = () => {
    let namespaces = userStore.orgs.map((org) => org.path)
    namespaces.unshift(userStore.username)
    const params = new URLSearchParams(window.location.search)
    const orgName = params.get('orgName')
    dataForm.value.owner = orgName || namespaces[0]
    return namespaces
  }

  const spaceResources = ref([])
  const spaceClusters = ref([])

  const fetchClusters = async () => {
    const { data, error } = await useFetchApi('/cluster').json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      dataForm.value.space_cluster = body.data[0]?.cluster_id || ''
      spaceClusters.value = body.data
      fetchSpaceResources()
    }
  }

  const fetchSpaceResources = async () => {
    const { data, error } = await useFetchApi(
      `/space_resources?cluster_id=${dataForm.value.space_cluster}`
    ).json()

    if (error.value) {
      ElMessage({
        message:
          error.value.msg || t('application_spaces.new.failedFetchResources'),
        type: 'warning'
      })
    } else {
      const body = data.value
      const allResources = body.data
      const firstAvailableResource = body.data.find((item) => item.is_available)
      dataForm.value.cloud_resource = firstAvailableResource?.id || ''
      const categories = {}
      // Category data
      allResources.forEach((item) => {
        const category = payModeMapping[item.pay_mode] || 'Others'
        if (!categories[category]) {
          categories[category] = []
        }
        if (item.pay_mode == 'minute') {
          item.label = `${item.name} ${(item.price / 100).toFixed(2)}${t(
            'all.hourUnit'
          )}`
        } else if (item.pay_mode == 'month') {
          item.label = `${item.name} ${(item.price / 100).toFixed(2)}${t(
            'all.monthUnit'
          )}`
        } else if (item.pay_mode == 'year') {
          item.label = `${item.name} ${(item.price / 100).toFixed(2)}${t(
            'all.yearUnit'
          )}`
        } else {
          item.label = item.name
        }
        categories[category].push(item)
      })
      // Generate formatted options
      const options = Object.keys(categories).map((category) => ({
        label: category,
        options: categories[category]
      }))
      spaceResources.value = options
    }
  }

  const fetchMcpServer = async () => {
    const { data, error } = await useFetchApi(
      `/mcps/${props.namespace}/${props.mcpServerName}`
    ).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const body = data.value
      const envJSON = body.data.configuration
      if (envJSON) {
        try {
          const env = JSON.parse(envJSON)
          mcpEnv.value = env.properties ? Object.keys(env.properties) : []
          mcpEnv.value.forEach((key) => {
            dataForm.value[key] = ''
            if (env.required.includes(key)) {
              rules.value[key] = [
                {
                  required: true,
                  message: t('all.pleaseInput', {
                    value: key
                  }),
                  trigger: 'blur'
                }
              ]
            }
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  const handleSubmit = () => {
    loading.value = true
    dataFormRef.value
      .validate(async (valid) => {
        if (valid) {
          await deployMcpSpace()
        } else {
          const firstErrorItem = Object.keys(rules.value).find((key) => {
            return dataFormRef.value.fields.find(
              (field) => field.prop === key && field.validateState === 'error'
            )
          })
          if (firstErrorItem) {
            const errorField = dataFormRef.value.fields.find(
              (field) => field.prop === firstErrorItem
            )
            if (errorField) {
              const el = errorField.$el
              if (el && typeof el.scrollIntoView === 'function') {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
              } else {
                console.error('Error field element is not valid:', el)
              }
            }
          }
          return false
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  const deployMcpSpace = async () => {
    const params = {
      name: dataForm.value.name,
      nickname: dataForm.value.nickname,
      namespace: dataForm.value.owner,
      license: dataForm.value.license,
      description: dataForm.value.desc,
      resource_id: dataForm.value.cloud_resource,
      cluster_id: dataForm.value.space_cluster,
      private: dataForm.value.visibility === 'private',
    }

    const env = {}
    if (mcpEnv.value.length > 0) {
      mcpEnv.value.map((key) => {
        env[key] = dataForm.value[key]
      })
      params.env = JSON.stringify(env)
    }

    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    }

    const newEndpoint = `/mcps/${props.namespace}/${props.mcpServerName}/deploys`
    const { data, error } = await useFetchApi(newEndpoint, options)
      .post()
      .json()
    if (data.value) {
      ElMessage({
        message: t('application_spaces.new.createSuccess'),
        type: 'success'
      })
      window.location.href = `/spaces/${data.value.data.path}`
    } else {
      ElMessage({
        message:
          t('application_spaces.new.createFail') + `: ${error.value.msg}`,
        type: 'error'
      })
    }
  }

  onMounted(() => {
    fetchClusters()
    fetchMcpServer()
  })
</script>

<style scoped>
  :deep(.el-input) {
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
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
</style>
