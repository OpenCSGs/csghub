import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import EndpointDetail from "@/components/endpoints/EndpointDetail.vue";

vi.mock('vue3-cookies', () => ({
  useCookies: () => ({
    cookies: {
      get: vi.fn().mockReturnValue('mocked-token')
    }
  })
}));

vi.mock('@/packs/useFetchApi', () => {
  return {
    default: vi.fn((url) => {
      return {
        json: vi.fn().mockImplementation(() => {
          if (url.includes('/models/test-namespace/test-model')) {
            return Promise.resolve({
              data: {
                value: {
                  data: {
                    namespace: 'test-namespace',
                    name: 'test-model',
                  }
                }
              }
            });
          }
          if (url.includes('/models/test-namespace/test-model/run/123')) {
            return Promise.resolve({
              data: {
                value: {
                  data: {
                    deploy_name: 'Test Endpoint',
                    endpoint: 'test-endpoint.com',
                    status: 'Running',
                    hardware: 'test-hardware',
                    actual_replica: 2,
                    cluster_id: 'cluster-1',
                    sku: 'test-sku',
                    model_id: 'test-model',
                    private: false,
                    repository_id: 'repo-1',
                    deploy_id: 123
                  }
                }
              }
            });
          }
          if (url.includes('/tags')) {
            return Promise.resolve({
              data: {
                value: []
              },
              error: { value: null }
            });
          }
        })
      };
    })
  };
});

vi.mock('@/stores/RepoDetailStore', () => ({
  default: () => ({
    initialize: vi.fn()
  })
}));

vi.mock('@/stores/UserStore.js', () => ({
  default: () => ({
    username: 'test-namespace'
  })
}));

vi.mock('@microsoft/fetch-event-source', () => ({
  fetchEventSource: vi.fn()
}));

vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
}));

const createWrapper = (props = {}) => {
  return mount(EndpointDetail, {
    props: {
      currentPath: '/test-path',
      defaultTab: 'overview',
      actionName: 'view',
      tags: {},
      namespace: 'test-namespace',
      modelName: 'test-model',
      endpointId: 123,
      ...props
    }
  });
};

describe("EndpointDetail", () => {
  it("mounts correctly", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.exists()).toBe(true);
  });

  it("fetches model detail on mount", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.modelInfo).toEqual({
      namespace: 'test-namespace',
      name: 'test-model'
    });
  });
});