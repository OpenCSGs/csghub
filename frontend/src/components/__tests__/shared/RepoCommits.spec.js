/**
 * @vitest-environment jsdom
 * @vitest-environment-options { "url": "https://hub.opencsg.com/models/test-org/test-model" }
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RepoCommits from '@/components/shared/RepoCommits.vue'

let { mockFetchApi } = vi.hoisted(() => {
  return {
    mockFetchApi: vi.fn((url = '') => {
      if (typeof url === 'string' && url.includes('/branches')) {
        return {
          json: () => Promise.resolve({
            data: { value: { data: [{ name: 'main' }] } },
            error: { value: null }
          })
        }
      }
      return {
        json: () => Promise.resolve({
          data: {
            value: {
              data: {
                commits: [
                  {
                    id: '8522220af5367811902a7b8e19034c5689012345',
                    message: 'feat: add raw markdown preview toggle',
                    author_name: 'hamzazia2005',
                    committer_date: '2026-09-30T10:00:00Z'
                  },
                  {
                    id: 'a1b2c3d4e5f60718293a4b5c6d7e8f9012345678',
                    message: 'fix: resolve dataset sorting issue',
                    author_name: 'sabhi128',
                    committer_date: '2026-09-29T15:00:00Z'
                  },
                  {
                    id: 'f9e8d7c6b5a432109876543210fedcba09876543',
                    message: 'docs: update repository readme with examples',
                    author_name: 'contributor',
                    committer_date: '2026-09-28T12:00:00Z'
                  }
                ],
                total: 3
              }
            }
          },
          error: { value: null }
        })
      }
    })
  }
})

vi.mock('@/packs/useFetchApi', () => ({
  default: mockFetchApi
}))

const mockCopyToClipboard = vi.fn()
vi.mock('@/packs/clipboard', () => ({
  copyToClipboard: (text) => mockCopyToClipboard(text)
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    currentRoute: { value: { path: '/models/test-org/test-model' } }
  }),
  useRoute: () => ({
    query: {}
  })
}))

vi.mock('@/stores/RepoTabStore', () => ({
  useRepoTabStore: () => ({
    repoTab: {},
    setRepoTab: vi.fn()
  })
}))

describe('RepoCommits.vue', () => {
  let wrapper

  const createWrapper = () => {
    return mount(RepoCommits, {
      props: {
        namespacePath: 'test-org/test-model',
        repoType: 'model',
        currentBranch: 'main'
      },
      global: {
        stubs: {
          BranchDropdown: true
        }
      }
    })
  }

  beforeEach(() => {
    mockFetchApi.mockClear()
    mockCopyToClipboard.mockClear()
  })

  it('mounts correctly and renders commits with total count badge', async () => {
    wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[data-testid="total-commits-badge"]').text()).toBe('3')
    
    const items = wrapper.findAll('[data-testid="commit-item"]')
    expect(items.length).toBe(3)
    expect(items[0].text()).toContain('feat: add raw markdown preview toggle')
    expect(items[0].text()).toContain('hamzazia2005')
    expect(items[0].text()).toContain('8522220')
  })

  it('filters commits in real time by commit message', async () => {
    wrapper = createWrapper()
    await flushPromises()

    const searchInput = wrapper.find('input')
    await searchInput.setValue('sorting')
    await flushPromises()

    expect(wrapper.vm.filteredCommits.length).toBe(1)
    const items = wrapper.findAll('[data-testid="commit-item"]')
    expect(items.length).toBe(1)
    expect(items[0].text()).toContain('fix: resolve dataset sorting issue')

    // Indicator
    expect(wrapper.find('[data-testid="matching-indicator"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="matching-indicator"]').text()).toContain('1')
  })

  it('filters commits by author name', async () => {
    wrapper = createWrapper()
    await flushPromises()

    const searchInput = wrapper.find('input')
    await searchInput.setValue('hamzazia2005')
    await flushPromises()

    expect(wrapper.vm.filteredCommits.length).toBe(1)
    expect(wrapper.vm.filteredCommits[0].author_name).toBe('hamzazia2005')
  })

  it('filters commits by commit SHA prefix', async () => {
    wrapper = createWrapper()
    await flushPromises()

    const searchInput = wrapper.find('input')
    await searchInput.setValue('f9e8d7')
    await flushPromises()

    expect(wrapper.vm.filteredCommits.length).toBe(1)
    expect(wrapper.vm.filteredCommits[0].message).toContain('docs: update repository readme')
  })

  it('shows empty search state when no commits match and clears on button click', async () => {
    wrapper = createWrapper()
    await flushPromises()

    const searchInput = wrapper.find('input')
    await searchInput.setValue('nonexistent-query-string')
    await flushPromises()

    expect(wrapper.vm.filteredCommits.length).toBe(0)
    expect(wrapper.find('[data-testid="no-matching-commits"]').exists()).toBe(true)

    // Clear via empty state clear button
    const clearBtn = wrapper.find('[data-testid="empty-state-clear-btn"]')
    expect(clearBtn.exists()).toBe(true)
    await clearBtn.trigger('click')
    await flushPromises()

    expect(wrapper.vm.searchQuery).toBe('')
    expect(wrapper.findAll('[data-testid="commit-item"]').length).toBe(3)
  })

  it('copies full commit SHA to clipboard on click', async () => {
    wrapper = createWrapper()
    await flushPromises()

    const copyBtns = wrapper.findAll('[data-testid="copy-commit-btn"]')
    expect(copyBtns.length).toBe(3)

    await copyBtns[0].trigger('click')
    expect(mockCopyToClipboard).toHaveBeenCalledWith('8522220af5367811902a7b8e19034c5689012345')
  })
})
