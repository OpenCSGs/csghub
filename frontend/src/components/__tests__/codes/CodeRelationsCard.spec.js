import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { mount } from "@vue/test-utils";
import CodeRelationsCard from "@/components/codes/CodeRelationsCard.vue";
import RepoItem from "@/components/shared/RepoItem.vue";

// Mock window.location.href and Image to satisfy RepoItem.vue runtime needs
const originalLocation = typeof window !== 'undefined' ? window.location : undefined;
const originalImage = global.Image;

beforeAll(() => {
  // Ensure window.location.href exists for new URL(window.location.href)
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'location', {
      value: { href: 'http://localhost/?page=1&search=kw&sort=updated' },
      writable: true,
      configurable: true,
    });
  }

  // Stub Image used in RepoItem's icon existence check
  vi.stubGlobal('Image', class {
    constructor() {
      // call onload asynchronously to simulate a successful load
      setTimeout(() => {
        if (typeof this.onload === 'function') this.onload();
      }, 0);
    }
    set src(_) {
      // no-op; onload will fire via constructor timeout
    }
  });
});

afterAll(() => {
  if (typeof window !== 'undefined' && originalLocation) {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      configurable: true,
    });
  }
  if (originalImage) {
    vi.stubGlobal('Image', originalImage);
  } else {
    // cleanup stub if none originally
    // @ts-ignore
    delete global.Image;
  }
});

const createWrapper = (props) => {
  return mount(CodeRelationsCard, {
    props: {
      namespacePath: 'test/namespace',
      codes: [],
      ...props
    }
  });
};

describe("CodeRelationsCard", () => {
  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("renders correctly with props", () => {
    const codes = [{
      id: 1,
      name: 'Code 1',
      path: 'user/code-1',
      updated_at: '2024-03-20 10:00:00',
      downloads: 100
    }, {
      id: 2,
      name: 'Code 2',
      path: 'user/code-2',
      updated_at: '2024-03-20 10:00:00',
      downloads: 200
    }];
    const wrapper = createWrapper({ codes });
    expect(wrapper.findAllComponents(RepoItem).length).toBe(codes.length);
  });
});
