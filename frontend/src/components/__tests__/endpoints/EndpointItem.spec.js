import { mount,waitFor } from '@vue/test-utils'
import EndpointItem from '@/components/endpoints/EndpointItem.vue'
import AppStatus from '@/components/application_spaces/AppStatus.vue'
import AppPayMode from '@/components/application_spaces/AppPayMode.vue'
import { copyToClipboard } from '@/packs/clipboard'

vi.mock('@/packs/clipboard', () => ({
  copyToClipboard: vi.fn()
}))

describe('EndpointItem.vue', () => {
  let wrapper
  const endpoint = {
    model_id: 'mockModelId',
    deploy_id: 'mockDeployId',
    deploy_name: 'Mock Deploy Name',
    pay_mode: 'mockPayMode',
    status: 'Running',
    hardware: 'mockHardware',
    repo_tag: 'mockRepoTag',
    provider: 'mockProvider',
    resource_type: 'mockResourceType',
    endpoint: 'mockEndpointUrl'
  }

  beforeEach(() => {
    wrapper = mount(EndpointItem, {
      props: {
        endpoint,
        namespace: 'mockNamespace'
      },
      global: {
        components: {
          AppStatus,
          AppPayMode
        }
      }
    })
  })

  // it('renders the correct link', () => {
  //   const link = wrapper.find('a')
  //   expect(link.attributes('href')).toBe('/endpoints/mockModelId/mockDeployId')
  // })

  it('renders the correct deploy name', () => {
    const deployName = wrapper.find('h3')
    expect(deployName.text()).toBe('Mock Deploy Name')
  })

  it('renders AppPayMode with correct payMode', () => {
    const appPayMode = wrapper.findComponent(AppPayMode)
    expect(appPayMode.exists()).toBe(true)
    expect(appPayMode.props('payMode')).toBe('mockPayMode')
  })

  it('renders AppStatus with correct appStatus and spaceResource', () => {
    const appStatus = wrapper.findComponent(AppStatus)
    expect(appStatus.exists()).toBe(true)
    expect(appStatus.props('appStatus')).toBe('Running')
    expect(appStatus.props('spaceResource')).toBe('mockHardware')
  })

  it('renders the endpoint URL when status is Running', () => {
    const endpointUrl = wrapper.find('div.rounded-b-xl div:first-child')
    expect(endpointUrl.text()).toBe('mockEndpointUrl')
  })

  it('does not render the copy icon when status is not Running', async () => {
    await wrapper.setProps({ endpoint: { ...endpoint, status: 'Stopped' } })
    const copyIcon = wrapper.findComponent({ name: 'SvgIcon' })
    expect(copyIcon.exists()).toBe(false)
  })

  it('renders the copy icon when status is Running', () => {
    const copyIcon = wrapper.findComponent({ name: 'SvgIcon' })
    expect(copyIcon.exists()).toBe(true)
  })

  it('calls copyToClipboard with the correct endpoint URL when copy icon is clicked', async () => {
    const copyIcon = wrapper.findComponent({ name: 'SvgIcon' })
    await copyIcon.trigger('click')
    expect(copyToClipboard).toHaveBeenCalledWith('mockEndpointUrl')
  })
})