import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import FinetuneSettings from "@/components/finetune/FinetuneSettings.vue";

// Mock useFetchApi
vi.mock('../../packs/useFetchApi', () => ({
  default: vi.fn(() => ({
    json: () => Promise.resolve({
      data: {
        value: {
          data: {
            // Mock your finetune settings data here
            resources: [
              { name: 'Resource 1', is_available: true, resources: 'res1' },
              { name: 'Resource 2', is_available: false, resources: 'res2' },
            ],
            // Add other necessary mock data
          }
        }
      }
    })
  }))
}));

const createWrapper = (props = {}) => {
  return mount(FinetuneSettings, {
    props: {
      finetune: {
        cluster_id: 'test-cluster',
        // 其他必要的 finetune 属性
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

  it("renders the finetune name correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.find('el-input').attributes('value')).toBe('Test Finetune');
  });

  it("displays available resources", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick(); // Wait for reactivity
    const options = wrapper.findAll('el-option');
    expect(options.length).toBe(2); // Check if two options are rendered
    expect(options[0].attributes('label')).toBe('Resource 1');
    expect(options[1].attributes('label')).toBe('Resource 2');
  });

  it("handles delete confirmation correctly", async () => {
    const wrapper = createWrapper();
    await wrapper.setData({ delDesc: 'Test Finetune/1' }); // Set delete description
    await wrapper.find('#confirmDelete').trigger('click'); // Trigger delete
    // Add assertions to check if delete function was called
  });

  it("fetches resources on mount", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.fetchResources(); // Manually call fetchResources
    expect(wrapper.vm.cloudResources).toHaveLength(2); // Adjust expected value based on mock data
  });
});
