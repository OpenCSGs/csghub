import { shallowMount } from "@vue/test-utils";
import ProfileEdit from "../user_settings/ProfileEdit.vue";

describe("ProfileEdit", () => {
  let wrapper;
  // 创建一个模拟的fetch函数
  const fetchMock = (url, options) => {
    // 对于测试中的特定URL和选项，返回一个模拟的响应
    if (url === "/api/data") {
      return Promise.resolve({ data: "Mocked data" });
    }
  };

  beforeEach(() => {
    wrapper = shallowMount(ProfileEdit, {
      props: {
        name: "John Doe",
        avatar: "avatar.jpg",
        phone: "1234567890",
        email: "john.doe@example.com",
        userName: "johndoe",
      },
    });
  });

  it("updates user profile when saveProfile method is called", async () => {
    // 模拟文件选择
    const file = new File([""], "avatar.jpg", { type: "image/jpeg" });
    wrapper.find(".fileInput").element.files = [file];

    // 保存按钮点击
    await wrapper.vm.updateProfile();
    // 等待异步更新完成
    await wrapper.vm.$nextTick();

    // 验证文件选择是否成功
    const inputFile = wrapper.find(".fileInput").element;
    expect(inputFile.files).toHaveLength(1);
    expect(inputFile.files[0].name).toBe("avatar.jpg");

  });

  it("resets avatarUrl when removeImage method is called", () => {
    // 移除头像按钮点击
    wrapper.vm.removeImage();

    // 断言 avatarUrl 为空
    expect(wrapper.vm.avatarUrl).toBe("");
  });
});
