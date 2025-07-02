import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import waitFor from 'wait-for-expect'
import NewApplicationSpace from '@/components/application_spaces/NewApplicationSpace.vue'

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
  [`/space_resources?cluster_id=1&deploy_type=0`]: createResponse([
    { id: 1, name: 'testcloud', is_available: true }
  ]),
  '/space_templates/docker': createResponse([
    {
        "id": 1,
        "type": "docker",
        "name": "ChatUI",
        "show_name": "ChatUI",
        "enable": true,
        "path": "model_chatui",
        "dev_mode": false,
        "port": 8080,
        "secrets": "",
        "variables": "[{ \"name\": \"MODEL_NAME\", \"value\": \"Qwen/Qwen2-0.5B-Instruct\", \"type\": \"string\", \"description\": \"model id to be used on csghub\" }]",
        "description": "A web-based chat UI that supports model.",
        "created_at": "2025-02-22T09:53:27.656306Z",
        "updated_at": "2025-02-22T09:53:27.656306Z"
    }
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
    it('mounts correctly', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.dataForm.space_cluster).toEqual('1')
      // need to wait because cloud_resource update is happening in nested async call
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.dataForm.cloud_resource).toEqual(1)
    })
  })

  describe('form validation', async () => {
    it('validates required fields', async () => {
      const wrapper = createWrapper()
      await triggerFormButton(wrapper)
      await waitFor(() => {
        const formErrors = wrapper.findAll('.el-form-item__error')
        expect(formErrors.length).toBeGreaterThan(0)
      })
    })

    it('validates space name length', async () => {
      const wrapper = createWrapper()
      wrapper.vm.dataForm.name = 'a' // Invalid length
      await triggerFormButton(wrapper)
      await waitFor(() => {
        expect(wrapper.find('.el-form-item__error').text()).toEqual('The length is within the range of 2 to 64 characters')
      })

      wrapper.vm.dataForm.name = 'valid-space' // Valid length
      await triggerFormButton(wrapper)
      await waitFor(() => {
        expect(wrapper.find('.el-form-item__error').exists()).toBe(false)
      })
    })

    it('validates owner selection', async () => {
      const wrapper = createWrapper()
      wrapper.vm.dataForm.owner = '' // Invalid owner
      await triggerFormButton(wrapper)
      await waitFor(() => {
        expect(wrapper.find('.el-form-item__error').text()).toEqual('Please select Owner')
      })
    })
  })

  describe('when select docker sdk', async () => {
    it('fetchs the docker templates', async () => {
      const wrapper = createWrapper()
      const dockerRadio = wrapper.find('#sdk-docker')
      await dockerRadio.trigger('click')
      await waitFor(() => {
        expect(wrapper.vm.dockerTemplates[0].name).toEqual('ChatUI')
      })
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
      await waitFor(() => {
        expect(window.location.href).toBe('/spaces/testuser/testspace')
      })
    })
  })
})
