/**
 * @vitest-environment jsdom
 * @vitest-environment-options { "url": "https://hub.opencsg.com/models/test-namespace/test-repo" }
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import BlobComponent from '@/components/shared/Blob.vue'
import { copyToClipboard } from '@/packs/clipboard'
import { createAndClickAnchor } from '@/packs/utils'

vi.mock('@/packs/clipboard', () => ({
  copyToClipboard: vi.fn()
}))

vi.mock('@/packs/utils', () => ({
  createAndClickAnchor: vi.fn(),
  ToNotFoundPage: vi.fn()
}))

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
    currentRoute: { value: { path: '/models/test-namespace/test-repo' } }
  }),
  useRoute: () => ({
    query: {}
  })
}))

const mockSetRepoTab = vi.fn()
vi.mock('@/stores/RepoTabStore', () => ({
  useRepoTabStore: () => ({
    repoTab: {},
    setRepoTab: mockSetRepoTab
  })
}))

const mockBlobData = {
  content: 'import os\nimport sys\n\ndef main():\n    print("Hello CSGHub")\n',
  commit: {
    author_name: 'test-author',
    message: 'test commit message',
    id: 'abcdef1234567890',
    committer_date: '2026-09-30T10:00:00Z'
  },
  size: 2048,
  lfs: false,
  path: 'src/main.py',
  preview_code: 0,
  lfs_relative_path: '',
  lfs_pointer_size: 0
}

let mockFetchApi = vi.fn(() => ({
  json: () => Promise.resolve({
    data: { value: { data: { ...mockBlobData } } },
    response: { value: { status: 200 } },
    error: { value: null }
  }),
  blob: () => Promise.resolve({
    data: { value: new Blob(['sample-binary-content']) },
    error: { value: null }
  })
}))

vi.mock('@/packs/useFetchApi', () => ({
  default: (...args) => mockFetchApi(...args)
}))

vi.mock('@/packs/resolveContent', () => ({
  default: vi.fn((prefix, rawContent) => rawContent)
}))

// Mock window.URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:https://hub.opencsg.com/fake-blob-id')

const createWrapper = (props = {}) => {
  return mount(BlobComponent, {
    props: {
      currentBranch: 'main',
      currentPath: 'src/main.py',
      namespacePath: 'test-namespace/test-repo',
      canWrite: true,
      ...props
    },
    global: {
      stubs: {
        SvgIcon: true,
        BranchDropdown: true,
        LoadingSpinner: true,
        MarkdownViewer: true,
        TextViewer: true,
        CodeViewer: true,
        'el-breadcrumb': true,
        'el-breadcrumb-item': true,
        'el-avatar': true,
        'el-popover': true
      },
      mocks: {
        $t: (key) => {
          const map = {
            'repo.loading': 'Loading...',
            'all.commits': 'Commits',
            'all.delete': 'Delete',
            'shared.preview': 'Preview',
            'shared.copyContent': 'Copy content',
            'shared.edit': 'Edit',
            'shared.lines': 'lines',
            'shared.line': 'line',
            'shared.raw': 'Raw',
            'shared.copyPath': 'Copy path',
            'shared.downloadFile': 'Download'
          }
          return map[key] || key
        }
      }
    }
  })
}

describe('Blob.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts and loads file data successfully', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.content).toContain('Hello CSGHub')
    expect(wrapper.vm.currentPath).toBe('src/main.py')
  })

  it('computes lineCount correctly for text/code content', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    // 5 lines in mockBlobData.content (ends with newline so 6 elements in split)
    expect(wrapper.vm.lineCount).toBe(6)

    const lineCountElem = wrapper.find('[data-testid="blob-line-count"]')
    expect(lineCountElem.exists()).toBe(true)
    expect(lineCountElem.text()).toContain('6 lines')
  })

  it('formats file size in the toolbar statistics area', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const sizeElem = wrapper.find('[data-testid="blob-size"]')
    expect(sizeElem.exists()).toBe(true)
    expect(sizeElem.text()).toBe('2.0 KB')
  })

  it('sets lineCount to 0 and hides line count for image files', async () => {
    const wrapper = createWrapper({ currentPath: 'assets/logo.png' })
    await flushPromises()

    expect(wrapper.vm.isImage()).toBe(true)
    expect(wrapper.vm.lineCount).toBe(0)
    expect(wrapper.find('[data-testid="blob-line-count"]').exists()).toBe(false)
  })

  it('clicking copy path button copies current file path to clipboard', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const copyPathBtn = wrapper.find('[data-testid="copy-path-btn"]')
    expect(copyPathBtn.exists()).toBe(true)

    await copyPathBtn.trigger('click')
    expect(copyToClipboard).toHaveBeenCalledWith('src/main.py')
  })

  it('invoking copyPath method copies path directly', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.copyPath()
    expect(copyToClipboard).toHaveBeenCalledWith('src/main.py')
  })

  it('copyFile copies decoded file content to clipboard', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.copyFile()
    expect(copyToClipboard).toHaveBeenCalledWith(wrapper.vm.content)
  })

  it('computes rawFileUrl with proper namespace, branch, and path', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.vm.rawFileUrl).toBe(
      '/models/test-namespace/test-repo/raw/src/main.py?ref=main'
    )

    const rawBtn = wrapper.find('[data-testid="blob-raw-btn"]')
    expect(rawBtn.exists()).toBe(true)
    expect(rawBtn.find('a').attributes('href')).toBe(wrapper.vm.rawFileUrl)
  })

  it('clicking download button invokes normalFileDownload and creates object URL', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const downloadBtn = wrapper.find('[data-testid="blob-download-btn"]')
    expect(downloadBtn.exists()).toBe(true)

    await downloadBtn.trigger('click')
    await flushPromises()

    expect(global.URL.createObjectURL).toHaveBeenCalled()
    expect(createAndClickAnchor).toHaveBeenCalledWith(
      'blob:https://hub.opencsg.com/fake-blob-id',
      'src/main.py'
    )
  })

  it('changeBranch updates currentBranch and navigates to new branch', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.vm.changeBranch('feature-branch')
    expect(wrapper.vm.currentBranch).toBe('feature-branch')
    expect(mockPush).toHaveBeenCalledWith({
      path: '/models/test-namespace/test-repo',
      query: {
        tab: 'files',
        actionName: 'files',
        branch: 'feature-branch'
      }
    })
  })
})
