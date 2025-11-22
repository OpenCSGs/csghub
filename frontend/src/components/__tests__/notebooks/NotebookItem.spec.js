import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NotebookItem from '@/components/notebooks/NotebookItem.vue'

// Mock sub components used inside
vi.mock('@/components/application_spaces/AppStatus.vue', () => ({
  default: { name: 'AppStatus', template: '<div>AppStatus</div>' }
}))
vi.mock('@/components/application_spaces/AppPayMode.vue', () => ({
  default: { name: 'AppPayMode', template: '<div>AppPayMode</div>' }
}))

// Mock clipboard util
const copySpy = vi.fn()
vi.mock('@/packs/clipboard', () => ({ copyToClipboard: (...args) => copySpy(...args) }))

const mountItem = (notebook) => mount(NotebookItem, {
  global: { stubs: { SvgIcon: { template: '<div />' } } },
  props: { notebook }
})

describe('NotebookItem', () => {
  it('renders and copies endpoint when running', async () => {
    const wrapper = mountItem({
      id: 1,
      deploy_name: 'nb',
      status: 'Running',
      endpoint: 'nb.endpoint',
      hardware: 'GPU',
      pay_mode: 'postpaid',
      runtime_framework: 'PyTorch',
      runtime_framework_version: '2.1',
      resource_name: 'A100'
    })

    // copy button exists and triggers copy
    const copyContainer = wrapper.find('div[class*="rounded-br-xl"]')
    expect(copyContainer.exists()).toBe(true)
    await copyContainer.trigger('click')
    expect(copySpy).toHaveBeenCalledWith('nb.endpoint')
  })

  it('detailLink navigates to notebook detail by id', async () => {
    const originalHref = window.location.href
    Object.defineProperty(window, 'location', { value: { href: '' }, writable: true })

    const wrapper = mountItem({ id: 123, deploy_name: 'nb', status: 'Stopped' })
    await wrapper.trigger('click')
    expect(window.location.href).toBe('/notebooks/123')

    window.location.href = originalHref
  })
})
