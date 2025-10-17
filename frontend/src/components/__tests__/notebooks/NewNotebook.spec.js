import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NewNotebook from '@/components/notebooks/NewNotebook.vue'

// Mock i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (k, p) => (p ? `${k}` : `${k}`) })
}))

// Mock element-plus
vi.mock('element-plus', () => ({
  ElMessage: { warning: vi.fn(), success: vi.fn(), error: vi.fn() }
}))

// Mock SvgIcon and CsgButton
vi.mock('@/components/shared/CsgButton.vue', () => ({
  default: { name: 'CsgButton', template: '<button><slot></slot></button>' }
}))

// Mock user store
vi.mock('@/stores/UserStore.js', () => ({
  default: () => ({ username: 'tester' })
}))

// Mock nameRule injection via provide when mounting

// Mock fetchResource helper
vi.mock('@/components/shared/deploy_instance/fetchResourceInCategory.js', () => ({
  fetchResourcesInCategory: vi.fn(async () => ([
    {
      label: 'GPU',
      options: [
        { id: 11, order_detail_id: 101, is_available: true, label: 'A100', type: 'gpu' },
        { id: 12, order_detail_id: 102, is_available: false, label: 'V100' }
      ]
    }
  ]))
}))

// Mock API
const apiMock = vi.fn((url, options) => ({
  json: () => {
    if (url === '/cluster') {
      return Promise.resolve({
        data: { value: { data: [{ cluster_id: 'c1', region: 'region-1' }] } },
        error: { value: null },
        response: { value: { status: 200 } }
      })
    }
    if (url.startsWith('/runtime_framework')) {
      return Promise.resolve({
        data: { value: { data: [
          { id: 1, frame_version: 'PyTorch 2.2', frame_name: 'pytorch', compute_type: 'gpu' },
          { id: 2, frame_version: 'TensorFlow 2.15', frame_name: 'tensorflow', compute_type: 'cpu' }
        ] } },
        error: { value: null },
        response: { value: { status: 200 } }
      })
    }
    return Promise.resolve({ data: { value: { data: [] } }, error: { value: null }, response: { value: { status: 200 } } })
  },
  post: () => ({
    json: () => Promise.resolve({
      data: { value: { data: { id: 999 } }, msg: 'ok' },
      error: { value: null },
      response: { value: { status: 200 } }
    })
  })
}))
vi.mock('@/packs/useFetchApi', () => ({ default: (url, options) => apiMock(url, options) }))

const mountNew = async (props = {}) => {
  const wrapper = mount(NewNotebook, {
    global: {
      provide: { nameRule: /.*/ },
      stubs: {
        SvgIcon: { template: '<div />' }
      }
    },
    props
  })
  await new Promise(r => setTimeout(r, 50))
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('NewNotebook', () => {
  beforeEach(() => {
    apiMock.mockClear()
  })

  it('mounts and loads clusters, resources and frameworks', async () => {
    console.log('Starting test...')
    const wrapper = await mountNew()
    
    // 增加等待时间并添加多个 nextTick 确保所有异步操作完成
    await new Promise(resolve => setTimeout(resolve, 100))
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    
    // 打印调试信息
    console.log('API calls made:', apiMock.mock.calls)
    
    // 验证 API 调用
    expect(apiMock).toHaveBeenCalled()
    expect(apiMock.mock.calls.some(call => call[0] === '/cluster')).toBe(true)
    expect(apiMock.mock.calls.some(call => call[0] === '/runtime_framework?deploy_type=5')).toBe(true)

    // 验证默认选中项
    expect(wrapper.vm.dataForm.notebook_cluster).toBe('c1')
    expect(wrapper.vm.dataForm.resource).toBe('11/101')
    expect([1, '']).toContain(wrapper.vm.dataForm.runtime_framework_id)
  })

  it('submit form triggers creation and redirects', async () => {
    const originalHref = window.location.href
    Object.defineProperty(window, 'location', { value: { href: '', pathname: '' }, writable: true })
    const wrapper = await mountNew()

    // 填充必要字段
    wrapper.vm.dataForm.title = 'nb-1'
    await wrapper.vm.createNotebook()
    await new Promise(r => setTimeout(r, 20))

    const notebooksCall = apiMock.mock.calls.find(([url]) => url === '/notebooks')
    expect(notebooksCall).toBeTruthy()

    const [, requestOptions] = notebooksCall
    expect(requestOptions?.headers?.['Content-Type']).toBe('application/json')

    const payload = JSON.parse(requestOptions.body)
    expect(payload).toMatchObject({
      currentUser: 'tester',
      deploy_name: 'nb-1',
      order_detail_id: 101,
      resource_id: 11
    })

    expect(window.location.href).toBe('/notebooks/999')

    // restore
    window.location.href = originalHref
  })

  it('cancel navigates back', async () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    const wrapper = await mountNew()
    await wrapper.vm.handleCancel()
    expect(backSpy).toHaveBeenCalled()
    backSpy.mockRestore()
  })
})
