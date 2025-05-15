import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DatasetSettings from "@/components/datasets/DatasetSettings.vue";

// Mock the API response
vi.mock('../../../packs/useFetchApi', () => ({
  default: (url) => ({
    post: () => ({
      json: () => Promise.resolve({
        data: { value: { msg: 'Success' } },
        error: { value: null }
      })
    }),
    put: () => ({
      json: () => Promise.resolve({
        data: { value: { msg: 'Success' } },
        error: { value: null }
      })
    }),
    delete: () => ({
      json: () => Promise.resolve({
        data: { value: null },
        error: { value: null }
      })
    }),
    get: () => ({
      json: () => Promise.resolve({
        data: {
          value: {
            data: {
              content: btoa('test content'),
              sha: 'test-sha'
            }
          }
        },
        error: { value: null }
      })
    }),
    json: () => {
      if (url === '/tags') {
        return Promise.resolve({
          data: {
            value: {
              data: [
                { name: 'tag1', category: 'industry', scope: 'dataset', show_name: 'Tag 1' },
                { name: 'tag2', category: 'industry', scope: 'dataset', show_name: 'Tag 2' }
              ]
            }
          },
          error: { value: null }
        })
      }
      return Promise.resolve({
        data: { value: null },
        error: { value: null }
      })
    }
  })
}));

const mockFetchRepoDetail = vi.fn()

const createWrapper = (props = {}) => {
  return mount(DatasetSettings, {
    props: {
      path: "test/dataset",
      datasetNickname: "Test Dataset",
      datasetDesc: "Test Description",
      default_branch: "main",
      tagList: [],
      tags: {
        task_tags: [],
        other_tags: [],
        industry_tags: []
      },
      ...props
    },
    global: {
      mocks: {
        $t: (key) => key
      },
      provide: {
        fetchRepoDetail: mockFetchRepoDetail
      }
    }
  });
};

describe("DatasetSettings", () => {
  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("displays dataset path correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.bg-gray-50').text()).toBe("test/dataset");
  });

  it("updates dataset nickname", async () => {
    const wrapper = createWrapper();
    await wrapper.find('input').setValue('New Dataset Name');
    await wrapper.findAll('button').find(btn => btn.text() === 'all.update').trigger('click');
    expect(wrapper.vm.theDatasetNickname).toBe('New Dataset Name');
  });

  it("updates dataset description", async () => {
    const wrapper = createWrapper();
    const textarea = wrapper.find('textarea');
    await textarea.setValue('New Description');
    const updateButtons = wrapper.findAll('button');
    await updateButtons[1].trigger('click');
    expect(wrapper.vm.theDatasetDesc).toBe('New Description');
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

  it.skip("handles visibility change", async () => {
    const wrapper = createWrapper();
    const select = wrapper.find('.el-select');
    await select.trigger('click');
    const options = wrapper.findAll('.el-option');
    await options[0].trigger('click');
    expect(wrapper.vm.visibilityName).toBe('Private');
  });

  it("validates delete dataset input", async () => {
    const wrapper = createWrapper();
    const deleteInput = wrapper.findAll('input').at(-1);
    await deleteInput.setValue('test/dataset');
    const deleteButton = wrapper.find('#confirmDelete');
    expect(deleteButton.classes()).toContain('btn-danger');
  });
});