<template>
  <div class="flex justify-between items-center">
    <div
      class="text-sm text-gray-700"
      :class="hideTitle ? 'opacity-0' : ''"
    >
      {{ $t('application_spaces.env.title') }}
    </div>
    <div class="flex gap-4">
      <div
        class="flex gap-1 btn btn-link-color btn-sm"
        @click="openAdd('env')"
      >
        <SvgIcon name="space-env-plus" />{{
          $t('application_spaces.env.addEnv')
        }}
      </div>
      <div
        class="flex gap-1 btn btn-link-color btn-sm"
        @click="openAdd('secret')"
      >
        <SvgIcon name="space-env-plus" />{{
          $t('application_spaces.env.addSecret')
        }}
      </div>
    </div>
  </div>

  <div v-if="envList.length">
    <div
      v-for="(item, idx) in envList"
      :key="item.key"
      class="flex justify-between items-center px-6 py-2 mb-2 border border-gray-200 bg-gray-50 rounded-xl"
    >
      <div class="flex font-medium text-gray-700 text-sm truncate">
        <SvgIcon
          name="space-env-icon"
          class="mr-3"
        />{{ item.key }}
      </div>
      <div class="flex space-x-2">
        <CsgButton
          :name="$t('application_spaces.env.edit')"
          class="btn btn-secondary-gray btn-sm"
          @click="openEdit('env', idx)"
        />
        <CsgButton
          :name="$t('application_spaces.env.delete')"
          class="btn btn-secondary-gray btn-sm"
          @click="remove('env', idx)"
        />
      </div>
    </div>
  </div>
  <div v-if="secretList.length">
    <div
      v-for="(item, idx) in secretList"
      :key="item.key"
      class="flex justify-between items-center px-6 py-2 mb-2 border border-gray-200 bg-gray-50 rounded-xl"
    >
      <div class="flex font-medium text-gray-700 text-sm truncate">
        <SvgIcon
          name="space-secret-icon"
          class="mr-3"
        />{{ item.key }}
      </div>
      <div class="flex space-x-2">
        <CsgButton
          :name="$t('application_spaces.env.replace')"
          class="btn btn-secondary-gray btn-sm"
          @click="openEdit('secret', idx)"
        />
        <CsgButton
          :name="$t('application_spaces.env.delete')"
          class="btn btn-secondary-gray btn-sm"
          @click="remove('secret', idx)"
        />
      </div>
    </div>
  </div>
  <div
    v-if="!envList.length && !secretList.length"
    class="py-4 border border-gray-200 border-dashed flex justify-center text-gray-600 text-sm font-light text-center rounded-lg"
  >
    <SvgIcon
      name="space-env-icon"
      class="mr-1"
    />
    {{ $t('application_spaces.env.empty') }}
  </div>

  <el-dialog
    v-model="dialogVisible"
    :width="dialogWidth"
    :close-on-click-modal="false"
  >
    <template #header="{ close }">
      <div class="flex justify-between">
        <img
          src="/images/collection_half_cirle.png"
          class="w-[50%] absolute top-0 left-0"
        />
      </div>
    </template>
    <div class="w-full relative">
      <div class="text-lg font-medium text-gray-900">{{ dialogTitle }}</div>
      <div class="text-sm font-light text-gray-600 mb-5">
        {{ dialogDesc }}
      </div>
      <el-form>
        <el-form-item
          :error="nameError"
          class="mb-9"
        >
          <div class="mb-1 text-sm text-gray-700">
            {{ $t('application_spaces.env.name') }}
          </div>
          <el-input
            v-model="form.key"
            @input="validateName"
            :placeholder="$t('application_spaces.env.name')"
          />
        </el-form-item>

        <el-form-item :error="valueError">
          <div class="mb-1 text-sm text-gray-700">
            {{ $t('application_spaces.env.value') }}
          </div>
          <el-input
            v-model="form.value"
            type="textarea"
            rows="3"
            @input="validateValue"
            :placeholder="$t('application_spaces.env.value')"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="flex w-full justify-between gap-3 px-5">
        <div class="w-1/2">
          <CsgButton
            :name="$t('application_spaces.env.cancel')"
            class="btn btn-secondary-gray btn-lg w-full"
            @click="dialogVisible = false"
          />
        </div>
        <div class="w-1/2">
          <CsgButton
            :name="$t('application_spaces.env.save')"
            class="btn btn-primary btn-lg w-full"
            @click="save"
          />
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    env: {
      type: String,
      default: ''
    },
    secrets: {
      type: String,
      default: ''
    },
    hideTitle: {
      type: Boolean,
      default: false
    }
  })
  const emit = defineEmits(['update:env', 'update:secrets'])

  const envList = ref([])
  const secretList = ref([])
  function fromString(str, target) {
    try {
      const obj = JSON.parse(str || '{}')
      target.value = Object.entries(obj).map(([k, v]) => ({
        key: k,
        value: String(v)
      }))
    } catch {
      target.value = []
    }
  }

  watch(
    () => props.env,
    (newVal) => {
      fromString(newVal, envList)
    },
    { immediate: true }
  )
  watch(
    () => props.secrets,
    (newVal) => {
      fromString(newVal, secretList)
    },
    { immediate: true }
  )

  function syncToParent() {
    const envObj = {}
    envList.value.forEach((i) => (envObj[i.key] = i.value))
    emit('update:env', JSON.stringify(envObj))
    const secretObj = {}
    secretList.value.forEach((i) => {
      secretObj[i.key] = i.value
    })
    emit('update:secrets', JSON.stringify(secretObj))
  }

  function remove(type, idx) {
    const list = type === 'env' ? envList.value : secretList.value
    list.splice(idx, 1)
    syncToParent()
  }

  const isMobile = ref(window.innerWidth < 450)
  const dialogWidth = computed(() => (isMobile.value ? '95%' : '450'))
  const dialogVisible = ref(false)
  const dialogTitle = ref(t('application_spaces.env.addEnv'))
  const dialogDesc = ref(t('application_spaces.env.placeholder2'))
  const editing = ref(false)
  const editIndex = ref(-1)
  const form = ref({ key: '', value: '' })
  const formType = ref('env')

  const nameError = ref('')
  const valueError = ref('')
  const reservedNames = [
    'PATH',
    'HOME',
    'USER',
    'USERNAME',
    'PWD',
    'TMP',
    'TEMP',
    'HOSTNAME',
    'SHELL',
    'LOGNAME',
    'DISPLAY',
    'LANG',
    'TERM',
    'EDITOR',
    'NODE_ENV',
    'JAVA_HOME',
    'PYTHONPATH',
    'GOPATH',
    'HTTP_PROXY',
    'HTTPS_PROXY',
    'NO_PROXY',
    'CI',
    'ENV',
    'SHLVL',
    'PORT',
    'BUILD_ID',
    'BRANCH',
    'CLASSPATH'
  ]

  function validateName() {
    const key = form.value.key.trim()
    nameError.value = ''
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      nameError.value = t('application_spaces.env.validatePlaceholder')
      return
    }
    if (reservedNames.includes(key.toUpperCase())) {
      nameError.value = t('application_spaces.env.validatePlaceholder2')
      return
    }
    const list = formType.value === 'env' ? envList.value : secretList.value
    const duplicated = list.some(
      (item, idx) =>
        item.key === key && idx !== (editing.value ? editIndex.value : -1)
    )
    if (duplicated)
      nameError.value = t('application_spaces.env.validatePlaceholder3')
  }

  function validateValue() {
    const val = form.value.value ?? ''
    valueError.value = /[\x00-\x1F\x7F]/.test(val)
      ? t('application_spaces.env.validatePlaceholder4')
      : ''
  }

  function openAdd(type) {
    formType.value = type
    dialogTitle.value =
      type === 'env'
        ? t('application_spaces.env.addEnv')
        : t('application_spaces.env.addSecret')
    dialogDesc.value =
      type === 'env'
        ? t('application_spaces.env.placeholder2')
        : t('application_spaces.env.placeholder3')
    editing.value = false
    form.value = { key: '', value: '' }
    nameError.value = ''
    valueError.value = ''
    dialogVisible.value = true
  }
  function openEdit(type, idx) {
    formType.value = type
    dialogTitle.value =
      type === 'env'
        ? t('application_spaces.env.editEnv')
        : t('application_spaces.env.editSecret')
    dialogDesc.value =
      type === 'env'
        ? t('application_spaces.env.placeholder2')
        : t('application_spaces.env.placeholder3')
    editing.value = true
    editIndex.value = idx
    const list = type === 'env' ? envList.value : secretList.value
    if (type === 'secret') {
      form.value = { key: list[idx].key, value: '' }
    } else {
      form.value = { ...list[idx] }
    }
    nameError.value = ''
    valueError.value = ''
    dialogVisible.value = true
  }

  function save() {
    validateName()
    validateValue()
    if (nameError.value || valueError.value) return

    const list = formType.value === 'env' ? envList.value : secretList.value

    if (editing.value) {
      list[editIndex.value] = { ...form.value }
    } else {
      list.push({ ...form.value })
    }

    dialogVisible.value = false
    syncToParent()
  }
  function onResize() {
    isMobile.value = window.innerWidth < 450
  }
  onMounted(() => window.addEventListener('resize', onResize))
  onBeforeUnmount(() => window.removeEventListener('resize', onResize))
</script>

<style scoped>
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
