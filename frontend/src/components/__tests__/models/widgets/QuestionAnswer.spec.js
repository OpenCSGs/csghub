import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import QuestionAnswer from "@/components/models/widgets/QuestionAnswer.vue";
import { ElMessage } from 'element-plus';

// Mock csrfFetch
vi.mock("../../../packs/csrfFetch", () => {
    return vi.fn((url, options) => {
        switch (url) {
            case '/predict':
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ result: "get result" })
                });
            case '/internal_api/models/test/model/predict':
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ result: "get result" })
                });
            default:
                return Promise.resolve({ ok: false, json: () => Promise.resolve({ message: "推理失败" }) });
        }
    });
});

// 创建挂载函数
const createWrapper = (props = {}) => {
    return mount(QuestionAnswer, {
        props: {
            namespacePath: "test/model",
            currentBranch: "main",
            ...props
        },
        global: {
            mocks: {
                $t: (key) => key,
                $i18n: {
                    locale: 'en'
                }
            }
        }
    });
};

describe("QuestionAnswer", () => {
    it("mounts correctly", () => {
        const wrapper = createWrapper();
        expect(wrapper.vm).toBeDefined();
    });

    it("calculates text input length correctly", async () => {
        const wrapper = createWrapper();
        const inputText = "test input";
        await wrapper.vm.countTextLength(inputText);
        expect(wrapper.vm.textInputLength).toBe(inputText.length);
    });

    it.skip("sends inference test and receives result", async () => {
        const wrapper = createWrapper();
        await wrapper.setData({ textInput: "test input" });
        await wrapper.vm.sendInferenceTest();

        expect(wrapper.vm.textOutput).toBe("get result");
        expect(wrapper.vm.loading).toBe(false);
    });

    it.skip("handles inference failure", async () => {
        // Mock csrfFetch to simulate failure
        vi.mock("../../../packs/csrfFetch", () => {
            return vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({ message: "推理失败" }) }));
        });

        const wrapper = createWrapper();
        await wrapper.setData({ textInput: "test input" });
        await wrapper.vm.sendInferenceTest();

        expect(ElMessage).toHaveBeenCalledWith({ message: 'test error', type: "warning" });
        expect(wrapper.vm.loading).toBe(false);
    });

    it("renders markdown output correctly", () => {
        const wrapper = createWrapper();
        const markdownText = "# Hello World";
        const renderedHtml = wrapper.vm.renderMarkdown(markdownText);
        expect(renderedHtml).toContain("<h1>Hello World</h1>");
    });
});
