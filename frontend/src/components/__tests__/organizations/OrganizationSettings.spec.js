import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import OrganizationSettings from '@/components/organizations/OrganizationSettings.vue'
import OrganizationEdit from '@/components/organizations/OrganizationEdit.vue'
import OrganizationMembers from '@/components/organizations/OrganizationMembers.vue'
import Menu from '@/components/organizations/Menu.vue'

const createWrapper = (props) => {
  return mount(OrganizationSettings, {
    global: {
      provide: {
        verified: false
      }
    },
    props: {
      name: 'testorg',
      action: 'edit',
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
    post: () => ({
      json: () =>
        Promise.resolve({
          data: { value: { msg: 'Success' } },
          error: { value: null }
        })
    }),
    put: () => ({
      json: () =>
        Promise.resolve({
          data: { value: { msg: 'Success' } },
          error: { value: null }
        })
    }),
    delete: () => ({
      json: () =>
        Promise.resolve({
          data: { value: null },
          error: { value: null }
        })
    }),
    get: () => ({
      json: () =>
        Promise.resolve({
          data: {
            value: {
              data: {
                content: btoa('test content'),
                sha: 'test-sha'
              }
            }
          },
          error: { value: null }
        })
    }),
    json: () => {
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
        data: { value: null },
        error: { value: null }
      })
    }
  })
}))

describe('NewOrganization', () => {
  describe('mount', async () => {
    it('mounts correctly', async () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.organization).toEqual(
        expect.objectContaining({
          name: 'testorg',
          nickname: 'testorg',
          homepage: 'https://baiud.com',
          logo: 'https://opencsg-test.oss-cn-beijing.aliyuncs.com/org_logo/072d3ec8-c5c1-4e36-b268-05fd2a6747ee',
          org_type: '社区组织',
          verified: false
        })
      )
      await wrapper.vm.currentUserRole()
      expect(wrapper.vm.role).toBe('admin')
    })
    it('renders Menu component', () => {
      const wrapper = createWrapper()
      const menu = wrapper.findComponent(Menu)
      expect(menu.exists()).toBe(true)
    })
    it('renders OrganizationEdit when action is edit', () => {
      const wrapper = createWrapper()
      expect(wrapper.findComponent(OrganizationEdit).exists()).toBe(true)
    })

    it('does not render OrganizationMembers when action is not members', () => {
      const wrapper = createWrapper()
      expect(wrapper.findComponent(OrganizationMembers).exists()).toBe(false)
    })
  })
})
