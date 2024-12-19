import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ModelSettings from "@/components/models/ModelSettings.vue";
import { createPinia, setActivePinia } from 'pinia';
import { ElMessage, ElMessageBox } from 'element-plus';

// Mock Element Plus components and functions
vi.mock('element-plus', () => ({
  ElMessage: {
    install: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn()
  },
  ElMessageBox: {
    install: vi.fn(),
    confirm: vi.fn()
  }
}));

// Mock the API response
vi.mock('../../../packs/useFetchApi', () => ({
  default: (url) => ({
    post: () => ({
      json: () => Promise.resolve({
        data: { value: { data: { path: 'testuser/testmodel' } } },
        error: { value: null }
      })
    }),
    json: () => {
      // different url return different data
      if (url === '/tags') {
        return Promise.resolve({
          data: {
            value: {
              data: [
                { name: 'tag1', category: 'industry', scope: 'model', show_name: 'Tag 1' },
                { name: 'tag2', category: 'industry', scope: 'model', show_name: 'Tag 2' },
                { name: 'tag3', category: 'other', scope: 'model', show_name: 'Tag 3' }
              ]
            }
          },
          error: { value: null }
        })
      }
      // return empty data
      return Promise.resolve({
        data: { value: null },
        error: { value: null }
      })
    }
  })
}));

const createWrapper = (props = {}) => {
  return mount(ModelSettings, {
    props: {
      path: "test/model",
      modelNickname: "Test Model",
      modelDesc: "Test Description",
      default_branch: "main",
      tagList: [],
      tags: {
        task_tags: [],
        other_tags: [],
        industry_tags: []
      },
      ...props
    },
  });
};

describe("ModelSettings", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("displays model path correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.bg-gray-50').text()).toBe("test/model");
  });

  it.skip("updates model nickname when button is clicked", async () => {
    const wrapper = createWrapper();
    await wrapper.setData({ theModelNickname: "New Name" });
    await wrapper.find('button').trigger('click');
    expect(ElMessage.success).toHaveBeenCalled();
  });

  it.skip("shows warning when trying to update empty nickname", async () => {
    const wrapper = createWrapper();
    await wrapper.setData({ theModelNickname: "" });
    const updateButton = wrapper.findAll('button').find(btn => btn.text() === 'all.update');
    await updateButton.trigger('click');
    expect(ElMessage.warning).toHaveBeenCalled();
  });

  it("handles tag selection correctly", async () => {
    const wrapper = createWrapper({
      tagList: [{ name: "tag1", show_name: "Tag 1" }]
    });
    await wrapper.vm.selectTag({ name: "tag1", show_name: "Tag 1" });
    expect(wrapper.vm.selectedTags).toHaveLength(1);
  });

  it("removes tag when close icon is clicked", async () => {
    const wrapper = createWrapper();
    await wrapper.setData({
      selectedTags: [{ name: "tag1", show_name: "Tag 1" }]
    });
    await wrapper.vm.removeTag("tag1");
    expect(wrapper.vm.selectedTags).toHaveLength(0);
  });
});
