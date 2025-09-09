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
        $t: (key, params) => {
          if (key === 'application_spaces.edit.updateSuccess') return 'Success'
          if (key === 'all.unknown') return 'Unknown'
          return key
        }
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
    const pathElements = wrapper.findAll('.bg-gray-50')
    expect(pathElements).toHaveLength(1) // space path only (SDK type removed)
    expect(pathElements[0].text()).toBe('test/application_space') // first element is the space path
  })

  it('updates application space nickname when button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ theApplicationSpaceNickname: 'New Name' })
    await wrapper.findComponent('[data-test="update-nickname"]').vm.$emit('click')
    expect(ElMessage.success).toHaveBeenCalledWith('Success')
  })

  it('update application space description when button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ theApplicationSpaceDesc: 'New Description' })
    await wrapper.findComponent('[data-test="update-description"]').vm.$emit('click')
    expect(ElMessage.success).toHaveBeenCalledWith('Success')
  })

  it('updates cluster when update-cluster clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ theClusterId: 'cluster-1' })
    await wrapper.findComponent('[data-test="update-cluster"]').vm.$emit('click')
    expect(ElMessage.success).toHaveBeenCalled()
    // 更新 cluster/resource 不触发 fetchRepoDetail 刷新
    expect(mockFetchRepoDetail).not.toHaveBeenCalled()
  })

  it('updates cloud resource and does not refresh repo', async () => {
    const wrapper = createWrapper({ cloudResource: '1' })
    await wrapper.setData({ theCloudResource: '2' })
    await wrapper.findComponent('[data-test="update-cloud-resource"]').vm.$emit('click')
    expect(ElMessage.success).toHaveBeenCalled()
    expect(mockFetchRepoDetail).not.toHaveBeenCalled()
  })

  it('updates env and refreshes repo detail', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ envJSON: '{"A":"1"}', secretJSON: '{"B":"2"}' })
    await wrapper.findComponent('[data-test="update-mcp-env"]').vm.$emit('click')
    expect(ElMessage.success).toHaveBeenCalled()
    expect(mockFetchRepoDetail).toHaveBeenCalled()
  })

  it('stops space successfully', async () => {
    const wrapper = createWrapper({ appStatus: 'Running' })
    const ok = await wrapper.vm.stopSpace()
    expect(ok).toBe(true)
    expect(ElMessage).toHaveBeenCalled()
  })

  it('restarts space successfully', async () => {
    const wrapper = createWrapper({ appStatus: 'Stopped' })
    const ok = await wrapper.vm.restartSpace()
    expect(ok).toBe(true)
    expect(ElMessage).toHaveBeenCalled()
  })

  it('change visibility confirmed by ElMessageBox', async () => {
    const wrapper = createWrapper()
    // 使用默认 resolve 的 ElMessageBox mock
    await wrapper.vm.changeVisibility('Private')
    await flushPromises()
    expect(ElMessage.success).toHaveBeenCalled()
    expect(mockFetchRepoDetail).toHaveBeenCalled()
  })

  it('change visibility canceled reverts selection and warns', async () => {
    const { ElMessageBox } = await import('element-plus')
    ElMessageBox.mockImplementationOnce(() => Promise.reject())
    const wrapper = createWrapper()
    await wrapper.vm.changeVisibility('Private')
    await flushPromises()
    expect(ElMessage).toHaveBeenCalled()
  })

  it('emits showSpaceLogs when error banner link clicked', async () => {
    const wrapper = createWrapper({ appStatus: 'DeployFailed' })
    await wrapper.find('p.text-brand-700').trigger('click')
    expect(wrapper.emitted('showSpaceLogs')).toBeTruthy()
  })

  it('updates docker variables when variables exist', async () => {
    const wrapper = createWrapper({ variables: { FOO: 'bar' } })
    await wrapper.setData({ theVariables: { FOO: 'baz' } })
    const btn = wrapper.findComponent('[data-test="update-varibles"]')
    expect(btn.exists()).toBe(true)
    await btn.vm.$emit('click')
    expect(ElMessage.success).toHaveBeenCalled()
    expect(mockFetchRepoDetail).toHaveBeenCalled()
  })
})

