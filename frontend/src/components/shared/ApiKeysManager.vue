<template>
  <div class="px-6 md:px-0 py-4 pt-[24px] w-full">
    <div
      class="flex justify-between gap-4 items-end mb-6 mt-2 md:flex-col md:items-stretch"
    >
      <div>
        <h2 class="text-2xl font-semibold text-gray-900 leading-8">
          {{ title }}
        </h2>
        <p class="text-sm font-light text-gray-600 leading-5 mt-1">
          {{ subtitle }}
        </p>
      </div>
      <div v-if="canManage" class="shrink-0 md:w-full">
        <button
          type="button"
          class="btn btn-primary btn-md md:w-full"
          @click="openCreateDialog"
        >
          {{ $t('apiKeys.create') }}
        </button>
      </div>
    </div>

    <div class="w-full overflow-x-auto mb-8">
      <div class="min-w-[280px] overflow-hidden rounded-lg border border-gray-200">
        <el-table
          v-loading="loading"
          class="api-keys-table w-full min-w-[280px]"
          header-row-class-name="api-keys-header-row"
          header-cell-class-name="api-keys-header-cell"
          row-class-name="api-keys-row"
          cell-class-name="api-keys-cell"
          :data="apiKeys"
          :empty-text="$t('all.noData')"
          style="width: 100%"
        >
          <el-table-column
            :label="$t('apiKeys.colName')"
            prop="token_name"
            width="120"
            show-overflow-tooltip
            label-class-name="pl-3 text-xs font-[400] leading-[18px] text-gray-600"
          >
            <template #default="scope">
              <div
                class="min-w-0 flex-1 truncate pl-3 text-sm font-[400] leading-[20px] text-gray-600"
              >
                {{ scope.row.token_name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('apiKeys.colKey')"
            prop="token"
            width="230"
            show-overflow-tooltip
            label-class-name="text-xs font-[400] leading-[18px] text-gray-600"
          >
            <template #default="scope">
              <div
                class="min-w-0 flex-1 truncate text-sm font-[400] leading-[20px] text-gray-600 font-mono"
              >
                {{ maskToken(scope.row.token) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('apiKeys.colCreated')"
            width="168"
            show-overflow-tooltip
            label-class-name="text-xs font-[400] leading-[18px] text-gray-600"
          >
            <template #default="scope">
              <div
                class="min-w-0 flex-1 truncate text-sm font-[400] leading-[20px] text-gray-600"
              >
                {{ formatDateTime(scope.row.created_at) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('apiKeys.colLastUsed')"
            width="168"
            show-overflow-tooltip
            label-class-name="text-xs font-[400] leading-[18px] text-gray-600"
          >
            <template #default="scope">
              <div
                class="min-w-0 flex-1 truncate text-sm font-[400] leading-[20px] text-gray-600"
              >
                {{
                  scope.row.last_used_at
                    ? formatDateTime(scope.row.last_used_at)
                    : '—'
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="canManage"
            :label="$t('apiKeys.colActions')"
            width="160"
            align="right"
            label-class-name="text-xs font-[400] leading-[18px] text-gray-600"
            class-name="api-keys-col-actions"
          >
            <template #default="scope">
              <div class="flex gap-5 justify-end pr-4 text-sm">
                <button
                  type="button"
                  class="text-gray-600 hover:opacity-80 bg-transparent border-0 cursor-pointer p-0 font-normal"
                  @click="openDeleteDialog(scope.row)"
                >
                  {{ $t('apiKeys.delete') }}
                </button>
                <button
                  type="button"
                  class="text-brand-700 font-semibold hover:opacity-80 bg-transparent border-0 cursor-pointer p-0"
                  @click="openEditDialog(scope.row)"
                >
                  {{ $t('apiKeys.edit') }}
                </button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      v-model="formDialogVisible"
      width="450"
      :style="{ borderRadius: '10px' }"
      class="api-key-form-dialog api-keys-dialog-responsive"
      :destroy-on-close="true"
      @closed="resetFormState"
    >
      <template #header>
        <div class="text-lg leading-[28px] text-gray-900 pr-8">
          {{ isEdit ? $t('apiKeys.editTitle') : $t('apiKeys.createTitle') }}
        </div>
      </template>
      <div class="flex flex-col gap-5">
        <div>
          <p class="text-gray-700 text-sm mb-[6px]">{{ $t('apiKeys.fieldName') }}</p>
          <el-input
            v-model="form.name"
            size="large"
            maxlength="128"
            :placeholder="$t('apiKeys.namePlaceholder')"
          />
        </div>
        <div>
          <p class="text-gray-700 text-sm mb-[6px]">{{ $t('apiKeys.fieldExpire') }}</p>
          <el-select
            v-model="expirationPreset"
            size="large"
            class="w-full"
          >
            <el-option
              v-for="opt in expirationOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <div
            v-if="expirationPreset === 'custom'"
            class="api-key-datetime-row w-full mt-2"
          >
            <el-date-picker
              v-model="expireAt"
              type="datetime"
              size="large"
              class="w-full"
              teleported
              popper-class="api-key-datetime-popper"
              :popper-options="datePickerPopperOptions"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer flex justify-between gap-3 w-full">
          <button
            type="button"
            class="btn btn-secondary-gray btn-md flex-1"
            @click="formDialogVisible = false"
          >{{ $t('all.cancel') }}</button>
          <button
            type="button"
            class="btn btn-primary btn-md flex-1"
            :disabled="formSubmitting"
            @click="submitForm"
          >
            {{ $t('all.confirm') }}
          </button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="successDialogVisible"
      width="480"
      :style="{ borderRadius: '10px' }"
      class="api-keys-dialog-responsive"
      :close-on-click-modal="false"
      @closed="createdPlainToken = ''"
    >
      <template #header>
        <div class="text-lg leading-[28px] text-gray-900 pr-8">
          {{ $t('apiKeys.successTitle') }}
        </div>
      </template>
      <div class="flex flex-col gap-3">
        <p class="text-sm text-gray-600 leading-[20px]">
          {{ $t('apiKeys.successHint') }}
        </p>
        <el-input
          :model-value="createdPlainToken"
          readonly
          class="font-mono text-sm"
        />
        <p class="text-sm text-amber-600 leading-[20px]">
          {{ $t('apiKeys.successWarn') }}
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer flex justify-between gap-3 w-full">
          <button
            type="button"
            class="btn btn-secondary-gray btn-md flex-1"
            @click="successDialogVisible = false"
          >{{ $t('apiKeys.close') }}</button>
          <button
            type="button"
            class="btn btn-primary btn-md flex-1"
            @click="copyCreatedToken"
          >{{ $t('apiKeys.copy') }}</button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="deleteDialogVisible"
      width="420"
      :style="{ borderRadius: '10px' }"
      class="api-key-delete-dialog api-keys-dialog-responsive"
      :show-close="true"
    >
      <template #header>
        <div class="flex justify-between relative">
          <div
            class="flex shrink-0 items-center justify-center px-[20px] py-[20px] leading-none"
          >
            <SvgIcon name="delete_prompt" />
          </div>
          <img src="/images/invite_bg.png" class="w-[200px] absolute top-1 left-1 pointer-events-none" alt="" />
        </div>
      </template>
      <div class="flex justify-center flex-col m-auto w-full relative">
        <div class="text-lg leading-[28px] text-gray-900">
          {{ $t('apiKeys.deleteTitle') }}
        </div>
        <p class="text-sm leading-[20px] text-gray-600 font-light">
          {{ $t('apiKeys.deleteMessageLead', { name: deleteTarget?.token_name || '' }) }}
        </p>
        <p class="text-sm leading-[20px] text-gray-600 font-light mb-5">
          {{ $t('apiKeys.deleteMessageTrail') }}
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer flex justify-between gap-3 w-full">
          <button
            type="button"
            class="btn btn-secondary-gray btn-md flex-1"
            @click="deleteDialogVisible = false"
          >{{ $t('all.cancel') }}</button>
          <button
            type="button"
            class="btn btn-danger btn-md flex-1"
            :disabled="deleteSubmitting"
            @click="confirmDelete"
          >{{ $t('apiKeys.deleteConfirm') }}</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { ElMessage } from 'element-plus'
  import dayjs from 'dayjs'
  import useFetchApi from '../../packs/useFetchApi'
  import { copyToClipboard } from '../../packs/clipboard'

  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    canManage: {
      type: Boolean,
      default: false
    },
    apiPaths: {
      type: Object,
      required: true
    },
    missingPathMessage: {
      type: String,
      default: ''
    }
  })

  const { t } = useI18n()

  const API_KEY_ALIAS_MAX_LEN = 128

  const validateApiKeyName = (raw) => {
    const name = (raw || '').trim()
    if (!name) {
      return t('apiKeys.nameRequired')
    }
    if (name.length > API_KEY_ALIAS_MAX_LEN) {
      return t('apiKeys.nameTooLong', { max: API_KEY_ALIAS_MAX_LEN })
    }
    if (/[\r\n\u0000]/.test(name)) {
      return t('apiKeys.nameInvalidChars')
    }
    return null
  }

  const apiKeys = ref([])
  const loading = ref(false)
  const formDialogVisible = ref(false)
  const successDialogVisible = ref(false)
  const deleteDialogVisible = ref(false)
  const isEdit = ref(false)
  const editingId = ref(null)
  const formSubmitting = ref(false)
  const deleteSubmitting = ref(false)
  const deleteTarget = ref(null)
  const createdPlainToken = ref('')
  const originalExpireAt = ref(null)

  const form = ref({
    name: ''
  })
  const expirationPreset = ref('never')
  const expireAt = ref(null)

  const expirationOptions = computed(() => (
    isEdit.value
      ? [
        { value: 'current', label: t('apiKeys.editExpireCurrent') },
        { value: 'never', label: t('apiKeys.expireNever') },
        { value: '30d', label: t('apiKeys.expire30d') },
        { value: '90d', label: t('apiKeys.expire90d') },
        { value: 'custom', label: t('apiKeys.expireCustom') }
      ]
      : [
        { value: 'never', label: t('apiKeys.expireNever') },
        { value: '30d', label: t('apiKeys.expire30d') },
        { value: '90d', label: t('apiKeys.expire90d') },
        { value: 'custom', label: t('apiKeys.expireCustom') }
      ]
  ))

  const datePickerPopperOptions = {
    placement: 'bottom-start',
    strategy: 'fixed'
  }

  const buildExpiredAtFromPreset = () => {
    const neverExpiresAt = dayjs('2099-12-31T23:59:59').toISOString()
    switch (expirationPreset.value) {
      case 'current':
        return originalExpireAt.value || neverExpiresAt
      case '30d':
        return dayjs().add(30, 'day').endOf('day').toISOString()
      case '90d':
        return dayjs().add(90, 'day').endOf('day').toISOString()
      case 'custom':
        return expireAt.value ? dayjs(expireAt.value).toISOString() : null
      case 'never':
      default:
        return neverExpiresAt
    }
  }

  watch(expirationPreset, (v) => {
    if (v !== 'custom') {
      expireAt.value = null
    }
  })

  const normalizeList = (body) => {
    const d = body?.data
    if (Array.isArray(d)) return d
    if (Array.isArray(d?.data)) return d.data
    return []
  }

  const maskToken = (token) => {
    if (!token || typeof token !== 'string') return '—'
    const s = token.trim()
    if (s.length <= 8) return `${s.slice(0, 2)}****`
    const head = s.slice(0, 3)
    const tail = s.slice(-4)
    return `${head}********************${tail}`
  }

  const formatDateTime = (v) => {
    if (!v) return '—'
    return dayjs(v).format('YYYY-MM-DD HH:mm')
  }

  const fetchList = async () => {
    if (!props.apiPaths.list) {
      apiKeys.value = []
      return
    }
    loading.value = true
    const { data, error } = await useFetchApi(props.apiPaths.list).json()
    loading.value = false
    if (error.value) {
      ElMessage({ message: error.value.msg || t('apiKeys.loadError'), type: 'warning' })
      apiKeys.value = []
      return
    }
    apiKeys.value = normalizeList(data.value)
  }

  const buildPayload = () => {
    return {
      name: form.value.name.trim(),
      expired_at: buildExpiredAtFromPreset()
    }
  }

  const openCreateDialog = () => {
    isEdit.value = false
    editingId.value = null
    originalExpireAt.value = null
    form.value = {
      name: ''
    }
    expirationPreset.value = 'never'
    expireAt.value = null
    formDialogVisible.value = true
  }

  const openEditDialog = (row) => {
    isEdit.value = true
    editingId.value = row.id
    originalExpireAt.value = row.expire_at || null
    form.value = {
      name: row.token_name || ''
    }
    expirationPreset.value = 'current'
    expireAt.value = null
    formDialogVisible.value = true
  }

  const openDeleteDialog = (row) => {
    deleteTarget.value = row
    deleteDialogVisible.value = true
  }

  const resetFormState = () => {
    formSubmitting.value = false
    if (!formDialogVisible.value) {
      originalExpireAt.value = null
    }
  }

  const submitForm = async () => {
    const nameErr = validateApiKeyName(form.value.name)
    if (nameErr) {
      ElMessage({ message: nameErr, type: 'warning' })
      return
    }
    if (expirationPreset.value === 'custom' && !expireAt.value) {
      ElMessage({ message: t('apiKeys.expireRequired'), type: 'warning' })
      return
    }
    const createPath = props.apiPaths.create
    if (!createPath) {
      ElMessage({ message: props.missingPathMessage || t('apiKeys.missingPath'), type: 'warning' })
      return
    }

    formSubmitting.value = true
    const payload = buildPayload()
    const options = {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }

    if (isEdit.value && editingId.value != null) {
      const updateBase = props.apiPaths.updateBase
      if (!updateBase) {
        formSubmitting.value = false
        ElMessage({ message: props.missingPathMessage || t('apiKeys.missingPath'), type: 'warning' })
        return
      }
      const { error } = await useFetchApi(`${updateBase}/${editingId.value}`, options).put().json()
      formSubmitting.value = false
      if (error.value) {
        ElMessage({ message: error.value.msg || t('apiKeys.saveError'), type: 'warning' })
        return
      }
      ElMessage({ message: t('apiKeys.updateSuccess'), type: 'success' })
      formDialogVisible.value = false
      await fetchList()
      return
    }

    const { data, error } = await useFetchApi(createPath, options).post().json()
    formSubmitting.value = false
    if (error.value) {
      ElMessage({ message: error.value.msg || t('apiKeys.saveError'), type: 'warning' })
      return
    }
    formDialogVisible.value = false
    const created = data.value?.data
    if (created?.token) {
      createdPlainToken.value = created.token
      successDialogVisible.value = true
    } else {
      ElMessage({ message: t('apiKeys.createSuccess'), type: 'success' })
    }
    await fetchList()
  }

  const copyCreatedToken = () => {
    copyToClipboard(createdPlainToken.value)
  }

  const confirmDelete = async () => {
    const row = deleteTarget.value
    if (!row?.id) return
    const deleteBase = props.apiPaths.deleteBase
    if (!deleteBase) return
    deleteSubmitting.value = true
    const { error } = await useFetchApi(`${deleteBase}/${row.id}`).delete().json()
    deleteSubmitting.value = false
    if (error.value) {
      ElMessage({ message: error.value.msg || t('apiKeys.deleteError'), type: 'warning' })
      return
    }
    ElMessage({ message: t('apiKeys.deleteSuccess'), type: 'success' })
    deleteDialogVisible.value = false
    deleteTarget.value = null
    await fetchList()
  }

  watch(
    [() => props.canManage, () => props.apiPaths.list],
    ([canManage, nextPath], [prevCanManage, prevPath]) => {
      if (!canManage || !nextPath) return
      if (canManage === prevCanManage && nextPath === prevPath) return
      fetchList()
    }
  )

  onMounted(() => {
    if (!props.canManage || !props.apiPaths.list) return
    fetchList()
  })
</script>

<style scoped lang="less">
  :deep(.api-keys-table.el-table) {
    --el-table-border-color: #eaecf0;
    --el-table-header-bg-color: #ffffff;

    table {
      table-layout: fixed;
      width: 100%;
    }

    &::before,
    &::after,
    .el-table__inner-wrapper::before {
      display: none;
    }

    th.el-table__cell {
      border-right: none !important;
      border-left: none !important;
      border-top: none !important;
      border-bottom: 1px solid #eaecf0 !important;
      vertical-align: middle !important;
      background-color: #ffffff !important;
    }

    td.el-table__cell {
      border-right: none !important;
      border-left: none !important;
      border-top: none !important;
      border-bottom: 1px solid #eaecf0 !important;
      vertical-align: middle !important;
    }

    tbody tr:last-child td.el-table__cell {
      border-bottom: none !important;
    }

    .api-keys-header-row {
      .api-keys-header-cell {
        padding: 12px 12px;
        .cell {
          display: flex;
          align-items: center;
          line-height: 18px;
          min-height: 22px;
        }
      }
    }

    .api-keys-row {
      .api-keys-cell {
        padding: 12px 12px;
        .cell {
          display: flex;
          align-items: center;
          line-height: 22px;
          min-width: 0;
        }
      }
    }

    td.api-keys-col-actions .cell {
      justify-content: flex-end;
    }
  }

  .api-key-datetime-row :deep(.el-date-editor.el-input) {
    width: 100%;
    max-width: 100%;
  }

  .api-key-datetime-row :deep(.el-date-editor .el-input__wrapper) {
    width: 100%;
  }
</style>

<style lang="less">
  @media (max-width: 639px) {
    .api-keys-dialog-responsive.el-dialog {
      width: calc(100vw - 32px) !important;
      max-width: 520px;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .api-key-form-dialog.el-dialog {
    overflow: visible;
  }

  .api-key-form-dialog .el-dialog__body {
    overflow: visible !important;
  }

  .api-key-datetime-popper.el-popper {
    z-index: 3100 !important;
  }

  @media (max-width: 1065px) {
    .api-key-datetime-popper.el-popper {
      max-width: calc(100vw - 24px) !important;
    }

    .api-key-datetime-popper .el-picker-panel {
      width: min(100vw - 32px, 560px) !important;
      max-width: 100% !important;
      box-sizing: border-box;
    }

    .api-key-datetime-popper .el-picker-panel__body-wrapper {
      overflow-x: auto;
      overflow-y: auto;
      max-height: min(60vh, 520px);
    }
  }

  @media (max-height: 720px) {
    .api-key-datetime-popper .el-picker-panel__body-wrapper {
      max-height: min(50vh, 420px);
      overflow-y: auto;
    }
  }
</style>
