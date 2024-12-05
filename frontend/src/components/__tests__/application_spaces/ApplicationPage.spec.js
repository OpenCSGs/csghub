import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ApplicationPage from "../../application_spaces/ApplicationPage.vue";

// mock vue3-cookies
vi.mock("vue3-cookies", () => ({
  useCookies: () => ({
    cookies: {
      get: vi.fn().mockReturnValue("mock-token"),
    },
  }),
}));

describe("ApplicationPage", () => {

  it("mount correctly", () => {
    const wrapper = mount(ApplicationPage);
    expect(wrapper.exists()).toBe(true);
  });

  describe("props", () => {
    describe("appEndpoint", () => {
      it("renders iframe with correct src", () => {
        const wrapper = mount(ApplicationPage, {
          props: {
            appEndpoint: "https://example.com/app",
          },
        });

        const src = wrapper.find("#application-space-iframe").attributes("src")
        expect(src).toBe("https://example.com/app?jwt=mock-token");
      });
    });
  });
});
