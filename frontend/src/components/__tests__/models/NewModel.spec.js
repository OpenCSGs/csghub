import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NewModel from "@/components/models/NewModel.vue";
import SvgIcon from '@/components/shared/SvgIcon.vue';
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const createWrapper = async (props) => {
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
  let wrapper;

  beforeEach(async () => {
    wrapper = await createWrapper();
  });

  describe("mount", async () => {
    it("mounts correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("form validation", () => {
    it("validates required fields", async () => {
      await wrapper.find('button').trigger('click');
      await new Promise((resolve) => setTimeout(resolve, 300));
      const formErrors = wrapper.findAll('.el-form-item__error');
      expect(formErrors.length).toBeGreaterThan(0);
    });

    it("accepts invalid model name", async () => {
      wrapper.vm.dataForm.name = '**__invalid-name';
      await wrapper.find('button').trigger('click');
      await new Promise((resolve) => setTimeout(resolve, 300));
      const errorMessage = wrapper.find('.el-form-item__error');
      expect(errorMessage.exists()).toBe(true);
    });

    it("accepts valid model name", async () => {
      wrapper.vm.dataForm.name = 'valid-model';
      await wrapper.find('button').trigger('click');
      await new Promise((resolve) => setTimeout(resolve, 300));
      const errorMessage = wrapper.find('.el-form-item__error');
      expect(errorMessage.exists()).toBe(false);
    });
  });

  describe("namespaces", () => {
    it("sets default owner from URL query", async () => {
      window.location.search = '?orgName=testorg';
      wrapper.unmount();
      wrapper = await createWrapper();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log(wrapper.vm.dataForm.owner);
      
      expect(wrapper.vm.dataForm.owner).toBe('testorg');
    });
  });

  describe("form submission", () => {
    it("submits form with valid data", async () => {
      wrapper.vm.dataForm = {
        owner: 'testuser',
        name: 'valid-model',
        nickname: 'Test Model',
        license: 'MIT',
        desc: 'Test description',
        visibility: 'public'
      };

      await wrapper.find('button').trigger('click');
      
      // 等待异步操作完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(window.location.href).toBe('/models/testuser/testmodel');
    });
  });
});
