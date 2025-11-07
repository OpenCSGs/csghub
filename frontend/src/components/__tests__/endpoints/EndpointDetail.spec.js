import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import EndpointDetail from "@/components/endpoints/EndpointDetail.vue";
import { createRouter, createWebHistory } from 'vue-router'
import FinetuneDetail from "@/components/finetune/FinetuneDetail.vue";
// import useWxShare from '@/components/hooks/useWxShare'

// // Mock hooks
// vi.mock('@/components/hooks/useWxShare', () => ({
//   default: () => ({
//     share: vi.fn()
//   })
// }))

// Mock vue3-cookies
vi.mock('vue3-cookies', () => ({
  useCookies: () => ({
    cookies: {
      get: vi.fn(() => 'mock-jwt-token')
    }
  })
}))

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/test-path',
    query: { tab: 'page' }
  }),
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn()
  })
}));

// Mock utils
vi.mock('@/packs/utils', () => ({
  validateTab: vi.fn((tab) => tab || 'page'),
  ToNotFoundPage: vi.fn()
}));

// Mock refreshJWT
vi.mock('../../packs/refreshJWT.js', () => ({
  default: vi.fn()
}));

// Mock Pinia stores
vi.mock('@/stores/RepoTabStore', () => ({
  useRepoTabStore: () => ({
    repoTab: { tab: 'page' },
    setRepoTab: vi.fn()
  })
}));

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
          response: { value: { status: 200 } }
        })
      };

      if (url.includes('/space_resources')) {
        return Promise.resolve({
          data: {
            value: {
              data: [
                {
                  id: 1,
                  name: 'Test Resource',
                  resources: 'Test Hardware',
                  is_available: true
                }
              ]
            }
          },
          error: { value: null },
          response: { value: { status: 200 } }
        })
      };

      return Promise.resolve({
        data: { value: { data: [] } },
        error: { value: null },
        response: { value: { status: 200 } }
      })
    }
  })
}));

// Mock fetch-event-source
vi.mock('@microsoft/fetch-event-source', () => {
  return {
    fetchEventSource: vi.fn((url, options) => {
      // 延迟执行 SSE 回调，模拟真实环境
      setTimeout(() => {
        if (options.onopen) {
          options.onopen({ ok: true, status: 200 });
        }
        if (options.onmessage) {
          options.onmessage({ 
            data: JSON.stringify({ 
              status: 'Running', 
              details: [{ name: 'Test Resource' }] 
            }) 
          });
        }
      }, 10);
      return { close: vi.fn() };
    })
  }
})

// Mock Element Plus
vi.mock('element-plus', () => ({
  ElMessage: vi.fn()
}));

// Mock components
vi.mock('../shared/RepoHeader.vue', () => ({
  default: { name: 'RepoHeader', template: '<div>RepoHeader</div>' }
}));

vi.mock('./FinetuneSettings.vue', () => ({
  default: { name: 'FinetuneSettings', template: '<div>FinetuneSettings</div>' }
}));

vi.mock('../shared/BillingDetail.vue', () => ({
  default: { name: 'BillingDetail', template: '<div>BillingDetail</div>' }
}));

vi.mock('../shared/InstanceInBuilding.vue', () => ({
  default: { name: 'InstanceInBuilding', template: '<div>InstanceInBuilding</div>' }
}));

vi.mock('../shared/InstanceAnalysis.vue', () => ({
  default: { name: 'InstanceAnalysis', template: '<div>InstanceAnalysis</div>' }
}));

vi.mock('../shared/CsgButton.vue', () => ({
  default: { name: 'CsgButton', template: '<button><slot></slot></button>' }
}));

const createWrapper = (props = {}) => {
  global.ENABLE_HTTPS = 'false';
  return mount(FinetuneDetail, {
    global: {
      provide: {
        csghubServer: 'http://test-server'
      },
      stubs: {
        'el-tabs': { template: '<div><slot></slot></div>' },
        'el-tab-pane': { template: '<div><slot></slot></div>' },
        'SvgIcon': { template: '<div></div>' }
      }
    },
    props: {
      namespace: 'test-namespace',
      modelName: 'test-model',
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
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();
    expect(wrapper.exists()).toBe(true);
  });

  // it("fetches finetune details on mount", async () => {
  //   const wrapper = createWrapper();
  //   await new Promise(resolve => setTimeout(resolve, 200));
  //   await wrapper.vm.$nextTick();
  //   expect(wrapper.vm.repoDetailStore.deployName).toBe('Test Finetune');
  //   expect(wrapper.vm.repoDetailStore.status).toBe('Running');
  // });

  // it("handles SSE connection successfully", async () => {
  //   const wrapper = createWrapper();
  //   await new Promise(resolve => setTimeout(resolve, 250));
  //   await wrapper.vm.$nextTick();
  //   expect(wrapper.vm.repoDetailStore.status).toBe('Running');
  // });
});
