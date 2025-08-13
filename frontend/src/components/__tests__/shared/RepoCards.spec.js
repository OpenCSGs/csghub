import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import RepoCards from "@/components/shared/RepoCards.vue";
import RepoItem from "@/components/shared/RepoItem.vue";
import TagSidebar from "@/components/tags/TagSidebar.vue";
import CsgPagination from "@/components/shared/CsgPagination.vue";
import { ElInput, ElSelect } from 'element-plus';


// Mock tags API response
vi.mock('@/packs/useFetchApi', () => ({
    default: vi.fn((url) => ({
        json: () => {
            if (url === '/tags') {
                return Promise.resolve({
                    data: {
                        value: {
                            data: [
                                {
                                    category: 'task',
                                    scope: 'model',
                                    built_in: true,
                                    group: 'computer_vision',
                                    name: 'computer_vision',
                                    show_name: 'Computer Vision'
                                },
                                {
                                    category: 'framework',
                                    scope: 'model',
                                    built_in: true,
                                    name: 'pytorch',
                                    show_name: 'PyTorch'
                                },
                                {
                                    category: 'language',
                                    scope: 'model',
                                    built_in: true,
                                    name: 'english',
                                    show_name: 'English'
                                },
                                {
                                    category: 'license',
                                    scope: 'model',
                                    built_in: true,
                                    name: 'MIT',
                                    show_name: 'MIT License'
                                }
                            ]
                        }
                    }
                });
            }
            return Promise.resolve({
                data: {
                    value: {
                        data: [],
                        total: 0
                    }
                }
            });
        }
    }))
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

window.location.href = 'http://localhost:3000/models';

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
        
        // 模拟不同窗口宽度
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
    });

    it("loads repos on mount for space type", () => {
        const wrapper = createWrapper({ repoType: 'space' });
        expect(wrapper.vm.reposData).toBeDefined();
    });
});
