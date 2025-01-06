import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NewOrganization from '@/components/organizations/NewOrganization.vue'

const createWrapper = (props) => {
  return mount(NewOrganization, {
    global: {
      provide: {
        nameRule: /^[a-zA-Z][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/
      }
    },
    props: {
      ...props
    }
  })
}

const triggerFormButton = (wrapper) => {
  const button = wrapper.findComponent({ name: 'CsgButton' })
  button.trigger('click')
  // here in the true component button click will trigger an async request and will take some time
  // but the test code will not wait for the async function end and will go to next step to do the check
  // if we do not wait some time here, the test will failed
  return new Promise((resolve) => { setTimeout(resolve, 1000) })
}

vi.mock('../../../stores/UserStore', () => ({
  default: () => ({
    username: 'testuser',
    orgs: [{ path: 'testorg' }]
  })
}))

vi.mock('@/packs/useFetchApi', () => ({
  default: () => ({
    post: () => ({
      json: () =>
        Promise.resolve({
          data: { value: { data: { name: 'testorg' } } },
          error: { value: null }
        })
    })
  })
}))

describe('NewOrganization', () => {
  describe('mount', async () => {
    it('mounts correctly', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('form validation', () => {
    it('validates required fields', async () => {
      const wrapper = createWrapper()
      await triggerFormButton(wrapper)
      const formErrors = wrapper.findAll('.el-form-item__error')
      expect(formErrors.length).toBeGreaterThan(0)
    })
  })

  describe('form submission', () => {
    it('shows success message on successful submission', async () => {
      const wrapper = createWrapper()
      wrapper.vm.dataForm = {
        homepage:'https://test.com"',
        logo:'https://opencsg-test.oss-cn-beijing.aliyuncs.com/org_logo/d85a3db4-dd51-47a7-919c-2308c7ff4b6b',
        owner: 'testuser',
        name: 'testorg',
        nickname: 'valid-org',
        org_type: '企业',
      }
      await wrapper.vm.$nextTick()
      await triggerFormButton(wrapper)
      expect(window.location.href).toBe('/organizations/testorg')
    })
  })
})
