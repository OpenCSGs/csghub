import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CodeRelationsCard from "@/components/codes/CodeRelationsCard.vue";
import RepoItem from "@/components/shared/RepoItem.vue";

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
