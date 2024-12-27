import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import FinetuneDetail from "@/components/finetune/FinetuneDetail.vue";

// Mock useFetchApi
vi.mock('../../packs/useFetchApi', () => ({
  default: vi.fn(() => ({
    json: () => Promise.resolve({
      data: {
        value: {
          data: {
            // Mock your finetune data here
            deploy_name: 'Test Finetune',
            proxy_endpoint: 'test.endpoint',
            hardware: 'Test Hardware',
            repository_id: 123,
            svc_name: 'Test Service',
            model_id: 456,
            deploy_id: 789,
            runtime_framework: 'Test Framework',
            cluster_id: 'Test Cluster',
          }
        }
      }
    })
  }))
}));

const createWrapper = (props = {}) => {
  window.ENABLE_HTTPS = 'false'
  return mount(FinetuneDetail, {
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
  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it.skip("renders the repo header with correct props", () => {
    const wrapper = createWrapper();
    const repoHeader = wrapper.findComponent({ name: 'repo-header' });
    expect(repoHeader.exists()).toBe(true);
    expect(repoHeader.props('name')).toBe('Test Finetune');
    expect(repoHeader.props('path')).toBe('test-namespace/test-name');
  });

  it.skip("shows the notebook button when endpoint is available", () => {
    const wrapper = createWrapper();
    expect(wrapper.find('el-button').exists()).toBe(true);
  });

  it.skip("renders the iframe when finetune.endpoint is available", () => {
    const wrapper = createWrapper();
    expect(wrapper.find('iframe').exists()).toBe(true);
    expect(wrapper.find('iframe').attributes('src')).toContain('test.endpoint');
  });

  it("renders no data message when finetune.endpoint is not available", async () => {
    const wrapper = createWrapper({ finetune: { endpoint: null } });
    await wrapper.vm.$nextTick(); // Wait for reactivity
    expect(wrapper.find('.flex.items-center').exists()).toBe(true);
  });
});
