import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ModelRelationsCard from "@/components/models/ModelRelationsCard.vue";
import RepoItem from "@/components/shared/RepoItem.vue";

const createWrapper = (props) => {
  return mount(ModelRelationsCard, {
    props: {
      namespacePath: 'test/namespace',
      models: [],
      ...props
    }
  });
};

describe("ModelRelationsCard", () => {
  it("mounts correctly", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it.skip("renders correctly with props", () => {
    const models = [{
      id: 1,
      name: 'Model 1',
      path: 'user/model-1',
      updated_at: '2024-03-20 10:00:00',
      downloads: 100
    }, {
      id: 2,
      name: 'Model 2',
      path: 'user/model-2',
      updated_at: '2024-03-20 10:00:00',
      downloads: 200
    }];
    const wrapper = createWrapper({ models });

    expect(wrapper.find('h3').text()).toContain('Model used to traintest/namespace');
    expect(wrapper.find('.text-gray-700').text()).toBe('Model used to train');
    expect(wrapper.findAllComponents(RepoItem).length).toBe(models.length);
  });
});
