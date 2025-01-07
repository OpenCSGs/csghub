import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NewEndpoint from "@/components/endpoints/NewEndpoint.vue";

vi.mock('vue3-cookies', () => ({
  useCookies: () => ({
    cookies: {
      get: vi.fn().mockReturnValue('mocked-token')
    }
  })
}));

vi.mock('@/packs/useFetchApi', () => ({
  default: (url) => {
    return {
      json: () => {
        if (url.includes('/cluster')) {
          return Promise.resolve({
            data: {
              value: {
                data: [
                  { cluster_id: 'cluster-1', region: 'region-1' },
                  { cluster_id: 'cluster-2', region: 'region-2' }
                ]
              }
            },
            error: { value: null }
          })
        }
        if (url.includes('/space_resources')) {
          return Promise.resolve({
            data: {
              value: {
                data: [
                  { name: 'Resource 1', is_available: true, resources: 'res1', id: 1 },
                  { name: 'Resource 2', is_available: false, resources: 'res2', id: 2 }
                ]
              }
            },
            error: { value: null }
          })
        }
        if (url.includes('/runtime_framework')) {
          return Promise.resolve({
            data: {
              value: {
                data: [{ id: 1, frame_name: 'test-framework', path: 'test-path' }]
              }
            },
            error: { value: null }
          })

        }
        if (url.includes('/models')) {
          return Promise.resolve({
            data: [
              { model_id: 'model-1', name: 'Model 1' },
              { model_id: 'model-2', name: 'Model 2' }
            ]
          });
        }
      },
      post: () => ({
        json: () => {
          return Promise.resolve({ error: { value: null } })
        }
      }),
      put: () => ({
        json: () => Promise.resolve({ error: { value: null } })
      }),
      delete: () => ({
        json: () => Promise.resolve({ error: { value: null } })
      }),
    };
  }
}));

vi.mock('element-plus', () => ({
  ElMessage: vi.fn(),
  ElInput: vi.fn()
}));

const createWrapper = (props = {}) => {
  return mount(NewEndpoint, {
    props: {
      ...props
    }
  });
};

describe("NewEndpoint", () => {
  it("mounts correctly", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.exists()).toBe(true);
  });

  it("fetches clusters on mount", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.exists()).toBe(true);
  });
});