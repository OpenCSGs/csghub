import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import NewDataset from "../../datasets/NewDataset.vue";


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
      const allSelectedItemsInString = wrapper.findAll('.el-select__selected-item').map((item) => item.text()).join(',')
      expect(allSelectedItemsInString).toContain('MIT License')
    });
  });

  describe("form validation", () => {
    it("validates required fields", async() => {
      // await wrapper.find('form').trigger('submit');
      await wrapper.find('button').trigger('click');

      await new Promise((resolve) => setTimeout(resolve, 300))
      const formErrors = wrapper.findAll('.el-form-item__error');
      expect(formErrors.length).toBeGreaterThan(0);
    })

    it("accepts invalid dataset name", async () => {
      wrapper.vm.dataForm.name = '**__invalid-name'
      await wrapper.find('button').trigger('click');
      await new Promise((resolve) => setTimeout(resolve, 300))
      const errorMessage = wrapper.find('.el-form-item__error');
      expect(errorMessage.exists()).toBe(true);
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

      await wrapper.find('button').trigger('click');
      expect(window.location.href).toBe('/datasets/testuser/testdataset');
    });
  });
});
