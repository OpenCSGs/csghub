/**
 * @vitest-environment jsdom
 * @vitest-environment-options { "url": "https://hub.opencsg.com/models/test-namespace/test-repo" }
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import BranchDropdown from "../../shared/BranchDropdown.vue";

let { mockFetchApi } = vi.hoisted(() => {
  return {
    mockFetchApi: vi.fn(() => ({
      json: () => Promise.resolve({
        data: { value: { data: [{ name: "main" }, { name: "dev" }, { name: "feature/auth" }] } },
        error: { value: null }
      })
    }))
  };
});

vi.mock('../../../packs/useFetchApi', () => ({
  default: mockFetchApi
}));

const mockResetFileNotFound = vi.fn();
vi.mock('../../../stores/RepoTabStore', () => ({
  useRepoTabStore: () => ({
    resetFileNotFound: mockResetFileNotFound
  })
}));

const createWrapper = (props = {}) => {
  return mount(BranchDropdown, {
    props: {
      currentBranch: "main",
      ...props
    },
    global: {
      stubs: {
        SvgIcon: true,
        CsgButton: true,
        'el-dropdown': { template: '<div><slot /><slot name="dropdown" /></div>' },
        'el-dropdown-menu': { template: '<div><slot /></div>' },
        'el-dropdown-item': { template: '<div class="branch-dropdown-item" @click="$emit(\'click\')"><slot /></div>' },
        'el-input': {
          inheritAttrs: false,
          template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
          props: ['modelValue']
        }
      },
      mocks: {
        $t: (key) => {
          const map = {
            'all.filterBranches': 'Filter branches...',
            'all.branches': 'Branches',
            'all.noMatchingBranches': 'No matching branches'
          }
          return map[key] || key
        }
      }
    }
  });
};

describe("BranchDropdown", () => {
  let wrapper;

  beforeEach(async () => {
    mockFetchApi.mockClear();
    mockResetFileNotFound.mockClear();
    wrapper = createWrapper();
    await flushPromises();
  });

  it("mounts correctly and renders search box and header", () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-testid="branch-search-box"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="branch-count-header"]').exists()).toBe(true);
  });

  it("fetches branches on mount and resolves them", async () => {
    expect(mockFetchApi).toHaveBeenCalled();
    expect(wrapper.vm.branches).toEqual([
      { name: "main" },
      { name: "dev" },
      { name: "feature/auth" }
    ]);
  });

  it("filters branches case-insensitively based on searchQuery", async () => {
    wrapper.vm.searchQuery = "feat";
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredBranches).toEqual([{ name: "feature/auth" }]);

    wrapper.vm.searchQuery = "DEV";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.filteredBranches).toEqual([{ name: "dev" }]);
  });

  it("displays empty state when no branches match searchQuery", async () => {
    wrapper.vm.searchQuery = "non-existent-branch";
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.filteredBranches.length).toBe(0);
    const noBranches = wrapper.find('[data-testid="no-branches-found"]');
    expect(noBranches.exists()).toBe(true);
    expect(noBranches.text()).toContain("No matching branches");
  });

  it("renders active branch indicator for the current branch", async () => {
    const activeIndicators = wrapper.findAll('[data-testid="active-branch-indicator"]');
    expect(activeIndicators.length).toBe(1);
  });

  it("triggers changeBranch event, clears search query, and resets file not found state when clicked", async () => {
    wrapper.vm.searchQuery = "dev";
    await wrapper.vm.handleClick("dev");

    expect(wrapper.emitted().changeBranch[0]).toEqual(["dev"]);
    expect(mockResetFileNotFound).toHaveBeenCalled();
    expect(wrapper.vm.searchQuery).toBe("");
  });

  it("automatically emits changeBranch to default branch if props.currentBranch does not exist in resolved branch list", async () => {
    const nonExistentWrapper = createWrapper({ currentBranch: "non-existent" });
    await flushPromises();
    expect(nonExistentWrapper.emitted().changeBranch[0]).toEqual(["main"]);
  });
});
