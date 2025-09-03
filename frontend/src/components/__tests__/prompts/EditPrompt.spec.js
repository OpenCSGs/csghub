import { mount, flushPromises } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import EditPrompt from '@/components/prompts/EditPrompt.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key, params) => {
      const translations = {
        'prompts.editPrompt': 'Edit Prompt',
        'prompts.new.title': 'Title',
        'prompts.new.language': 'Language',
        'prompts.new.scene': 'Scene',
        'prompts.new.origin': 'Source',
        'prompts.new.content': 'Content',
        'prompts.new.titleTips': 'Title tips',
        'prompts.new.promptName': 'Prompt Name',
        'prompts.new.promptContent': 'Prompt Content',
        'prompts.update.updateSuccess': 'Update successful',
        'prompts.update.updateFail': 'Update failed',
        'all.pleaseInput': `Please input ${params?.value || ''}`,
        'all.select': 'Select',
        'all.cancel': 'Cancel',
        'all.confirm': 'Confirm',
        'rule.lengthLimit': `Length should be ${params?.min}-${params?.max} characters`,
        'rule.specialStrNotTogether': 'Special characters should not be together'
      }
      return translations[key] || key
    }),
    locale: ref('en')
  })
}))

// Mock Element Plus
vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
}))

// Mock useFetchApi
let { useFetchApiMock } = vi.hoisted(() => {
  return {
    useFetchApiMock: vi.fn(() => ({
      put: () => ({
        json: () => Promise.resolve({
          data: { value: { success: true } },
          error: { value: null }
        })
      })
    }))
  }
})

vi.mock('@/packs/useFetchApi', () => ({
  default: useFetchApiMock
}))

describe('EditPrompt.vue', () => {
  const mockPromptsDetails = {
    title: 'Test Prompt',
    language: 'en',
    tags: ['Image', 'Code'],
    source: 'https://example.com',
    content: 'Test prompt content',
    file_path: 'test-prompt.md'
  }

  const createWrapper = (props = {}) => {
    return mount(EditPrompt, {
      props: {
        namespace: 'test-namespace',
        name: 'test-name',
        filePath: 'test-file-path',
        promptsDetails: mockPromptsDetails,
        ...props
      },
      global: {
        provide: {
          nameRule: /^[a-zA-Z0-9_-]+$/
        },
        stubs: {
          PromptsBreadCrumbs: true,
          PromptsTags: true,
          SvgIcon: true,
          CsgButton: {
            template: '<button class="csg-button" @click="$emit(\'click\')" :disabled="loading">{{ name }}</button>',
            props: ['name', 'loading', 'class'],
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
    window.location = { href: '', reload: vi.fn() }
    
    // 重置 useFetchApi mock
    useFetchApiMock.mockImplementation(() => ({
      put: () => ({
        json: () => Promise.resolve({
          data: { value: { success: true } },
          error: { value: null }
        })
      })
    }))
  })

  it('should render component correctly with initial data', () => {
    const wrapper = createWrapper()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.text-2xl').text()).toBe('Edit Prompt')
    
    // 验证表单字段初始值
    expect(wrapper.vm.dataForm.title).toBe('Test Prompt')
    expect(wrapper.vm.dataForm.language).toBe('en')
    expect(wrapper.vm.dataForm.scene).toEqual(['Image', 'Code'])
    expect(wrapper.vm.dataForm.source).toBe('https://example.com')
    expect(wrapper.vm.dataForm.content).toBe('Test prompt content')
  })

  it('should initialize form with correct validation rules', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.rules.title).toBeDefined()
    expect(wrapper.vm.rules.content).toBeDefined()
    
    // 验证标题验证规则
    const titleRules = wrapper.vm.rules.title
    expect(titleRules[0].required).toBeTruthy()
    expect(titleRules[1].min).toBe(2)
    expect(titleRules[1].max).toBe(64)
    expect(titleRules[2].pattern).toBeDefined()
    
    // 验证内容验证规则
    const contentRules = wrapper.vm.rules.content
    expect(contentRules[0].required).toBeTruthy()
  })

  it('should compute showButton correctly based on form data', async () => {
    const wrapper = createWrapper()

    // 初始状态应该显示按钮（有标题和内容）
    expect(wrapper.vm.showButton).toBeTruthy()

    // 清空标题后不应该显示按钮
    wrapper.vm.dataForm.title = ''
    await nextTick()
    expect(wrapper.vm.showButton).toBeFalsy()

    // 清空内容后不应该显示按钮
    wrapper.vm.dataForm.title = 'Test Title'
    wrapper.vm.dataForm.content = ''
    await nextTick()
    expect(wrapper.vm.showButton).toBeFalsy()

    // 都有内容时应该显示按钮
    wrapper.vm.dataForm.content = 'Test Content'
    await nextTick()
    expect(wrapper.vm.showButton).toBeTruthy()
  })

  it('should render language options correctly', () => {
    const wrapper = createWrapper()

    const languageOptions = wrapper.vm.languages
    expect(languageOptions).toHaveLength(2)
    expect(languageOptions[0].value).toBe('zh')
    expect(languageOptions[1].value).toBe('en')
  })

  it('should render scene options correctly', () => {
    const wrapper = createWrapper()

    const sceneOptions = wrapper.vm.options
    expect(sceneOptions.length).toBeGreaterThan(0)
    
    // 验证一些关键选项
    const imageOption = sceneOptions.find(option => option.value === 'Image')
    const codeOption = sceneOptions.find(option => option.value === 'Code')
    
    expect(imageOption).toBeDefined()
    expect(codeOption).toBeDefined()
  })

  it('should handle form submission with valid data', async () => {
    const { ElMessage } = await import('element-plus')
    const wrapper = createWrapper()

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
      '/prompts/test-namespace/test-name/prompt/record/test-prompt.md',
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"title":"Test Prompt"')
      })
    )

    // 验证成功消息
    expect(ElMessage).toHaveBeenCalledWith({
      message: 'Update successful',
      type: 'success'
    })

    // 验证页面跳转
    expect(window.location.href).toBe('/prompts/library/test-namespace/test-name/test-prompt.md')
  })

  it('should handle form submission with invalid data', async () => {
    const wrapper = createWrapper()

    // Mock 表单验证失败
    wrapper.vm.dataFormRef = {
      validate: vi.fn((callback) => {
        callback(false)
        return Promise.resolve()
      })
    }

    const initialLoading = wrapper.vm.loading
    await wrapper.vm.handleSubmit()
    await flushPromises()

    // 验证表单验证被调用
    expect(wrapper.vm.dataFormRef.validate).toHaveBeenCalled()
    
    // 验证 API 没有被调用
    expect(useFetchApiMock).not.toHaveBeenCalled()
    
    // 验证 loading 状态被重置
    expect(wrapper.vm.loading).toBe(initialLoading)
  })

  it('should handle API error during submission', async () => {
    const { ElMessage } = await import('element-plus')
    
    // Mock API 返回错误
    useFetchApiMock.mockImplementationOnce(() => ({
      put: () => ({
        json: () => Promise.resolve({
          data: { value: null },
          error: { value: { msg: 'Server error' } }
        })
      })
    }))

    const wrapper = createWrapper()

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
      message: 'Update failed: Server error',
      type: 'error'
    })
  })

  it('should handle cancel button click', () => {
    const wrapper = createWrapper()

    wrapper.vm.cancelSubmit()

    // 验证页面重新加载
    expect(window.location.reload).toHaveBeenCalled()
  })

  it('should update loading state during form submission', async () => {
    const wrapper = createWrapper()

    // Mock 表单验证通过
    wrapper.vm.dataFormRef = {
      validate: vi.fn((callback) => {
        callback(true)
        return Promise.resolve()
      })
    }

    expect(wrapper.vm.loading).toBeFalsy()

    // 开始提交
    const submitPromise = wrapper.vm.handleSubmit()
    
    // 提交过程中应该是 loading 状态
    expect(wrapper.vm.loading).toBeTruthy()

    await submitPromise
    await flushPromises()

    // 提交完成后应该重置 loading 状态
    expect(wrapper.vm.loading).toBeFalsy()
  })

  it('should validate title field correctly', () => {
    const wrapper = createWrapper()
    const titleRules = wrapper.vm.rules.title

    // 测试必填验证
    const requiredRule = titleRules.find(rule => rule.required)
    expect(requiredRule).toBeDefined()
    expect(requiredRule.message).toContain('Please input')

    // 测试长度验证
    const lengthRule = titleRules.find(rule => rule.min && rule.max)
    expect(lengthRule).toBeDefined()
    expect(lengthRule.min).toBe(2)
    expect(lengthRule.max).toBe(64)

    // 测试特殊字符验证
    const patternRule = titleRules.find(rule => rule.pattern)
    expect(patternRule).toBeDefined()
    expect(patternRule.pattern.test('valid-name')).toBeTruthy()
    expect(patternRule.pattern.test('invalid--name')).toBeFalsy()
  })

  it('should validate content field correctly', () => {
    const wrapper = createWrapper()
    const contentRules = wrapper.vm.rules.content

    // 测试必填验证
    const requiredRule = contentRules.find(rule => rule.required)
    expect(requiredRule).toBeDefined()
    expect(requiredRule.message).toContain('Please input')
  })

  it('should construct API endpoint correctly', async () => {
    const wrapper = createWrapper({
      namespace: 'custom-namespace',
      name: 'custom-name',
      promptsDetails: {
        ...mockPromptsDetails,
        file_path: 'custom-file.md'
      }
    })

    // Mock 表单验证通过
    wrapper.vm.dataFormRef = {
      validate: vi.fn((callback) => {
        callback(true)
        return Promise.resolve()
      })
    }

    await wrapper.vm.handleSubmit()
    await flushPromises()

    // 验证 API 端点构造正确
    expect(useFetchApiMock).toHaveBeenCalledWith(
      '/prompts/custom-namespace/custom-name/prompt/record/custom-file.md',
      expect.any(Object)
    )
  })
})