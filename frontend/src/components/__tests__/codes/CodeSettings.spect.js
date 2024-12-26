import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import CodeSettings from "@/components/codes/CodeSettings.vue";
import { createPinia, setActivePinia } from 'pinia';
import { ElMessage } from 'element-plus';

vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    warning: vi.fn()
  }
}));

// Mock the API response
vi.mock('../../../packs/useFetchApi', () => ({
  default: (url) => ({
    post: () => ({
      json: () => Promise.resolve({
        data: { value: { data: { path: 'testuser/testcode' } } },
        error: { value: null }
      })
    }),
    json: () => {
      return Promise.resolve({
        data: { value: null },
        error: { value: null }
      })
    }
  })
}));

const createWrapper = (props = {}) => {
  return mount(CodeSettings, {
    props: {
      path: "test/code",
      codeNickname: "Test Code",
      codeDesc: "Test Description",
      default_branch: "main",
      ...props
    },
  });
};

describe("CodeSettings", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("displays code path correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.bg-gray-50').text()).toBe("test/code");
  });

  it.skip("updates code nickname when button is clicked", async () => {
    const wrapper = createWrapper();
    await wrapper.setData({ codeNickname: "New Name" });
    await wrapper.find('button').trigger('click');
    expect(ElMessage.success).toHaveBeenCalled();
  });

  it.skip("shows warning when trying to update empty nickname", async () => {
    const wrapper = createWrapper();
    await wrapper.setData({ codeNickname: "" });
    const updateButton = wrapper.findAll('button').find(btn => btn.text() === 'all.update');
    await updateButton.trigger('click');
    expect(ElMessage.warning).toHaveBeenCalled();
  });
});
