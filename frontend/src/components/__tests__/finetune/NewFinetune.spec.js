import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NewFinetune from "@/components/finetune/NewFinetune.vue";

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
      },
      post: () => ({
        json: () => {
          if (url.includes('finetune?current_user')) {
            return Promise.resolve({
              error: { value: null }, data: {
                deploy_id: 123
              }
            })
          }
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

const createWrapper = (props = {}) => {
  return mount(NewFinetune, {
    props: {
      namespace: 'test-namespace',
      ...props
    }
  });
};

window.location.search = '?namespace=test-namespace&model_id=123'

describe("NewFinetune", () => {
  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

});
