import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ElMessage } from 'element-plus'
import NotebookSettings from '@/components/notebooks/NotebookSettings.vue'

// Mock RepoDetailStore
const repoDetail = { updateVisibility: vi.fn(), activeInstance: '' }
vi.mock('@/stores/RepoDetailStore', () => ({
  default: () => repoDetail
}))

// Mock Element Plus
vi.mock('element-plus', () => ({
  ElMessage: vi.fn(),
  ElMessageBox: { confirm: vi.fn() },
}));

// Mock child components
vi.mock('@/components/dialog/BalanceInsufficientDialog.vue', () => ({
  default: { name: 'BalanceInsufficientDialog', props: ['errorMsg'], template: '<div />' }
}))
vi.mock('@/components/shared/CsgButton.vue', () => ({
  default: { name: 'CsgButton', template: '<button @click="$emit(\'click\')"><slot /></button>' }
}))

// Mock fetchResourcesInCategory
vi.mock('@/components/shared/deploy_instance/fetchResourceInCategory.js', () => ({
  fetchResourcesInCategory: vi.fn(async () => ([
    { label: 'GPU', options: [ { id: 11, order_detail_id: 101, is_available: true, label: 'A100' } ] }
  ]))
}))

// Mock useFetchApi
const apiMock = vi.fn((url, options) => ({
  json: () => {
    return Promise.resolve({ data: { value: { msg: 'ok' } }, error: { value: null }, response: { value: { status: 200 } } })
  },
  put: () => ({
    json: () => Promise.resolve({ data: { value: { msg: 'ok' } }, error: { value: null }, response: { value: { status: 200 } } })
  }),
  delete: () => ({
    json: () => Promise.resolve({ data: { value: { msg: 'deleted' } }, error: { value: null } })
  })
}))
vi.mock('@/packs/useFetchApi', () => ({ default: (url, options) => apiMock(url, options) }))

const mountSettings = async (overrides = {}) => {
  const wrapper = mount(NotebookSettings, {
    global: {
      provide: { fetchRepoDetail: vi.fn() }
    },
    props: {
      notebookId: 1,
      notebookName: 'nb',
      appStatus: 'Stopped',
      framework: 'pytorch',
      maxReplica: 1,
      minReplica: 0,
      clusterId: 'c1',
      sku: '11/101',
      ...overrides.props
    }
  })
  await new Promise(r => setTimeout(r, 40))
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('NotebookSettings', () => {
  beforeEach(() => {
    apiMock.mockClear()
    vi.mocked(ElMessage).mockClear()
  })

  it('mounts and loads resources/frameworks', async () => {
    const wrapper = await mountSettings()
    // fetch frameworks is triggered indirectly after resources
    // not asserting exact calls sequence, just that component exists
    expect(wrapper.exists()).toBe(true)
  })

  it('stopNotebook calls API and shows success', async () => {
    const wrapper = await mountSettings({ props: { appStatus: 'Running' } })
    await wrapper.vm.stopNotebook()
    expect(apiMock).toHaveBeenCalledWith('/notebooks/1/stop', undefined)
    expect(vi.mocked(ElMessage)).toHaveBeenCalled()
  })

  it('restartNotebook calls API and shows success', async () => {
    const wrapper = await mountSettings()
    await wrapper.vm.restartNotebook()
    expect(apiMock).toHaveBeenCalledWith('/notebooks/1/start', undefined)
    expect(vi.mocked(ElMessage)).toHaveBeenCalled()
  })

  it('updateCloudResource sends PUT with resource payload', async () => {
    const wrapper = await mountSettings()
    await wrapper.vm.updateCloudResource('11/101')
    // last call should be PUT to /notebooks/1
    const lastCall = apiMock.mock.calls[apiMock.mock.calls.length - 1]
    expect(lastCall[0]).toBe('/notebooks/1')
    expect(JSON.parse(lastCall[1].body)).toMatchObject({ resource_id: 11, order_detail_id: 101 })
  })

  it('updateFramework sends PUT payload', async () => {
    const wrapper = await mountSettings()
    await wrapper.vm.updateFramework(2)
    const lastCall = apiMock.mock.calls[apiMock.mock.calls.length - 1]
    expect(lastCall[0]).toBe('/notebooks/1')
    expect(JSON.parse(lastCall[1].body)).toMatchObject({ runtime_framework_id: 2 })
  })

  it('updateMinReplica sends PUT payload', async () => {
    const wrapper = await mountSettings()
    await wrapper.vm.updateMinReplica(1)
    const lastCall = apiMock.mock.calls[apiMock.mock.calls.length - 1]
    expect(lastCall[0]).toBe('/notebooks/1')
    expect(JSON.parse(lastCall[1].body)).toMatchObject({ min_replica: 1 })
  })

  it('clickDelete does nothing if input not matched, then deletes when matched', async () => {
    const wrapper = await mountSettings()
    wrapper.vm.delDesc = 'wrong'
    await wrapper.vm.clickDelete()
    expect(apiMock).not.toHaveBeenCalledWith('/notebooks/1')

    wrapper.vm.delDesc = 'nb/1'
    await wrapper.vm.clickDelete()
    // delete called
    const calls = apiMock.mock.calls.map(c => c[0])
    expect(calls).toContain('/notebooks/1')
  })
})
