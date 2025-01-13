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
vi.mock('../../../packs/useFetchApi', () => ({
  default: () => ({
    post: () => ({
      json: () => Promise.resolve({
        data: { value: { data: { path: 'testuser/testdataset' } } },
        error: { value: null }
      })
    })
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
    const validateForm = () => {
      return new Promise(resolve => {
        wrapper.vm.$refs.dataFormRef.validate(valid => resolve(valid))
      })
    }
    it("validates required fields", async() => {
      expect(await validateForm()).toBe(false)
    })

    it("accepts invalid dataset name", async () => {
      wrapper.vm.dataForm.name = '**__invalid-name'
      await wrapper.vm.$nextTick()
      expect(await validateForm()).toBe(false)
    });

    it("accepts valid dataset name", async () => {
      wrapper.vm.dataForm.name = 'valid-name'
      await wrapper.vm.$nextTick()
      expect(await validateForm()).toBe(true)
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

      const button = wrapper.findComponent({ name: 'CsgButton' })
      await button.trigger('click');
      setTimeout(() => {
        expect(window.location.href).toBe('/datasets/testuser/testdataset');
      }, 300);
    });
  });
});
