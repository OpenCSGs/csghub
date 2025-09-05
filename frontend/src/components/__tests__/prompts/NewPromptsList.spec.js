import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import NewPromptsList from '@/components/prompts/NewPromptsList.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key, params) => {
      const translations = {
        'prompts.newList.title': 'Create New Prompts List',
        'prompts.newList.owner': 'Owner',
        'prompts.newList.PromptsEnName': 'Prompts English Name',
        'prompts.newList.promptsNickName': 'Prompts Nickname',
        'prompts.newList.promptsDesc': 'Prompts Description',
        'prompts.newList.promptsName': 'Prompts Name',
        'prompts.newList.createPrompts': 'Create Prompts',
        'prompts.newList.createSuccess': 'Create successful',
        'prompts.newList.createFail': 'Create failed',
        'prompts.newList.publicDesc': 'Public description',
        'prompts.newList.privateDesc': 'Private description',
        'prompts.newList.titleTips': 'Title tips',
        'models.newModel.owner': 'Owner',
        'models.newModel.license': 'License',
        'all.pleaseInput': `Please input ${params?.value || ''}`,
        'all.pleaseSelect': `Please select ${params?.value || ''}`,
        'all.select': 'Select',
        'all.cancel': 'Cancel',
        'rule.lengthLimit': `Length should be ${params?.min}-${params?.max} characters`,
        'rule.startWithLetter': 'Must start with letter',
        'rule.endWithLetterOrNumber': 'Must end with letter or number',
        'rule.onlyLetterNumberAndSpecialStr': 'Only letters, numbers and special characters allowed',
        'rule.specialStrNotTogether': 'Special characters should not be together',
        'rule.nameRule': 'Name rule validation'
      }
      return translations[key] || key
    })
  })
}))

// Mock Element Plus
vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
}))

// Mock UserStore
const mockUserStore = {
  username: 'testuser',
  orgs: [
    { path: 'org1' },
    { path: 'org2' }
  ]
}

vi.mock('@/stores/UserStore', () => ({
  default: vi.fn(() => mockUserStore)
}))

// Mock useFetchApi
let { useFetchApiMock } = vi.hoisted(() => {
  return {
    useFetchApiMock: vi.fn(() => ({
      post: () => ({
        json: () => Promise.resolve({
          data: { value: { data: { path: 'testuser/test-prompts' } } },
          error: { value: null }
        })
      })
    }))
  }
})

vi.mock('@/packs/useFetchApi', () => ({
  default: useFetchApiMock
}))

describe('NewPromptsList.vue', () => {
  const mockLicenses = [
    ['MIT', 'MIT License'],
    ['Apache-2.0', 'Apache License 2.0'],
    ['GPL-3.0', 'GNU General Public License v3.0']
  ]

  const createWrapper = (props = {}) => {
    return mount(NewPromptsList, {
      props: {
        namespace: 'test-namespace',
        name: 'test-name',
        licenses: mockLicenses,
        ...props
      },
      global: {
        provide: {
          nameRule: /^[a-zA-Z0-9_-]+$/
        },
        stubs: {
          PromptsBreadCrumbs: true,
          PublicAndPrivateRadioGroup: {
            template: '<div class="radio-group"><input type="radio" value="public" /><input type="radio" value="private" /></div>',
            props: ['modelValue', 'publicDesc', 'privateDesc'],
            emits: ['update:modelValue'],
            name: 'PublicAndPrivateRadioGroup'
          },
          CsgButton: {
            template: '<button class="csg-button" @click="$emit(\'click\')" :disabled="disabled || loading">{{ name }}</button>',
            props: ['name', 'loading', 'class', 'disabled'],
            name: 'CsgButton'
          }
        }
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // 重置 location mock
    delete window.location
    window.location = { href: '', search: '' }

    // 重置 useFetchApi mock
    useFetchApiMock.mockImplementation(() => ({
      post: () => ({
        json: () => Promise.resolve({
          data: { value: { data: { path: 'testuser/test-prompts' } } },
          error: { value: null }
        })
      })
    }))
  })

  it('should render component correctly with initial data', () => {
    const wrapper = createWrapper()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.text-2xl').text()).toBe('New Prompt Library')

    // 验证表单字段初始值
    expect(wrapper.vm.dataForm.owner).toBe('testuser')
    expect(wrapper.vm.dataForm.name).toBe('')
    expect(wrapper.vm.dataForm.nickname).toBe('')
    expect(wrapper.vm.dataForm.license).toBe('MIT') // 默认第一个许可证
    expect(wrapper.vm.dataForm.desc).toBe('')
    expect(wrapper.vm.dataForm.visibility).toBe('public')
  })

  it('should initialize form with correct validation rules', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.rules.owner).toBeDefined()
    expect(wrapper.vm.rules.name).toBeDefined()
    expect(wrapper.vm.rules.license).toBeDefined()

    // 验证所有者验证规则
    const ownerRules = wrapper.vm.rules.owner
    expect(ownerRules[0].required).toBeTruthy()

    // 验证名称验证规则
    const nameRules = wrapper.vm.rules.name
    expect(nameRules[0].required).toBeTruthy()
    expect(nameRules[1].min).toBe(2)
    expect(nameRules[1].max).toBe(64)
    expect(nameRules[2].pattern).toBeDefined()
    expect(nameRules[3].pattern).toBeDefined()
    expect(nameRules[4].pattern).toBeDefined()
    expect(nameRules[5].pattern).toBeDefined()

    // 验证许可证验证规则
    const licenseRules = wrapper.vm.rules.license
    expect(licenseRules[0].required).toBeTruthy()
  })

  it('should compute showButton correctly based on form data', async () => {
    const wrapper = createWrapper()

    // 初始状态不应该显示按钮（缺少必填字段）
    expect(wrapper.vm.showButton).toBeFalsy()

    // 填写必填字段后应该显示按钮
    wrapper.vm.dataForm.name = 'test-prompts'
    wrapper.vm.dataForm.owner = 'testuser'
    wrapper.vm.dataForm.license = 'MIT'
    await nextTick()
    expect(wrapper.vm.showButton).toBeTruthy()

    // 清空名称后不应该显示按钮
    wrapper.vm.dataForm.name = ''
    await nextTick()
    expect(wrapper.vm.showButton).toBeFalsy()
  })

  it('should generate namespaces correctly from user store', () => {
    const wrapper = createWrapper()

    const namespaces = wrapper.vm.namespaces()

    // 应该包含用户名和组织
    expect(namespaces).toContain('testuser')
    expect(namespaces).toContain('org1')
    expect(namespaces).toContain('org2')

    // 用户名应该在第一位
    expect(namespaces[0]).toBe('testuser')

    // 默认选择第一个命名空间
    expect(wrapper.vm.dataForm.owner).toBe('testuser')
  })

  it('should handle form submission with valid data', async () => {
    const { ElMessage } = await import('element-plus')
    const wrapper = createWrapper()

    // 填写表单数据
    wrapper.vm.dataForm.name = 'test-prompts'
    wrapper.vm.dataForm.nickname = 'Test Prompts'
    wrapper.vm.dataForm.owner = 'testuser'
    wrapper.vm.dataForm.license = 'MIT'
    wrapper.vm.dataForm.desc = 'Test description'
    wrapper.vm.dataForm.visibility = 'public'

    // Mock 表单验证通过
    wrapper.vm.dataFormRef = {
      validate: vi.fn((callback) => {
        callback(true)
        return Promise.resolve()
      })
    }

    // 调用提交方法
    await wrapper.vm.handleSubmit()
    await flushPromises()

    // 验证 API 调用
    expect(useFetchApiMock).toHaveBeenCalledWith(
      '/prompts',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"name":"test-prompts"')
      })
    )

    // 验证成功消息
    expect(ElMessage).toHaveBeenCalledWith({
      message: 'Create successful',
      type: 'success'
    })

    // 验证页面跳转
    expect(window.location.href).toBe('/prompts/library/testuser/test-prompts')
  })

  it('should handle API error during submission', async () => {
    const { ElMessage } = await import('element-plus')

    // Mock API 返回错误
    useFetchApiMock.mockImplementationOnce(() => ({
      post: () => ({
        json: () => Promise.resolve({
          data: { value: null },
          error: { value: { msg: 'Server error' } }
        })
      })
    }))

    const wrapper = createWrapper()

    // 填写表单数据
    wrapper.vm.dataForm.name = 'test-prompts'
    wrapper.vm.dataForm.owner = 'testuser'
    wrapper.vm.dataForm.license = 'MIT'

    // Mock 表单验证通过
    wrapper.vm.dataFormRef = {
      validate: vi.fn((callback) => {
        callback(true)
        return Promise.resolve()
      })
    }

    await wrapper.vm.handleSubmit()
    await flushPromises()

    // 验证错误消息
    expect(ElMessage).toHaveBeenCalledWith({
      message: 'Create failed: Server error',
      type: 'error'
    })
  })

  it('should handle cancel button click', () => {
    const wrapper = createWrapper()

    wrapper.vm.cancelSubmit()

    // 验证页面跳转到 prompts 库
    expect(window.location.href).toBe('/prompts/library')
  })

  it('should validate name field correctly', () => {
    const wrapper = createWrapper()
    const nameRules = wrapper.vm.rules.name

    // 测试必填验证
    const requiredRule = nameRules.find(rule => rule.required)
    expect(requiredRule).toBeDefined()

    // 测试长度验证
    const lengthRule = nameRules.find(rule => rule.min && rule.max)
    expect(lengthRule).toBeDefined()
    expect(lengthRule.min).toBe(2)
    expect(lengthRule.max).toBe(64)

    // 测试以字母开头的验证
    const startLetterRule = nameRules.find(rule => rule.pattern && rule.pattern.source === '^[a-zA-Z]')
    expect(startLetterRule).toBeDefined()
    expect(startLetterRule.pattern.test('valid-name')).toBeTruthy()
    expect(startLetterRule.pattern.test('1invalid')).toBeFalsy()

    // 测试以字母或数字结尾的验证
    const endRule = nameRules.find(rule => rule.pattern && rule.pattern.source === '[a-zA-Z0-9]$')
    expect(endRule).toBeDefined()
    expect(endRule.pattern.test('valid1')).toBeTruthy()
    expect(endRule.pattern.test('invalid-')).toBeFalsy()
  })

  it('should send correct request body in API call', async () => {
    const wrapper = createWrapper()

    // 修改表单数据
    wrapper.vm.dataForm.name = 'updated-prompts'
    wrapper.vm.dataForm.nickname = 'Updated Prompts'
    wrapper.vm.dataForm.owner = 'org1'
    wrapper.vm.dataForm.license = 'Apache-2.0'
    wrapper.vm.dataForm.desc = 'Updated description'
    wrapper.vm.dataForm.visibility = 'private'

    // Mock 表单验证通过
    wrapper.vm.dataFormRef = {
      validate: vi.fn((callback) => {
        callback(true)
        return Promise.resolve()
      })
    }

    await wrapper.vm.handleSubmit()
    await flushPromises()

    // 验证请求体包含正确的数据
    const expectedBody = JSON.stringify({
      name: 'updated-prompts',
      nickname: 'Updated Prompts',
      namespace: 'org1',
      license: 'Apache-2.0',
      description: 'Updated description',
      private: true
    })

    expect(useFetchApiMock).toHaveBeenCalledWith(
      '/prompts',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
        body: expectedBody
      })
    )
  })
})