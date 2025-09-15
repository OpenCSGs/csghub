import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import NewPrompt from '@/components/prompts/NewPrompt.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key, params) => {
      if (params) {
        return `${key}_${JSON.stringify(params)}`
      }
      return key
    }),
    locale: { value: 'zh' }
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
      post: () => ({
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

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: ''
  },
  writable: true
})

describe('NewPrompt.vue', () => {
  const createWrapper = (props = {}) => {
    return mount(NewPrompt, {
      props: {
        namespace: 'test-namespace',
        name: 'test-name',
        ...props
      },
      global: {
        provide: {
          nameRule: vi.fn()
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
    window.location.href = ''

    // 重置 useFetchApi mock 的默认行为
    useFetchApiMock.mockImplementation(() => ({
      post: () => ({
        json: () => Promise.resolve({
          data: { value: { success: true } },
          error: { value: null }
        })
      })
    }))
  })

  it('should render correctly with all form fields', () => {
    const wrapper = createWrapper()

    // 验证组件正确渲染
    expect(wrapper.exists()).toBe(true)

    // 验证标题
    expect(wrapper.find('.text-2xl').text()).toBe('New Prompt')

    // 验证表单字段存在
    expect(wrapper.find('input[placeholder*="prompts.new.title"]').exists()).toBe(true)
    expect(wrapper.find('.el-select').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="www.opencsg.com"]').exists()).toBe(true)
  })

  it('should initialize with correct default values', () => {
    const wrapper = createWrapper()

    // 验证默认表单数据
    expect(wrapper.vm.dataForm.title).toBe('')
    expect(wrapper.vm.dataForm.language).toBe('zh')
    expect(wrapper.vm.dataForm.scene).toEqual([])
    expect(wrapper.vm.dataForm.source).toBe('')
    expect(wrapper.vm.dataForm.content).toBe('')
    expect(wrapper.vm.loading).toBeFalsy()
  })

  it('should update form data when user inputs', async () => {
    const wrapper = createWrapper()

    // 测试标题输入
    const titleInput = wrapper.find('input[placeholder*="prompts.new.title"]')
    await titleInput.setValue('Test Prompt Title')
    expect(wrapper.vm.dataForm.title).toBe('Test Prompt Title')

    // 测试内容输入
    const contentTextarea = wrapper.find('textarea')
    await contentTextarea.setValue('Test prompt content')
    expect(wrapper.vm.dataForm.content).toBe('Test prompt content')

    // 测试来源输入
    const sourceInput = wrapper.find('input[placeholder="www.opencsg.com"]')
    await sourceInput.setValue('test.com')
    expect(wrapper.vm.dataForm.source).toBe('test.com')
  })

  it('should have correct language options based on locale', () => {
    const wrapper = createWrapper()

    const languages = wrapper.vm.languages
    expect(languages).toHaveLength(2)
    expect(languages[0]).toEqual({ value: 'zh', label: '中文' })
    expect(languages[1]).toEqual({ value: 'en', label: '英文' })
  })

  it('should have correct scene options', () => {
    const wrapper = createWrapper()

    const options = wrapper.vm.options
    expect(options).toHaveLength(12)
    expect(options[0]).toEqual({ value: 'Image', label: '图像生成' })
    expect(options[1]).toEqual({ value: 'Video', label: '视频生成' })
    expect(options[2]).toEqual({ value: 'Music', label: '音乐生成' })
  })

  it('should validate required fields', async () => {
    const wrapper = createWrapper()

    // Mock 表单验证失败
    wrapper.vm.dataFormRef = {
      validate: vi.fn((callback) => callback(false))
    }

    // 点击提交按钮
    const submitButton = wrapper.findAllComponents({ name: 'CsgButton' })[1]
    await submitButton.trigger('click')

    // 验证表单验证被调用
    expect(wrapper.vm.dataFormRef.validate).toHaveBeenCalled()
    expect(wrapper.vm.loading).toBe(false)
  })

  it('should submit form successfully when validation passes', async () => {
    const wrapper = createWrapper()

    // 设置表单数据
    wrapper.vm.dataForm = {
      title: 'Test Title',
      language: 'zh',
      scene: ['Image', 'Code'],
      source: 'test.com',
      content: 'Test content'
    }

    // Mock 表单验证成功
    wrapper.vm.dataFormRef = {
      validate: vi.fn((callback) => {
        callback(true)
        return Promise.resolve()
      })
    }

    // Mock 成功的 API 响应
    useFetchApiMock.mockImplementation(() => ({
      post: () => ({
        json: () => Promise.resolve({
          data: { value: { success: true } },
          error: { value: null }
        })
      })
    }))

    // 点击提交按钮
    const submitButton = wrapper.findAllComponents({ name: 'CsgButton' })[1]
    await submitButton.trigger('click')

    // 等待异步操作完成
    await flushPromises()

    // 验证 API 调用
    expect(useFetchApiMock).toHaveBeenCalledWith(
      '/prompts/test-namespace/test-name/prompt/record',
      {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Title',
          language: 'zh',
          tags: ['Image', 'Code'],
          source: 'test.com',
          content: 'Test content'
        })
      }
    )

    // 验证成功消息
    const { ElMessage } = await import('element-plus')
    expect(ElMessage).toHaveBeenCalledWith({
      message: 'prompts.new.createSuccess',
      type: 'success'
    })

    // 验证页面跳转
    expect(window.location.href).toBe('/prompts/library/test-namespace/test-name/Test Title.jsonl')
  })

  it('should handle API error correctly', async () => {
    const wrapper = createWrapper()

    // 设置表单数据
    wrapper.vm.dataForm = {
      title: 'Test Title',
      language: 'zh',
      scene: ['Image'],
      source: 'test.com',
      content: 'Test content'
    }

    // Mock 表单验证成功
    wrapper.vm.dataFormRef = {
      validate: vi.fn((callback) => {
        callback(true)
        return Promise.resolve()
      })
    }

    // Mock API 错误响应
    useFetchApiMock.mockImplementation(() => ({
      post: () => ({
        json: () => Promise.resolve({
          data: { value: null },
          error: { value: { msg: 'API Error' } }
        })
      })
    }))

    // 点击提交按钮
    const submitButton = wrapper.findAllComponents({ name: 'CsgButton' })[1]
    await submitButton.trigger('click')

    // 等待异步操作完成
    await flushPromises()

    // 验证错误消息
    const { ElMessage } = await import('element-plus')
    expect(ElMessage).toHaveBeenCalledWith({
      message: 'prompts.new.createFail: API Error',
      type: 'error'
    })
  })

  it('should show loading state during form submission', async () => {
    const wrapper = createWrapper()

    // Mock 表单验证成功，返回一个 Promise 来模拟异步验证
    const validatePromise = new Promise((resolve) => {
      setTimeout(() => resolve(), 100)
    })

    wrapper.vm.dataFormRef = {
      validate: vi.fn((callback) => {
        callback(true) // 立即调用回调表示验证成功
        return validatePromise
      })
    }

    // 点击提交按钮
    const submitButton = wrapper.findAllComponents({ name: 'CsgButton' })[1]
    await submitButton.trigger('click')

    // 等待 Vue 响应式更新
    await nextTick()

    // 验证加载状态
    expect(wrapper.vm.loading).toBeTruthy()

    // 等待异步操作完成
    await flushPromises()
    await validatePromise

    // 验证加载状态重置
    expect(wrapper.vm.loading).toBeFalsy()
  })

  it('should cancel and redirect when cancel button is clicked', async () => {
    const wrapper = createWrapper()

    // 点击取消按钮
    const cancelButton = wrapper.findAllComponents({ name: 'CsgButton' })[0]
    await cancelButton.trigger('click')

    // 验证页面跳转
    expect(window.location.href).toBe('/prompts/library/test-namespace/test-name')
  })

  it('should compute showButton correctly', async () => {
    const wrapper = createWrapper()

    // 等待 Vue 响应式系统初始化
    await nextTick()

    // 初始状态，按钮应该不显示（空字符串 && 空字符串 = 空字符串，为假值）
    expect(wrapper.vm.showButton).toBeFalsy()

    // 只有标题，按钮不显示（字符串 && 空字符串 = 空字符串，为假值）
    wrapper.vm.dataForm.title = 'Test Title'
    await nextTick()
    expect(wrapper.vm.showButton).toBeFalsy()

    // 只有内容，按钮不显示（空字符串 && 字符串 = 空字符串，为假值）
    wrapper.vm.dataForm.title = ''
    wrapper.vm.dataForm.content = 'Test Content'
    await nextTick()
    expect(wrapper.vm.showButton).toBeFalsy()

    // 标题和内容都有，按钮显示（字符串 && 字符串 = 字符串，为真值）
    wrapper.vm.dataForm.title = 'Test Title'
    wrapper.vm.dataForm.content = 'Test Content'
    await nextTick()
    expect(wrapper.vm.showButton).toBeTruthy()
  })

  it('should have correct form validation rules', () => {
    const wrapper = createWrapper()

    const rules = wrapper.vm.rules

    // 验证标题规则
    expect(rules.title).toHaveLength(3)
    expect(rules.title[0].required).toBeTruthy()
    expect(rules.title[1].min).toBe(2)
    expect(rules.title[1].max).toBe(64)
    expect(rules.title[2].pattern).toEqual(/^(?!.*[-_.]{2,}).*$/)

    // 验证内容规则
    expect(rules.content).toHaveLength(1)
    expect(rules.content[0].required).toBeTruthy()
  })

  it('should initialize component with custom props', () => {
    // 测试组件能够正确初始化并使用自定义props
    const customNamespace = 'custom-namespace'
    const customName = 'custom-name'
    
    const wrapper = createWrapper({
      namespace: customNamespace,
      name: customName
    })

    // 验证组件基本功能正常工作
    expect(wrapper.vm.dataForm).toBeDefined()
    expect(wrapper.vm.loading).toBeFalsy()
    expect(wrapper.vm.rules).toBeDefined()
    
    // 验证组件方法存在且可调用
    expect(typeof wrapper.vm.handleSubmit).toBe('function')
    expect(typeof wrapper.vm.cancelSubmit).toBe('function')
    expect(typeof wrapper.vm.createPrompt).toBe('function')
    
    // 验证表单初始数据结构正确
    expect(wrapper.vm.dataForm.title).toBe('')
    expect(wrapper.vm.dataForm.language).toBe('zh')
    expect(Array.isArray(wrapper.vm.dataForm.scene)).toBeTruthy()
  })

  it('should handle form validation with different scenarios', async () => {
    const wrapper = createWrapper()

    // 测试标题长度验证
    const titleRule = wrapper.vm.rules.title[1]
    expect(titleRule.min).toBe(2)
    expect(titleRule.max).toBe(64)

    // 测试特殊字符验证
    const patternRule = wrapper.vm.rules.title[2]
    expect(patternRule.pattern.test('valid-name')).toBeTruthy()
    expect(patternRule.pattern.test('invalid--name')).toBeFalsy()
    expect(patternRule.pattern.test('invalid__name')).toBeFalsy()
    expect(patternRule.pattern.test('invalid..name')).toBeFalsy()
  })

  it('should render scene options with PromptsTags', () => {
    const wrapper = createWrapper()

    // 验证场景选择器存在
    const sceneSelect = wrapper.find('.el-select')
    expect(sceneSelect.exists()).toBe(true)

    // 验证选项数量
    expect(wrapper.vm.options).toHaveLength(12)
  })

  it('should handle multiple scene selection', async () => {
    const wrapper = createWrapper()

    // 设置多个场景
    wrapper.vm.dataForm.scene = ['Image', 'Code', 'Design']
    await nextTick()

    expect(wrapper.vm.dataForm.scene).toEqual(['Image', 'Code', 'Design'])
  })
})