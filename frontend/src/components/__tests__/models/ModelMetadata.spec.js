import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ModelMetadata from "../../models/ModelMetadata.vue";

vi.mock("vue-i18n", () => ({
  useI18n: () => ({
    t: (key) => key,
  }),
}));

const createWrapper = (props = {}) => {
  return mount(ModelMetadata, {
    props: {
      framework: "Safetensors",
      data: {
        model_params: "7",
        tensor_type: "BF16",
        architecture: "LlamaForCausalLM",
      },
      namespacePath: "test/model",
      currentBranch: "main",
      ...props,
    },
    global: {
      stubs: {
        SvgIcon: true,
      },
    },
  });
};

describe("ModelMetadata.vue", () => {
  it("renders correctly for Safetensors framework", () => {
    const wrapper = createWrapper({
      framework: "Safetensors",
      data: {
        model_params: "7",
        tensor_type: "BF16",
      },
    });

    expect(wrapper.text()).toContain("Safetensors");
    expect(wrapper.text()).toContain("7B params");
    expect(wrapper.text()).toContain("BF16");
  });

  it("renders correctly for GGUF framework", () => {
    const wrapper = createWrapper({
      framework: "GGUF",
      data: {
        model_params: "14",
        architecture: "LlamaForCausalLM",
      },
    });

    expect(wrapper.text()).toContain("GGUF");
    expect(wrapper.text()).toContain("14B params");
    expect(wrapper.text()).toContain("LlamaForCausalLM");
  });

  it("renders correctly for PyTorch framework", () => {
    const wrapper = createWrapper({
      framework: "PyTorch",
      data: {
        model_params: "7",
        architecture: "BertForMaskedLM",
      },
    });

    expect(wrapper.text()).toContain("PyTorch");
    expect(wrapper.text()).toContain("7B params");
    expect(wrapper.text()).toContain("BertForMaskedLM");
  });

  it("renders correctly for ONNX framework", () => {
    const wrapper = createWrapper({
      framework: "ONNX",
      data: {
        model_params: "3",
        architecture: "ResNetForImageClassification",
      },
    });

    expect(wrapper.text()).toContain("ONNX");
    expect(wrapper.text()).toContain("3B params");
    expect(wrapper.text()).toContain("ResNetForImageClassification");
  });
});
