import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import Profile from '../user_settings/Profile.vue'; 
import ElementPlus from 'element-plus';

describe('Profile.vue Implementation Test', () => {
  it('renders props when passed', () => {
    const name = 'John Doe';
    const phone = '1234567890';
    const avatar = 'path/to/avatar.jpg';
    const email = 'john.doe@example.com';
    const lastLoginTime = 'Sat, 07 Oct 2023 13:42:22.000000000 CST +08:00';
    const loginIdentity = 'User';
    const roles = '["role1", "role2"]';

    const wrapper = shallowMount(Profile, {
      global: {
        plugins: [ElementPlus]
      },
      props: {
        name,
        phone,
        avatar,
        email,
        lastLoginTime,
        loginIdentity,
        roles,
      },
    });
    
    expect(wrapper.html()).toContain(name);
    expect(wrapper.html()).toContain(loginIdentity);
    expect(wrapper.html()).toContain(phone);
    expect(wrapper.html()).toContain(email);
    expect(wrapper.html()).toContain('role1, role2');
    expect(wrapper.html()).toContain(lastLoginTime.slice(0, -6));});

  it('parses roles JSON correctly', () => {
    const roles = '["role1", "role2"]';
    const wrapper = shallowMount(Profile, {
      propsData: {
        roles,
      },
    });

    expect(wrapper.vm.userRoles).toEqual(['role1', 'role2']);
  });
});