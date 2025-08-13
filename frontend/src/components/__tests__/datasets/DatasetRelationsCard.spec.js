import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import DatasetRelationsCard from "@/components/datasets/DatasetRelationsCard.vue";
import RepoItem from "@/components/shared/RepoItem.vue";

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
