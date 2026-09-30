/**
 * @vitest-environment jsdom
 * @vitest-environment-options { "url": "https://hub.opencsg.com/models/test-org/test-model" }
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RepoCommit from '@/components/shared/RepoCommit.vue'

const sampleRawDiff = `--- a/README.md
+++ b/README.md
@@ -1,3 +1,5 @@
 # Title
-old line
+new line
+another line
+third line
--- a/config.json
+++ b/config.json
@@ -1,2 +1,3 @@
 {
-  "version": 1
+  "version": 2,
+  "debug": true
 }
`

const sampleCommitData = {
  id: '8522220af5367811902a7b8e19034c5689012345',
  message: 'feat: add raw markdown preview toggle',
  committer_name: 'hamzazia2005',
  committer_date: '2026-09-30T10:00:00Z',
  diff: btoa(sampleRawDiff)
}

let mockCommitResponse = { ...sampleCommitData }

let { mockFetchApi } = vi.hoisted(() => {
  return {
    mockFetchApi: vi.fn(() => ({
      json: () => Promise.resolve({
        data: {
          value: {
            data: mockCommitResponse
          }
        },
        error: { value: null },
        response: { value: { status: 200 } }
      })
    }))
  }
})

vi.mock('@/packs/useFetchApi', () => ({
  default: mockFetchApi
}))

const mockCopyToClipboard = vi.fn()
vi.mock('@/packs/clipboard', () => ({
  copyToClipboard: (text) => mockCopyToClipboard(text)
}))

describe('RepoCommit.vue', () => {
  let wrapper

  const createWrapper = () => {
    return mount(RepoCommit, {
      props: {
        namespacePath: 'test-org/test-model',
        repoType: 'model',
        commitId: '8522220af5367811902a7b8e19034c5689012345'
      },
      global: {
        stubs: {
          MarkdownViewer: true,
          LoadingSpinner: true
        }
      }
    })
  }

  beforeEach(() => {
    mockCommitResponse = { ...sampleCommitData }
    mockFetchApi.mockClear()
    mockCopyToClipboard.mockClear()
  })

  it('mounts correctly and displays commit author and 7-character truncated SHA', async () => {
    wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.text()).toContain('hamzazia2005')
    expect(wrapper.text()).toContain('8522220')
  })

  it('calculates and displays diff statistics correctly', async () => {
    wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.find('[data-testid="diff-toolbar"]').exists()).toBe(true)
    expect(wrapper.vm.totalChangedFiles).toBe(2)
    expect(wrapper.vm.totalAdditions).toBe(5)
    expect(wrapper.vm.totalDeletions).toBe(2)

    expect(wrapper.find('[data-testid="diff-file-count"]').text()).toContain('2')
    expect(wrapper.find('[data-testid="diff-additions"]').text()).toBe('+5')
    expect(wrapper.find('[data-testid="diff-deletions"]').text()).toBe('-2')
  })

  it('defaults to Split (side-by-side) diff mode', async () => {
    wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.diffMode).toBe('side-by-side')
    const splitBtn = wrapper.find('[data-testid="diff-split-btn"]')
    expect(splitBtn.classes()).toContain('bg-white')
  })

  it('toggles to Unified (line-by-line) mode when clicked', async () => {
    wrapper = createWrapper()
    await flushPromises()

    const unifiedBtn = wrapper.find('[data-testid="diff-unified-btn"]')
    await unifiedBtn.trigger('click')
    await flushPromises()

    expect(wrapper.vm.diffMode).toBe('line-by-line')
    expect(unifiedBtn.classes()).toContain('bg-white')

    // Switch back to split mode
    const splitBtn = wrapper.find('[data-testid="diff-split-btn"]')
    await splitBtn.trigger('click')
    await flushPromises()

    expect(wrapper.vm.diffMode).toBe('side-by-side')
  })

  it('copies full commit SHA to clipboard on click', async () => {
    wrapper = createWrapper()
    await flushPromises()

    const copyBtn = wrapper.find('[data-testid="copy-commit-btn"]')
    expect(copyBtn.exists()).toBe(true)

    await copyBtn.trigger('click')
    expect(mockCopyToClipboard).toHaveBeenCalledWith('8522220af5367811902a7b8e19034c5689012345')
  })

  it('displays empty diff state when no changes detected', async () => {
    mockCommitResponse = {
      ...sampleCommitData,
      diff: ''
    }

    wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.find('[data-testid="no-changes-detected"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="diff-toolbar"]').exists()).toBe(false)
  })
})
