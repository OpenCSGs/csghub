import { mount } from '@vue/test-utils'
import EndpointPage from '@/components/endpoints/EndpointPage.vue'
import EndpointPlayground from '@/components/endpoints/EndpointPlayground.vue'

vi.mock('@/packs/useFetchApi', () => ({
  default: (url) => {
    return {
      json: () => {
        if (url.includes('/space_resources')) {
          return Promise.resolve({
            data: {
              value: {
                data: [
                  { name: 'Resource 1', is_available: true, resources: 'res1', id: 1 },
                  { name: 'Resource 2', is_available: false, resources: 'res2', id: 2 }
                ]
              }
            },
            error: { value: null }
          })
        }
      },
      post: () => ({
        json: () => {
          if (url.includes('finetune?current_user')) {
            return Promise.resolve({
              error: { value: null }, data: {
                deploy_id: 123
              }
            })
          }
          return Promise.resolve({ error: { value: null } })
        }
      }),
      put: () => ({
        json: () => Promise.resolve({ error: { value: null } })
      }),
      delete: () => ({
        json: () => Promise.resolve({ error: { value: null } })
      }),
    };
  }
}));
vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessage: vi.fn()
  }
})

describe('EndpointPage.vue', () => {
  let wrapper
  const propsData = {
    appEndpoint: 'http://mockEndpoint',
    appStatus: 'Running',
    clusterId: 'mockClusterId',
    sku: 'mockSku',
    modelId: 'mockModelId',
    private: 'true',
    replicaList: [
      { name: 'Replica1', status: 'Running' },
      { name: 'Replica2', status: 'Stopped' }
    ],
    endpointReplica: 2
  }

  beforeEach(() => {
    wrapper = mount(EndpointPage, {
      props: propsData,
      global: {
        components: {
          EndpointPlayground
        }
      }
    })
  })

  it('renders EndpointPlayground when appStatus is Running and appEndpoint is provided', () => {
    expect(wrapper.findComponent(EndpointPlayground).exists()).toBe(true)
  })

  it('does not render EndpointPlayground when appStatus is not Running', async () => {
    await wrapper.setProps({ appStatus: 'Stopped' })
    expect(wrapper.findComponent(EndpointPlayground).exists()).toBe(false)
  })

  it('does not render EndpointPlayground when appEndpoint is not provided', async () => {
    await wrapper.setProps({ appEndpoint: '' })
    expect(wrapper.findComponent(EndpointPlayground).exists()).toBe(false)
  })
})