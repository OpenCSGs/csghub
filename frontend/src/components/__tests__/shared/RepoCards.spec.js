import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import RepoCards from "@/components/shared/RepoCards.vue";
import RepoItem from "@/components/shared/RepoItem.vue";
import TagSidebar from "@/components/tags/TagSidebar.vue";
import CsgPagination from "@/components/shared/CsgPagination.vue";
import { ElInput, ElSelect } from 'element-plus';
import useFetchApi from '@/packs/useFetchApi';

vi.mock('@/packs/config', () => ({
    isEE: () => true,
    isSaas: () => true,
}));
vi.mock('../../packs/config', () => ({
    isEE: () => true,
    isSaas: () => true,
}), { virtual: true });


const mockApiCalls = [];
vi.mock('@/packs/useFetchApi', () => ({
    default: vi.fn((url) => {
        mockApiCalls.push(url);
        const json = () => {
            if (url === '/tags') {
                return Promise.resolve({
                    data: {
                        value: {
                            data: [
                                { category: 'task', scope: 'model', built_in: true, group: 'computer_vision', name: 'computer_vision', show_name: 'Computer Vision' },
                                { category: 'framework', scope: 'model', built_in: true, name: 'pytorch', show_name: 'PyTorch' },
                                { category: 'language', scope: 'model', built_in: true, name: 'english', show_name: 'English' },
                                { category: 'license', scope: 'model', built_in: true, name: 'MIT', show_name: 'MIT License' }
                            ]
                        }
                    }
                });
            }
            if (url.startsWith('/spaces')) {
                return Promise.resolve({ data: { value: { data: [
                    { id: 1, name: 'Space One', path: 'org/space-1', updated_at: '2024-01-01', downloads: 1 },
                    { id: 2, name: 'Space Two', path: 'org/space-2', updated_at: '2024-01-02', downloads: 2 },
                ], total: 2 } } });
            }
            if (url.startsWith('/mcps')) {
                return Promise.resolve({ data: { value: { data: { data: [
                    { id: 'm1', name: 'MCP One' },
                    { id: 'm2', name: 'MCP Two' },
                ], total: 2 } } } });
            }
            if (url.startsWith('/models')) {
                return Promise.resolve({ data: { value: { data: [], total: 0 } } });
            }
            return Promise.resolve({ data: { value: { data: [], total: 0 } } });
        };
        return { json };
    })
}));

const createWrapper = (props = {}) => {
    return mount(RepoCards, {
        props: {
            repoType: 'model',
            ...props
        },
        global: {
            components: {
                RepoItem,
                TagSidebar,
                CsgPagination
            },
            stubs: {
                'svg-icon': true,
                'el-message': true
            }
        }
    });
};

const originalLocation = typeof window !== 'undefined' ? window.location : undefined;
const originalOpen = typeof window !== 'undefined' ? window.open : undefined;
const originalHistory = typeof window !== 'undefined' ? window.history : undefined;
const originalImage = global.Image;

beforeAll(() => {
    if (typeof window !== 'undefined') {
        Object.defineProperty(window, 'location', {
            value: { href: 'http://localhost:3000/models?page=2&search=abc&sort=trending&filter=all&source=all' },
            writable: true,
            configurable: true,
        });
        Object.defineProperty(window, 'history', {
            value: { replaceState: vi.fn(), pushState: vi.fn() },
            configurable: true,
        });
        window.open = vi.fn();
    }
    vi.stubGlobal('Image', class {
        constructor() {
            setTimeout(() => { if (typeof this.onload === 'function') this.onload(); }, 0);
        }
        set src(_) {}
    });
});

afterAll(() => {
    if (typeof window !== 'undefined' && originalLocation) {
        Object.defineProperty(window, 'location', { value: originalLocation, configurable: true });
    }
    if (typeof window !== 'undefined' && originalHistory) {
        Object.defineProperty(window, 'history', { value: originalHistory, configurable: true });
    }
    if (typeof window !== 'undefined') {
        window.open = originalOpen;
    }
    if (originalImage) {
        vi.stubGlobal('Image', originalImage);
    } else {
        delete global.Image;
    }
});

beforeEach(() => {
    mockApiCalls.length = 0;
    vi.clearAllMocks();
});

describe("RepoCards", () => {
    it("mounts correctly", () => {

        const wrapper = createWrapper();
        expect(wrapper.vm).toBeDefined();
    });

    it("renders correct components based on repoType", () => {
        const wrapper = createWrapper({ repoType: 'model' });
        expect(wrapper.findComponent(TagSidebar).exists()).toBe(true);
        expect(wrapper.findComponent(ElInput).exists()).toBe(true);
        expect(wrapper.findComponent(ElSelect).exists()).toBe(true);
    });

    it("calculates correct perPage based on repoType", () => {
        // 模拟不同窗口宽度测试space类型
        const spaceWrapper = createWrapper({ repoType: 'space' });
        
        // 测试默认窗口宽度下的perPage（通常是最小值6）
        expect(spaceWrapper.vm.perPage).toBeGreaterThanOrEqual(6);
        expect(spaceWrapper.vm.perPage).toBeLessThanOrEqual(20);
        
        // 测试非space类型
        const modelWrapper = createWrapper({ repoType: 'model' });
        expect(modelWrapper.vm.perPage).toBe(16);
    });

    it("calculates correct perPage for space type at different window widths", () => {
        const spaceWrapper = createWrapper({ repoType: 'space' });
        
        spaceWrapper.vm.windowWidth = 1600; // >= 1536
        expect(spaceWrapper.vm.perPage).toBe(20);
        
        spaceWrapper.vm.windowWidth = 1400; // >= 1280
        expect(spaceWrapper.vm.perPage).toBe(12);
        
        spaceWrapper.vm.windowWidth = 800; // >= 768
        expect(spaceWrapper.vm.perPage).toBe(10);
        
        spaceWrapper.vm.windowWidth = 500; // < 768
        expect(spaceWrapper.vm.perPage).toBe(6);
    });

    it("handles tag selection correctly", async () => {
        const wrapper = createWrapper();
        await wrapper.vm.resetTags({ "task": ['vision'], "framework": ['pytorch'], "language": ['python'], "license": ['MIT'] });

        expect(wrapper.vm.activeTags.task).toContain('vision');
        expect(wrapper.vm.activeTags.framework).toContain('pytorch');
        expect(wrapper.vm.activeTags.language).toContain('python');
        expect(wrapper.vm.activeTags.license).toContain('MIT');
        expect(mockApiCalls.some(u => u.includes('/models'))).toBe(true);
        const lastUrl = mockApiCalls.reverse().find(u => u.startsWith('/models'));
        expect(lastUrl).toContain('tag_category=task');
        expect(lastUrl).toContain('tag_name=vision');
        expect(lastUrl).toContain('tag_category=framework');
        expect(lastUrl).toContain('tag_name=pytorch');
    });

    it("loads repos on mount for space type and renders items", async () => {
        const wrapper = createWrapper({ repoType: 'space' });
        expect(mockApiCalls.some(u => u.startsWith('/spaces'))).toBe(true);
        await new Promise(r => setTimeout(r, 0));
        expect(wrapper.vm.reposData?.length).toBe(2);
        const grid = wrapper.find('[class*="grid-cols-4"]');
        expect(grid.exists()).toBe(true);
    });

    it("initializes from URL params and updates URL on filter change", async () => {
        const wrapper = createWrapper({ repoType: 'model' });
        expect(wrapper.vm.currentPage).toBe(2);
        expect(wrapper.vm.nameFilterInput).toBe('abc');
        expect(wrapper.vm.sortSelection).toBe('trending');
        expect(wrapper.vm.filterSelection).toBe('all');
        expect(wrapper.vm.sourceSelection).toBe('all');

        await wrapper.setData?.({});
        wrapper.vm.nameFilterInput = 'hello';
        await wrapper.vm.filterChange();
        expect(window.history.pushState).toHaveBeenCalled();
        const modelsUrls = mockApiCalls.filter(u => u.startsWith('/models'));
        const calledUrl = modelsUrls[modelsUrls.length - 1] || '';
        expect(calledUrl).toContain('search=hello');
        expect(calledUrl).toContain('sort=trending');
        expect(calledUrl).toContain('per=16');
    });

    it("pagination emits currentChange and triggers reload with page update", async () => {
        const wrapper = createWrapper({ repoType: 'model' });
        const pager = wrapper.findComponent(CsgPagination);
        expect(pager.exists()).toBe(true);
        await pager.vm.$emit('currentChange', 3);
        const url = mockApiCalls.reverse().find(u => u.startsWith('/models'));
        expect(url).toContain('page=3');
    });

    it("renders MCP list and guide button triggers window.open", async () => {
        const wrapper = createWrapper({ repoType: 'mcp' });
        expect(mockApiCalls.some(u => u.startsWith('/mcps'))).toBe(true);
        await new Promise(r => setTimeout(r, 0));
        await wrapper.vm.handleMcpGuideClick();
        expect(window.open).toHaveBeenCalledWith('https://opencsg.com/docs/mcp/mcp_intro', '_blank');
    });

    it("renders empty model state when EE and no repos", async () => {
        const wrapper = createWrapper({ repoType: 'model' });
        await new Promise(r => setTimeout(r, 0));
        expect(wrapper.findComponent({ name: 'EmptyModels' }).exists() || wrapper.text().includes('Empty')).toBeTruthy();
    });
});
