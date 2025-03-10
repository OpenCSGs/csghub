import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Profile from '../../user_settings/Profile.vue'
import { reactive } from 'vue'

const mockLocation = {
  href: 'http://localhost:3000/profile/current_user',
  search: ''
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

const createUserStore = (overrides = {}) =>
  reactive({
    uuid: 'current_user',
    username: 'current_user',
    nickname: 'current_user',
    email: 'current_user@test.com',
    avatar: 'current_user.com',
    roles: ['admin'],
    initialized: true,
    orgs: [
      {
        path: 'org_one',
        logo: 'org_one.png'
      }
    ],
    lastLoginTime: '2023-09-11',
    phone: '123456',
    ...overrides
  })

const getApiMockFn = vi.fn().mockResolvedValue({
  data: {
    value: {
      data: {
        id: 16,
        username: 'testuser',
        nickname: 'TestUser',
        phone: '123456',
        email: 'testuser@gmail.com',
        uuid: 'ddfbb27b',
        avatar: 'https://example.com/avatar.jpg',
        bio: 'my bio',
        homepage: 'mm.com',
        roles: ['admin', 'super_user'],
        orgs: [
          {
            path: 'power',
            name: '联合力量',
            homepage: 'https://baidu.com',
            logo: 'https://example.com/logo.jpg',
            org_type: '社区组织',
            verified: false,
            user_id: 16
          }
        ]
      }
    }
  },
  error: { value: null }
})

vi.mock('../../../packs/useFetchApi', () => ({
  default: () => ({
    json: getApiMockFn
  })
}))

describe('Profile', () => {
  let wrapper
  let originalLocalStorage

  beforeEach(() => {
    originalLocalStorage = { ...localStorage }
    localStorage.clear()
    vi.clearAllMocks()

    vi.mock('../../../stores/UserStore', () => ({
      default: () => createUserStore()
    }))
  })

  afterEach(() => {
    localStorage.clear()
    Object.entries(originalLocalStorage).forEach(([key, value]) => {
      localStorage.setItem(key, value)
    })

    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('logged in', () => {
    describe('is current user', () => {
      it('should not call profile API', async () => {
        window.location.href = 'http://localhost:3000/profile/current_user'

        vi.doMock('../../../stores/UserStore', () => ({
          default: () =>
            createUserStore({
              username: 'current_user',
              uuid: 'current_user'
            })
        }))

        wrapper = mount(Profile, { props: { name: 'current_user' } })
        await wrapper.vm.$nextTick()

        expect(getApiMockFn).not.toHaveBeenCalled()
      })
    })

    describe('is not current user', () => {
      it('should call profile API', async () => {
        window.location.href = 'http://localhost:3000/profile/other_user'

        vi.doMock('../../../stores/UserStore', () => ({
          default: () =>
            createUserStore({
              username: 'current_user',
              uuid: 'current_user'
            })
        }))

        wrapper = mount(Profile, { props: { name: 'other_user' } })
        await wrapper.vm.$nextTick()

        expect(getApiMockFn).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('not logged in', () => {
    beforeEach(() => {
      vi.doMock('../../../stores/UserStore', () => ({
        default: () =>
          createUserStore({
            uuid: '',
            username: '',
            initialized: true
          })
      }))
    })

    it('should call profile API', async () => {
      wrapper = mount(Profile, { props: { name: 'testuser' } })
      await wrapper.vm.$nextTick()

      expect(getApiMockFn).toHaveBeenCalledTimes(1)
    })

    it('should not be current user', async () => {
      wrapper = mount(Profile, { props: { name: 'testuser' } })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isCurrentUser).toBe(false)
    })
  })
})
