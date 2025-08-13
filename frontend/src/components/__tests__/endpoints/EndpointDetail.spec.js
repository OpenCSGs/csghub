import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import EndpointDetail from "@/components/endpoints/EndpointDetail.vue";
import { createRouter, createWebHistory } from 'vue-router'

global.ENABLE_HTTPS = 'false';

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
          if (url.includes('/space_resources')) {
            return Promise.resolve({
              data: {
                value: {
                  data: []
                }
              },
              error: { value: null }
            });
          }
          return Promise.resolve({
            data: {
              value: {
                data: {}
              }
            },
            error: { value: null }
          });
        })
      };
    })
  };
});

vi.mock('@/stores/RepoDetailStore', () => ({
  default: () => ({
    initialize: vi.fn(),
    updateLikes: vi.fn(),
    updateUserLikes: vi.fn()
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

vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {},
    params: {}
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn()
  }),
  createRouter: vi.fn(),
  createWebHistory: vi.fn()
}));

vi.mock('@/stores/RepoTabStore', () => ({
  useRepoTabStore: () => ({
    setRepoTab: vi.fn(),
    currentTab: 'overview',
    actionName: 'view',
    tab: 'overview',
    currentBranch: 'main',
    lastPath: '',
    repoType: 'endpoint',
    namespace: 'test-namespace',
    repoName: 'test-model',
    repoTab: {
      actionName: 'view',
      tab: 'overview',
      currentBranch: 'main',
      lastPath: '',
      repoType: 'endpoint',
      namespace: 'test-namespace',
      repoName: 'test-model'
    }
  })
}));

const createWrapper = (props = {}) => {
  const router = createRouter({
    history: createWebHistory(),
    routes: []
  });

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
    },
    global: {
      provide: {
        csghubServer: 'http://test-server'
      },
      plugins: [router]
    }
  });
};

describe("EndpointDetail", () => {
  it("mounts correctly", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.w-full').exists()).toBe(true);
  });

  it("fetches model detail on mount", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick(); // 等待所有异步操作完成
    expect(wrapper.vm.modelInfo).toEqual({
      namespace: 'test-namespace',
      name: 'test-model'
    });
  });
});
