import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NewDataset from "../../datasets/NewDataset.vue";
import useUserStore from '../../../stores/UserStore';
import useFetchApi from '../../../packs/useFetchApi';

// Mock stores
vi.mock('../../../stores/UserStore', () => ({
  default: () => ({
    username: 'testuser',
    orgs: [{ path: 'testorg' }]
  })
}));

// Mock useFetchApi
const mockPost = vi.fn();
vi.mock('../../../packs/useFetchApi', () => ({
  default: () => ({
    post: () => mockPost(),
  })
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

describe("NewDataset", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(NewDataset, {
      global: {
        provide: {
          nameRule: /^[a-zA-Z][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/
        }
      },
      props: {
        licenses: [['MIT', 'MIT License']]
      }
    });
  });

  describe("mount", () => {
    it("mounts correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("renders license options", () => {
      const licenseSelect = wrapper.find('[data-test="license-select"]');
      expect(licenseSelect.exists()).toBe(true);
      expect(wrapper.find('option[value="MIT"]').exists()).toBe(true);
    });
  });

  describe("form validation", () => {
    it("validates required fields", async () => {
      await wrapper.find('button').trigger('click');
      await wrapper.vm.$nextTick();
      
      const formErrors = wrapper.findAll('.el-form-item__error');
      expect(formErrors.length).toBeGreaterThan(0);
    });

    it("validates dataset name format", async () => {
      const nameInput = wrapper.find('[data-test="name-input"]');
      await nameInput.setValue('invalid-name-');
      await nameInput.trigger('blur');
      
      const errorMessage = wrapper.find('.el-form-item__error');
      expect(errorMessage.exists()).toBe(true);
    });

    it("accepts valid dataset name", async () => {
      const nameInput = wrapper.find('[data-test="name-input"]');
      await nameInput.setValue('valid-name');
      await nameInput.trigger('blur');
      
      const errorMessage = wrapper.find('.el-form-item__error');
      expect(errorMessage.exists()).toBe(false);
    });
  });

  describe("namespaces", () => {
    it("includes user and organizations", () => {
      const options = wrapper.findAll('.el-select-dropdown__item');
      expect(options.length).toBe(2); // user + org
      expect(options[0].text()).toBe('testuser');
      expect(options[1].text()).toBe('testorg');
    });

    it("sets default owner from URL query", async () => {
      window.location.search = '?orgName=testorg';
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.dataForm.owner).toBe('testorg');
    });
  });

  describe("form submission", () => {
    beforeEach(() => {
      // 设置默认的成功响应
      mockPost.mockResolvedValue({
        json: () => ({
          data: { value: { data: { path: 'testuser/testdataset' } } },
          error: { value: null }
        })
      });
    });

    it("submits form with valid data", async () => {
      // Fill form data
      await wrapper.setData({
        dataForm: {
          owner: 'testuser',
          name: 'valid-dataset',
          nickname: 'Test Dataset',
          license: 'MIT',
          desc: 'Test description',
          visibility: 'public'
        }
      });

      const submitButton = wrapper.find('[data-test="submit-button"]');
      await submitButton.trigger('click');
      await wrapper.vm.$nextTick();

      expect(window.location.href).toBe('/datasets/testuser/testdataset');
    });

    it("handles submission error", async () => {
      // 为这个测试用例设置错误响应
      mockPost.mockResolvedValueOnce({
        json: () => ({
          data: { value: null },
          error: { value: { msg: 'Error creating dataset' } }
        })
      });

      const mockMessage = vi.spyOn(ElMessage, 'error');
      
      await wrapper.setData({
        dataForm: {
          owner: 'testuser',
          name: 'error-dataset',
          license: 'MIT',
          visibility: 'public'
        }
      });

      await wrapper.find('[data-test="submit-button"]').trigger('click');
      await wrapper.vm.$nextTick();

      expect(mockMessage).toHaveBeenCalled();
    });
  });
});
