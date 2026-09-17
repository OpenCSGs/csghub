import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MarkdownViewer from "@/components/shared/viewers/MarkdownViewer.vue";

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
}));

vi.mock("tippy.js", () => ({
  default: vi.fn(),
}));

describe("MarkdownViewer.vue", () => {
  it("renders markdown content properly", () => {
    const wrapper = mount(MarkdownViewer, {
      props: {
        content: "# Test Heading\n\nThis is a paragraph.",
      },
    });

    expect(wrapper.html()).toContain("<h1");
    expect(wrapper.html()).toContain("Test Heading");
    expect(wrapper.html()).toContain("This is a paragraph.");
  });

  it("renders code block toolbar with language badge and copy button", () => {
    const markdownWithCode = "```python\nprint('hello world')\n```";
    const wrapper = mount(MarkdownViewer, {
      props: {
        content: markdownWithCode,
      },
    });

    const html = wrapper.html();
    expect(html).toContain("code-block-container");
    expect(html).toContain("code-block-header");
    expect(html).toContain("PYTHON");
    expect(html).toContain("clipboard-copy");
    expect(html).toContain("Copy");
    expect(html).toContain("hello world");
  });

  it("renders fallback label for code blocks without a specified language", () => {
    const plainCodeBlock = "```\nsome plain text\n```";
    const wrapper = mount(MarkdownViewer, {
      props: {
        content: plainCodeBlock,
      },
    });

    const html = wrapper.html();
    expect(html).toContain("code-block-container");
    expect(html).toContain("CODE");
    expect(html).toContain("some plain text");
  });
});
