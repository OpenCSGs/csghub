import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import FinetuneSettings from "@/components/finetune/FinetuneSettings.vue";

// Mock the API response
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
                  { name: 'Resource 1', is_available: true, resources: 'res1' },
                  { name: 'Resource 2', is_available: false, resources: 'res2' }
                ]
              }
            },
            error: { value: null }
          })
        }
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
      },
      put: () => ({
        json: () => Promise.resolve({ error: { value: null } })
      }),
      delete: () => ({
        json: () => Promise.resolve({ error: { value: null } })
      }),
    };
  }
}));

// Mock useUserStore
vi.mock('../../stores/UserStore', () => ({
  default: vi.fn(() => ({
    username: 'test-user'
  }))
}));

const createWrapper = (props = {}) => {
  return mount(FinetuneSettings, {
    props: {
      finetune: {
        cluster_id: 'test-cluster',
      },
      finetuneId: 1,
      finetuneName: 'Test Finetune',
      appStatus: 'Running',
      modelId: 'test-model-id',
      userName: 'test-user',
      cloudResource: 'test-resource',
      framework: 'test-framework',
      ...props
    }
  });
};

describe("FinetuneSettings", () => {
  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

});
