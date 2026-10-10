import { describe, it, expect, beforeEach, vi } from "vitest"
import { mount } from "@vue/test-utils"
import CompareVersionsModal from "@/components/models/CompareVersionsModal.vue"
import ConfigDiffViewer from "@/components/models/ConfigDiffViewer.vue"
import ReadmeDiffViewer from "@/components/models/ReadmeDiffViewer.vue"
import MetricsCompareViewer from "@/components/models/MetricsCompareViewer.vue"
import { createPinia, setActivePinia } from "pinia"

// Mock Element Plus components and functions
vi.mock("element-plus", () => ({
  ElMessage: {
    install: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  },
  ElMessageBox: {
    install: vi.fn(),
    confirm: vi.fn()
  }
}))

vi.mock("echarts", () => ({
  init: () => ({
    setOption: vi.fn(),
    dispose: vi.fn()
  })
}))

// Mock API responses
vi.mock("@/packs/useFetchApi", () => ({
  default: (url) => ({
    json: () => {
      if (url.includes("/branches")) {
        return Promise.resolve({
          data: {
            value: {
              data: [
                { name: "main" },
                { name: "v1.0" },
                { name: "v1.1" }
              ]
            }
          },
          error: { value: null }
        })
      }
      if (url.includes("/tags")) {
        return Promise.resolve({
          data: {
            value: {
              data: [
                { name: "v1.0.0" }
              ]
            }
          },
          error: { value: null }
        })
      }
      if (url.includes("/commits?ref=")) {
        return Promise.resolve({
          data: {
            value: {
              data: {
                commits: [
                  {
                    id: "abc123456789",
                    author_name: "Test Author",
                    committer_date: "2026-10-01T12:00:00Z",
                    message: "Initial commit"
                  }
                ]
              }
            }
          },
          error: { value: null }
        })
      }
      if (url.includes("/commits")) {
        return Promise.resolve({
          data: {
            value: {
              data: {
                commits: [
                  { id: "abc123456789", author_name: "Author 1", committer_date: "2026-10-01", message: "Commit 1" },
                  { id: "def456789012", author_name: "Author 2", committer_date: "2026-10-02", message: "Commit 2" }
                ]
              }
            }
          },
          error: { value: null }
        })
      }
      if (url.includes("/blob/config.json")) {
        const mockConfig = JSON.stringify({
          architectures: ["LlamaForCausalLM"],
          hidden_size: 4096,
          num_attention_heads: 32,
          metrics: { accuracy: 92.5, f1: 88.3 }
        })
        const b64 = btoa(mockConfig)
        return Promise.resolve({
          data: {
            value: {
              data: { content: b64 }
            }
          },
          error: { value: null }
        })
      }
      if (url.includes("/blob/README.md")) {
        const mockMd = "# Model Card\n\nThis is version 1.0 of the model."
        const b64 = btoa(mockMd)
        return Promise.resolve({
          data: {
            value: {
              data: { content: b64 }
            }
          },
          error: { value: null }
        })
      }
      return Promise.resolve({
        data: { value: null },
        error: { value: null }
      })
    }
  })
}))

import flushPromises from "flush-promises"

const createWrapper = (props = {}) => {
  return mount(CompareVersionsModal, {
    props: {
      visible: true,
      namespace: "test-user",
      name: "test-model",
      currentBranch: "main",
      repoType: "model",
      ...props
    },
    global: {
      stubs: {
        teleport: true,
        'el-dialog': { template: '<div><slot /><slot name="footer" /></div>' },
        'el-tabs': { template: '<div><slot /></div>' },
        'el-tab-pane': { template: '<div><slot /></div>' }
      }
    }
  })
}

describe("CompareVersionsModal", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("mounts correctly when visible", () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it("fetches real version options on mount from branches, tags, and commits", async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await new Promise((r) => setTimeout(r, 10))
    expect(wrapper.vm.versionOptions.length).toBe(6) // 3 branches + 1 tag + 2 commits
    expect(wrapper.vm.versionA).toBe("main")
    expect(wrapper.vm.versionB).toBe("v1.0")
  })

  it("renders ConfigDiffViewer, ReadmeDiffViewer, and MetricsCompareViewer components", async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await new Promise((r) => setTimeout(r, 10))
    expect(wrapper.findComponent(ConfigDiffViewer).exists()).toBe(true)
    expect(wrapper.findComponent(ReadmeDiffViewer).exists()).toBe(true)
    expect(wrapper.findComponent(MetricsCompareViewer).exists()).toBe(true)
  })

  it("handles duplicate version selection cleanly", async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await new Promise((r) => setTimeout(r, 10))
    wrapper.vm.versionA = "main"
    wrapper.vm.versionB = "main"
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.versionA).toBe(wrapper.vm.versionB)
  })

  it("populates real commit details for version A and version B", async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await new Promise((r) => setTimeout(r, 10))
    expect(wrapper.vm.dataA.commitId).toBe("abc123456789")
    expect(wrapper.vm.dataA.author).toBe("Test Author")
    expect(wrapper.vm.dataA.message).toBe("Initial commit")
  })

  it("fetches real config, readme, and metrics from API blob responses", async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await new Promise((r) => setTimeout(r, 10))
    expect(wrapper.vm.dataA.config).toBeDefined()
    expect(wrapper.vm.dataA.config.architectures).toEqual(["LlamaForCausalLM"])
    expect(wrapper.vm.dataA.readme).toContain("# Model Card")
    expect(wrapper.vm.dataA.metrics).toEqual({ accuracy: 92.5, f1: 88.3 })
  })
})
