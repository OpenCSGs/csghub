import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { mount } from "@vue/test-utils";
import DatasetRelationsCard from "@/components/datasets/DatasetRelationsCard.vue";
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
  return mount(DatasetRelationsCard, {
    props: {
      namespacePath: 'test/namespace',
      datasets: [],
      ...props
    }
  });
};

describe("DatasetRelationsCard", () => {
  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("renders correctly with props", () => {
    const datasets = [{
      id: 1,
      name: 'Dataset 1',
      path: 'user/dataset-1',
      updated_at: '2024-03-20 10:00:00',
      downloads: 100
    }, {
      id: 2,
      name: 'Dataset 2',
      path: 'user/dataset-2',
      updated_at: '2024-03-20 10:00:00',
      downloads: 200
    }];
    
    const wrapper = createWrapper({ datasets });

    // Test title and count display
    expect(wrapper.find('h3').text()).toContain('Associated Datasets2');
    expect(wrapper.find('h3 .text-gray-500').text().trim()).toBe('2');
    
    // Test RepoItem components rendering
    const repoItems = wrapper.findAllComponents(RepoItem);
    expect(repoItems.length).toBe(datasets.length);
    
    // Verify RepoItem props
    const firstRepoItem = repoItems[0];
    expect(firstRepoItem.props('repo')).toEqual(datasets[0]);
    expect(firstRepoItem.props('repoType')).toBe('dataset');
    expect(firstRepoItem.props('cardType')).toBe('relations');
  });

  it("renders correctly with empty datasets", () => {
    const wrapper = createWrapper({ datasets: [] });
    expect(wrapper.findAllComponents(RepoItem).length).toBe(0);
    expect(wrapper.find('h3 .text-gray-500').text().trim()).toBe('0');
  });
});
