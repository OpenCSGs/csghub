import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  afterEach,
  afterAll
} from 'vitest'
import { mount } from '@vue/test-utils'
import Profile from '../../user_settings/Profile.vue'
import { useCookies } from 'vue3-cookies'

// Mock vue3-cookies
let mockCookieGetFn = vi.fn()

mockCookieGetFn.mockImplementation(
  () => ({ cookies: {
    get: (key) => '123'
  }})
)

vi.mock('vue3-cookies', () => ({
  useCookies: mockCookieGetFn
  // useCookies: () => ({ cookies: {
  //   get: (key) => '123'
  // }})
}))

let userStoreData = {
  username: 'current_user',
  nickname: 'current_user',
  email: 'current_user@test.com',
  avatar: 'current_user.com',
  roles: ['admin'],
  orgs: [
    {
      path: 'org_one',
      logo: 'org_one.png'
    }
  ],
  lastLoginTime: '2023-09-11',
  phone: '123456'
}
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
    wrapper = mount(Profile, {
      props: {
        name: 'test_name'
      }
    })
  })

  describe("mount", () => {
    it("mounts correctly", () => {
      expect(wrapper.exists()).toBe(true);
    })
  })
})
