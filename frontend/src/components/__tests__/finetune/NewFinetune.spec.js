import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NewFinetune from '@/components/finetune/NewFinetune.vue'

vi.mock('vue3-lottie', () => ({
  Vue3Lottie: {
    name: 'Vue3Lottie',
    template: '<div class="mock-lottie"></div>'
  }
}))

vi.mock('@/packs/useFetchApi', () => ({
  default: (url) => {
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
                    id: 1
                  },
                  {
                    name: 'Resource 2',
                    is_available: false,
                    resources: 'res2',
                    id: 2
                  }
                ]
              }
            },
            error: { value: null }
          })
        }
        if (url.includes('/runtime_framework_v2')) {
          return Promise.resolve({
            value: {
              data: {
                data: [
                  {
                    frame_name: 'tgi',
                    compute_types: ['gpu'],
                    versions: [
                      {
                        id: 75,
                        frame_name: 'tgi',
                        driver_version: '12.4'
                      }
                    ]
                  }
                ]
              },
              error: null
            }
          })
        }
      },
      post: () => ({
        json: () => {
          if (url.includes('finetune?current_user')) {
            return Promise.resolve({
              error: { value: null },
              data: {
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
      })
    }
  }
}))

vi.mock('@/components/shared/deploy_instance/fetchResourceInCategory', () => ({
  fetchResourcesInCategory: vi.fn(() => {
    return Promise.resolve([
      {
        label: 'Others',
        options: [
          {
            name: 'Resource 1',
            label: 'Resource 1',
            is_available: true,
            resources: 'res1',
            order_detail_id: 1,
            type: 'cpu',
            id: 1
          }
        ]
      }
    ])
  })
}))

const createWrapper = (props = {}) => {
  return mount(NewFinetune, {
    props: {
      namespace: 'test-namespace',
      ...props
    }
  })
}

window.location.search = '?namespace=test-namespace&model_id=123'

describe('NewFinetune', () => {
  it('mounts correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })
})
