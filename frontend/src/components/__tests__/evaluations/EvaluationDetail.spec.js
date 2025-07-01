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
    const dateElement = wrapper.find('.text-gray-700.text-base')
    expect(wrapper.find('.text-2xl').text()).toBe('task1')
    expect(dateElement.text()).toBe('2021-10-01')
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
})
