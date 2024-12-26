import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NewCode from '@/components/codes/NewCode.vue'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const createWrapper = (props) => {
  return mount(NewCode, {
    global: {
      provide: {
        nameRule: /^[a-zA-Z][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/
      }
    },
    props: {
      licenses: [['MIT', 'GPL-3.0', 'Apache-2.0']],
      ...props
    }
  })
}

const triggerFormButton = async (wrapper) => {
  const button = wrapper.findComponent({ name: 'CsgButton' })
  await button.trigger('click')
  await delay(300)
  await wrapper.vm.$nextTick()
}

vi.mock('../../../stores/UserStore', () => ({
  default: () => ({
    username: 'testuser',
    orgs: [{ path: 'testorg' }]
  })
}))

vi.mock('../../../packs/useFetchApi', () => ({
  default: () => ({
    post: () => ({
      json: () =>
        Promise.resolve({
          data: { value: { data: { path: 'testuser/testcode' } } },
          error: { value: null }
        })
    })
  })
}))

describe('NewCode', () => {
  describe('mount', async () => {
    it('mounts correctly', () => {
      const wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('form validation', () => {
    it('validates required fields', async () => {
      const wrapper = createWrapper()
      await triggerFormButton(wrapper)
      const formErrors = wrapper.findAll('.el-form-item__error')
      expect(formErrors.length).toBeGreaterThan(0)
    })

    it('validates code name length', async () => {
      const wrapper = createWrapper()
      wrapper.vm.dataForm.name = 'a' // Invalid length
      await triggerFormButton(wrapper)
      expect(wrapper.find('.el-form-item__error').exists()).toBe(true)

      wrapper.vm.dataForm.name = 'valid-code' // Valid length
      await triggerFormButton(wrapper)
      expect(wrapper.find('.el-form-item__error').exists()).toBe(false)
    })

    it('validates owner selection', async () => {
      const wrapper = createWrapper()
      wrapper.vm.dataForm.owner = '' // Invalid owner
      await triggerFormButton(wrapper)
      expect(wrapper.find('.el-form-item__error').exists()).toBe(true)
    })
  })

  describe('form submission', async () => {
    it('shows success message on successful submission', async () => {
      const wrapper = createWrapper()

      wrapper.vm.dataForm = {
        owner: 'testuser',
        name: 'valid-code',
        license: 'MIT',
        desc: 'Test description',
        visibility: 'public'
      }

      await triggerFormButton(wrapper)
      await new Promise((resolve) => setTimeout(resolve, 300))
      expect(window.location.href).toBe('/codes/testuser/testcode')
    })
  })
})
