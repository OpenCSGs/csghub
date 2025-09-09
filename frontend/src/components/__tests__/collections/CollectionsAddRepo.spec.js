import { mount } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import { ElMessage } from 'element-plus'
import CollectionsAddRepo from '@/components/collections/CollectionsAddRepo.vue'

// ---------------- Mock ----------------

vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessage: vi.fn(),
    ElSelect: (props, { slots }) =>
      h(
        'select',
        {
          onChange: (e) => props['onUpdate:modelValue']?.(e.target.value)
        },
        slots.default ? slots.default() : []
      ),
    ElOption: (props) => h('option', { value: props.value }, props.label),
    ElDialog: (props, { slots }) =>
      props.modelValue ? h('div', {}, slots.default ? slots.default() : []) : null,
    ElInput: (props) =>
      h('textarea', {
        value: props.modelValue,
        onInput: (e) => props['onUpdate:modelValue']?.(e.target.value)
      })
  }
})

// 模拟 useFetchApi
const mockJson = vi.fn()
const mockPost = vi.fn(() => ({ json: mockJson }))
vi.mock('@/packs/useFetchApi', () => ({
  default: vi.fn(() => ({
    post: mockPost,
    json: mockJson
  }))
}))

describe('CollectionsAddRepo.vue', () => {
  let wrapper
  const fetchCollectionDetail = vi.fn()

  const createWrapper = (props = {}) =>
    mount(CollectionsAddRepo, {
      props: {
        collectionsId: '123',
        canManage: true,
        ...props
      },
      global: {
        mocks: {
          $t: (key) => key // 简化i18n
        },
        provide: { fetchCollectionDetail },
        stubs: ['SvgIcon']
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('当 canManage=true 时显示添加按钮', async () => {
    wrapper = createWrapper()
    expect(wrapper.text()).toContain('collections.edit.add')
  })

  it('当 canManage=false 时不显示按钮', async () => {
    wrapper = createWrapper({ canManage: false })
    expect(wrapper.text()).not.toContain('collections.edit.add')
  })

  it('点击添加按钮后显示对话框', async () => {
    wrapper = createWrapper()
    expect(wrapper.find('.invite_dialog').exists()).toBe(false)

    await wrapper.find('.CollectionAddRepo > div').trigger('click')
    await nextTick()

    expect(wrapper.findComponent({ name: 'ElDialog' }).exists()).toBe(true)
  })

  it('切换 type 时清空 repoIdsInput 和 tempRemark', async () => {
    wrapper = createWrapper()
    wrapper.vm.repoIdsInput = 'xxx'
    wrapper.vm.tempRemark = '备注'

    wrapper.vm.typeChange()
    await nextTick()

    expect(wrapper.vm.repoIdsInput).toBe('')
    expect(wrapper.vm.tempRemark).toBe('')
  })

  it('确认添加时如果未选择 repo，则弹出 warning', async () => {
    wrapper = createWrapper()
    wrapper.vm.repoIdsInput = ''
    await wrapper.vm.confirmAddRepo()

    expect(ElMessage).toHaveBeenCalledWith({
      message: 'Please select Project',
      type: 'warning'
    })
  })

  it('确认添加成功后关闭弹窗并提示 success', async () => {
    wrapper = createWrapper()
    wrapper.vm.repoIdsInput = '456'
    wrapper.vm.tempRemark = '测试备注'

    mockJson.mockResolvedValue({
      data: { value: { ok: true } },
      error: { value: null }
    })

    await wrapper.vm.confirmAddRepo()
    await nextTick()

    expect(ElMessage).toHaveBeenCalledWith({
      message: 'Added successfully',
      type: 'success'
    })
    expect(fetchCollectionDetail).toHaveBeenCalled()
    expect(wrapper.vm.dialogVisible).toBe(false)
  })

  it('确认添加失败时提示 warning', async () => {
    wrapper = createWrapper()
    wrapper.vm.repoIdsInput = '456'
    wrapper.vm.tempRemark = '测试备注'

    mockJson.mockResolvedValue({
      data: { value: null },
      error: { value: { msg: '出错了' } }
    })

    await wrapper.vm.confirmAddRepo()
    await nextTick()

   expect(ElMessage).toHaveBeenCalledWith({
    message: '出错了',
    type: 'warning'
  })
  })
})
