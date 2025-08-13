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

let postApiMockFn = vi.fn().mockImplementation(
  () => ({
    json: () => Promise.resolve({
      data: { value: { data: { path: 'testuser/testdataset' } } },
      error: { value: null }
    })
  })
)
let getApiMockFn = vi.fn()

vi.mock('../../../packs/useFetchApi', () => ({
  default: () => ({
    json: getApiMockFn,
    post: postApiMockFn
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
    getApiMockFn.mockImplementation(
      () => Promise.resolve({
        data: { value: { data: [{
          "id": 92,
          "name": "apache-2.0",
          "category": "license",
          "group": "",
          "scope": "dataset",
          "built_in": true,
          "show_name": "",
          "created_at": "2024-03-27T09:11:06.652752Z",
          "updated_at": "2024-03-27T09:11:06.652752Z"
        }]}},
        error: { value: null }
      })
    )

    wrapper = mount(NewDataset, {
      global: {
        provide: {
          nameRule: /^[a-zA-Z][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/
        },
      },
      props: {
        licenses: [['MIT License', 'MIT']]
      }
    });
  });

  describe("mount", () => {
    it("mounts correctly", () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("renders license options", async () => {
      await getApiMockFn(); // Ensure the promise is resolved
      await wrapper.vm.$nextTick()

      expect(getApiMockFn).toHaveBeenCalled();

      // await getApiMockFn()
      const allSelectedItemsInString = wrapper.findAll('.el-select__selected-item').map((item) => item.text()).join(',')
      expect(allSelectedItemsInString).toContain('apache-2.0')
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
      wrapper.vm.dataForm.license = 'apach-2.0'
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

      await wrapper.find('button').trigger('click');
      await new Promise(resolve => setTimeout(resolve, 300));
      expect(window.location.href).toBe('/datasets/testuser/testdataset');
    });
  });
});
