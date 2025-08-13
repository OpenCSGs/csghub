import { describe, it, expect, beforeEach, vi, afterEach, afterAll } from 'vitest'
import { mount } from '@vue/test-utils'
import Menu from '../../user_settings/Menu.vue'

let userStoreData = {
  username: 'test',
  nickname: 'testn',
  email: 'test@test.com',
  avatar: 'test_avatar.com',
  actionLimited: false
}
vi.mock('../../../stores/UserStore', () => ({
  default: () => (userStoreData)
}))

vi.mock('pinia', () => ({
  storeToRefs: (obj) => obj
}))

describe('Menu', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(Menu)
  })

  describe('Initial State', () => {
    it('mounts with correct default props', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.hasSave).toBe(true)
    })
  })

  describe('template render with email', () => {
    it('renders access token navbar', () => {
      const link = wrapper.find('a[href="/settings/access-token"]')
      expect(link.exists()).toBe(true);
    })
    it('renders ssh key navbar', () => {
      const link = wrapper.find('a[href="/settings/ssh-keys"]')
      expect(link.exists()).toBe(true);
    })
  })

  describe('template render with user action limited', () => {
    beforeEach(() => {
      userStoreData = { username: 'test', nickname: 'testn', avatar: 'test_avatar.com', actionLimited: true };
      wrapper = mount(Menu)
    })
    it('renders access token navbar', async () => {
      const link = wrapper.find('a[href="/settings/access-token"]')
      expect(link.exists()).toBe(false);
    })
    it('renders ssh key navbar', () => {
      const link = wrapper.find('a[href="/settings/ssh-keys"]')
      expect(link.exists()).toBe(false);
    })
  })

  describe('click on avatar to jump with saved true', () => {
    it('jumps to user profile', async () => {
      const avatarDiv = wrapper.find('#user_settings_avatar_div')
      await avatarDiv.trigger('click')
      expect(window.location.href).toBe(`/profile/${userStoreData.username}`)
    })
  })

  describe('click on avatar to jump with saved false', () => {
    beforeEach(() => {
      wrapper = mount(Menu, {
        props: {
          hasSave: false
        }
      })
    })

    it('pops up confirm dialog', async () => {
      const avatarDiv = wrapper.find('#user_settings_avatar_div')
      await avatarDiv.trigger('click')
      expect(wrapper.vm.showDialog).toBe(true)
    })

    it('hide dialog after click on cancel', async () => {
      const avatarDiv = wrapper.find('#user_settings_avatar_div')
      await avatarDiv.trigger('click')
      const cancelBtn = wrapper.find('#user_settings_dialog_cancel')
      await cancelBtn.trigger('click')
      expect(wrapper.vm.showDialog).toBe(false)
    })

    it('jumps to user profile after click on confirm', async () => {
      const avatarDiv = wrapper.find('#user_settings_avatar_div')
      await avatarDiv.trigger('click')
      const confirmBtn = wrapper.find('#user_settings_dialog_confirm')
      await confirmBtn.trigger('click')
      expect(window.location.href).toBe(`/profile/${userStoreData.username}`)
    })
  })
})