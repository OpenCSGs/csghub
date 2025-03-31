import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import NewEndpoint from '@/components/endpoints/NewEndpoint.vue'

vi.mock('vue3-cookies', () => ({
  useCookies: () => ({
    cookies: {
      get: vi.fn().mockReturnValue('mocked-token')
    }
  })
}))

let { mockFetchApi } = vi.hoisted(() => {
  return { mockFetchApi:
    vi.fn((url) => {
      return {
        json: () => {
          if (url.includes('/cluster')) {
            return Promise.resolve({
              data: {
                value: {
                  data: [
                    { cluster_id: 'cluster-1', region: 'region-1' },
                    { cluster_id: 'cluster-2', region: 'region-2' }
                  ]
                }
              },
              error: { value: null }
            })
          }
          if (url.includes('/space_resources')) {
            return Promise.resolve({
              data: {
                value: {
                  data: [
                    {
                      name: 'Resource 1',
                      is_available: true,
                      resources: 'res1',
                      type: 'cpu',
                      id: 1
                    },
                    {
                      name: 'Resource 2',
                      is_available: false,
                      resources: 'res2',
                      type: 'gpu',
                      id: 2
                    }
                  ]
                }
              },
              error: { value: null }
            })
          }
          if (url.includes('/runtime_framework')) {
            return Promise.resolve({
              data: {
                value: {
                  data: [
                    {
                      id: 1,
                      frame_name: 'test-framework',
                      path: 'test-path',
                      frame_cpu_image: 'ktransformers:0.2.1.post1'
                    }
                  ]
                }
              },
              error: { value: null }
            })
          }
          if (url.includes('/quantizations')) {
            return Promise.resolve({
              data: {
                value: {
                  data: [
                    {
                      name: 'tinyllama-1.1b-chat-v1.0.Q2_K.gguf',
                      path: 'q3/tinyllama-1.1b-chat-v1.0.Q2_K.gguf'
                    },
                    {
                      name: 'tinyllama-1.1b-chat-v1.0.Q2_K.gguf',
                      path: 'tinyllama-1.1b-chat-v1.0.Q2_K.gguf'
                    }
                  ]
                }
              },
              error: { value: null }
            })
          }
          if (url.includes('/models')) {
            return Promise.resolve({
              data: [
                { model_id: 'model-1', name: 'Model 1' },
                { model_id: 'model-2', name: 'Model 2' }
              ]
            })
          }
        },
        post: () => ({
          json: () => {
            return Promise.resolve({ error: { value: null } })
          }
        }),
        put: () => ({
          json: () => Promise.resolve({ error: { value: null } })
        }),
        delete: () => ({
          json: () => Promise.resolve({ error: { value: null } })
        })
      }
    })
  }
})

vi.mock('@/packs/useFetchApi', () => ({
  default: mockFetchApi,
}))

vi.mock('element-plus', () => ({
  ElMessage: vi.fn(),
  ElInput: vi.fn()
}))

const createWrapper = (props = {}) => {
  return mount(NewEndpoint, {
    props: {
      ...props
    },
  })
}

describe('NewEndpoint', () => {
  it('mounts correctly', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toBe(true)
  })

  it('fetches clusters/respurces', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.endpointClusters).toEqual([
      { cluster_id: 'cluster-1', region: 'region-1' },
      { cluster_id: 'cluster-2', region: 'region-2' }
    ])
    expect(wrapper.vm.dataForm.endpoint_cluster).toBe('cluster-1')

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.endpointResources).toEqual([
      {
        name: 'Resource 1',
        is_available: true,
        resources: 'res1',
        type: 'cpu',
        id: 1
      },
      {
        name: 'Resource 2',
        is_available: false,
        resources: 'res2',
        type: 'gpu',
        id: 2
      }
    ])
    expect(wrapper.vm.dataForm.cloud_resource).toEqual(1)

    // without model_id will not fetch runtime_framework
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.endpointFrameworks).toEqual([])
  })

  it('fetches runtimeframeworks', async () => {
    const wrapper = createWrapper()
    wrapper.vm.dataForm.model_id = 'model-1'

    // Waiting for all promises and Vue updates at once
    await flushPromises()

    // fetch runtime_framework is nested in fetch source, so we need to await 3 times
    expect(wrapper.vm.endpointFrameworks).toEqual([
      {
        id: 1,
        frame_name: 'test-framework',
        path: 'test-path',
        frame_cpu_image: 'ktransformers:0.2.1.post1'
      }
    ])

    expect(wrapper.vm.dataForm.endpoint_framework).toEqual(1)
  })

  it('fetches quantizations when model_id is present', async () => {
    // Mock window.location
    const mockLocation = {
      href: '',
      search: '?model_id=model-1'
    }
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    })
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.availableQuantizations).toEqual([
      {
        name: 'tinyllama-1.1b-chat-v1.0.Q2_K.gguf',
        path: 'q3/tinyllama-1.1b-chat-v1.0.Q2_K.gguf'
      },
      {
        name: 'tinyllama-1.1b-chat-v1.0.Q2_K.gguf',
        path: 'tinyllama-1.1b-chat-v1.0.Q2_K.gguf'
      }
    ])
  })
})
