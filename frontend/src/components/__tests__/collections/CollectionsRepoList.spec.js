import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CollectionsRepoList from '@/components/collections/CollectionsRepoList.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// ---------------- Mock ----------------
vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')
  return {
    ...actual,
    ElMessage: {
      success: vi.fn(),
      warning: vi.fn()
    },
    ElMessageBox: { confirm: vi.fn() }
  }
})

// Mock CollectionsRepoCard 内部子组件
vi.mock('@/components/collections/CollectionsRepoCard.vue', () => ({
  default: {
    name: 'CollectionsRepoCard',
    props: ['repo', 'canManage'],
    template: '<div class="repo-card"><slot name="item"></slot></div>'
  }
}))

vi.mock('@/packs/useFetchApi', () => ({
  default: vi.fn(() => ({
    put: () => ({ json: vi.fn().mockResolvedValue({ data: { value: true }, error: { value: null } }) }),
    delete: () => ({ json: vi.fn().mockResolvedValue({ data: null, error: { value: null } }) }),
  }))
}))

describe('CollectionsRepoList.vue', () => {
  let wrapper
  const fetchCollectionDetail = vi.fn()
  const repositories = [
    { id: 1, repository_type: 'model', download_count: 5 },
    { id: 2, repository_type: 'dataset', download_count: 10 },
    { id: 3, repository_type: 'code', download_count: 2 },
    { id: 4, repository_type: 'space', download_count: 3 },
    { id: 5, repository_type: 'mcpserver', download_count: 0 }
  ]

  const createWrapper = () =>
    mount(CollectionsRepoList, {
      props: {
        collectionsId: '123',
        canManage: true,
        repositories
      },
      global: {
        mocks: { $t: (key) => key },
        provide: { fetchCollectionDetail },
        stubs: ['SvgIcon', 'repo-item', 'application-space-item', 'mcp-item']
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = createWrapper()
  })

  it('渲染所有类型的 repo', async () => {
    await nextTick()
    expect(wrapper.text()).toContain('organization.model')
    expect(wrapper.text()).toContain('organization.dataset')
    expect(wrapper.text()).toContain('organization.code')
    expect(wrapper.text()).toContain('organization.space')
    expect(wrapper.text()).toContain('mcps.title')
  })

  it('updateRemark 调用成功后显示 success', async () => {
    const comp = wrapper.vm
    await comp.updateRemark({ id: 1, remark: 'test remark' })
    expect(ElMessage.success).toHaveBeenCalled()
    expect(fetchCollectionDetail).toHaveBeenCalled()
  })

  it('removeRepo 调用 confirm 成功后调用 fetchCollectionDetail', async () => {
    ElMessageBox.confirm.mockResolvedValue()
    const comp = wrapper.vm
    await comp.removeRepo(1)
    await nextTick()
    expect(fetchCollectionDetail).toHaveBeenCalled()
  })

  it('removeRepo 调用 confirm 取消时不调用 fetchCollectionDetail', async () => {
    ElMessageBox.confirm.mockRejectedValue()
    const comp = wrapper.vm
    await comp.removeRepo(1)
    await nextTick()
    expect(fetchCollectionDetail).not.toHaveBeenCalled()
  })
})
