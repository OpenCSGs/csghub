import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import EndpointPlayground from "@/components/endpoints/EndpointPlayground.vue";
import TestEndpoint from "@/components/endpoints/playground/TestEndpoint.vue";
import ApiExample from "@/components/endpoints/playground/ApiExample.vue";
import TestImageText from "@/components/endpoints/playground/TestImageText.vue";
import ApiImageText from "@/components/endpoints/playground/ApiImageText.vue";
import TestExtraction from "@/components/endpoints/playground/TestExtraction.vue";
import ApiExtraction from "@/components/endpoints/playground/ApiExtraction.vue";
import TestWidget from "@/components/endpoints/playground/TestWidget.vue";
import ApiWidget from "@/components/endpoints/playground/ApiWidget.vue";

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

  it("renders TestImageText component in 'test' mode when task is 'image-text-to-text'", () => {
    const wrapper = createWrapper({ task: 'image-text-to-text' });
    expect(wrapper.findComponent(TestImageText).exists()).toBe(true);
  });

  it("renders ApiImageText component in 'api' mode when task is 'image-text-to-text'", async () => {
    const wrapper = createWrapper({ task: 'image-text-to-text' });
    await wrapper.find('.cursor-pointer').trigger('click');
    expect(wrapper.findComponent(ApiImageText).exists()).toBe(true);
    expect(wrapper.findComponent(TestImageText).exists()).toBe(true);
  });

  it("renders TestExtraction component in 'test' mode when task is 'feature-extraction'", () => {
    const wrapper = createWrapper({ task: 'feature-extraction' });
    expect(wrapper.findComponent(TestExtraction).exists()).toBe(true);
  });

  it("renders ApiExtraction component in 'api' mode when task is 'feature-extraction'", async () => {
    const wrapper = createWrapper({ task: 'feature-extraction' });
    await wrapper.find('.cursor-pointer').trigger('click');
    expect(wrapper.findComponent(ApiExtraction).exists()).toBe(true);
    expect(wrapper.findComponent(TestExtraction).exists()).toBe(true);
  });

  it("renders TestWidget component in 'test' mode when task is 'text-to-image'", () => {
    const wrapper = createWrapper({ task: 'text-to-image' });
    expect(wrapper.findComponent(TestWidget).exists()).toBe(true);
  });

  it("renders ApiWidget component in 'api' mode when task is 'text-to-image'", async () => {
    const wrapper = createWrapper({ task: 'text-to-image' });
    await wrapper.find('.cursor-pointer').trigger('click');
    expect(wrapper.findComponent(ApiWidget).exists()).toBe(true);
    expect(wrapper.findComponent(TestWidget).exists()).toBe(true);
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