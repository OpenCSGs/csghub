import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  afterEach,
} from 'vitest'
import { mount } from '@vue/test-utils'
import Profile from '../../user_settings/Profile.vue'
import { reactive } from 'vue'

// Mock vue3-cookies
// let mockCookieGetFn = vi.fn()
let { mockCookieGetFn } = vi.hoisted(() => {
  return { mockCookieGetFn: vi.fn() }
})
mockCookieGetFn.mockImplementation(() => ({
  cookies: {
    get: (key) => '123'
  }
}))
vi.mock('vue3-cookies', () => ({
  useCookies: mockCookieGetFn
}))

// mock, actually redefine window.location
const mockLocation = {
  href: 'http://localhost:3000/profile/current_user',
  search: ''
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
})

let userStoreData = reactive({
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
  phone: '123456'
})
vi.mock('../../../stores/UserStore', () => ({
  default: () => userStoreData
}))

let getApiMockFn = vi.fn().mockImplementation(() =>
  Promise.resolve({
    data: {
      value: {
        data: {
          id: 16,
          username: 'testuser',
          nickname: 'TestUser',
          phone: '123456',
          email: 'testuser@gmail.com',
          uuid: 'ddfbb27b',
          avatar:
            'https://opencsg-public-resource.oss-cn-beijing.aliyuncs.com/comment/21b4d6ca-213e-48fc-9aba-aeed122633ef',
          bio: 'mya ',
          homepage: 'mm.com',
          roles: ['admin', 'super_user'],
          orgs: [
            {
              path: 'power',
              name: '联合力量',
              homepage: 'https://baidu.com',
              logo: 'https://opencsg-test.oss-cn-beijing.aliyuncs.com/org_logo/8d8aa331-54b7-453e-9d0b-d253a706ae27',
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
)
vi.mock('../../../packs/useFetchApi', () => ({
  default: () => ({
    json: getApiMockFn
  })
}))

describe('Profile', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(Profile, {
      props: {
        name: 'test_name'
      }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('mount', () => {
    it('mounts correctly', () => {
      console.log('mount correctly')
      expect(wrapper.exists()).toBe(true)
      expect(getApiMockFn).toHaveBeenCalledTimes(0)
    })
  })

  describe('logged in', () => {
    describe('is current user', () => {
      it('will not fetch user info from api', async () => {
        userStoreData.username = 'test_user'
        await wrapper.vm.$nextTick()
        expect(getApiMockFn).toHaveBeenCalledTimes(0)
      })
    })

    // describe('is not current user', () => {
    //   it('fetch user info from api', async () => {
    //     userStoreData.username = 'not_test_user'
    //     await wrapper.vm.$nextTick()
    //     expect(getApiMockFn).toHaveBeenCalledTimes(1)
    //   })
    // })

  })

  describe('without logged in', () => {
    beforeEach(() => {
      mockCookieGetFn.mockImplementation(() => ({
        cookies: {
          get: (key) => null
        }
      }))
      userStoreData = {}
      wrapper = mount(Profile, {
        props: {
          name: 'test_name'
        }
      })
    })

    it('fetchs user info from api', async () => {
      await wrapper.vm.$nextTick()
      expect(getApiMockFn).toHaveBeenCalledTimes(1)
    })

    it('renders user info from api', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isCurrentUser).toBe(false)
      expect(wrapper.vm.username).toBe('testuser')
    })
  })
})
