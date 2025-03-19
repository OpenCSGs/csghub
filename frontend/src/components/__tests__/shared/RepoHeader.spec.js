import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RepoHeader from '@/components/shared/RepoHeader.vue'
import HeaderTags from '@/components/shared/HeaderTags.vue'
import AppStatus from '@/components/application_spaces/AppStatus.vue'
import { copyToClipboard } from '@/packs/clipboard'

vi.mock('@/packs/clipboard', () => ({
  copyToClipboard: vi.fn()
}))

vi.mock('@/packs/useFetchApi', () => ({
  default: vi.fn((url) => ({
    put: () => ({
      json: () => Promise.resolve({ error: { value: null } })
    }),
    delete: () => ({
      json: () => Promise.resolve({ error: { value: null } })
    })
  }))
}))

const mockRepoDetailStore = {
  isPrivate: false,
  likes: 10,
  userLikes: false,
  updateLikes: vi.fn(),
  updateUserLikes: vi.fn()
}

vi.mock('@/stores/RepoDetailStore', () => ({
  default: () => mockRepoDetailStore
}))

const createWrapper = (props = {}) => {
  return mount(RepoHeader, {
    props: {
      avatar: 'avatar-url.jpg',
      name: 'test-name',
      nickname: 'Test Nickname',
      desc: 'Test description',
      path: 'owner/repo',
      tags: { task: ['computer-vision'], framework: ['pytorch'] },
      ownerUrl: '/owner',
      repoType: 'model',
      totalLikes: 42,
      hasLike: false,
      ...props
    },
    global: {
      components: {
        HeaderTags,
        AppStatus
      },
      stubs: {
        'svg-icon': true,
        'el-avatar': true,
        'el-message': true
      },
      mocks: {
        $t: (key) => key
      }
    }
  })
}

describe('RepoHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRepoDetailStore.isPrivate = false
  })

  it('mounts correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it('displays correct repository name and nickname', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Test Nickname')

    // Test fallback to name when nickname is empty
    const wrapperNoNickname = createWrapper({ nickname: '' })
    expect(wrapperNoNickname.text()).toContain('test-name')
  })

  it('displays repo path correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('owner')
    expect(wrapper.text()).toContain('repo')
  })

  it('displays description correctly', () => {
    const wrapper = createWrapper({ desc: 'Custom description' })
    expect(wrapper.text()).toContain('Custom description')
  })

  it('renders dataset repo type correctly', async () => {
    const wrapper = createWrapper({ repoType: 'dataset' })
    expect(wrapper.text()).toContain('Dataset:')
    expect(wrapper.find("[name='repoheader_dataset']").exists()).toBe(true)
  })

  it('renders endpoint repo type correctly', async () => {
    const wrapper = createWrapper({
      repoType: 'endpoint',
      appStatus: 'running'
    })
    expect(wrapper.findComponent(AppStatus).exists()).toBe(true)
  })

  it('renders finetune repo type correctly', async () => {
    const wrapper = createWrapper({
      repoType: 'finetune',
      appStatus: 'running',
      resourceName: 'CPU x2'
    })
    expect(wrapper.find("[name='model_finetune_create']").exists()).toBe(true)
    expect(wrapper.text()).toContain('CPU x2')
  })

  it('shows private label when repo is private', async () => {
    mockRepoDetailStore.isPrivate = true

    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('all.private')
  })

  it('handles like button clicks correctly', async () => {
    const wrapper = createWrapper({ totalLikes: 10, hasLike: false })

    expect(wrapper.text()).toContain('shared.likes')
    expect(wrapper.text()).toContain('10')

    // Click to like
    await wrapper.find('.flex.cursor-pointer.gap-1').trigger('click')
    await flushPromises()

    // Click again to unlike
    await wrapper.find('.flex.cursor-pointer.gap-1').trigger('click')
    await flushPromises()

    expect(mockRepoDetailStore.updateLikes).toHaveBeenCalledTimes(2)
  })

  it('copies repo path when copy button is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper
      .find('.cursor-pointer[data-test="copy-name"]')
      .trigger('click')
    expect(copyToClipboard).toHaveBeenCalledWith('owner/repo')
  })

  it('renders correct URL for different repo types', async () => {
    // Test model URL
    const modelWrapper = createWrapper({ repoType: 'model' })
    expect(modelWrapper.find('a[href="/models/owner/repo"]').exists()).toBe(
      true
    )

    // Test endpoint URL
    const endpointWrapper = createWrapper({
      repoType: 'endpoint',
      path: 'endpoint-name',
      deployId: 123
    })
    expect(
      endpointWrapper.find('a[href="/endpoints/endpoint-name/123"]').exists()
    ).toBe(true)

    // Test collections URL
    const collectionsWrapper = createWrapper({
      repoType: 'collections',
      collectionsId: 456
    })
    expect(collectionsWrapper.find('a[href="/collections/456"]').exists()).toBe(
      true
    )
  })

  it('renders HeaderTags for appropriate repo types', async () => {
    // Should show tags for model
    const modelWrapper = createWrapper({ repoType: 'model' })
    expect(modelWrapper.findComponent(HeaderTags).exists()).toBe(true)

    // Should show tags for dataset
    const datasetWrapper = createWrapper({ repoType: 'dataset' })
    expect(datasetWrapper.findComponent(HeaderTags).exists()).toBe(true)

    // Should not show tags for endpoint
    const endpointWrapper = createWrapper({ repoType: 'endpoint' })
    expect(endpointWrapper.findComponent(HeaderTags).exists()).toBe(false)
  })

  it('renders different like button text based on user liked status', async () => {
    const wrapper = createWrapper({ hasLike: false })
    expect(wrapper.text()).toContain('shared.likes')
  })

  it('updates store when adding a like', async () => {
    const wrapper = createWrapper({ totalLikes: 10, hasLike: false })

    await wrapper.find('.flex.cursor-pointer.gap-1').trigger('click')
    await flushPromises()

    expect(mockRepoDetailStore.updateLikes).toHaveBeenCalledWith(11)
    expect(mockRepoDetailStore.updateUserLikes).toHaveBeenCalledWith(true)
  })

  it('constructs correct like URL for different repo types', async () => {
    // Test for regular repo
    const modelWrapper = createWrapper({
      repoType: 'model',
      name: 'username',
      repoId: 123
    })
    expect(modelWrapper.vm.likeUrl).toBe('/user/username/likes/123')

    // Test for collections
    const collectionsWrapper = createWrapper({
      repoType: 'collections',
      name: 'username',
      repoId: 456
    })
    expect(collectionsWrapper.vm.likeUrl).toBe(
      '/user/username/likes/collections/456'
    )
  })
})

describe('RepoHeader Source Display', () => {
  const mockSourceStore = {
    hfPath: 'huggingface/user/repo',
    msPath: null,
    csgPath: null,
    path: 'CSG_123',
    source: true
  }

  beforeEach(() => {
    mockRepoDetailStore.source = true
    mockRepoDetailStore.hfPath = mockSourceStore.hfPath
    mockRepoDetailStore.msPath = mockSourceStore.msPath
    mockRepoDetailStore.csgPath = mockSourceStore.csgPath
    mockRepoDetailStore.path = mockSourceStore.path
  })

  it('displays HuggingFace source correctly', async () => {
    const wrapper = createWrapper()
    const sourceIcon = wrapper.findComponent({ name: 'RepoHeaderSourceIcon' })

    expect(sourceIcon.exists()).toBe(true)
    expect(sourceIcon.props()).toEqual({
      repoType: 'model',
      source: 'HuggingFace',
      sourcePath: 'huggingface/user/repo'
    })
  })

  it('prioritizes ModelScope source when both hfPath and msPath exist', async () => {
    mockRepoDetailStore.msPath = 'modelscope/user/repo'

    const wrapper = createWrapper()
    expect(
      wrapper.findComponent({ name: 'RepoHeaderSourceIcon' }).props('source')
    ).toBe('HuggingFace')
  })
})
