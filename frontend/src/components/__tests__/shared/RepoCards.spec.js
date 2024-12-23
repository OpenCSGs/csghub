import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import RepoCards from "@/components/shared/RepoCards.vue";
import RepoItem from "@/components/shared/RepoItem.vue";
import TagSidebar from "@/components/tags/TagSidebar.vue";
import CsgPagination from "@/components/shared/CsgPagination.vue";
import { ElInput, ElSelect } from 'element-plus';

// Mock getQueryParams
vi.mock('@/components/shared/RepoCards.vue', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        getQueryParams: () => ({
            tag: 'test-tag',
            tagType: 'test-type'
        })
    };
});

// Mock fetch API
vi.mock('@/packs/useFetchApi', () => ({
    default: vi.fn(() => ({
        json: () => Promise.resolve({
            data: {
                value: {
                    data: [
                        {
                            id: 1,
                            name: 'Repo 1',
                            path: 'user/repo-1',
                            updated_at: '2024-03-20 10:00:00',
                            downloads: 100
                        },
                        {
                            id: 2,
                            name: 'Repo 2',
                            path: 'user/repo-2',
                            updated_at: '2024-03-20 10:00:00',
                            downloads: 200
                        }
                    ],
                    total: 2
                }
            }
        })
    }))
}));

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
                                    group: 'computer_vision'
                                },
                                {
                                    category: 'framework',
                                    scope: 'model',
                                    built_in: true
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
                CsgPagination,
                ElInput,
                ElSelect
            },
            provide: {
                onPremise: 'true'
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

    it.skip("displays correct title and icon based on repoType", () => {
        const wrapper = createWrapper({ repoType: 'model' });
        expect(wrapper.find('h3 span').text()).toContain('models 0');
        expect(wrapper.find('svg-icon[name="models"]').exists()).toBe(true);
    });

    it.skip("handles filter changes", async () => {
        const wrapper = createWrapper();
        const searchInput = wrapper.findComponent(ElInput);

        await searchInput.setValue('test search');
        expect(wrapper.vm.nameFilterInput).toBe('test search');
    });

    it.skip("handles sort selection changes", async () => {
        const wrapper = createWrapper();
        const sortSelect = wrapper.findComponent(ElSelect);

        await sortSelect.setValue('most_download');
        expect(wrapper.vm.sortSelection).toBe('most_download');
    });

    it("calculates correct perPage based on repoType", () => {
        const modelWrapper = createWrapper({ repoType: 'model' });
        expect(modelWrapper.vm.perPage).toBe(16);

        const spaceWrapper = createWrapper({ repoType: 'space' });
        expect(spaceWrapper.vm.perPage).toBe(9);
    });

    it("handles tag selection correctly", async () => {
        const wrapper = createWrapper();
        await wrapper.vm.resetTags('vision', 'pytorch', 'python', 'MIT');

        expect(wrapper.vm.taskTag).toBe('vision');
        expect(wrapper.vm.frameworkTag).toBe('pytorch');
        expect(wrapper.vm.languageTag).toBe('python');
        expect(wrapper.vm.licenseTag).toBe('MIT');
    });

    it("loads repos on mount for space type", () => {
        const wrapper = createWrapper({ repoType: 'space' });
        expect(wrapper.vm.reposData).toBeDefined();
    });
});
