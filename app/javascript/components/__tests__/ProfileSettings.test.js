import { shallowMount } from "@vue/test-utils";
import ProfileSettings from "../user_settings/ProfileSettings.vue";

describe('ProfileSettings.vue', () => {
  it('renders menu and profile edit components', () => {
    const wrapper = shallowMount(ProfileSettings, {
      propsData: {
        name: 'John Doe',
        phone: '1234567890',
        avatar: 'avatar.png',
        email: 'john@example.com',
        userName: 'johndoe',
      },
    });

    // 断言 Menu 组件是否被渲染，并传递了正确的 props
    const menuComponent = wrapper.findComponent({ name: 'Menu' });
    expect(menuComponent.exists()).toBe(true);
    expect(menuComponent.props('name')).toBe('John Doe');
    expect(menuComponent.props('avatar')).toBe('avatar.png');

    // 断言 ProfileEdit 组件是否被渲染，并传递了正确的 props
    const profileEditComponent = wrapper.findComponent({ name: 'ProfileEdit' });
    expect(profileEditComponent.exists()).toBe(true);
    expect(profileEditComponent.props('name')).toBe('John Doe');
    expect(profileEditComponent.props('avatar')).toBe('avatar.png');
    expect(profileEditComponent.props('phone')).toBe('1234567890');
    expect(profileEditComponent.props('email')).toBe('john@example.com');
    expect(profileEditComponent.props('userName')).toBe('johndoe');

    // 模拟调用监听事件
    profileEditComponent.vm.$emit('updateUserInfo', { name: 'Jane Smith', avatar: 'new-avatar.png' });
    // 检查组件的 data 是否正确更新
    expect(wrapper.vm.profileName).toBe('Jane Smith');
    expect(wrapper.vm.profileAvatar).toBe('new-avatar.png');
  });
});
