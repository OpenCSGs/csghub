import { mount } from '@vue/test-utils'
import ProfileSettings from '@/components/user_settings/ProfileSettings.vue'
import Menu from '@/components/user_settings/Menu.vue'
import ProfileEdit from '@/components/user_settings/ProfileEdit.vue'

describe('ProfileSettings.vue', () => {
  // 创建测试包装器
  const createWrapper = () => {
    return mount(ProfileSettings, {
      global: {
        components: {
          Menu,
          ProfileEdit
        }
      }
    })
  }

  // 测试1：验证基础渲染
  it('正确渲染容器和子组件', () => {
    const wrapper = createWrapper()

    // 验证容器元素
    const container = wrapper.find('.page-responsive-width')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('bg-white')

    // 验证子组件存在
    expect(wrapper.findComponent(Menu).exists()).toBe(true)
    expect(wrapper.findComponent(ProfileEdit).exists()).toBe(true)
  })

  // 测试2：验证布局类名
  it('正确应用响应式布局类', () => {
    const wrapper = createWrapper()
    const container = wrapper.find('div')

    // 验证响应式类
    expect(container.classes()).toContain('md:flex-col')
    expect(container.classes()).toContain('justify-center')
  })

  // 测试3：验证props传递
  it('正确传递hasSave到Menu组件', () => {
    const wrapper = createWrapper()
    const menu = wrapper.findComponent(Menu)

    // 验证初始值传递
    expect(menu.props('hasSave')).toBe(true)

    // 验证class传递
    expect(menu.vm.$attrs.class).toContain('max-w-[411px]')
  })

  // 测试4：验证事件处理
  it('正确响应update-has-save事件', async () => {
    const wrapper = createWrapper()
    const profileEdit = wrapper.findComponent(ProfileEdit)

    // 模拟事件触发
    await profileEdit.vm.$emit('update-has-save', false)

    // 验证状态更新
    expect(wrapper.findComponent(Menu).props('hasSave')).toBe(false)
  })

  // 测试5：验证子组件class传递
  it('正确传递class到ProfileEdit组件', () => {
    const wrapper = createWrapper()
    const profileEdit = wrapper.findComponent(ProfileEdit)

    // 验证grow类传递
    expect(profileEdit.classes()).toContain('grow')
  })
})