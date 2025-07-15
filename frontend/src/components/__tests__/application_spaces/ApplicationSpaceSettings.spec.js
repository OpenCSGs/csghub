import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ApplicationSpaceSettings from '@/components/application_spaces/ApplicationSpaceSettings.vue'
import { ElMessage } from 'element-plus'

vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    warning: vi.fn()
  }
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

const mockFetchRepoDetail = vi.fn()

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
      mocks: {
        $t: (key) => key
      },
      provide: {
        fetchRepoDetail: mockFetchRepoDetail
      }
    }
  })
}

describe('ApplicationSpaceSettings', () => {
  let wrapper

  beforeEach(() => {
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
    await wrapper.setData({ theApplicationSpaceNickname: 'New Name' })
    await wrapper.find('[data-test="update-nickname"]').trigger('click')
    expect(ElMessage.success).toHaveBeenCalledWith('Success')
  })

  it('update application space description when button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ theApplicationSpaceDesc: 'New Description' })
    await wrapper.find('[data-test="update-description"]').trigger('click')
    expect(ElMessage.success).toHaveBeenCalledWith('Success')
  })
})
