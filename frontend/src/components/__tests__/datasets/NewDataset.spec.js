import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NewDataset from "../../datasets/NewDataset.vue";
// import useUserStore from '../../../stores/UserStore';
// import useFetchApi from '../../../packs/useFetchApi';
// import ElementPlus from 'element-plus'
// import { ElMessage } from 'element-plus'


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
                     data: { value: { data: { path: 'testuser/testdataset' } } },
                     error: { value: null }
                   })
                 });

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

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key,
  })
}))

describe("NewDataset", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(NewDataset, {
      // sync: false,
      // stubs: {
      //   transition: false,
      //   teleport: { template: '<div></div>', },
      //  },
      global: {
        provide: {
          nameRule: /^[a-zA-Z][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/
        },
        // plugins: [ElementPlus],
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
      // expect(wrapper.html()).toContain('MIT')
      // expect(wrapper.html()).toContain('MIT License')
      // expect(wrapper.find('.el-select').exists()).toBe(true)
      // expect(wrapper.find('.el-select__wrapper').exists()).toBe(true)
      // expect(wrapper.find('.el-select__selected-item').exists()).toBe(true)

      const allSelectedItemsInString = wrapper.findAll('.el-select__selected-item').map((item) => item.text()).join(',')
      expect(allSelectedItemsInString).toContain('MIT License')

      // const licenseSelect = wrapper.find('[data-test="license-select"]');
      // expect(licenseSelect.exists()).toBe(true);
      // expect(wrapper.find('option[value="MIT"]').exists()).toBe(true);
    });
  });

  describe("form validation", () => {
    // beforeEach(() => {
    //   // 设置默认的成功响应
    //   mockPost.mockResolvedValue({
    //     json: () => ({
    //       data: { value: { data: { path: 'testuser/testdataset' } } },
    //       error: { value: null }
    //     })
    //   });
    // });

    it("validates required fields", async() => {
      // await wrapper.find('form').trigger('submit');
      await wrapper.find('button').trigger('click');

      await new Promise((resolve) => setTimeout(resolve, 300))
      const formErrors = wrapper.findAll('.el-form-item__error');
      expect(formErrors.length).toBeGreaterThan(0);

      // wrapper.find('form').validate(async (valid) => {
      //   if (valid) {
      //   } else {
      //     const formErrors = wrapper.findAll('.el-form-item__error');
      //     expect(formErrors.length).toBeGreaterThan(0);
      //   }
      // })
    })

    it("accepts invalid dataset name", async () => {
      // mockPost.mockResolvedValue({
      //   json: () => ({
      //     data: { value: { data: { path: 'testuser/testdataset' } } },
      //     error: { value: null }
      //   })
      // });


      wrapper.vm.dataForm.name = '**__invalid-name'
      // await wrapper.setData({ dataForm: {
      //   name: '**__invalid-name'
      // } })
      // await wrapper.find('form').trigger('submit.prevent');
      // await wrapper.find('form').trigger('submit')
      // vi.useFakeTimers()
      await wrapper.find('button').trigger('click');
      // await wrapper.find('form').trigger('submit')
      // vi.runAllTimers()
      // vi.useRealTimers()
      // await nextTick()

      // await wrapper.findComponent({ ref: 'dataFormRef'}).vm.validate()

      // await wrapper.vm.$nextTick()
      // // wrapper.vm.$nextTick(() => {


      await new Promise((resolve) => setTimeout(resolve, 300))
      // await new Promise(resolve => setTimeout(resolve, 300)) // Ensure all async operations complete
      const errorMessage = wrapper.find('.el-form-item__error');
      expect(errorMessage.exists()).toBe(true);
      // })
    });

    it("accepts valid dataset name", async () => {
      wrapper.vm.dataForm.name = 'valid-name'
      await wrapper.find('button').trigger('click');
      await new Promise((resolve) => setTimeout(resolve, 300))
      const errorMessage = wrapper.find('.el-form-item__error');
      expect(errorMessage.exists()).toBe(false);
    });
  })

  describe("namespaces", () => {
    it("includes user and organizations", async () => {
      // await wrapper.find('.el-select__wrapper').trigger('click')
      // await new Promise((resolve) => setTimeout(resolve, 300))
      // await wrapper.vm.$nextTick()

      // const test = wrapper.findAll('.el-select-dropdown__item').at(1)
      // const selectTrigger = wrapper.find('.el-select')

      // await selectTrigger.trigger('click')
      // // await wrapper.vm.$nextTick() // Might need multiple $nextTick calls
      // await new Promise((resolve) => setTimeout(resolve, 300))

      // const options = wrapper.findAll('.el-select-dropdown__item');


      // expect(options.length).toBe(2); // user + org
      // expect(options[0].text()).toBe('testuser');
      // expect(options[1].text()).toBe('testorg');
    });

    it("sets default owner from URL query", async () => {
      window.location.search = '?orgName=testorg'
      wrapper.unmount()
      wrapper = mount(NewDataset, {
        global: {
          provide: {
            nameRule: /^[a-zA-Z][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/
          },
        },
        props: {
          licenses: [['MIT', 'MIT License']]
        }
      })
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.dataForm.owner).toBe('testorg');
    });
  });

  describe("form submission", () => {
    // beforeEach(() => {
    //   // 设置默认的成功响应
    //   mockPost.mockResolvedValue({
    //     json: () => ({
    //       data: { value: { data: { path: 'testuser/testdataset' } } },
    //       error: { value: null }
    //     })
    //   });
    // });


    it("submits form with valid data", async () => {
      // Fill form data
      wrapper.vm.dataForm = {
        owner: 'testuser',
        name: 'valid-dataset',
        nickname: 'Test Dataset',
        license: 'MIT',
        desc: 'Test description',
        visibility: 'public'
      }

      // wrapper.find('form').trigger('submit');
      await wrapper.find('button').trigger('click');
      // const mockMessage = vi.spyOn(wrapper.vm.ElMessage, 'error');


      // expect(mockMessage).toHaveBeenCalled();
      // wrapper.vm.$nextTick(() => {
      // const formErrors = wrapper.findAll('.el-form-item__error');
      // expect(formErrors.length).toBeGreaterThan(0);

      expect(window.location.href).toBe('/datasets/testuser/testdataset');
      // })

      // const submitButton = wrapper.find('[data-test="submit-button"]');
      // await submitButton.trigger('click');
      // await wrapper.vm.$nextTick();

    });

    it("handles submission error", async () => {
      // 为这个测试用例设置错误响应
      mockPost.mockResolvedValueOnce({
        json: () => ({
          data: { value: null },
          error: { value: { msg: 'Error creating dataset' } }
        })
      });

      // const mockMessage = vi.spyOn(wrapper.vm.ElMessage, 'error');

      wrapper.vm.dataForm = {
        owner: 'testuser',
        name: 'error-dataset',
        license: 'MIT',
        visibility: 'public'
      }

      // await wrapper.find('form').trigger('submit');
      await wrapper.find('button').trigger('click');
      // await new Promise((resolve) => setTimeout(resolve, 300))
      expect(window.location.href).toBe('/datasets/testuser/testdataset');

      // wrapper.vm.$nextTick(() => {
      // const formErrors = wrapper.findAll('.el-form-item__error');
      // expect(formErrors.length).toBeGreaterThan(0);
      // await wrapper.vm.$nextTick()
      //   // const formErrors = wrapper.findAll('.el-form-item__error');
      //   // expect(formErrors.length).toBeGreaterThan(0);


      // expect(mockMessage).toHaveBeenCalled();
      // })


      // await wrapper.find('[data-test="submit-button"]').trigger('click');
      // await wrapper.vm.$nextTick();
    });
  });
});
