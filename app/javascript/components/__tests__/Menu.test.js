import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import Menu from "../user_settings/Menu.vue";

describe("Menu.vue", () => {
  it("renders correctly with props", () => {
    const wrapper = shallowMount(Menu, {
      propsData: {
        name: "John Doe",
        avatar: "avatar-url.jpg",
      },
      global: {
        components: {
          "router-link": RouterLinkStub,
          "el-avatar": {
            template: "<div></div>",
          },
        },
      },
    });
    expect(wrapper.html()).toContain('John Doe');
  });

  it("renders menu items correctly", () => {
    const wrapper = shallowMount(Menu, {
      propsData: {
        name: "John",
        avatar: "/path/to/avatar.png",
      }
    });

    // 断言渲染的 menu item 是否包含正确的文本内容和样式类名
    expect(wrapper.html()).toContain("个人资料");
    expect(wrapper.html()).toContain("账户信息");
    expect(wrapper.html()).toContain("访问令牌");
    expect(wrapper.html()).toContain("SSH和GPG密钥");
    expect(wrapper.html()).toContain("账单");
  });
  it("returns correct menu class for active menu item", () => {
    const wrapper = shallowMount(Menu, {
      propsData: {
        name: "John Doe",
        avatar: "avatar-url.jpg",
      },
    });
    // 设置 window.location.pathname
    Object.defineProperty(window, "location", {
      value: {
        pathname: "/settings/profile",
      },
      writable: true,
    });
    // 调用 menuClass 方法并进行断言
    expect(wrapper.vm.menuClass("/settings/profile")).toBe(
      "text-[#303133] font-semibold"
    );
    // 还原 window.location.pathname
    Object.defineProperty(window, "location", {
      value: {
        pathname: null,
      },
    });

    // 调用 menuClass 方法并进行断言
    expect(wrapper.vm.menuClass("/settings/profile")).toBe("");
  });
});
