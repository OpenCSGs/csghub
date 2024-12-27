import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ApplicationSpaceSettings from '@/components/application_spaces/ApplicationSpaceSettings.vue'
import { createPinia, setActivePinia } from 'pinia'
import { ElMessage } from 'element-plus'

vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
}))

vi.mock('../../../packs/useFetchApi', () => ({
  default: () => ({
    post: () => ({
      json: () =>
        Promise.resolve({
          response: { ok: true },
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
          data: { value: { msg: 'Success' } },
          error: { value: null }
        })
    }),
    json: () => {
      return Promise.resolve({
        data: { value: { id: 1, name: 'testcloud', is_available: true } },
        error: { value: null }
      })
    }
  })
}))

const createWrapper = (props = {}) => {
  return mount(ApplicationSpaceSettings, {
    props: {
      path: 'test/application_space',
      applicationSpaceNickname: 'Test Application Space',
      applicationSpaceDesc: 'Test Description',
      default_branch: 'main',
      appStatus: 'Running',
      ...props
    },
    global: {
      plugins: [createPinia()],
      mocks: {
        $t: (key) => key
      }
    }
  })
}

describe('ApplicationSpaceSettings', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = createWrapper()
  })

  it('mounts correctly', () => {
    expect(wrapper.vm).toBeDefined()
  })

  it('displays space path correctly', () => {
    expect(wrapper.find('.bg-gray-50').text()).toBe('test/application_space')
  })

  it('updates application space nickname when button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ applicationSpaceNickname: 'New Name' })
    await wrapper.find('button[data-test="update-nickname"]').trigger('click')
    expect(ElMessage).toHaveBeenCalled()
  })

  it('update application space description when button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ applicationSpaceDesc: 'New Description' })
    await wrapper.find('button[data-test="update-description"]').trigger('click')
    expect(ElMessage).toHaveBeenCalled()
  })
})
