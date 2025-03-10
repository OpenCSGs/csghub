import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import FinetuneDetail from "@/components/finetune/FinetuneDetail.vue";
// Mock useFetchApi
vi.mock('@/packs/useFetchApi', () => ({
  default: (url) => ({
    json: () => {
      if (url.includes('/models') && url.includes('/run/')) {
        return Promise.resolve({
          data: {
            value: {
              data: {
                deploy_name: 'Test Finetune',
                proxy_endpoint: 'test.endpoint',
                hardware: 'Test Hardware',
                repository_id: 123,
                svc_name: 'Test Service',
                model_id: '456',
                deploy_id: 789,
                runtime_framework: 'Test Framework',
                cluster_id: 'Test Cluster',
                status: 'Running',
                endpoint: 'test.endpoint'
              }
            }
          },
          error: { value: null },
          response: { status: 200 }
        })
      };

      if (url.includes('/space_resources')) {
        return Promise.resolve({
          data: {
            value: {
              data: [
                {
                  name: 'Test Resource',
                  resources: 'Test Hardware',
                  is_available: true
                }
              ]
            }
          },
          error: { value: null },
          response: { status: 200 }
        })
      };

      if (url.includes('/models/runtime_framework')) {
        return Promise.resolve({
          data: {
            value: {
              data: [{ id: 1, frame_name: 'test-framework' }]
            }
          },
          error: { value: null }
        })
      }
      return Promise.resolve({
        data: { value: { body: { data: [] } } },
        error: { value: null },
        response: { status: 200 }
      })
    }
  })
}));


vi.mock('@microsoft/fetch-event-source', () => {
  return {
    fetchEventSource: vi.fn((url, options) => {
      // Simulate the onopen and onmessage events
      options.onopen({ ok: true, status: 200 });
      options.onmessage({ data: JSON.stringify({ status: 'Running', details: [{ name: 'Test Resource' }] }) });
      return { close: vi.fn() }; // Return a mock close function
    })
  }
})

const createWrapper = (props = {}) => {
  window.ENABLE_HTTPS = 'false';
  return mount(FinetuneDetail, {
    global: {
      provide: {
        csghubServer: 'http://test-server'
      }
    },
    props: {
      namespace: 'test-namespace',
      name: 'test-name',
      userName: 'test-user',
      finetuneName: 'Test Finetune',
      finetuneId: 789,
      path: 'page',
      ...props
    }
  });
};

describe("FinetuneDetail", () => {
  it("mounts correctly", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.exists()).toBe(true);
  });

  it("fetches finetune details on mount", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.repoDetailStore.deployName).toBe('Test Finetune');
    expect(wrapper.vm.repoDetailStore.status).toBe('Running');
  });


  it("handles SSE connection successfully", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.repoDetailStore.status).toBe('Running');
  });
});
