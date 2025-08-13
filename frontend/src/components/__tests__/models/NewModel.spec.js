import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import NewModel from "@/components/models/NewModel.vue";
import ElementPlus from 'element-plus'
import waitForExpect from 'wait-for-expect';

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
}));

// Mock UserStore
vi.mock('../../../stores/UserStore', () => ({
  default: () => ({
    username: 'testuser',
    orgs: [{ path: 'testorg' }]
  })
}));

// Mock useFetchApi to handle license fetching and form submission
vi.mock('../../../packs/useFetchApi', () => {
  const mock = vi.fn().mockImplementation((url) => {
    if (url.startsWith('/tags')) {
      return {
        json: () => Promise.resolve({
          data: { value: { data: [{name: 'MIT'}, {name: 'Apache-2.0'}] } }
        })
      };
    }
    if (url === '/models') {
      return {
        post: () => ({
          json: () => Promise.resolve({
            data: { value: { data: { path: 'testuser/testmodel' } } },
            error: { value: null }
          })
        })
      };
    }
    // Default mock for any other calls
    return {
      post: () => ({
        json: () => Promise.resolve({ data: { value: {} }, error: { value: null } })
      }),
      json: () => Promise.resolve({ data: { value: {} } })
    };
  });
  return { default: mock };
});

const createWrapper = (props) => {
  return mount(NewModel, {
    global: {
      plugins: [ElementPlus],
      provide: {
        nameRule: /^[a-zA-Z][a-zA-Z0-9-_.]*[a-zA-Z0-9]$/,
      },
      stubs: {
        SvgIcon: true,
        PublicAndPrivateRadioGroup: true,
        // Stub CsgButton to be a simple button that emits a click event
        CsgButton: {
          template: '<button @click="$emit(\'click\')"><slot/></button>',
          props: ['loading']
        }
      }
    },
    props: {
      licenses: [['MIT', 'MIT License']],
      ...props
    }
  });
};

// Helper to trigger form submission and wait for reactivity
async function triggerFormButton(wrapper) {
  const button = wrapper.find('button');
  await button.trigger('click');
  // Wait for the next DOM update cycle
  await wrapper.vm.$nextTick();
}

describe("NewModel", () => {
  beforeEach(() => {
    // Reset mocks and window.location before each test
    vi.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  describe("mount", () => {
    it("mounts correctly", async () => {
      const wrapper = createWrapper();
      // Wait for async operations in onMounted to complete
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("form validation", () => {
    it("validates required fields", async () => {
      const wrapper = createWrapper();
      await new Promise(resolve => setTimeout(resolve, 0)); // Wait for mount
      // Clear pre-filled fields to test required rule
      wrapper.vm.dataForm.owner = '';
      wrapper.vm.dataForm.name = '';
      wrapper.vm.dataForm.license = '';
      await triggerFormButton(wrapper);
      
      await waitForExpect(() => {
        const formErrors = wrapper.findAll('.el-form-item__error');
        expect(formErrors.length).toBe(3); // owner, name, license
      });
    });

    it("validates invalid model name", async () => {
      const wrapper = createWrapper();
      await new Promise(resolve => setTimeout(resolve, 0));
      wrapper.vm.dataForm.name = 'a'; // Invalid length
      wrapper.vm.dataForm.license = 'MIT'; // Provide valid license
      await triggerFormButton(wrapper);
      
      await waitForExpect(() => {
        const error = wrapper.find('.el-form-item__error');
        expect(error.exists()).toBe(true);
        expect(error.text()).toContain('rule.lengthLimit');
      });
    });

    it("validates valid form", async () => {
      const wrapper = createWrapper();
      await new Promise(resolve => setTimeout(resolve, 0));
      wrapper.vm.dataForm.owner = 'testuser';
      wrapper.vm.dataForm.name = 'valid_model';
      wrapper.vm.dataForm.license = 'MIT';
      await triggerFormButton(wrapper);
      
      await waitForExpect(() => {
        expect(wrapper.find('.el-form-item__error').exists()).toBe(false);
      });
    });

    it("validates owner selection", async () => {
      const wrapper = createWrapper();
      await new Promise(resolve => setTimeout(resolve, 0));
      wrapper.vm.dataForm.owner = ''; // Set invalid owner
      await triggerFormButton(wrapper);
      
      await waitForExpect(() => {
        const formErrors = wrapper.findAll('.el-form-item__error');
        const ownerError = formErrors.filter(e => e.text().includes('all.pleaseSelect'));
        expect(ownerError.length).toBeGreaterThan(0);
      });
    });
  });

  describe("form submission", () => {
    it("redirects on successful submission", async () => {
      const wrapper = createWrapper();
      await new Promise(resolve => setTimeout(resolve, 0));

      // Fill the form with valid data
      wrapper.vm.dataForm = {
        owner: 'testuser',
        name: 'valid-model',
        nickname: 'Test Model',
        license: 'MIT',
        desc: 'Test description',
        visibility: 'public'
      };

      await triggerFormButton(wrapper);
      
      await waitForExpect(() => {
        expect(window.location.href).toBe('/models/testuser/testmodel');
      });
    });
  });
});
