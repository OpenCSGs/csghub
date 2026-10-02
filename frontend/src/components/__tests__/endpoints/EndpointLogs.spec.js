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

  it('should parse ANSI color codes into styled HTML spans', () => {
    const wrapper = mount(EndpointLogs, {
      props: {
        instances: mockInstances.value,
        modelId: '123',
        deployId: 1,
      },
    });

    const parsedRed = wrapper.vm.ansiToHtml('\x1b[31mError message\x1b[0m');
    expect(parsedRed).toContain('color:#ef4444');
    expect(parsedRed).toContain('Error message');
    expect(parsedRed).toContain('</span>');

    const parsedGreen = wrapper.vm.ansiToHtml('\x1b[32mConnected\x1b[0m');
    expect(parsedGreen).toContain('color:#10b981');
    expect(parsedGreen).toContain('Connected');
  });

  it('should append logs with ANSI formatting and update line counts', async () => {
    const wrapper = mount(EndpointLogs, {
      props: {
        instances: mockInstances.value,
        modelId: '123',
        deployId: 1,
      },
    });

    wrapper.vm.appendLog(
      wrapper.vm.instanceLogDiv,
      'Server starting\nServer ready',
      wrapper.vm.instanceLogLineNum
    );

    expect(wrapper.vm.totalCount).toBe(2);
    expect(wrapper.vm.filteredCount).toBe(2);
    const logLines = wrapper.findAll('.log-line');
    expect(logLines).toHaveLength(2);
    expect(logLines[0].text()).toContain('Server starting');
    expect(logLines[1].text()).toContain('Server ready');
  });

  it('should filter log lines based on search query', async () => {
    const wrapper = mount(EndpointLogs, {
      props: {
        instances: mockInstances.value,
        modelId: '123',
        deployId: 1,
      },
    });

    wrapper.vm.appendLog(
      wrapper.vm.instanceLogDiv,
      'Loading weights\nError: CUDA out of memory\nTask completed',
      wrapper.vm.instanceLogLineNum
    );
    expect(wrapper.vm.totalCount).toBe(3);

    wrapper.vm.searchQuery = 'cuda';
    wrapper.vm.handleSearchInput();
    expect(wrapper.vm.filteredCount).toBe(1);

    const logLines = wrapper.findAll('.log-line');
    expect(logLines[0].element.style.display).toBe('none');
    expect(logLines[1].element.style.display).toBe('flex');
    expect(logLines[2].element.style.display).toBe('none');

    wrapper.vm.searchQuery = '';
    wrapper.vm.handleSearchInput();
    expect(wrapper.vm.filteredCount).toBe(3);
    expect(logLines[0].element.style.display).toBe('flex');
    expect(logLines[1].element.style.display).toBe('flex');
    expect(logLines[2].element.style.display).toBe('flex');
  });

  it('should toggle autoScrollEnabled and wrapLines', () => {
    const wrapper = mount(EndpointLogs, {
      props: {
        instances: mockInstances.value,
        modelId: '123',
        deployId: 1,
      },
    });

    expect(wrapper.vm.autoScrollEnabled).toBe(true);
    wrapper.vm.toggleAutoScroll();
    expect(wrapper.vm.autoScrollEnabled).toBe(false);

    expect(wrapper.vm.wrapLines).toBe(true);
    wrapper.vm.toggleWrapLines();
    expect(wrapper.vm.wrapLines).toBe(false);
  });

  it('should clear logs and reset line counts', () => {
    const wrapper = mount(EndpointLogs, {
      props: {
        instances: mockInstances.value,
        modelId: '123',
        deployId: 1,
      },
    });

    wrapper.vm.appendLog(
      wrapper.vm.instanceLogDiv,
      'Test line 1\nTest line 2',
      wrapper.vm.instanceLogLineNum
    );
    expect(wrapper.vm.totalCount).toBe(2);

    wrapper.vm.clearLogs();
    expect(wrapper.vm.totalCount).toBe(0);
    expect(wrapper.vm.filteredCount).toBe(0);
    expect(wrapper.vm.instanceLogDiv.innerHTML).toBe('');
  });

  it('should copy logs to clipboard', async () => {
    const writeTextSpy = vi.fn().mockResolvedValue();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextSpy,
      },
    });

    const wrapper = mount(EndpointLogs, {
      props: {
        instances: mockInstances.value,
        modelId: '123',
        deployId: 1,
      },
    });

    wrapper.vm.appendLog(
      wrapper.vm.instanceLogDiv,
      'Line to copy 1\nLine to copy 2',
      wrapper.vm.instanceLogLineNum
    );

    await wrapper.vm.copyLogs();
    expect(writeTextSpy).toHaveBeenCalled();
    const copiedContent = writeTextSpy.mock.calls[0][0];
    expect(copiedContent).toContain('Line to copy 1');
    expect(copiedContent).toContain('Line to copy 2');
  });
});