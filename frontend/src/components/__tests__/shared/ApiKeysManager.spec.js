import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import ApiKeysManager from '@/components/shared/ApiKeysManager.vue'

vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
}))

const { copyToClipboardMock, requestLog, useFetchApiMock } = vi.hoisted(() => ({
  copyToClipboardMock: vi.fn(),
  requestLog: [],
  useFetchApiMock: vi.fn((url, options = {}) => {
    const entry = { url, options, method: 'json' }
    requestLog.push(entry)

    return {
      json: vi.fn(async () => {
        if (url === '/namespaces/org-ns/apikeys') {
          return {
            data: {
              value: {
                data: [
                  {
                    id: 1,
                    token_name: 'existing-key',
                    token: 'sk-test-token',
                    created_at: '2026-04-01T10:00:00Z',
                    last_used_at: '2026-04-02T10:00:00Z'
                  }
                ]
              }
            },
            error: { value: null }
          }
        }

        return {
          data: { value: {} },
          error: { value: null }
        }
      }),
      post: vi.fn(() => ({
        json: vi.fn(async () => {
          entry.method = 'post'
          return {
            data: {
              value: {
                data: {
                  token: 'plain-created-token'
                }
              }
            },
            error: { value: null }
          }
        })
      })),
      put: vi.fn(() => ({
        json: vi.fn(async () => {
          entry.method = 'put'
          return {
            data: { value: { data: {} } },
            error: { value: null }
          }
        })
      })),
      delete: vi.fn(() => ({
        json: vi.fn(async () => {
          entry.method = 'delete'
          return {
            data: { value: { data: {} } },
            error: { value: null }
          }
        })
      }))
    }
  })
}))

vi.mock('@/packs/clipboard', () => ({
  copyToClipboard: copyToClipboardMock
}))

vi.mock('@/packs/useFetchApi', () => ({
  default: useFetchApiMock
}))

const createI18nInstance = () =>
  createI18n({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        all: {
          noData: 'No data',
          select: 'Select',
          cancel: 'Cancel',
          confirm: 'Confirm'
        },
        apiKeys: {
          create: 'Create API key',
          colName: 'Name',
          colKey: 'Key',
          colCreated: 'Created',
          colLastUsed: 'Last used',
          colActions: 'Actions',
          edit: 'Edit',
          delete: 'Delete',
          createTitle: 'Create API key',
          editTitle: 'Edit API key',
          fieldName: 'Name',
          fieldExpire: 'Expiration',
          namePlaceholder: 'Name',
          expireNever: 'Never',
          expire30d: '30 days',
          expire90d: '90 days',
          expireCustom: 'Custom',
          editExpireCurrent: 'Keep current expiration',
          successTitle: 'Success',
          successHint: 'Hint',
          successWarn: 'Warn',
          close: 'Close',
          copy: 'Copy',
          deleteTitle: 'Delete',
          deleteMessageLead: 'Delete {name}',
          deleteMessageTrail: 'After deletion',
          deleteConfirm: 'Delete',
          deleteSuccess: 'Deleted',
          deleteError: 'Delete failed',
          loadError: 'Load failed',
          saveError: 'Save failed',
          createSuccess: 'Created',
          updateSuccess: 'Updated',
          nameRequired: 'Name required',
          nameTooLong: 'Name too long',
          nameInvalidChars: 'Invalid chars',
          expireRequired: 'Expire required',
          missingPath: 'Missing path'
        }
      }
    }
  })

const globalStubs = {
  SvgIcon: true,
  'el-table': {
    props: ['data', 'emptyText'],
    template: '<div class="el-table-stub"><slot></slot></div>'
  },
  'el-table-column': {
    template: '<div class="el-table-column-stub"></div>'
  },
  'el-dialog': {
    props: ['modelValue'],
    emits: ['update:modelValue', 'closed'],
    template: `
      <div v-if="modelValue" class="el-dialog-stub">
        <slot name="header"></slot>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    `
  },
  'el-input': {
    props: ['modelValue', 'placeholder', 'type', 'readonly', 'maxlength'],
    emits: ['update:modelValue'],
    template: `
      <div class="el-input-stub">
        <input
          :value="modelValue"
          :placeholder="placeholder"
          :type="type || 'text'"
          :readonly="readonly"
          @input="$emit('update:modelValue', $event.target.value)"
        />
        <slot name="append"></slot>
      </div>
    `
  },
  'el-select': {
    props: ['modelValue', 'placeholder'],
    emits: ['update:modelValue'],
    template: `
      <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <slot></slot>
      </select>
    `
  },
  'el-option': {
    props: ['label', 'value'],
    template: '<option :value="value">{{ label }}</option>'
  },
  'el-date-picker': {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template: '<input class="date-picker-stub" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
  }
}

const createWrapper = (props = {}) =>
  mount(ApiKeysManager, {
    props: {
      title: 'API Keys',
      subtitle: 'Manage keys',
      canManage: true,
      apiPaths: {
        list: '/namespaces/org-ns/apikeys',
        create: '/namespaces/org-ns/apikeys',
        updateBase: '/namespaces/org-ns/apikeys',
        deleteBase: '/namespaces/org-ns/apikeys'
      },
      ...props
    },
    global: {
      plugins: [createI18nInstance()],
      stubs: globalStubs
    }
  })

describe('ApiKeysManager.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requestLog.length = 0
  })

  it('有管理权限时挂载后会加载列表', async () => {
    createWrapper()
    await flushPromises()

    expect(useFetchApiMock).toHaveBeenCalledWith('/namespaces/org-ns/apikeys')
    expect(requestLog[0].method).toBe('json')
  })

  it('创建时会提交名称和过期时间', async () => {
    const wrapper = createWrapper({ canManage: false })

    wrapper.vm.openCreateDialog()
    wrapper.vm.form.name = 'new-key'

    await wrapper.vm.submitForm()
    await flushPromises()

    const createRequest = requestLog.find((entry) => entry.method === 'post')
    expect(createRequest).toBeTruthy()

    const payload = JSON.parse(createRequest.options.body)
    expect(payload.name).toBe('new-key')
    expect(payload.expired_at).toBeTruthy()
    expect(payload.quota).toBeUndefined()
    expect(payload.quota_type).toBeUndefined()
  })

  it('编辑时会正确回填表单数据', async () => {
    const wrapper = createWrapper({ canManage: true })
    await flushPromises()

    wrapper.vm.openEditDialog({
      id: 1,
      token_name: 'existing-key',
      expire_at: '2099-12-31T23:59:59Z'
    })

    expect(wrapper.vm.form.name).toBe('existing-key')
    expect(wrapper.vm.expirationPreset).toBe('current')
  })

  it('无管理权限时不会自动加载列表，也不显示创建按钮', async () => {
    const wrapper = createWrapper({ canManage: false })
    await flushPromises()

    expect(useFetchApiMock).not.toHaveBeenCalledWith('/namespaces/org-ns/apikeys')
    expect(wrapper.text()).not.toContain('Create API key')
  })
})
