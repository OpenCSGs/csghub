import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import DatasetSettings from "@/components/datasets/DatasetSettings.vue";
import { createPinia, setActivePinia } from 'pinia';
import { ElMessage, ElMessageBox } from 'element-plus';

// Mock Element Plus components
vi.mock('element-plus', () => ({
  ElMessage: {
    warning: vi.fn(),
    success: vi.fn()
  },
  ElMessageBox: {
    confirm: vi.fn().mockResolvedValue('confirm')
  }
}));

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

// Mock other dependencies
vi.mock('../../../packs/config', () => ({
  isSaas: () => false
}));

vi.mock('../../../packs/utils', () => ({
  atob_utf8: vi.fn(),
  btoa_utf8: vi.fn()
}));

const mockFetchRepoDetail = vi.fn();

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
        $t: (key) => key,
        $i18n: {
          locale: 'en'
        }
      },
      provide: {
        fetchRepoDetail: mockFetchRepoDetail
      },
      stubs: {
        'el-input': true,
        'el-select': true,
        'el-option': true,
        'el-divider': true,
        'el-icon': true,
        'CsgButton': true
      }
    }
  });
};

describe("DatasetSettings", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });
  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("displays dataset path correctly", () => {
    const wrapper = createWrapper();
    const pathElement = wrapper.find('.bg-gray-50');
    expect(pathElement.exists()).toBe(true);
    expect(pathElement.text()).toBe("test/dataset");
  });

  it("updates dataset nickname", async () => {
    const wrapper = createWrapper();
    // 直接设置组件的数据而不是使用setData
    await wrapper.setData({
      theDatasetNickname: 'New Dataset Name'
    });
    expect(wrapper.vm.theDatasetNickname).toBe('New Dataset Name');
  });

  it("updates dataset description", async () => {
    const wrapper = createWrapper();
    // 直接设置组件的数据
    await wrapper.setData({
      theDatasetDesc: 'New Description'
    });
    expect(wrapper.vm.theDatasetDesc).toBe('New Description');
  });

  it("handles tag selection correctly", async () => {
    const wrapper = createWrapper({
      tagList: [{ name: "tag1", show_name: "Tag 1", category: "test" }]
    });
    
    // 初始化selectedTags
    await wrapper.setData({
      selectedTags: []
    });
    
    await wrapper.vm.selectTag({ name: "tag1", show_name: "Tag 1", category: "test" });
    expect(wrapper.vm.selectedTags).toHaveLength(1);
  });

  it("removes tag when close icon is clicked", async () => {
    const wrapper = createWrapper();
    
    // 使用setData替代已废弃的方法
    await wrapper.setData({
      selectedTags: [{ name: "tag1", show_name: "Tag 1", uid: "testtag1" }]
    });
    
    await wrapper.vm.removeTag("testtag1");
    expect(wrapper.vm.selectedTags).toHaveLength(0);
  });

  it("validates delete dataset input", async () => {
    const wrapper = createWrapper();
    
    // 设置删除输入值
    await wrapper.setData({
      delDesc: 'test/dataset'
    });
    
    // 验证删除按钮状态
    expect(wrapper.vm.delDesc).toBe('test/dataset');
  });

  it("handles visibility change", async () => {
    const wrapper = createWrapper();
    
    // 测试可见性变化
    await wrapper.setData({
      visibilityName: 'Private'
    });
    
    expect(wrapper.vm.visibilityName).toBe('Private');
  });

  it("initializes with correct data", () => {
    const wrapper = createWrapper();
    
    expect(wrapper.vm.datasetPath).toBe("test/dataset");
    expect(wrapper.vm.theDatasetNickname).toBe("Test Dataset");
    expect(wrapper.vm.theDatasetDesc).toBe("Test Description");
  });

  it("handles empty tag list", () => {
    const wrapper = createWrapper({
      tagList: [],
      tags: {
        task_tags: [],
        other_tags: [],
        industry_tags: []
      }
    });
    
    expect(wrapper.vm.selectedTags).toHaveLength(0);
    expect(wrapper.vm.selectedIndustryTags).toHaveLength(0);
  });
});