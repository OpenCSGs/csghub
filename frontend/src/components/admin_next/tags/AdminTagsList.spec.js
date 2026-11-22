import { flushPromises, shallowMount } from '@vue/test-utils'
import { expect, it, vi } from 'vitest'
import AdminTagsList from './AdminTagsList.vue'
import useFetchApi from '../../../packs/useFetchApi'

vi.mock('../../../packs/useFetchApi', () => ({ default: vi.fn() }))

it('loads each page from the API and starts category filters on page one', async () => {
  const table = { name: 'TagRows', props: ['data'], template: '<div><slot name="footer" /></div>' }
  const pager = { name: 'TagPager', props: ['currentPage', 'total'], template: '<div />' }
  const queries = []
  useFetchApi.mockImplementation(url => ({
    json: async () => {
      const query = new URL(url, 'https://example.test').searchParams
      const categoryRequest = url === '/tags/categories'
      if (!categoryRequest) queries.push(query)
      const response = categoryRequest || query.get('category') === 'empty'
        ? { data: [] }
        : { data: [{ name: 'page-' + query.get('page') }], total: 25 }
      return { data: { value: response }, error: { value: null } }
    }
  }))
  const wrapper = shallowMount(AdminTagsList, {
    global: { stubs: {
      Container: { template: '<div><slot /></div>' },
      Table: table, Pagination: pager, RouterLink: true
    } }
  })
  await flushPromises()
  const pagerComponent = wrapper.getComponent(pager)
  expect(pagerComponent.props('total')).toBe(25)
  pagerComponent.vm.$emit('update:current-page', 2)
  await flushPromises()
  expect(queries.at(-1).get('page')).toBe('2')
  expect(wrapper.getComponent(table).props('data')).toEqual([{ name: 'page-2' }])
  const category = wrapper.findAllComponents({ name: 'ElSelect' })[1]
  category.vm.$emit('update:modelValue', 'license')
  category.vm.$emit('change', 'license')
  await flushPromises()
  expect(Object.fromEntries(queries.at(-1))).toEqual({ page: '1', per: '10', category: 'license' })
  expect(pagerComponent.props('currentPage')).toBe(1)
  category.vm.$emit('update:modelValue', 'empty')
  category.vm.$emit('change', 'empty')
  await flushPromises()
  expect(wrapper.getComponent(table).props('data')).toEqual([])
  expect(wrapper.findComponent(pager).exists()).toBe(false)
  wrapper.unmount()
})
