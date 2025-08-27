import { mount } from '@vue/test-utils'
import CollectionsRepoCard from '@/components/collections/CollectionsRepoCard.vue'
import { nextTick } from 'vue'

// ---------------- Mock ----------------
// 模拟 Element Plus 组件
vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElInput: () => null // 模拟 ElInput 组件
  }
})

describe('CollectionsRepoCard.vue', () => {
  let wrapper

  // 创建组件包装器的工厂函数
  const createWrapper = (props = {}) =>
    mount(CollectionsRepoCard, {
      props: {
        repo: {
          id: 1,
          name: 'test-repo',
          repository_type: 'model',
          remark: '', // 默认无备注
          ...props.repo
        },
        canManage: true, // 默认可管理
        ...props
      },
      global: {
        mocks: {
          $t: (key) => key // 简化i18n
        },
        stubs: ['SvgIcon', 'CsgButton', 'ElInput'] // 存根子组件和 Element Plus 组件
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 1. 渲染测试：无备注且可管理时
  it('当无备注且可管理时，显示添加备注图标', async () => {
    wrapper = createWrapper({ repo: { remark: '' }, canManage: true })
    await nextTick()

    // 验证 SvgIcon 的 name 属性为 'plus-square'
    const svgIcon = wrapper.findComponent({ name: 'SvgIcon' })
    expect(svgIcon.exists()).toBe(true)
    expect(svgIcon.props('name')).toBe('plus-square')
    expect(wrapper.find('.text-sm.text-gray-600').exists()).toBe(false) // 不显示备注内容
  })

  // 2. 渲染测试：有备注且可管理时
  it('当有备注且可管理时，显示编辑备注图标和备注内容', async () => {
    wrapper = createWrapper({ repo: { remark: '这是一个测试备注' }, canManage: true })
    await nextTick()

    // 验证 SvgIcon 的 name 属性为 'edit-2'
    const svgIcon = wrapper.findComponent({ name: 'SvgIcon' })
    expect(svgIcon.exists()).toBe(true)
    expect(svgIcon.props('name')).toBe('edit-2')

    // 验证备注内容是否显示
    const remarkDisplay = wrapper.find('.text-sm.text-gray-600')
    expect(remarkDisplay.exists()).toBe(true)
    expect(remarkDisplay.text()).toContain('collections.remarkTitle： 这是一个测试备注')
  })

  // 3. 渲染测试：不可管理时
  it('当不可管理时，不显示编辑/添加备注图标和删除图标', async () => {
    wrapper = createWrapper({ canManage: false })
    await nextTick()

    // 验证 SvgIcon 不存在
    expect(wrapper.findComponent({ name: 'SvgIcon' }).exists()).toBe(false)
  })

  // 4. 交互测试：点击添加备注图标
  it('点击添加备注图标，显示 ElInput 和保存/取消按钮', async () => {
    wrapper = createWrapper({ repo: { remark: '' }, canManage: true })
    await nextTick()

    // 初始状态下 ElInput 不可见
    expect(wrapper.findComponent({ name: 'ElInput' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'CsgButton', props: { name: 'all.save' } }).exists()).toBe(false)

    // 点击 SvgIcon
    await wrapper.findComponent({ name: 'SvgIcon' }).trigger('click')
    await nextTick()

    // 验证 ElInput 和按钮是否可见
    expect(wrapper.findComponent({ name: 'ElInput' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'CsgButton', props: { name: 'all.save' } }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'CsgButton', props: { name: 'all.cancel' } }).exists()).toBe(true)
    expect(wrapper.vm.showRemarkInput).toBe(true)
    expect(wrapper.vm.tempRemark).toBe('') // 初始为空
  })

  // 5. 交互测试：点击编辑备注图标
  it('点击编辑备注图标，显示 ElInput 并填充现有备注', async () => {
    wrapper = createWrapper({ repo: { remark: '现有备注' }, canManage: true })
    await nextTick()

    // 点击 SvgIcon
    await wrapper.findComponent({ name: 'SvgIcon' }).trigger('click')
    await nextTick()

    // 验证 ElInput 是否可见，并且 tempRemark 填充了现有备注
    expect(wrapper.findComponent({ name: 'ElInput' }).exists()).toBe(true)
    expect(wrapper.vm.showRemarkInput).toBe(true)
    expect(wrapper.vm.tempRemark).toBe('现有备注')
  })

  // 6. 交互测试：保存备注
  it('输入备注并点击保存，触发 update:remark 事件并隐藏输入框', async () => {
    wrapper = createWrapper({ repo: { id: 100, remark: '' }, canManage: true })
    await nextTick()

    await wrapper.findComponent({ name: 'SvgIcon' }).trigger('click') // 显示输入框
    await nextTick()

    // 模拟输入备注
    wrapper.vm.tempRemark = '新的备注内容'
    await nextTick()

    await wrapper.vm.saveRemark()
    await nextTick()

    // 验证 update:remark 事件是否触发，并传递正确参数
    expect(wrapper.emitted('update:remark')).toBeTruthy()
    expect(wrapper.emitted('update:remark')[0][0]).toEqual({
      id: 100,
      remark: '新的备注内容'
    })
    expect(wrapper.vm.showRemarkInput).toBe(false) // 隐藏输入框
  })

  // 7. 交互测试：取消备注
  it('点击取消按钮，隐藏输入框且不触发事件', async () => {
    wrapper = createWrapper({ repo: { id: 100, remark: '旧备注' }, canManage: true })
    await nextTick()

    await wrapper.findComponent({ name: 'SvgIcon' }).trigger('click') // 显示输入框
    await nextTick()

    wrapper.vm.tempRemark = '尝试修改的备注' // 模拟输入
    await nextTick()

    // 点击取消按钮
    await wrapper.findComponent({ name: 'CsgButton', props: { name: 'all.cancel' } }).trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:remark')).toBeFalsy() // 不应触发 update:remark
    expect(wrapper.vm.showRemarkInput).toBe(false) // 隐藏输入框
    expect(wrapper.vm.tempRemark).toBe('尝试修改的备注') // tempRemark 保持不变，但因为输入框隐藏，不影响显示
  })

  // 8. 交互测试：点击删除图标
  it('点击删除图标，触发 remove 事件', async () => {
    wrapper = createWrapper({ repo: { id: 200 }, canManage: true })
    await nextTick()

    // 找到删除图标（第二个 SvgIcon）并点击
    const deleteIcon = wrapper.findAllComponents({ name: 'SvgIcon' })[1]
    expect(deleteIcon.exists()).toBe(true)
    expect(deleteIcon.props('name')).toBe('trash')

    await deleteIcon.trigger('click')
    await nextTick()

    // 验证 remove 事件是否触发，并传递正确参数
    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')[0][0]).toBe(200)
  })
})
