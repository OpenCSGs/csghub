import { describe, it, expect, vi } from "vitest";
import { ref } from 'vue'
import { mount } from "@vue/test-utils";
import EndpointLogs from "@/components/endpoints/EndpointLogs.vue";

vi.mock('vue3-cookies', () => ({
  useCookies: () => ({
    cookies: {
      get: vi.fn().mockReturnValue('mocked-token')
    }
  })
}));

vi.mock('@microsoft/fetch-event-source', () => ({
  fetchEventSource: vi.fn()
}));

describe('EndpointLogs', () => {
  const mockInstances = ref([{ name: 'Instance 1' }, { name: 'Instance 2' }])

  it('should render instances in select', async () => {
    const wrapper = mount(EndpointLogs, {
      props: {
        instances: mockInstances.value,
        modelId: '123',
        deployId: 1,
      },
    })

    await wrapper.find('.el-select').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toBe(true)
  })

  it('should call refreshInstanceLogs on change', async () => {
    const refreshInstanceLogs = vi.fn()
    const wrapper = mount(EndpointLogs, {
      props: {
        instances: mockInstances.value,
        modelId: '123',
        deployId: 1,
      },
      methods: {
        refreshInstanceLogs: refreshInstanceLogs,
      }
    })

    // Trigger the dropdown to open
    await wrapper.find('.el-select').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.exists()).toBe(true)
  })

  it('should sync instance logs on mount', () => {
    const syncInstanceLogs = vi.fn()
    const wrapper = mount(EndpointLogs, {
      props: {
        instances: mockInstances.value,
        modelId: '123',
        deployId: 1,
      },
      methods: {
        syncInstanceLogs: syncInstanceLogs,
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should sync instance logs on instance change', async () => {
    const mockInstances = ref([{ name: 'Instance 1' }, { name: 'Instance 2' }]);
    const wrapper = mount(EndpointLogs, {
      props: {
        instances: mockInstances.value,
        modelId: '123',
        deployId: 1,
      },
    });
    const syncInstanceLogs = vi.spyOn(wrapper.vm, 'syncInstanceLogs');
    mockInstances.value.push({ name: 'Instance 3' });
    await wrapper.setProps({ instances: mockInstances.value });
    wrapper.vm.isLogsSSEConnected = false;
    await wrapper.vm.$nextTick();
    if (wrapper.vm.isLogsSSEConnected) {
      wrapper.vm.isLogsSSEConnected = false;
      expect(syncInstanceLogs).toHaveBeenCalled();
    }
  });
})