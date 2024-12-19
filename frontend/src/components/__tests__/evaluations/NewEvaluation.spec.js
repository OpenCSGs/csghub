import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NewEvaluation from '../../evaluations/NewEvaluation.vue'

const MOCK_USERNAME = 'testuser'
const MOCK_MODEL_PATH = `${MOCK_USERNAME}/testmodel`
const MOCK_DATASET_PATH = `${MOCK_USERNAME}/testdataset`
const MOCK_CLUSTER_ID = 'cluster1'
const MOCK_EVALUATION_PATH = `${MOCK_USERNAME}/testevaluation`

const MOCK_RESOURCE = {
  id: 1,
  order_detail_id: 1,
  name: 'gpu-resource',
  type: 'gpu',
  is_available: true,
  pay_mode: 'minute',
  price: 1000
}

const MOCK_TRANSFORMED_RESOURCE = {
  label: 'all.minutePay',
  options: [
    {
      id: 1,
      order_detail_id: 1,
      name: 'gpu-resource',
      type: 'gpu',
      is_available: true,
      pay_mode: 'minute',
      price: 1000,
      label: 'gpu-resource 10all.hourUnit'
    }
  ]
}

const createResponse = (data, errorMsg = null) => ({
  data: { value: { data } },
  error: { value: errorMsg ? { msg: errorMsg } : null }
})

const mockApiResponses = {
  [`/runtime_framework/models?search=test&deploy_type=4`]: createResponse([
    { path: MOCK_MODEL_PATH }
  ]),
  '/cluster': createResponse([
    { cluster_id: MOCK_CLUSTER_ID, region: 'region1' }
  ]),
  [`/space_resources?cluster_id=${MOCK_CLUSTER_ID}`]: createResponse([
    MOCK_RESOURCE
  ]),
  [`/models/${MOCK_MODEL_PATH}/runtime_framework?deploy_type=4`]:
    createResponse([{ id: 1, frame_name: 'pytorch' }]),
  '/tags?scope=dataset&category=evaluation': createResponse([
    { name: 'tag1', show_name: 'Tag 1' }
  ]),
  '/datasets?tag_category=runtime_framework&tag_name=pytorch&tag_category=evaluation&tag_name=tag1':
    createResponse([{ path: MOCK_DATASET_PATH }])
}

vi.mock('../../../stores/UserStore', () => ({
  default: () => ({ username: MOCK_USERNAME })
}))

vi.mock('../../../packs/useFetchApi', () => ({
  default: (url) => ({
    json: () => Promise.resolve(mockApiResponses[url] || createResponse([])),
    post: () => ({
      json: () =>
        Promise.resolve(createResponse({ path: MOCK_EVALUATION_PATH }))
    })
  })
}))

describe('NewEvaluation', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(NewEvaluation)
  })

  describe('Initial State', () => {
    it('mounts and initializes with shared resource type', () => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.dataForm.evaluation_resource_type).toBe('shared')
    })

    it('loads initial data', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.evaluationClusters.length).toBeGreaterThan(0)
    })
  })

  describe('Form Validation', () => {
    const validateForm = () => {
      return new Promise((resolve) => {
        wrapper.vm.$refs.dataFormRef.validate((valid) => resolve(valid))
      })
    }

    it('fails validation with empty required fields', async () => {
      expect(await validateForm()).toBe(false)
    })

    it('fails validation with invalid model_id format', async () => {
      wrapper.vm.dataForm.model_id = 'invalid/format/'
      await wrapper.vm.$nextTick()
      expect(await validateForm()).toBe(false)
    })
  })

  describe('Resource Type UI', () => {
    const getClusterSelect = () => wrapper.find('[data-test="cluster-select"]')

    it('shows/hides dedicated resource fields based on type selection', async () => {
      wrapper.vm.dataForm.evaluation_resource_type = 'dedicated'
      await wrapper.vm.$nextTick()
      expect(getClusterSelect().isVisible()).toBe(true)

      wrapper.vm.dataForm.evaluation_resource_type = 'shared'
      await wrapper.vm.$nextTick()
      expect(getClusterSelect().isVisible()).toBe(false)
    })
  })

  describe('API Interactions', () => {
    it('fetches and formats models', async () => {
      await wrapper.vm.fetchModels('test')
      expect(wrapper.vm.models).toEqual([
        { key: MOCK_MODEL_PATH, value: MOCK_MODEL_PATH }
      ])
    })

    it('fetches resources for selected cluster', async () => {
      wrapper.vm.dataForm.evaluation_cluster = MOCK_CLUSTER_ID
      await wrapper.vm.fetchResources()
      expect(wrapper.vm.evaluationResources).toEqual([
        MOCK_TRANSFORMED_RESOURCE
      ])
    })
  })

  describe('Form Submission', () => {
    it('submits form and redirects on success', async () => {
      wrapper.vm.dataForm = {
        name: 'Test Evaluation',
        model_id: MOCK_MODEL_PATH,
        evaluation_framework: 1,
        evaluation_dataset: [MOCK_DATASET_PATH],
        evaluation_resource_type: 'shared'
      }

      await wrapper.vm.handleSubmit()
      expect(window.location.href).toBe('/resource-console')
    })
  })
})
