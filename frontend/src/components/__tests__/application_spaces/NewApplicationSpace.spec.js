import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NewApplicationSpace from '@/components/application_spaces/NewApplicationSpace.vue'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const createWrapper = (props) => {
  return mount(NewApplicationSpace, {
    global: {
      provide: {
        nameRule: /^[a-zA-Z][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/
      }
    },
    props: {
      licenses: [['MIT', 'Apache-2.0']],
      ...props
    }
  })
}

const triggerFormButton = async (wrapper) => {
  const button = wrapper.findComponent({ name: 'CsgButton' })
  await button.trigger('click')
  await delay(300)
  await wrapper.vm.$nextTick()
}

vi.mock('../../../stores/UserStore', () => ({
  default: () => ({
    username: 'testuser',
    orgs: [{ path: 'testorg' }]
  })
}))

const createResponse = (data, errorMsg = null) => ({
  data: { value: { data } },
  error: { value: errorMsg ? { msg: errorMsg } : null }
})

const mockApiResponses = {
  '/cluster': createResponse([{ cluster_id: '1', region: 'region1' }]),
  [`/space_resources?cluster_id=1`]: createResponse([
    { id: 1, name: 'testcloud', is_available: true }
  ])
}

vi.mock('../../../packs/useFetchApi', () => ({
  default: (url) => ({
    json: () => Promise.resolve(mockApiResponses[url] || createResponse([])),
    post: () => ({
      json: () =>
        Promise.resolve(createResponse({ path: 'testuser/testspace' }))
    })
  })
}))

describe('NewApplicationSpace', () => {
  describe('mount', async () => {
    it('mounts correctly', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('form validation', async () => {
    it('validates required fields', async () => {
      const wrapper = createWrapper()
      await triggerFormButton(wrapper)
      const formErrors = wrapper.findAll('.el-form-item__error')
      expect(formErrors.length).toBeGreaterThan(0)
    })

    it('validates space name length', async () => {
      const wrapper = createWrapper()
      wrapper.vm.dataForm.name = 'a' // Invalid length
      await triggerFormButton(wrapper)
      expect(wrapper.find('.el-form-item__error').exists()).toBe(true)

      wrapper.vm.dataForm.name = 'valid-space' // Valid length
      await triggerFormButton(wrapper)
      expect(wrapper.find('.el-form-item__error').exists()).toBe(false)
    })

    it('validates owner selection', async () => {
      const wrapper = createWrapper()
      wrapper.vm.dataForm.owner = '' // Invalid owner
      await triggerFormButton(wrapper)
      expect(wrapper.find('.el-form-item__error').exists()).toBe(true)
    })
  })

  describe('form submission', async () => {
    it('submits form with valid data', async () => {
      const wrapper = createWrapper()

      wrapper.vm.dataForm = {
        name: 'testspace',
        nickname: 'Test Space',
        license: 'MIT',
        desc: 'Test description',
        space_cluster: '1',
        cloud_resource: '1',
        namespace: 'testuser'
      }

      await triggerFormButton(wrapper)
      await new Promise((resolve) => setTimeout(resolve, 300))
      expect(window.location.href).toBe('/spaces/testuser/testspace')
    })
  })
})
