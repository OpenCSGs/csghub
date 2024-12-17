import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NewModel from "@/components/models/NewModel.vue";
import SvgIcon from '@/components/shared/SvgIcon.vue';
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


const createWrapper = (props) => {
  return mount(NewModel, {
    global: {
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

      await wrapper.find('button').trigger('click');
      await delay(800);
      await wrapper.vm.$nextTick();

      // validate href is correct
      expect(window.location.href).toBe('/models/testuser/testmodel');
    });

  });
});
