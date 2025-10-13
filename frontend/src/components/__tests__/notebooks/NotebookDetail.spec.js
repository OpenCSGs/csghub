import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NotebookDetail from '@/components/notebooks/NotebookDetail.vue'

// Mock vue-router usage is minimal here; component uses provide/inject and props.

// Mock vue3-cookies
vi.mock('vue3-cookies', () => ({
  useCookies: () => ({ cookies: { get: vi.fn(() => 'mock-jwt') } })
}))

// Mock RepoHeader/RepoTabs/LoadingSpinner
vi.mock('@/components/shared/RepoHeader.vue', () => ({
  default: { name: 'RepoHeader', template: '<div>RepoHeader</div>' }
}))
vi.mock('@/components/shared/RepoTabs.vue', () => ({
  default: { name: 'RepoTabs', template: '<div>RepoTabs</div>' }
}))
vi.mock('@/components/shared/LoadingSpinner.vue', () => ({
  default: { name: 'LoadingSpinner', props: ['loading','text'], template: '<div v-if="loading">loading</div>' }
}))

// Mock RepoTabStore
vi.mock('@/stores/RepoTabStore', () => ({
  useRepoTabStore: () => ({ setRepoTab: vi.fn() })
}))

// Mock RepoDetailStore
const storeState = () => ({
  deployName: '', id: '', status: '', hardware: '', notebookResource: '',
  repositoryId: 0, deployId: 0, nickName: '', description: '', endpoint: '',
  modelId: '', clusterId: '', privateVisibility: false, actualReplica: 0,
  activeInstance: '', failedReason: '', repoType: 'notebook',
  initialize: vi.fn(function (data) {
    this.deployName = data.deploy_name || 'nb-name'
    this.id = String(data.id || '1')
    this.status = data.status || 'Running'
    this.hardware = data.hardware || 'GPU'
    this.notebookResource = data.resource_name || 'r1'
    this.repositoryId = data.repository_id || 1
    this.deployId = data.deploy_id || 2
    this.endpoint = data.endpoint || 'nb.endpoint'
  })
})
vi.mock('@/stores/RepoDetailStore', () => ({
  default: () => ({ ...storeState(), isInitialized: { value: true } })
}))

// Mock Element Plus
vi.mock('element-plus', () => ({ ElMessage: vi.fn() }))

// Mock utils
vi.mock('@/packs/utils', () => ({ ToNotFoundPage: vi.fn() }))

// Mock refreshJWT
vi.mock('@/packs/refreshJWT.js', () => ({ default: vi.fn() }))

// Mock fetch-event-source for status sse
vi.mock('@microsoft/fetch-event-source', () => ({
  fetchEventSource: vi.fn((url, opts) => {
    setTimeout(() => {
      opts.onopen && opts.onopen({ ok: true, status: 200 })
      opts.onmessage && opts.onmessage({ data: JSON.stringify({ status: 'Running', details: [{ name: 'pod-1' }] }) })
    }, 10)
    return { close: vi.fn() }
  })
}))

// Mock API
const apiMock = vi.fn((url) => ({
  json: () => {
    if (url.startsWith('/notebooks/')) {
      return Promise.resolve({
        response: { value: { status: 200 } },
        data: { value: { data: {
          id: 1,
          namespace: { Path: 'tester', Type: 'user', Avatar: '' },
          deploy_id: 2,
          repository_id: 3,
          deploy_name: 'NB Demo',
          status: 'Running',
          hardware: 'A100',
          endpoint: 'nb.endpoint',
          resource_id: 11,
          order_detail_id: 101,
          resource_name: 'GPU-A100'
        } } },
        error: { value: null }
      })
    }
    return Promise.resolve({ data: { value: { data: [] } }, error: { value: null }, response: { value: { status: 200 } } })
  }
}))
vi.mock('@/packs/useFetchApi', () => ({ default: (url) => apiMock(url) }))

const createWrapper = async (props = {}) => {
  global.ENABLE_HTTPS = 'false'
  const wrapper = mount(NotebookDetail, {
    global: {
      provide: { csghubServer: 'http://server' }
    },
    props: { notebookId: '1', notebookName: 'nb', ...props }
  })
  await new Promise(r => setTimeout(r, 60))
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('NotebookDetail', () => {
  beforeEach(() => apiMock.mockClear())

  it('mounts and fetches detail', async () => {
    const wrapper = await createWrapper()
    expect(wrapper.exists()).toBe(true)
    expect(apiMock).toHaveBeenCalledWith('/notebooks/1')
  })

  it('connects status SSE and updates store fields', async () => {
    const wrapper = await createWrapper()
    await new Promise(r => setTimeout(r, 100))
    expect(wrapper.vm.repoDetailStore.status).toBe('Running')
  })
})
