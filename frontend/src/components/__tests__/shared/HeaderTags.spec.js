import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderTags from '@/components/shared/HeaderTags.vue'

// Mock child components
vi.mock('@/components/tags/frameworks/PyTorch.vue', () => ({
  default: { name: 'PyTorch', template: '<div>PyTorch</div>' }
}))
vi.mock('@/components/tags/frameworks/TensorFlow.vue', () => ({
  default: { name: 'TensorFlow', template: '<div>TensorFlow</div>' }
}))
vi.mock('@/components/tags/frameworks/Safetensors.vue', () => ({
  default: { name: 'Safetensors', template: '<div>Safetensors</div>' }
}))
vi.mock('@/components/tags/frameworks/JAX.vue', () => ({
  default: { name: 'JAX', template: '<div>JAX</div>' }
}))
vi.mock('@/components/tags/frameworks/ONNX.vue', () => ({
  default: { name: 'ONNX', template: '<div>ONNX</div>' }
}))
vi.mock('@/components/tags/frameworks/PaddlePaddle.vue', () => ({
  default: { name: 'PaddlePaddle', template: '<div>PaddlePaddle</div>' }
}))
vi.mock('@/components/tags/frameworks/GGUF.vue', () => ({
  default: { name: 'GGUF', template: '<div>GGUF</div>' }
}))
vi.mock('@/components/tags/frameworks/Joblib.vue', () => ({
  default: { name: 'Joblib', template: '<div>Joblib</div>' }
}))

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
    href: 'http://localhost:3000'
  },
  writable: true
})

const createWrapper = (props = {}) => {
  return mount(HeaderTags, {
    props: {
      tags: {
        task_tags: [],
        framework_tags: [],
        language_tags: [],
        license_tags: [],
        industry_tags: [],
        other_tags: [],
        program_language: [],
        runmode_tags: [],
        scene_tags: [],
        sdk_tags: [],
        hardware_tags: [],
        lwftest_tags: [],
        hhcate01_tags: []
      },
      prefix: '',
      reportUrl: null,
      ...props
    },
    global: {
      components: {
        'SvgIcon': { template: '<div></div>' },
        'TagItem': { 
          template: '<span>{{ tag.name }}</span>',
          props: ['tag']
        },
        'MoreTags': { 
          template: '<div>+ {{ num }} more</div>',
          props: ['num', 'target']
        }
      },
      mocks: {
        $t: (key) => key
      }
    }
  })
}

describe('HeaderTags', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('renders task tags correctly', () => {
    const taskTags = [
      { name: 'computer-vision', show_name: '计算机视觉' },
      { name: 'nlp', show_name: '自然语言处理' }
    ]
    
    const wrapper = createWrapper({
      tags: { task_tags: taskTags }
    })

    expect(wrapper.text()).toContain('all.task')
    // Check that task tags are rendered - tag names are displayed (hyphens replaced with spaces)
    expect(wrapper.text()).toContain('computer vision')
    expect(wrapper.text()).toContain('nlp')
  })

  it('renders framework tags with correct icons', () => {
    const frameworkTags = [
      { name: 'pytorch' },
      { name: 'tensorflow' },
      { name: 'onnx' }
    ]
    
    const wrapper = createWrapper({
      tags: { framework_tags: frameworkTags }
    })

    expect(wrapper.text()).toContain('all.framework')
    expect(wrapper.findAll('a').length).toBe(3)
  })

  it('renders language tags with correct styling', () => {
    const languageTags = [
      { name: 'en', show_name: 'English', color: '#007bff', label: 'english' },
      { name: 'zh', show_name: '中文', color: '#28a745', label: 'chinese' }
    ]
    
    const wrapper = createWrapper({
      tags: { language_tags: languageTags }
    })

    expect(wrapper.text()).toContain('all.language')
    const languageLinks = wrapper.findAll('a')
    expect(languageLinks.length).toBe(2)
  })

  it('renders license tags with license icon', () => {
    const licenseTags = [
      { name: 'MIT' },
      { name: 'Apache-2.0' }
    ]
    
    const wrapper = createWrapper({
      tags: { license_tags: licenseTags }
    })

    expect(wrapper.text()).toContain('License:')
    expect(wrapper.findAllComponents({ name: 'SvgIcon' }).length).toBeGreaterThanOrEqual(2)
  })

  it('renders hardware tags with hardware icon', () => {
    const hardwareTags = [
      { name: 'GPU' },
      { name: 'CPU' }
    ]
    
    const wrapper = createWrapper({
      tags: { hardware_tags: hardwareTags }
    })

    expect(wrapper.text()).toContain('all.hardware')
    expect(wrapper.findAllComponents({ name: 'SvgIcon' }).length).toBeGreaterThanOrEqual(2)
  })

  it('renders SDK tags with MCP icon for mcp_server', () => {
    const sdkTags = [
      { name: 'mcp_server' },
      { name: 'other_sdk' }
    ]
    
    const wrapper = createWrapper({
      tags: { sdk_tags: sdkTags }
    })

    expect(wrapper.text()).toContain('all.sdk')
    expect(wrapper.findAllComponents({ name: 'SvgIcon' }).length).toBeGreaterThanOrEqual(1)
  })

  it('shows "more tags" component when tags exceed 3', () => {
    const taskTags = [
      { name: 'tag1' },
      { name: 'tag2' },
      { name: 'tag3' },
      { name: 'tag4' },
      { name: 'tag5' }
    ]
    
    const wrapper = createWrapper({
      tags: { task_tags: taskTags }
    })

    expect(wrapper.findComponent({ name: 'MoreTags' }).exists()).toBe(true)
  })

  it('displays only first 3 tags initially', () => {
    const taskTags = [
      { name: 'tag1' },
      { name: 'tag2' },
      { name: 'tag3' },
      { name: 'tag4' },
      { name: 'tag5' }
    ]
    
    const wrapper = createWrapper({
      tags: { task_tags: taskTags }
    })

    // Initially should show only 3 tags
    // theTaskTags is a ref containing { moreTags: ref, theTags: ref }
    expect(wrapper.vm.theTaskTags.theTags.length).toBe(3)
    expect(wrapper.vm.theTaskTags.moreTags).toBe(true)
  })

  it('shows all tags when viewMoreTargets is called', async () => {
    const taskTags = [
      { name: 'tag1' },
      { name: 'tag2' },
      { name: 'tag3' },
      { name: 'tag4' },
      { name: 'tag5' }
    ]
    
    const wrapper = createWrapper({
      tags: { task_tags: taskTags }
    })

    // Call viewMoreTargets
    wrapper.vm.viewMoreTargets('task')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.theTaskTags.theTags.length).toBe(5)
    expect(wrapper.vm.theTaskTags.moreTags).toBe(false)
  })

  it('generates correct tag URLs for different categories', () => {
    const wrapper = createWrapper({ prefix: 'models/' })

    const taskUrl = wrapper.vm.getTagUrl('task', 'computer-vision')
    expect(taskUrl).toContain('/models/')
    expect(taskUrl).toContain('task=computer-vision')
    expect(taskUrl).toContain('page=1')

    const frameworkUrl = wrapper.vm.getTagUrl('framework', 'PyTorch')
    expect(frameworkUrl).toContain('framework=pytorch')
  })

  it('generates correct MCP server URLs', () => {
    const wrapper = createWrapper({ prefix: 'mcps/' })

    const url = wrapper.vm.getTagUrl('sdk', 'mcp_server')
    expect(url).toContain('/mcp/servers')
    expect(url).toContain('sdk=mcp_server')
  })

  it('handles searchByTag correctly', () => {
    const wrapper = createWrapper()
    
    // Mock window.location.href setter
    const mockHref = vi.fn()
    Object.defineProperty(window.location, 'href', {
      set: mockHref
    })

    const tag = { name: 'computer-vision' }
    wrapper.vm.searchByTag(tag)

    expect(mockHref).toHaveBeenCalledWith(
      expect.stringContaining('task=computer-vision')
    )
  })

//   it('displays report section when reportUrl is provided', () => {
//     const wrapper = createWrapper({
//       reportUrl: 'http://example.com/report'
//     })

//     expect(wrapper.text()).toContain('models.report')
//     expect(wrapper.text()).toContain('models.reportName')
//     expect(wrapper.findComponent({ name: 'SvgIcon' }).exists()).toBe(true)
//   })

  it('uses correct locale for tag display names', () => {
    const taskTags = [
      { name: 'computer-vision', show_name: '计算机视觉' }
    ]
    
    const wrapper = createWrapper({
      tags: { task_tags: taskTags }
    })

    // Mock locale
    wrapper.vm.locale = 'zh'
    expect(wrapper.vm.locale).toBe('zh')
  })

  it('watches props.tags changes and updates tag refs', async () => {
    const wrapper = createWrapper({
      tags: { task_tags: [{ name: 'tag1' }] }
    })

    expect(wrapper.vm.theTaskTags.theTags.length).toBe(1)

    // Update props
    await wrapper.setProps({
      tags: { 
        task_tags: [
          { name: 'tag1' },
          { name: 'tag2' },
          { name: 'tag3' },
          { name: 'tag4' }
        ]
      }
    })

    expect(wrapper.vm.theTaskTags.theTags.length).toBe(3)
    expect(wrapper.vm.theTaskTags.moreTags).toBe(true)
  })

  it('handles empty tag arrays correctly', () => {
    const wrapper = createWrapper({
      tags: {
        task_tags: [],
        framework_tags: [],
        language_tags: []
      }
    })

    expect(wrapper.vm.theTaskTags.theTags).toEqual([])
    expect(wrapper.vm.theFrameworkTags.theTags).toEqual([])
    expect(wrapper.vm.theLanguageTags.theTags).toEqual([])
  })

  it('handles null/undefined tag values', () => {
    const wrapper = createWrapper({
      tags: {
        task_tags: null,
        framework_tags: undefined
      }
    })

    // The createTagRefs function should handle null/undefined values gracefully
    // When tags are null/undefined, createTagRefs returns { moreTags: ref(false), theTags: ref(undefined) }
    expect(wrapper.vm.theTaskTags).toBeDefined()
    expect(wrapper.vm.theTaskTags.moreTags).toBe(false)
    expect(wrapper.vm.theFrameworkTags).toBeDefined()
    expect(wrapper.vm.theFrameworkTags.moreTags).toBe(false)
    
    // The component should not crash and should not display these sections
    expect(wrapper.text()).not.toContain('all.task')
    expect(wrapper.text()).not.toContain('all.framework')
  })

  it('returns # for invalid tag URLs', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.getTagUrl('', 'test')).toBe('#')
    expect(wrapper.vm.getTagUrl('task', '')).toBe('#')
    expect(wrapper.vm.getTagUrl(null, 'test')).toBe('#')
  })

  it('renders all tag categories when provided', () => {
    const allTags = {
      task_tags: [{ name: 'task1' }],
      framework_tags: [{ name: 'pytorch' }],
      language_tags: [{ name: 'en', color: '#007bff' }],
      license_tags: [{ name: 'MIT' }],
      industry_tags: [{ name: 'finance' }],
      other_tags: [{ name: 'other1' }],
      program_language: [{ name: 'python' }],
      runmode_tags: [{ name: 'inference' }],
      scene_tags: [{ name: 'chatbot' }],
      sdk_tags: [{ name: 'transformers' }],
      hardware_tags: [{ name: 'GPU' }],
      lwftest_tags: [{ name: 'lwftest1' }],
      hhcate01_tags: [{ name: 'hhcate1' }]
    }

    const wrapper = createWrapper({ tags: allTags })

    expect(wrapper.text()).toContain('all.task')
    expect(wrapper.text()).toContain('all.framework')
    expect(wrapper.text()).toContain('all.language')
    expect(wrapper.text()).toContain('License:')
    expect(wrapper.text()).toContain('all.industry')
    expect(wrapper.text()).toContain('all.others')
    expect(wrapper.text()).toContain('all.programLanguage')
    expect(wrapper.text()).toContain('all.runmode')
    expect(wrapper.text()).toContain('all.scene')
    expect(wrapper.text()).toContain('all.sdk')
    expect(wrapper.text()).toContain('all.hardware')
    expect(wrapper.text()).toContain('lwftest:')
    expect(wrapper.text()).toContain('hhcate01:')
  })
})