import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import PromptsIndex from '@/components/prompts/PromptsIndex.vue'
import { ElMessage } from 'element-plus'

// Mock ElementPlus components
vi.mock('element-plus', () => ({
  ElMessage: vi.fn(),
  ElInput: {
    name: 'ElInput',
    template: '<input v-model="modelValue" :placeholder="placeholder" @change="$emit(\'change\')" />',
    props: ['modelValue', 'placeholder', 'prefixIcon', 'size', 'class'],
    emits: ['update:modelValue', 'change']
  }
}))

// Mock CsgButton component
vi.mock('@/components/shared/CsgButton.vue', () => ({
  default: {
    name: 'CsgButton',
    template: '<button :disabled="loading" @click="$emit(\'click\')">{{ name }}</button>',
    props: ['loading', 'class', 'svgName', 'name'],
    emits: ['click']
  }
}))

// Mock CsgPagination component
vi.mock('@/components/shared/CsgPagination.vue', () => ({
  default: {
    name: 'CsgPagination',
    template: '<div class="pagination" @click="$emit(\'currentChange\', 2)">Pagination Component</div>',
    props: ['perPage', 'currentPage', 'total'],
    emits: ['currentChange']
  }
}))

// Mock PromptsDatasetsCard component
vi.mock('@/components/prompts/PromptsDatasetsCard.vue', () => ({
  default: {
    name: 'PromptsDatasetsCard',
    template: '<div class="prompts-card">{{ promptsData.name || "Prompts Card" }}</div>',
    props: ['promptsData']
  }
}))

// Mock PromptsBreadCrumbs component
vi.mock('@/components/prompts/PromptsBreadCrumbs.vue', () => ({
  default: {
    name: 'PromptsBreadCrumbs',
    template: '<div class="breadcrumbs">Breadcrumb Navigation</div>',
    props: ['firstHref', 'firstHrefName', 'class']
  }
}))

// Mock useFetchApi
let { useFetchApiMock } = vi.hoisted(() => {
  return {
    useFetchApiMock: vi.fn(() => ({
      json: () => Promise.resolve({
        data: { value: { data: [], total: 0 } },
        error: { value: null }
      })
    }))
  }
})

vi.mock('@/packs/useFetchApi', () => ({
  default: useFetchApiMock
}))

// Mock UserStore - 使用 ref 创建真正的响应式状态
import { ref } from 'vue'

const mockActionLimited = ref(false)
const mockIsLoggedIn = ref(true)

const mockUserStore = {
  actionLimited: mockActionLimited.value,
  isLoggedIn: mockIsLoggedIn.value
}

vi.mock('@/stores/UserStore.js', () => ({
  default: vi.fn(() => mockUserStore)
}))

// Mock pinia storeToRefs 返回真正的 ref 对象
vi.mock('pinia', () => ({
  storeToRefs: () => ({
    actionLimited: mockActionLimited,
    isLoggedIn: mockIsLoggedIn
  })
}))

// Mock i18n
const mockT = vi.fn((key) => {
  const translations = {
    'prompts.promptLibrary': 'Prompts Library',
    'prompts.placeholder': 'Search Prompts',
    'prompts.newPromptsList': 'New Prompts List',
    'prompts.noData': 'No Data'
  }
  return translations[key] || key
})

const mockI18n = {
  global: {
    mocks: {
      $t: mockT
    }
  }
}

// Mock Search 图标
vi.mock('@element-plus/icons-vue', () => ({
  Search: 'search-icon'
}))

describe('PromptsIndex.vue', () => {
  let wrapper

  const mockPromptsData = [
    {
      id: 1,
      name: 'Test Prompt 1',
      description: 'Test Description 1',
      namespace: 'test-user',
      created_at: '2024-01-01'
    },
    {
      id: 2,
      name: 'Test Prompt 2',
      description: 'Test Description 2',
      namespace: 'test-user',
      created_at: '2024-01-02'
    }
  ]

  const createWrapper = (props = {}) => {
    return mount(PromptsIndex, {
      props,
      ...mockI18n,
      global: {
        ...mockI18n.global,
        stubs: {
          ElInput: true,
          CsgButton: true,
          CsgPagination: true,
          PromptsDatasetsCard: true,
          PromptsBreadCrumbs: true
        }
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock user state
    mockActionLimited.value = false
    mockIsLoggedIn.value = true
  })

  it('should render component basic structure correctly', () => {
    wrapper = createWrapper()

    expect(wrapper.find('.w-full.text-gray-900').exists()).toBe(true)
    expect(wrapper.find('.text-2xl.font-medium').exists()).toBe(true)
    expect(wrapper.find('.grid.grid-cols-2').exists()).toBe(true)
  })

  it('should display page title correctly', () => {
    wrapper = createWrapper()

    const title = wrapper.find('.text-2xl.font-medium')
    expect(title.text()).toBe('Prompts Library')
    expect(mockT).toHaveBeenCalledWith('prompts.promptLibrary')
  })

  it('should show new button when user has permission', () => {
    // Ensure user has permission
    mockActionLimited.value = false
    wrapper = createWrapper()

    // Verify button exists (controlled by v-if="!actionLimited")
    const buttonStub = wrapper.findComponent({ name: 'CsgButton' })
    expect(buttonStub.exists()).toBe(true)
  })

  it('should hide new button when user permission is limited', () => {
    // Set user permission limited state
    mockActionLimited.value = true
    wrapper = createWrapper()

    // When actionLimited is true, v-if="!actionLimited" is false, button should not be displayed
    const buttonStub = wrapper.findComponent({ name: 'CsgButton' })
    expect(buttonStub.exists()).toBe(false)
  })

  it('should fetch and display prompts data correctly', async () => {
    useFetchApiMock.mockImplementationOnce(() => ({
      json: () => Promise.resolve({
        data: { value: { data: mockPromptsData, total: 2 } },
        error: { value: null }
      })
    }))

    wrapper = createWrapper()
    await nextTick()

    expect(useFetchApiMock).toHaveBeenCalledWith('/prompts?per=16&page=1&search=')
    expect(wrapper.vm.promptsData).toEqual(mockPromptsData)
    expect(wrapper.vm.totalPrompts).toBe(2)
    expect(wrapper.vm.loading).toBe(false)
  })

  it('should handle API errors correctly', async () => {
    const errorMessage = 'Failed to fetch data'
    useFetchApiMock.mockImplementationOnce(() => ({
      json: () => Promise.resolve({
        data: { value: null },
        error: { value: { msg: errorMessage } }
      })
    }))

    wrapper = createWrapper()
    await nextTick()

    expect(ElMessage).toHaveBeenCalledWith({
      message: errorMessage,
      type: 'warning'
    })
    expect(wrapper.vm.loading).toBe(false)
  })

  it('should search functionality work correctly', async () => {
    wrapper = createWrapper()

    // 等待组件挂载完成
    await nextTick()

    // 清除之前的调用记录，只关注搜索相关的调用
    vi.clearAllMocks()

    // 设置搜索输入并触发搜索
    wrapper.vm.nameFilterInput = 'test search'
    await wrapper.vm.filterChange()

    // 等待异步操作完成
    await nextTick()

    expect(wrapper.vm.currentPage).toBe(1)

    // 验证搜索功能：检查 API 是否被调用
    expect(useFetchApiMock).toHaveBeenCalled()
    
    // 调试：打印所有调用记录以了解实际的 URL 格式
    console.log('All API calls:', useFetchApiMock.mock.calls)
    
    // 获取最后一次 API 调用的 URL
    const lastCall = useFetchApiMock.mock.calls[useFetchApiMock.mock.calls.length - 1]
    const calledUrl = lastCall[0]
    
    console.log('Called URL:', calledUrl)
    
    // 验证 URL 包含搜索参数（更宽松的检查）
    expect(calledUrl).toContain('search=')
    expect(calledUrl).toContain('page=1') // 搜索时应该重置到第一页
    
    // 验证搜索参数存在（不管具体的编码格式）
    const hasSearchParam = calledUrl.includes('search=test') || 
                          calledUrl.includes('search=test%20search') ||
                          calledUrl.includes('search=test+search')
    expect(hasSearchParam).toBe(true)
  })

  it('should pagination functionality work correctly', async () => {
    wrapper = createWrapper()

    await wrapper.vm.fetchPromptsIndex(3)

    expect(wrapper.vm.currentPage).toBe(3)

    // Verify pagination functionality: check if correct pagination parameters were called
    const calls = useFetchApiMock.mock.calls
    const hasPageCall = calls.some(call =>
      call[0].includes('page=3') && call[0].includes('search=')
    )
    expect(hasPageCall).toBe(true)
  })

  it('should trigger correct event when clicking new button', async () => {
    mockIsLoggedIn.value = true
    wrapper = createWrapper()

    wrapper.vm.changeCurrentComponent('newPromptsList')

    expect(wrapper.emitted('changeCurrentComponent')).toBeTruthy()
    expect(wrapper.emitted('changeCurrentComponent')[0]).toEqual(['newPromptsList'])
  })

  it('should redirect to login page when unauthenticated user clicks new button', async () => {
    mockIsLoggedIn.value = false

    const mockLocation = { href: '' }
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    })

    wrapper = createWrapper()
    wrapper.vm.changeCurrentComponent('newPromptsList')

    expect(window.location.href).toBe('/login')
  })

  it('should automatically fetch data when component mounts', () => {
    wrapper = createWrapper()

    expect(useFetchApiMock).toHaveBeenCalled()
  })
})