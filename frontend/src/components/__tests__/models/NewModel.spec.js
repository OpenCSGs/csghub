import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NewModel from "@/components/models/NewModel.vue";
import SvgIcon from '@/components/shared/SvgIcon.vue';
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const createWrapper = (props) => {
  return mount(NewModel, {
    components: {
      ...ElementPlusIconsVue,
      SvgIcon,
    },
    global: {
      // plugins: [ElementPlus],
      provide: {
        nameRule: /^[a-zA-Z][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/,
      }
    },
    props: {
      licenses: [['MIT', 'MIT License']],
      ...props
    }
  });
};


// Mock stores
vi.mock('../../../stores/UserStore', () => ({
  default: () => ({
    username: 'testuser',
    orgs: [{ path: 'testorg' }]
  })
}));

// Mock useFetchApi
const mockPost = vi.fn().mockResolvedValue({
  json: async () => ({
    data: { value: { data: { path: 'testuser/testmodel' } } },
    error: { value: null }
  })
});

vi.mock('../../../packs/useFetchApi', () => ({
  default: () => {
    return {
      post: () => ({
        json: () => Promise.resolve({
          data: { value: { data: { path: 'testuser/testmodel' } } },
          error: { value: null }
        })
      })
    };
  }
}));

// Mock window.location
const mockLocation = {
  href: '',
  search: ''
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key,
  })
}));

// testUtils.js
export const createFetchApiMock = (mockResponses = {}) => {
  return () => ({
    post: () => {
      return Promise.resolve({
        data: { value: { data: { path: 'testuser/testmodel' } } },
        error: { value: null }
      });
    }
  });
};

describe("NewModel", () => {
  describe("mount", async () => {
    it("mounts correctly", () => {
      const wrapper = createWrapper();
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("form validation", () => {
    it("validates required fields", async () => {
      const wrapper = createWrapper();
      await wrapper.find('button').trigger('click');
      await delay(300);
      await wrapper.vm.$nextTick()
      const formErrors = wrapper.findAll('.el-form-item__error');
      expect(formErrors.length).toBeGreaterThan(0);
    });

    it("validates model name length", async () => {
      const wrapper = createWrapper();
      wrapper.vm.dataForm.name = 'a'; // Invalid length
      await wrapper.find('button').trigger('click');
      await delay(300);
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.el-form-item__error').exists()).toBe(true);

      wrapper.vm.dataForm.name = 'valid-model'; // Valid length
      await wrapper.find('button').trigger('click');
      await delay(300);
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.el-form-item__error').exists()).toBe(false);
    });

    it("validates owner selection", async () => {
      const wrapper = createWrapper();
      wrapper.vm.dataForm.owner = ''; // Invalid owner
      await wrapper.find('button').trigger('click');
      await delay(300);
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.el-form-item__error').exists()).toBe(true);
    });
  });

  describe("form submission", () => {
    it("shows success message on successful submission", async () => {
      const wrapper = createWrapper();
      
      // 设置表单数据以确保验证通过
      wrapper.vm.dataForm = {
        owner: 'testuser',
        name: 'valid-model',
        nickname: 'Test Model',
        license: 'MIT',
        desc: 'Test description',
        visibility: 'public'
      };

      // Mock the API response
      vi.mock('../../../packs/useFetchApi', () => ({
        default: () => ({
          post: () => ({
            json: () => Promise.resolve({
              data: { value: { data: { path: 'testuser/testmodel' } } },
              error: { value: null }
            })
          })
        })
      }));

      await wrapper.vm.handleSubmit(); // 调用提交方法
      await delay(2000); // 等待 API 响应
      await wrapper.vm.$nextTick(); // 等待 Vue 更新

      // 验证成功消息是否被调用
      // expect(wrapper.vm.$message).toHaveBeenCalledWith({
      //   message: '创建成功', // 确保这里的消息与实际消息一致
      //   type: 'success'
      // });

      // 验证 URL 是否正确
      expect(window.location.href).toBe('/models/testuser/testmodel');
    });

    it("shows error message on failed submission", async () => {
      const wrapper = createWrapper();
      // Mock the API response with an error
      vi.mock('../../../packs/useFetchApi', () => ({
        default: () => ({
          post: () => ({
            json: () => Promise.resolve({
              data: { value: null },
              error: { value: { msg: '创建失败' } }
            })
          })
        })
      }));

      await wrapper.find('button').trigger('click');
      await delay(300);
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.$message).toHaveBeenCalledWith({
        message: '创建失败: 创建失败',
        type: 'error'
      });
    });
  });
});
