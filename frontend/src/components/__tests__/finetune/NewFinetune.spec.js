import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NewFinetune from "@/components/finetune/NewFinetune.vue";

// Mock useFetchApi
vi.mock('../../packs/useFetchApi', () => ({
  default: vi.fn(() => ({
    json: () => Promise.resolve({
      data: {
        value: {
          data: {
            // Mock your finetune data here
            cluster_id: 'test-cluster',
            model_id: 'test-model',
            deploy_name: 'Test Finetune',
            resource_id: 'test-resource',
            runtime_framework_id: 'test-framework',
          }
        }
      }
    })
  }))
}));

const createWrapper = (props = {}) => {
  return mount(NewFinetune, {
    props: {
      namespace: 'test-namespace',
      ...props
    }
  });
};

describe("NewFinetune", () => {
  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it("renders the title and description", () => {
    const wrapper = createWrapper();
    expect(wrapper.find('h3').text()).toContain('finetune.new.title');
    expect(wrapper.find('p').text()).toContain('finetune.new.desc');
  });

  it("validates the deploy_name field", async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input[placeholder*="pleaseInput"]'); // 根据 placeholder 查找
    await input.setValue(''); // 设置为空以触发验证
    await wrapper.vm.dataFormRef.value.validate(); // 触发验证
    expect(wrapper.vm.rules.deploy_name[0].message).toBe('all.pleaseInput');
  });

  it("fetches resources on cluster change", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.fetchResources(); // 手动调用 fetchResources
    expect(wrapper.vm.finetuneResources).toHaveLength(1); // 根据 mock 数据调整期望值
  });

  it("submits the form correctly", async () => {
    const wrapper = createWrapper();
    await wrapper.vm.dataForm.deploy_name = 'Valid Name'; // 设置有效值
    await wrapper.vm.handleSubmit(); // 提交表单
    expect(wrapper.vm.loading).toBe(false); // 验证加载状态
  });
});
