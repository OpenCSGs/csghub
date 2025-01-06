import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import OrganizationDetail from '@/components/organizations/OrganizationDetail.vue'

const createWrapper = (props) => {
  return mount(OrganizationDetail, {
    global: {
      provide: {
        verified: false
      }
    },
    props: {
      name: 'testorg',
      ...props
    }
  })
}

vi.mock('../../../stores/UserStore', () => ({
  default: () => ({
    username: 'testuser',
    orgs: [{ path: 'testorg' }]
  })
}))

vi.mock('@/packs/useFetchApi', () => ({
  default: (url) => ({
    json: () => {
      console.log(url)
      if (url === '/organization/testorg') {
        return Promise.resolve({
          data: {
            value: {
              data: {
                path: 'testorg',
                name: 'testorg',
                homepage: 'https://baiud.com',
                logo: 'https://opencsg-test.oss-cn-beijing.aliyuncs.com/org_logo/072d3ec8-c5c1-4e36-b268-05fd2a6747ee',
                org_type: '社区组织',
                verified: false
              }
            }
          },
          error: { value: null }
        })
      }
      if (url === '/organization/testorg/members') {
        return Promise.resolve({
          data: {
            value: {
              data: {
                data: [
                  {
                    username: 'testuser',
                    nickname: 'testuser',
                    uuid: '75496af6-3004-4e96-ad7e-07ff999b40fc',
                    avatar:
                      'https://opencsg-test.oss-cn-beijing.aliyuncs.com/comment/10fe27da-4ebe-4713-aa7d-2daafdf9851c',
                    role: 'admin',
                    last_login_at: '2024-12-30 02:55:43'
                  }
                ],
                total: 1
              }
            }
          },
          error: { value: null }
        })
      }
      if (url === '/organization/testorg/members/testuser') {
        return Promise.resolve({
          data: {
            value: {
              data: 'admin'
            }
          },
          error: { value: null }
        })
      }
      return Promise.resolve({
        data: { value: { data: null } },
        error: { value: null }
      })
    }
  })
}))

describe('OrganizationDetail', () => {
  describe('mount', () => {
    it('mounts correctly', async () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.organizationData).toEqual(
        expect.objectContaining({
          name: 'testorg',
          nickname: 'testorg',
          verified: false,
          avatar:
            'https://opencsg-test.oss-cn-beijing.aliyuncs.com/org_logo/072d3ec8-c5c1-4e36-b268-05fd2a6747ee'
        })
      )
      expect(wrapper.vm.membersList).toEqual([
        {
          username: 'testuser',
          nickname: 'testuser',
          role: 'admin',
          last_login_at: '2024-12-30 02:55:43',
          uuid: '75496af6-3004-4e96-ad7e-07ff999b40fc',
          avatar:
            'https://opencsg-test.oss-cn-beijing.aliyuncs.com/comment/10fe27da-4ebe-4713-aa7d-2daafdf9851c'
        }
      ])
      await wrapper.vm.currentUserRole()
      expect(wrapper.vm.role).toBe('admin')
    })
  })
})
