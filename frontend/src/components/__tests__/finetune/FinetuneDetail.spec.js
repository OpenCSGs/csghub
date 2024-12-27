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
              body: {
                data: {
                  deploy_name: 'Test Finetune',
                  proxy_endpoint: 'test.endpoint',
                  hardware: 'Test Hardware',
                  repository_id: 123,
                  svc_name: 'Test Service',
                  model_id: 456,
                  deploy_id: 789,
                  runtime_framework: 'Test Framework',
                  cluster_id: 'Test Cluster',
                  status: 'Running',
                  endpoint: 'test.endpoint'
                }
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
              body: {
                data: [
                  {
                    name: 'Test Resource',
                    resources: 'Test Hardware',
                    is_available: true
                  }
                ]
              }
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

  it.skip("fetches finetune details on mount", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.finetune.deploy_name).toBe('Test Finetune');
    expect(wrapper.vm.appStatus).toBe('Running');
  });


  it.skip("handles SSE connection successfully", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    expect(fetchEventSource).toHaveBeenCalled();
    expect(wrapper.vm.isStatusSSEConnected).toBe(true);
    expect(wrapper.vm.appStatus).toBe('Running');
  });
});
