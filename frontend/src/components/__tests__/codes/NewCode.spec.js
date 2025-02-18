import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import waitFor from 'wait-for-expect'
import NewCode from '@/components/codes/NewCode.vue'

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
      await waitFor(() => {
        expect(wrapper.find('.el-form-item__error').text()).toBe( 'Please input Code Name')
      })
    })

    it('with invalid name', async () => {
      const wrapper = createWrapper()
      wrapper.vm.dataForm.name = 'a' // Invalid length
      await triggerFormButton(wrapper)
      await waitFor(() => {
        expect(wrapper.find('.el-form-item__error').text()).toBe( 'The length is within the range of 2 to 64 characters')
      })
    })
    it('with valid name', async () => {
      const wrapper = createWrapper()
      wrapper.vm.dataForm.name = 'valid-code'
      await triggerFormButton(wrapper)
      const isValid = await wrapper.vm.$refs.dataFormRef
        .validate()
        .catch(() => false)
      expect(isValid).toBe(true)
    })

    it('validates owner selection', async () => {
      const wrapper = createWrapper()
      wrapper.vm.dataForm.owner = ''
      await triggerFormButton(wrapper)

      await waitFor(() => {
        expect(wrapper.find('.el-form-item__error').text()).toBe('Please select Owner')
      })
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
      await waitFor(() => {
        expect(window.location.href).toBe('/codes/testuser/testcode');
      })
    })
  })
})
