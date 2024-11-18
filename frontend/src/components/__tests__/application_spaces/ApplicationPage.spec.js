import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ApplicationPage from '../../application_spaces/ApplicationPage.vue'

// 模拟 vue3-cookies
vi.mock('vue3-cookies', () => ({
  useCookies: () => ({
    cookies: {
      get: vi.fn().mockReturnValue('mock-token')
    }
  })
}))

describe('ApplicationPage', () => {
  let wrapper

  beforeEach(() => {
    // 每个测试前创建新的组件实例
    wrapper = mount(ApplicationPage, {
      props: {
        appEndpoint: 'https://example.com/app'
      }
    })
  })

  it('renders iframe with correct src', () => {
    const iframe = wrapper.find('#application-space-iframe')
    expect(iframe.exists()).toBe(true)
    expect(iframe.attributes('src')).toBe('https://example.com/app?jwt=mock-token')
  })

  it('has correct iframe attributes', () => {
    const iframe = wrapper.find('#application-space-iframe')
    expect(iframe.attributes('allow')).toBe('clipboard-write')
    expect(iframe.attributes('frameborder')).toBe('0')
  })

  it('updates iframe src when appEndpoint prop changes', async () => {
    await wrapper.setProps({
      appEndpoint: 'https://example.com/new-app'
    })
    
    const iframe = wrapper.find('#application-space-iframe')
    expect(iframe.attributes('src')).toBe('https://example.com/new-app?jwt=mock-token')
  })
}) 