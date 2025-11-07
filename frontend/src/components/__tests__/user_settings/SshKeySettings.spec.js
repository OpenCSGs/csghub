import { mount } from '@vue/test-utils'
import SshKeySettings from '@/components/user_settings/SshKeySettings.vue'
import { ElMessage } from 'element-plus'
import { nextTick } from 'vue'
import waitFor from 'wait-for-expect'

// Mock 依赖项
vi.mock('element-plus', () => ({
  ElMessage: {
    warning: vi.fn(),
    success: vi.fn(),
    error: vi.fn()
  },
  ElMessageBox: {
    confirm: vi.fn(() => Promise.resolve())
  }
}))

// Mock API 函数
const mockGet = {
  data: { value: [] },
  error: { value: null }
}
const mockPost = {
  data: { value: [] },
  error: { value: null }
}

// Mock the API response
vi.mock('@/packs/useFetchApi', () => ({
  default: (url) => {
    return {
      get: () => ({
        json: () => {
          return mockGet
        }
      }),
      post: () => ({
        json: () => {
          return mockPost
        }
      })
    };
  }
}));

describe('SshKeySettings.vue', () => {
  const mockProps = {
    name: 'test-user'
  }

  const createWrapper = () => {
    return mount(SshKeySettings, {
      props: mockProps,
      global: {
        mocks: {
          $t: (key) => key // 简化i18n
        }
      },
      attachTo: document.body
    })
  }

  // beforeEach(() => {
  //   vi.clearAllMocks()
  //   mockGet.mockResolvedValue({ data: { value: [] }, error: { value: null } })
  //   mockPost.mockResolvedValue({ error: { value: null } })
  // })

  // 1. 基础渲染测试
  it('正确渲染初始状态', async () => {
    const wrapper = createWrapper()
    await nextTick()

    expect(wrapper.find('.page-responsive-width').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'Menu' }).exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('SSH Keys')
  })

  // 2. 空状态测试
  it('显示无SSH Key时的提示', async () => {
    // mockGet.mockResolvedValue({ data: { value: [] }, error: { value: null } })
    const wrapper = createWrapper()
    await nextTick()

    expect(wrapper.find('.bg-brand-25').exists()).toBe(true)
    expect(wrapper.find('.bg-brand-25').text()).toContain('noKeyTips')
  })

  // 3. 对话框测试
  it('点击添加按钮显示对话框', async () => {
    const wrapper = createWrapper()
    await wrapper.find('.btn-primary').trigger('click')

    expect(wrapper.findComponent({ name: 'ElDialog' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ElForm' }).exists()).toBe(true)
  })

  // 4. 表单验证测试
  // it('验证SSH Key格式', async () => {
  //   const wrapper = createWrapper()
  //   await wrapper.find('.btn-primary').trigger('click')

  //   const textarea = wrapper.find('textarea')
  //   await textarea.setValue('invalid-ssh-key')
  //   await wrapper.find('.btn-primary').trigger('click')

  //   expect(ElMessage.warning).toHaveBeenCalled()
  // })

  // 5. 提交测试
  it('成功提交SSH Key', async () => {
    const wrapper = createWrapper()

    // 1. 先点击主界面的"Add SSH Key"按钮打开对话框
    await wrapper.find('.btn-primary').trigger('click') // 打开对话框的按钮
    await nextTick() // 等待对话框渲染完成

    // 2. 现在可以操作对话框内的元素
    const dialog = wrapper.findComponent({ name: 'ElDialog' })
    expect(dialog.exists()).toBe(true) // 确认对话框已显示

    // 3. 填写表单
    await wrapper.find('input[type="text"]').setValue('test-key')
    await wrapper.find('textarea').setValue('ssh-rsa valid-key')

    // 4. 点击对话框内的提交按钮
    const submitBtn = wrapper.findComponent("#add-ssh-key-button")
    // await submitBtn.trigger('click')
    await submitBtn.vm.$emit('click') // 触发提交按钮的点击事件
    await nextTick() // 等待事件处理

    // 5. 验证
    await waitFor(() => {
      expect(ElMessage.success).toHaveBeenCalled()
    })
  })


  // 6. 自动填充测试
  it('自动从SSH Key提取名称', async () => {
    const wrapper = createWrapper()
    await wrapper.find('.btn-primary').trigger('click')

    const textarea = wrapper.find('textarea')
    await textarea.setValue('ssh-rsa key-content user@hostname')

    expect(wrapper.find('input[type="text"]').element.value).toBe('user@hostname')
  })
})
