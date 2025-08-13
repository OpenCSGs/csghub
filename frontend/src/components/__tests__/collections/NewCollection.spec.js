import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NewCollection from '../../collections/NewCollection.vue'

vi.mock('../../../stores/UserStore', () => ({
  default: () => ({
    username: 'testuser',
    orgs: [{ path: 'testorg' }]
  })
}))

const i18nMapping = {
  'collections.color.lPurple': 'Light Purple'
}

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => i18nMapping[key]
  })
}))

let postApiMockFn = vi.fn().mockImplementation(() => ({
  json: () =>
    Promise.resolve({
      data: { value: { data: { path: 'testuser/testcollection', id: 22 } } },
      error: { value: null }
    })
}))
let getApiMockFn = vi.fn()

vi.mock('../../../packs/useFetchApi', () => ({
  default: () => ({
    json: getApiMockFn,
    post: postApiMockFn
  })
}))

describe('NewCollection', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(NewCollection, {
      global: {
        provide: {
          nameRule: /^[a-zA-Z][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/
        }
      }
    })
  })

  describe('mount', () => {
    it('mounts correctly', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('renders default light purple theme', async () => {
      const allSelectedItemsInString = wrapper
        .findAll('.el-select__selected-item')
        .map((item) => item.text())
        .join(',')
      expect(allSelectedItemsInString).toContain('Light Purple')
    })
  })

  describe('form validation', () => {
    const validateForm = () => {
      return new Promise((resolve) => {
        wrapper.vm.$refs.dataFormRef.validate((valid) => resolve(valid))
      })
    }

    it('validates required fields', async () => {
      expect(await validateForm()).toBe(false)
    })

    it('accepts invalid collection name', async () => {
      wrapper.vm.dataForm.name = '**__invalid-name'
      await wrapper.vm.$nextTick()
      expect(await validateForm()).toBe(false)
    })

    it('accepts valid collection name', async () => {
      wrapper.vm.dataForm.title = 'valid-name'
      await wrapper.vm.$nextTick()
      expect(await validateForm()).toBe(true)
    })
  })

  describe('namespaces', () => {
    it('sets default owner from URL query', async () => {
      window.location.search = '?orgName=testorg'
      wrapper.unmount()
      wrapper = mount(NewCollection, {
        global: {
          provide: {
            nameRule: /^[a-zA-Z][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/
          }
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.dataForm.owner).toBe('testorg')
    })
  })

  describe('form submission', () => {
    it('submits form with valid data', async () => {
      // Fill form data
      wrapper.vm.dataForm = {
        owner: 'testuser',
        title: 'valid-collection',
        collectionNickName: 'Test Collection',
        collectionDesc: 'Test description',
        colorName: '#F5F3FF'
      }

      await wrapper.find('button').trigger('click')
      await new Promise((resolve) => setTimeout(resolve, 300))

      expect(window.location.pathname).toBe('/collections/22')
    })
  })
})
