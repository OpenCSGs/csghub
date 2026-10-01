import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CodeEditor from '@/components/shared/CodeEditor.vue'

const createWrapper = (props = {}, modelValue = '') => {
  return mount(CodeEditor, {
    props: {
      modelValue,
      originalCodeContent: '',
      fileName: 'main.py',
      ...props
    },
    global: {
      stubs: {
        Codemirror: true,
        MarkdownViewer: true,
        'el-tabs': { template: '<div><slot /></div>' },
        'el-tab-pane': { template: '<div><slot /></div>' }
      },
      mocks: {
        $t: (key) => {
          const map = {
            'shared.edit': 'Edit',
            'shared.preview': 'Preview',
            'shared.line': 'line',
            'shared.lines': 'lines',
            'all.changes': 'Changes',
            'all.unifiedDiff': 'Unified',
            'all.splitDiff': 'Split',
            'all.modified': 'Modified',
            'all.characters': 'characters'
          }
          return map[key] || key
        }
      }
    }
  })
}

describe('CodeEditor.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts correctly with default edit tab and status bar', () => {
    const wrapper = createWrapper({}, 'print("hello world")')
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.activeName).toBe('edit')

    const statusBar = wrapper.find('[data-testid="editor-status-bar"]')
    expect(statusBar.exists()).toBe(true)
  })

  it('detects programming language accurately from file extension', () => {
    const pyWrapper = createWrapper({ fileName: 'train.py' })
    expect(pyWrapper.vm.detectedLanguage).toBe('Python')

    const jsWrapper = createWrapper({ fileName: 'index.js' })
    expect(jsWrapper.vm.detectedLanguage).toBe('JavaScript')

    const tsWrapper = createWrapper({ fileName: 'app.ts' })
    expect(tsWrapper.vm.detectedLanguage).toBe('TypeScript')

    const jsonWrapper = createWrapper({ fileName: 'package.json' })
    expect(jsonWrapper.vm.detectedLanguage).toBe('JSON')

    const mdWrapper = createWrapper({ fileName: 'README.md' })
    expect(mdWrapper.vm.detectedLanguage).toBe('Markdown')

    const yamlWrapper = createWrapper({ fileName: 'config.yaml' })
    expect(yamlWrapper.vm.detectedLanguage).toBe('YAML')

    const goWrapper = createWrapper({ fileName: 'main.go' })
    expect(goWrapper.vm.detectedLanguage).toBe('Go')

    const fallbackWrapper = createWrapper({ fileName: 'notes.unknown' })
    expect(fallbackWrapper.vm.detectedLanguage).toBe('UNKNOWN')

    const noNameWrapper = createWrapper({ fileName: '' })
    expect(noNameWrapper.vm.detectedLanguage).toBe('Plain Text')
  })

  it('calculates live lineCount and charCount accurately', async () => {
    const content = 'line 1\nline 2\nline 3'
    const wrapper = createWrapper({}, content)
    await flushPromises()

    expect(wrapper.vm.lineCount).toBe(3)
    expect(wrapper.vm.charCount).toBe(content.length)

    const linesElem = wrapper.find('[data-testid="editor-lines"]')
    expect(linesElem.exists()).toBe(true)
    expect(linesElem.text()).toContain('3 lines')

    const charsElem = wrapper.find('[data-testid="editor-chars"]')
    expect(charsElem.exists()).toBe(true)
    expect(charsElem.text()).toContain(`${content.length} characters`)
  })

  it('displays modified indicator when content differs from originalCodeContent', async () => {
    const wrapper = createWrapper(
      { originalCodeContent: 'original text' },
      'modified text'
    )
    await flushPromises()

    expect(wrapper.vm.isModified).toBe(true)
    const modifiedBadge = wrapper.find('[data-testid="modified-indicator"]')
    expect(modifiedBadge.exists()).toBe(true)
    expect(modifiedBadge.text()).toContain('Modified')
  })

  it('hides modified indicator when content equals originalCodeContent', async () => {
    const wrapper = createWrapper(
      { originalCodeContent: 'unchanged text' },
      'unchanged text'
    )
    await flushPromises()

    expect(wrapper.vm.isModified).toBe(false)
    expect(wrapper.find('[data-testid="modified-indicator"]').exists()).toBe(false)
  })

  it('renders MarkdownViewer and skips diff toolbar for markdown files', async () => {
    const wrapper = createWrapper(
      { fileName: 'README.md' },
      '# Markdown Title'
    )
    wrapper.vm.activeName = 'preview'
    await flushPromises()

    expect(wrapper.vm.isMarkdown).toBe(true)
    expect(wrapper.findComponent({ name: 'MarkdownViewer' }).exists()).toBe(true)
    expect(wrapper.find('[data-testid="diff-toolbar"]').exists()).toBe(false)
  })

  it('generates diff and computes additions and deletions for code files', async () => {
    const original = 'const a = 1;\nconst b = 2;\n'
    const modified = 'const a = 1;\nconst b = 20;\nconst c = 3;\n'
    const wrapper = createWrapper(
      { originalCodeContent: original, fileName: 'app.js' },
      modified
    )

    wrapper.vm.preview()
    await flushPromises()

    expect(wrapper.vm.additionsCount).toBeGreaterThan(0)
    expect(wrapper.vm.deletionsCount).toBeGreaterThan(0)
    expect(wrapper.vm.previewDiff).toBeTruthy()
    expect(wrapper.find('[data-testid="diff-toolbar"]').exists()).toBe(true)
  })

  it('toggles between unified and split diff modes', async () => {
    const original = 'def foo():\n    return 1\n'
    const modified = 'def foo():\n    return 2\n'
    const wrapper = createWrapper(
      { originalCodeContent: original, fileName: 'main.py' },
      modified
    )

    wrapper.vm.activeName = 'preview'
    wrapper.vm.preview()
    await flushPromises()

    expect(wrapper.vm.diffViewMode).toBe('side-by-side')

    wrapper.vm.toggleDiffView('line-by-line')
    expect(wrapper.vm.diffViewMode).toBe('line-by-line')

    wrapper.vm.toggleDiffView('side-by-side')
    expect(wrapper.vm.diffViewMode).toBe('side-by-side')
  })

  it('changeTab triggers preview and computes diff stats on non-markdown files', async () => {
    const original = 'x = 1\n'
    const modified = 'x = 2\n'
    const wrapper = createWrapper(
      { originalCodeContent: original, fileName: 'test.py' },
      modified
    )
    expect(wrapper.vm.previewDiff).toBe('')

    wrapper.vm.changeTab('preview')
    await flushPromises()

    expect(wrapper.vm.previewDiff).toBeTruthy()
    expect(wrapper.vm.additionsCount).toBe(1)
    expect(wrapper.vm.deletionsCount).toBe(1)
  })
})
