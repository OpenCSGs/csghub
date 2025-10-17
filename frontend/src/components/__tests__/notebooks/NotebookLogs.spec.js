import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NotebookLogs from '@/components/notebooks/NotebookLogs.vue'

// Mock RepoDetailStore with activeInstance
vi.mock('@/stores/RepoDetailStore.js', () => ({
  default: vi.fn(() => ({
    activeInstance: 'pod-1',
    status: 'Running',
    isInitialized: true
  }))
}))

// Mock vue3-cookies
vi.mock('vue3-cookies', () => ({
  useCookies: () => ({ cookies: { get: vi.fn(() => 'mock-jwt') } })
}))

// Mock refreshJWT
vi.mock('@/packs/refreshJWT.js', () => ({ default: vi.fn() }))

// Mock CsgButton
vi.mock('@/components/shared/CsgButton.vue', () => ({
  default: { name: 'CsgButton', template: '<button @click="$emit(\'click\')"><slot /></button>' }
}))

// Capture created anchors for download
const createElementSpy = vi.spyOn(document, 'createElement')

// Mock fetch-event-source
const fesMock = vi.fn((url, opts) => {
  setTimeout(() => {
    opts.onopen && opts.onopen({ ok: true, status: 200 })
    // push a Container event log line
    opts.onmessage && opts.onmessage({ event: 'Container', data: 'line-1' })
  }, 10)
  return { close: vi.fn() }
})
vi.mock('@microsoft/fetch-event-source', () => ({ fetchEventSource: (...args) => fesMock(...args) }))

const mountLogs = async (props = {}) => {
  const wrapper = mount(NotebookLogs, {
    global: {
      provide: { csghubServer: 'http://server' }
    },
    props: { instances: [{ name: 'pod-1' }], notebookId: '1', deployId: 2, ...props }
  })
  await new Promise(r => setTimeout(r, 60))
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('NotebookLogs', () => {
  beforeEach(() => {
    fesMock.mockClear()
  })

  it('connects logs SSE on mount and appends logs', async () => {
    const wrapper = await mountLogs()
    
    // 等待组件完成初始化和异步操作
    await new Promise(r => setTimeout(r, 50))
    
    // 验证 fetchEventSource 被调用
    expect(fesMock).toHaveBeenCalled()
    
    // 等待 onmessage 被处理
    await new Promise(r => setTimeout(r, 50))
    
    // 验证日志内容被正确渲染
    expect(wrapper.html()).toContain('line-1')
  })

  // it('downloadLog generates file', async () => {
  //   const linkMock = { href: '', click: vi.fn() }
  //   createElementSpy.mockImplementation((tag) => {
  //     if (tag === 'a') return linkMock
  //     // Call the original, un-spied function
  //     return createElementSpy.mock.original.call(document, tag)
  //   })

  //   const wrapper = await mountLogs()
  //   await new Promise(r => setTimeout(r, 80))

  //   // trigger download via button
  //   const btn = wrapper.find('button')
  //   await btn.trigger('click')
  //   expect(linkMock.click).toHaveBeenCalled()
  // })
})
