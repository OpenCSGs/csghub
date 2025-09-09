import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import PromptsList from '@/components/prompts/PromptsList.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key) => key)
  })
}))

// Mock element-plus
vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
}))

// Mock @element-plus/icons-vue
vi.mock('@element-plus/icons-vue', () => ({
  Search: {},
  ArrowDown: {},
  ArrowUp: {}
}))

// Mock utils
vi.mock('@/packs/utils', () => ({
  ToNotFoundPage: vi.fn()
}))

// Mock promptsOptions
vi.mock('@/components/prompts/promptsOptions', () => ({
  useLangOptions: () => [
    { id: 1, value: 'zh', label: 'Chinese' },
    { id: 2, value: 'en', label: 'English' }
  ],
  useTagOptions: () => [
    { id: 1, value: 'tag1', label: 'Tag 1' },
    { id: 2, value: 'tag2', label: 'Tag 2' }
  ]
}))

// Use vi.hoisted to mock useFetchApi
let { useFetchApiMock } = vi.hoisted(() => {
  return {
    useFetchApiMock: vi.fn(() => ({
      json: () => Promise.resolve({
        data: {
          value: {
            data: {
              prompts: [
                 {
                   id: 1,
                   title: 'Test Prompt 1',
                   language: 'zh',
                   tags: ['tag1'],
                   file_path: 'test1.md'
                 },
                 {
                   id: 2,
                   title: 'Test Prompt 2',
                   language: 'en',
                   tags: ['tag2'],
                   file_path: 'test2.md'
                 }
               ],
               detail: {
                 name: 'Test Repository',
                 nickname: 'Test Repository Nickname',
                 description: 'Test Repository Description',
                 path: 'test/repo',
                 can_manage: true,
                 user: {
                   username: 'testuser',
                   avatar: 'avatar.png'
                 },
                 updated_at: '2023-01-01T00:00:00Z'
               }
            }
          }
        },
        error: { value: null },
        response: { value: { status: 200 } }
      })
    }))
  }
})

vi.mock('@/packs/useFetchApi', () => ({
  default: useFetchApiMock
}))

describe('PromptsList.vue', () => {
  // Factory function to create component wrapper
  const createWrapper = (props = {}) => {
    return mount(PromptsList, {
      props: {
        namespace: 'test-namespace',
        name: 'test-name',
        ...props
      },
      global: {
        stubs: {
          PromptsCard: true,
          PromptsBreadCrumbs: true,
          CsgPagination: true,
          CsgButton: {
            template: '<button class="csg-button" @click="$emit(\'click\')">{{ name }}</button>',
            props: ['name', 'svgName', 'class', 'loading'],
            name: 'CsgButton'
          },
          SvgIcon: true,
          LoadingSpinner: true,
          'el-avatar': true,
          'el-icon': true,
          'el-input': true,
          'el-select': true,
          'el-option': true
        }
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render component correctly', async () => {
    const wrapper = createWrapper()
    
    // Verify basic component rendering
    expect(wrapper.exists()).toBe(true)
    
    // Wait for async operations to complete
    await flushPromises()
    await nextTick()
    
    // Verify component exists
    expect(wrapper.vm).toBeDefined()
  })

  it('should load data correctly', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await nextTick()
    
    // Verify data loading state after completion
    expect(wrapper.vm.promptsListData.length).toBe(2)
    expect(wrapper.vm.repo.name).toBe('Test Repository')
    expect(wrapper.vm.filteredData.length).toBe(2)
  })

  it('should display repository information correctly', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await nextTick()
    
    // Verify repository information display
    expect(wrapper.text()).toContain('Test Repository Nickname')
    expect(wrapper.text()).toContain('Test Repository Description')
    expect(wrapper.text()).toContain('testuser')
    expect(wrapper.text()).toContain('2023-01-01')
  })

  it('should handle management permissions correctly', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await nextTick()
    
    // Verify component state
    expect(wrapper.vm.repo.can_manage).toBe(true)
    
    // Verify component basic functionality
    expect(wrapper.vm.filteredData.length).toBe(2)
    expect(wrapper.vm.promptsListData.length).toBe(2)
  })

  it('should filter functionality work correctly', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await nextTick()
    
    // Initial state should show all prompts
    expect(wrapper.vm.filteredData.length).toBe(2)
    
    // Verify filter-related properties and methods exist
    expect(wrapper.vm.promptsListData.length).toBe(2)
    expect(typeof wrapper.vm.filterChange).toBe('function')
    expect(typeof wrapper.vm.filterPrompts).toBe('function')
    
    // Verify pagination-related properties
    expect(wrapper.vm.currentPage).toBe(1)
    expect(wrapper.vm.perPage).toBe(24)
    expect(wrapper.vm.totalPrompts).toBe(2)
  })

  it('should trigger events correctly', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await nextTick()
    
    // Verify component methods exist
    expect(typeof wrapper.vm.changeCurrentComponent).toBe('function')
    expect(typeof wrapper.vm.setPromptsDetails).toBe('function')
    
    // Test changeCurrentComponent method
    wrapper.vm.changeCurrentComponent('newPrompt')
    expect(wrapper.emitted()).toHaveProperty('changeCurrentComponent')
    expect(wrapper.emitted().changeCurrentComponent[0]).toEqual(['newPrompt'])
    
    // Verify setPromptsDetails event was automatically triggered on component mount
    expect(wrapper.emitted()).toHaveProperty('setPromptsDetails')
    expect(wrapper.emitted().setPromptsDetails.length).toBeGreaterThanOrEqual(1)
    
    // Verify event parameters contain correct repository information
    const emittedRepo = wrapper.emitted().setPromptsDetails[0][0]
    expect(emittedRepo.name).toBe('Test Repository')
    expect(emittedRepo.path).toBe('test/repo')
  })
})
