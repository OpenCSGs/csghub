import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EvaluationDetail from '../../evaluations/EvaluationDetail.vue'

const createResponse = (data, errorMsg = null) => ({
  data: { value: { data } },
  error: { value: errorMsg ? { msg: errorMsg } : null }
})

const mockApiResponses = {
  '/tags?scope=dataset&category=evaluation': createResponse([
    { name: 'tag1', show_name: 'Tag 1' }
  ]),
  '/evaluations/1': createResponse({
    task_name: 'task1',
    submit_time: '2021-10-01',
    repo_ids: ['repo1'],
    task_desc: 'desc1',
    datasets: [{ repo_id: 'namespace1/repo1', tags: [{ name: 'tag1' }] }],
    download_url: 'test.zip'
  })
}

vi.mock('../../../packs/useFetchApi', () => ({
  default: (url) => ({
    json: () => Promise.resolve(mockApiResponses[url] || createResponse([]))
  })
}))

describe('EvaluationDetail', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(EvaluationDetail, {
      props: {
        evaluationId: '1'
      }
    })
  })

  it('renders evaluation details correctly', async () => {
    const allGrayTextElements = wrapper.findAll('.text-gray-700.text-base')
    const dateElement = allGrayTextElements.find(el =>
      el.text() === '2021-10-01'
    )
    expect(wrapper.find('.text-2xl').text()).toBe('task1')
    expect(dateElement?.text()).toBe('2021-10-01')
    expect(wrapper.text()).includes('desc1')
  })

  it('displays download button when download_url is present', async () => {
    const downloadBtn = wrapper.find('a.btn-primary')
    expect(downloadBtn.exists()).toBe(true)
    expect(downloadBtn.attributes('href')).toBe('test.zip')
  })

  it('groups datasets by categories correctly', async () => {
    const groupedDatasets = wrapper.vm.groupedDatasets
    expect(groupedDatasets).toHaveLength(1)
    expect(groupedDatasets[0].name).toBe('tag1')
  })

  it('formats table data correctly', async () => {
    wrapper.vm.evaluationResult = {
      summary: {
        column: [{ key: 'score', customizeRender: true }],
        data: [
          {
            model: 'testmodel',
            dataset: 'dataset1',
            metric: 'metric1',
            score: '0.95'
          }
        ]
      }
    }
    wrapper.vm.scoresKey = 'score'
    await wrapper.vm.$nextTick()

    const tableData = wrapper.vm.getTableData('all')
    expect(tableData).toHaveLength(1)
    expect(tableData[0]).toEqual({
      dataset: {
        'dataset1': [
          {
          'metric': 'metric1',
          'score': '0.95',
          }
        ]
      },
      model: 'testmodel'
    })
  })

  it('filters evaluation table data by model search query correctly', async () => {
    wrapper.vm.tableDataResult = [
      { model: 'Qwen-7B', dataset: { 'mmlu': [{ metric: 'acc', score: 75.2 }] } },
      { model: 'Llama-3-8B', dataset: { 'mmlu': [{ metric: 'acc', score: 68.4 }] } },
      { model: 'Mistral-7B', dataset: { 'mmlu': [{ metric: 'acc', score: 65.0 }] } }
    ]
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.filteredTableData).toHaveLength(3)

    wrapper.vm.searchQuery = 'llama'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.filteredTableData).toHaveLength(1)
    expect(wrapper.vm.filteredTableData[0].model).toBe('Llama-3-8B')

    wrapper.vm.searchQuery = 'nonexistent'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.filteredTableData).toHaveLength(0)

    wrapper.vm.searchQuery = ''
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.filteredTableData).toHaveLength(3)
  })

  it('computes availableDatasets correctly across multiple models', async () => {
    wrapper.vm.tableDataResult = [
      {
        model: 'model1',
        dataset: {
          'mmlu': [{ metric: 'acc', score: 80 }],
          'gsm8k': [{ metric: 'acc', score: 70 }]
        }
      },
      {
        model: 'model2',
        dataset: {
          'mmlu': [{ metric: 'acc', score: 85 }],
          'humaneval': [{ metric: 'pass@1', score: 60 }]
        }
      }
    ]
    await wrapper.vm.$nextTick()

    const dsMap = wrapper.vm.availableDatasets
    expect(Object.keys(dsMap)).toEqual(['mmlu', 'gsm8k', 'humaneval'])
    expect(dsMap['mmlu']).toEqual([{ metric: 'acc', score: 80 }])
    expect(dsMap['humaneval']).toEqual([{ metric: 'pass@1', score: 60 }])
  })

  it('exports evaluation matrix to CSV with UTF-8 BOM and correct headers', async () => {
    wrapper.vm.tableDataResult = [
      {
        model: 'Qwen-7B, "Special"',
        dataset: {
          'mmlu': [{ metric: 'accuracy', score: 82.5 }]
        }
      }
    ]
    wrapper.vm.activeName = 'all'
    wrapper.vm.evaluation = { task_name: 'test_eval' }
    await wrapper.vm.$nextTick()

    let capturedBlobParts = null
    const originalBlob = global.Blob
    global.Blob = class MockBlob extends originalBlob {
      constructor(parts, options) {
        super(parts, options)
        capturedBlobParts = parts
      }
    }

    let downloadLink = null
    const originalCreateObjectURL = window.URL.createObjectURL
    const originalRevokeObjectURL = window.URL.revokeObjectURL
    window.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    window.URL.revokeObjectURL = vi.fn()

    const clickSpy = vi.fn()
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      const el = originalCreateElement(tag)
      if (tag === 'a') {
        el.click = clickSpy
        downloadLink = el
      }
      return el
    })

    wrapper.vm.exportCsv()

    expect(window.URL.createObjectURL).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
    expect(downloadLink.getAttribute('download')).toBe('test_eval_all_scores.csv')

    const text = capturedBlobParts[0]
    expect(text.startsWith('\uFEFF')).toBe(true)
    expect(text).includes('mmlu - accuracy')
    expect(text).includes('"Qwen-7B, ""Special"""')
    expect(text).includes('82.5')

    global.Blob = originalBlob
    window.URL.createObjectURL = originalCreateObjectURL
    window.URL.revokeObjectURL = originalRevokeObjectURL
    vi.restoreAllMocks()
  })
})
