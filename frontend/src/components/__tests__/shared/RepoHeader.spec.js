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

    // Should now be liked with count increased
    expect(wrapper.vm.userLiked).toBe(true)
    expect(wrapper.vm.likesNumber).toBe(11)

    // Click again to unlike
    await wrapper.find('.flex.cursor-pointer.gap-1').trigger('click')
    await flushPromises()

    // Should now be unliked with count decreased
    expect(wrapper.vm.userLiked).toBe(false)
    expect(wrapper.vm.likesNumber).toBe(10)
  })

  it('formats like count correctly', async () => {
    const wrapper = createWrapper({ totalLikes: 1200 })
    expect(wrapper.vm.likesNumberDisplayName).toBe('1k+')

    await wrapper.setProps({ totalLikes: 12000 })
    expect(wrapper.vm.likesNumberDisplayName).toBe('1w+')

    await wrapper.setProps({ totalLikes: 42 })
    expect(wrapper.vm.likesNumberDisplayName).toBe('42')
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

  it('initializes userLiked and likesNumber from props', () => {
    const wrapper = createWrapper({ totalLikes: 100, hasLike: true })
    expect(wrapper.vm.userLiked).toBe(true)
    expect(wrapper.vm.likesNumber).toBe(100)
  })

  it('updates userLiked when hasLike prop changes', async () => {
    const wrapper = createWrapper({ hasLike: false })
    expect(wrapper.vm.userLiked).toBe(false)

    await wrapper.setProps({ hasLike: true })
    expect(wrapper.vm.userLiked).toBe(true)
  })

  it('updates likesNumber when totalLikes prop changes', async () => {
    const wrapper = createWrapper({ totalLikes: 50 })
    expect(wrapper.vm.likesNumber).toBe(50)

    await wrapper.setProps({ totalLikes: 75 })
    expect(wrapper.vm.likesNumber).toBe(75)
  })

  it('renders different like button text based on user liked status', async () => {
    const wrapper = createWrapper({ hasLike: false })
    expect(wrapper.text()).toContain('shared.likes')

    await wrapper.setProps({ hasLike: true })
    expect(wrapper.text()).toContain('shared.hasLikes')
  })

  it('updates store when adding a like', async () => {
    const wrapper = createWrapper({ totalLikes: 10, hasLike: false })

    await wrapper.find('.flex.cursor-pointer.gap-1').trigger('click')
    await flushPromises()

    expect(mockRepoDetailStore.updateLikes).toHaveBeenCalledWith(11)
    expect(mockRepoDetailStore.updateUserLikes).toHaveBeenCalledWith(true)
  })

  it('updates store when removing a like', async () => {
    const wrapper = createWrapper({ totalLikes: 10, hasLike: true })

    await wrapper.find('.flex.cursor-pointer.gap-1').trigger('click')
    await flushPromises()

    expect(mockRepoDetailStore.updateLikes).toHaveBeenCalledWith(9)
    expect(mockRepoDetailStore.updateUserLikes).toHaveBeenCalledWith(false)
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
