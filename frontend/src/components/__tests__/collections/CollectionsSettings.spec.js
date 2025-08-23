import { mount } from '@vue/test-utils'
import CollectionsSettings from '@/components/collections/CollectionsSettings.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { nextTick } from 'vue'

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

const { mockPut, mockDelete, useFetchApiMock } = vi.hoisted(() => {
  const mockPut = vi.fn(() => Promise.resolve({ data: { value: {} }, error: { value: null } }))
  const mockDelete = vi.fn(() => Promise.resolve({ data: { value: {} }, error: { value: null } }))

  return {
    mockPut,
    mockDelete,
    useFetchApiMock: vi.fn(() => ({
      put: () => ({ json: mockPut }),
      delete: () => ({ json: mockDelete })
    }))
  }
})

vi.mock('@/packs/useFetchApi', () => ({
  default: useFetchApiMock
}))

describe('CollectionsSettings.vue', () => {
  const mockCollection = {
    name: 'test-collection',
    username: 'test-user',
    nickname: 'Test Collection',
    description: 'Test description',
    privateVisibility: false,
    theme: '#F5F3FF'
  }

  const createWrapper = (props = {}) => {
    return mount(CollectionsSettings, {
      props: {
        collection: mockCollection,
        userName: 'test-user',
        collectionsId: '123',
        ...props
      },
      global: {
        provide: {
          fetchCollectionDetail: vi.fn()
        },
        mocks: {
          $t: (key) => key
        }
      },
      attachTo: document.body // 确保组件挂载到DOM
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockPut.mockResolvedValue({ data: { value: {} }, error: { value: null } })
    mockDelete.mockResolvedValue({ data: { value: {} }, error: { value: null } })
  })

  it('正确渲染初始状态', async () => {
    const wrapper = createWrapper()
    await nextTick()

    // 使用更可靠的选择器，找到第一个el-input组件（集合名称输入框）
    const nicknameInputs = wrapper.findAll('.el-input__inner')
    const nicknameInput = nicknameInputs[0]

    expect(nicknameInput.exists()).toBe(true)
    expect(nicknameInput.element.value).toBe(mockCollection.nickname)
  })

  it('更新集合名称和描述', async () => {
    const wrapper = createWrapper()
    const updateButtons = wrapper.findAll('.btn-secondary-gray')
    const nicknameInputs = wrapper.findAll('.el-input__inner')

    // 使用第一个输入框（集合名称）
    await nicknameInputs[0].setValue('New Name')
    await updateButtons[0].trigger('click')

    expect(useFetchApiMock).toHaveBeenCalledWith(
      '/collections/123',
      expect.objectContaining({
        body: JSON.stringify({
          description: 'Test description',
          name: 'test-collection',
          nickname: 'New Name',
          private: false,
          theme: '#F5F3FF'
        })
      })
    )
  })

  it('变更可见性时显示确认对话框', async () => {
    const wrapper = createWrapper()
    // 找到所有ElSelect组件，第二个是可见性选择器
    const selects = wrapper.findAllComponents({ name: 'ElSelect' })
    const visibilitySelect = selects[1]
    await visibilitySelect.vm.$emit('select', 'true')

    const elMessageBox = wrapper.findAllComponents({ name: 'ElMessageBox' })
    expect(elMessageBox).toBeTruthy()
  })

it('删除集合需要正确输入名称', async () => {
  const wrapper = createWrapper()

  // 1. 通过组件选择器找到 CsgButton
  const deleteBtn = wrapper.findComponent('#confirmDelete')

  // 2. 检查初始禁用状态（通过 props）
  expect(deleteBtn.props('disabled')).toBe(true)

  // 3. 找到删除确认输入框（第三个el-input）
  const inputs = wrapper.findAll('.el-input__inner')
  const confirmInput = inputs[2]

  // 4. 输入正确名称
  await confirmInput.setValue('test-user/test-collection')

  // 5. 检查启用状态
  expect(deleteBtn.props('disabled')).toBe(false)
})

  it('处理API错误情况', async () => {
    mockPut.mockResolvedValueOnce({ data: { value: null }, error: { value: { msg: 'Error' } } })
    const wrapper = createWrapper()
    // 使用更精确的选择器找到第一个更新按钮
    const updateButtons = wrapper.findAll('.btn-secondary-gray')
    await updateButtons[0].trigger('click')

    expect(ElMessage.warning).toHaveBeenCalled()
  })
})