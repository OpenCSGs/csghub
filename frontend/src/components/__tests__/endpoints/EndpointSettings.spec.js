import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import EndpointSettings from "@/components/endpoints/EndpointSettings.vue";

// Mock the API response
vi.mock('@/packs/useFetchApi', () => ({
  default: (url, options) => {
    return {
      json: () => {
        if (url.includes('/runtime_framework')) {
          return Promise.resolve({
            data: {
              value: {
                data: [{ id: 1, frame_name: 'test-framework' }]
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
        if (url.includes('/run')) {
          return Promise.resolve({
            data: {
              value: { msg: 'Success' }
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

// Mock useRepoDetailStore
vi.mock('../../stores/RepoDetailStore', () => ({
  default: vi.fn(() => ({
    isPrivate: false,
    privateVisibility: false,
    updateVisibility: vi.fn()
  }))
}));

const createWrapper = (props = {}) => {
  return mount(EndpointSettings, {
    props: {
      endpointId: 1,
      endpointName: 'Test Endpoint',
      appStatus: 'Running',
      modelId: 'test-model-id',
      userName: 'test-user',
      cloudResource: 'test-resource',
      framework: 'test-framework',
      maxReplica: 1,
      minReplica: 1,
      clusterId: 'test-cluster-id',
      variables: {},
      ...props
    }
  });
};

describe("EndpointSettings", () => {
  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });
});