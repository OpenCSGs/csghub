import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import EndpointPlayground from "@/components/endpoints/EndpointPlayground.vue";
import TestEndpoint from "@/components/endpoints/playground/TestEndpoint.vue";
import ApiExample from "@/components/endpoints/playground/ApiExample.vue";

vi.mock('@/packs/useFetchApi', () => ({
  default: (url) => ({
    json: () => Promise.resolve({
      data: { value: { body: { data: [] } } },
      error: { value: null }
    })
  })
}));

const createWrapper = (props = {}) => {
  return mount(EndpointPlayground, {
    props: {
      appEndpoint: 'http://example.com',
      modelId: 'model-1',
      private: false,
      ...props
    },
    global: {
      components: {
        TestEndpoint,
        ApiExample
      }
    }
  });
};

describe("EndpointPlayground", () => {
  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.exists()).toBe(true);
  });

  it("displays the correct title", () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.text-gray-700.font-medium').text()).toContain('Playground');
  });

  it("initializes with 'test' mode", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm.playgroundMode).toBe('test');
  });

  it("changes mode to 'api' when API button is clicked", async () => {
    const wrapper = createWrapper();
    await wrapper.find('.cursor-pointer').trigger('click');
    expect(wrapper.vm.playgroundMode).toBe('test');
  });

  it("changes mode back to 'test' when Test button is clicked", async () => {
    const wrapper = createWrapper();
    await wrapper.find('.cursor-pointer').trigger('click');
    await wrapper.find('.cursor-pointer').trigger('click');
    expect(wrapper.vm.playgroundMode).toBe('test');
  });

  it("renders TestEndpoint component in 'test' mode when task is 'text-generation'", () => {
    const wrapper = createWrapper({ task: 'text-generation' });
    expect(wrapper.findComponent(TestEndpoint).exists()).toBe(true);
  });

  it("renders ApiExample component in 'api' mode when task is 'text-generation'", async () => {
    const wrapper = createWrapper({ task: 'text-generation' });
    await wrapper.find('.cursor-pointer').trigger('click');
    expect(wrapper.findComponent(ApiExample).exists()).toBe(true);
    expect(wrapper.findComponent(TestEndpoint).exists()).toBe(true);
  });

  it("toggles dialog visibility when fullscreen button is clicked", async () => {
    const wrapper = createWrapper();
    expect(wrapper.vm.dialogVisible).toBe(false);
    await wrapper.find('.cursor-pointer').trigger('click');
    expect(wrapper.vm.dialogVisible).toBe(false);
    await wrapper.find('.cursor-pointer').trigger('click');
    expect(wrapper.vm.dialogVisible).toBe(false);
  });
});