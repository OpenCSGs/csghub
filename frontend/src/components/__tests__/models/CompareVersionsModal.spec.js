import { describe, it, expect, beforeEach, vi } from "vitest"
import { mount } from "@vue/test-utils"
import CompareVersionsModal from "@/components/models/CompareVersionsModal.vue"
import ConfigDiffViewer from "@/components/models/ConfigDiffViewer.vue"
import ReadmeDiffViewer from "@/components/models/ReadmeDiffViewer.vue"
import MetricsCompareViewer from "@/components/models/MetricsCompareViewer.vue"
import { createPinia, setActivePinia } from "pinia"
import flushPromises from "flush-promises"

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

const { fetchApiMock } = vi.hoisted(() => ({
  fetchApiMock: vi.fn()
}))

vi.mock("@/packs/useFetchApi", () => ({
  default: (url) => ({
    json: () => fetchApiMock(url)
  })
}))

const jsonResponse = ({ data = null, error = null, status = 200 } = {}) => ({
  data: { value: data },
  error: { value: error },
  response: { value: { status } }
})

const encodeContent = (value) => btoa(typeof value === "string" ? value : JSON.stringify(value))

const MAIN_COMMIT = {
  id: "aaa111bbbb222ccc333",
  author_name: "Main Author",
  committer_date: "2026-10-01T12:00:00Z",
  message: "Main branch commit"
}

const V10_COMMIT = {
  id: "ddd444eeee555fff666",
  author_name: "V10 Author",
  committer_date: "2026-10-02T12:00:00Z",
  message: "v1.0 branch commit"
}

const MAIN_CONFIG = {
  architectures: ["LlamaForCausalLM"],
  hidden_size: 4096,
  metrics: { accuracy: 92.5, f1: 88.3 }
}

const V10_CONFIG = {
  architectures: ["LlamaForCausalLM"],
  hidden_size: 2048,
  metrics: { accuracy: 88.1, f1: 80.0 }
}

const TAXONOMY_TAGS = [
  { name: "text-generation", category: "task", scope: "model" },
  { name: "pytorch", category: "framework", scope: "model" }
]

const createDefaultFetchMock = () => async (url) => {
  if (url.includes("/tags")) {
    return jsonResponse({ data: { data: TAXONOMY_TAGS } })
  }

  if (url.endsWith("/branches") || url.includes("/branches?")) {
    return jsonResponse({
      data: {
        data: [{ name: "main" }, { name: "v1.0" }]
      }
    })
  }

  if (url.includes("/commits?")) {
    const ref = new URLSearchParams(url.split("?")[1] || "").get("ref")
    if (ref === "main" || ref === MAIN_COMMIT.id) {
      return jsonResponse({ data: { data: { commits: [MAIN_COMMIT] } } })
    }
    if (ref === "v1.0" || ref === V10_COMMIT.id) {
      return jsonResponse({ data: { data: { commits: [V10_COMMIT] } } })
    }
    return jsonResponse({ error: { msg: `Unknown ref ${ref}` }, status: 400 })
  }

  if (url.includes("/blob/")) {
    const [pathPart, queryPart] = url.split("?")
    const ref = new URLSearchParams(queryPart || "").get("ref")
    const fileName = pathPart.split("/blob/")[1]

    if (!ref) {
      return jsonResponse({ error: { msg: "Missing ref" }, status: 400 })
    }

    if (fileName === "config.json") {
      const config = ref === "v1.0" || ref === V10_COMMIT.id ? V10_CONFIG : MAIN_CONFIG
      return jsonResponse({ data: { data: { content: encodeContent(config) } } })
    }

    if (fileName === "README.md") {
      return jsonResponse({
        data: { data: { content: encodeContent(`# Model Card for ${ref}`) } }
      })
    }

    return jsonResponse({ error: { msg: "file not found" }, status: 404 })
  }

  return jsonResponse({ error: { msg: `Unhandled URL ${url}` }, status: 500 })
}

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
        "el-dialog": { template: "<div><slot /><slot name=\"footer\" /></div>" },
        "el-tabs": { template: "<div><slot /></div>" },
        "el-tab-pane": { template: "<div><slot /></div>" }
      }
    }
  })
}

const waitForLoad = async () => {
  await flushPromises()
  await new Promise((r) => setTimeout(r, 10))
  await flushPromises()
}

describe("CompareVersionsModal", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchApiMock.mockReset()
    fetchApiMock.mockImplementation(createDefaultFetchMock())
  })

  it("mounts correctly when visible", () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  it("does not call the /tags endpoint", async () => {
    createWrapper()
    await waitForLoad()
    const urls = fetchApiMock.mock.calls.map(([url]) => url)
    expect(urls.some((url) => url.includes("/tags"))).toBe(false)
  })

  it("builds version options from branches and commits only", async () => {
    const wrapper = createWrapper()
    await waitForLoad()

    expect(wrapper.vm.versionOptions.map((opt) => opt.type).sort()).toEqual([
      "branch",
      "branch",
      "commit",
      "commit"
    ])
    expect(wrapper.vm.versionOptions.map((opt) => opt.value)).toEqual([
      "main",
      "v1.0",
      MAIN_COMMIT.id,
      V10_COMMIT.id
    ])
    expect(wrapper.vm.versionOptions.some((opt) => opt.type === "tag")).toBe(false)
    expect(wrapper.vm.versionOptions.some((opt) => opt.value === "text-generation")).toBe(false)
    expect(wrapper.vm.versionA).toBe("main")
    expect(wrapper.vm.versionB).toBe("v1.0")
  })

  it("fetches comparison data using the selected branch and commit refs", async () => {
    const wrapper = createWrapper()
    await waitForLoad()

    wrapper.vm.versionA = "main"
    wrapper.vm.versionB = V10_COMMIT.id
    await wrapper.vm.fetchComparisonData()
    await waitForLoad()

    const comparisonUrls = fetchApiMock.mock.calls
      .map(([url]) => url)
      .filter((url) => url.includes("/commits?ref=") || url.includes("/blob/"))

    expect(comparisonUrls.some((url) => url.includes("ref=main"))).toBe(true)
    expect(comparisonUrls.some((url) => url.includes(`ref=${encodeURIComponent(V10_COMMIT.id)}`))).toBe(true)
    expect(wrapper.vm.dataA.commitId).toBe(MAIN_COMMIT.id)
    expect(wrapper.vm.dataA.author).toBe("Main Author")
    expect(wrapper.vm.dataA.config.hidden_size).toBe(4096)
    expect(wrapper.vm.dataB.commitId).toBe(V10_COMMIT.id)
    expect(wrapper.vm.dataB.author).toBe("V10 Author")
    expect(wrapper.vm.dataB.config.hidden_size).toBe(2048)
    expect(wrapper.vm.dataA.readme).toContain("main")
    expect(wrapper.vm.dataB.readme).toContain(V10_COMMIT.id)
  })

  it("never treats taxonomy tags as Git refs", async () => {
    const wrapper = createWrapper()
    await waitForLoad()

    const urls = fetchApiMock.mock.calls.map(([url]) => url)
    expect(urls.some((url) => url.includes("ref=text-generation") || url.includes("ref=pytorch"))).toBe(false)
    expect(wrapper.vm.versionOptions.map((opt) => opt.value)).not.toContain("text-generation")
    expect(wrapper.vm.versionOptions.map((opt) => opt.value)).not.toContain("pytorch")
  })

  it("renders comparison viewers after loading valid versions", async () => {
    const wrapper = createWrapper()
    await waitForLoad()
    expect(wrapper.findComponent(ConfigDiffViewer).exists()).toBe(true)
    expect(wrapper.findComponent(ReadmeDiffViewer).exists()).toBe(true)
    expect(wrapper.findComponent(MetricsCompareViewer).exists()).toBe(true)
  })

  it("handles duplicate version selection cleanly", async () => {
    const wrapper = createWrapper()
    await waitForLoad()
    wrapper.vm.versionA = "main"
    wrapper.vm.versionB = "main"
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.versionA).toBe(wrapper.vm.versionB)
  })

  it("shows an error when branch loading fails", async () => {
    fetchApiMock.mockImplementation(async (url) => {
      if (url.includes("/branches")) {
        return jsonResponse({ error: { msg: "branches unavailable" }, status: 500 })
      }
      return jsonResponse({ error: { msg: `Unhandled URL ${url}` }, status: 500 })
    })

    const wrapper = createWrapper()
    await waitForLoad()

    expect(wrapper.vm.versionLoadError).toContain("branches unavailable")
    expect(wrapper.vm.versionOptions).toEqual([])
    expect(wrapper.vm.comparisonError).toBe("")
    expect(wrapper.text()).toContain("branches unavailable")
  })

  it("shows missing-file state instead of fabricated comparison data", async () => {
    fetchApiMock.mockImplementation(async (url) => {
      if (url.includes("/tags")) {
        return jsonResponse({ data: { data: TAXONOMY_TAGS } })
      }
      if (url.includes("/branches")) {
        return jsonResponse({ data: { data: [{ name: "main" }, { name: "v1.0" }] } })
      }
      if (url.includes("/commits?")) {
        const ref = new URLSearchParams(url.split("?")[1] || "").get("ref")
        const commit = ref === "v1.0" ? V10_COMMIT : MAIN_COMMIT
        return jsonResponse({ data: { data: { commits: [commit] } } })
      }
      if (url.includes("/blob/")) {
        return jsonResponse({ error: { msg: "file not found" }, status: 404 })
      }
      return jsonResponse({ error: { msg: `Unhandled URL ${url}` }, status: 500 })
    })

    const wrapper = createWrapper()
    await waitForLoad()

    expect(wrapper.vm.dataA.config).toBeNull()
    expect(wrapper.vm.dataB.config).toBeNull()
    expect(wrapper.vm.dataA.readme).toBeNull()
    expect(wrapper.vm.dataA.metrics).toBeNull()
    expect(wrapper.vm.missingFilesMessage).toContain("config.json")
    expect(wrapper.vm.missingFilesMessage).toContain("README.md")
    expect(wrapper.text()).toContain("Version A missing")
  })

  it("shows an error when comparison APIs fail instead of fallback data", async () => {
    fetchApiMock.mockImplementation(async (url) => {
      if (url.includes("/branches")) {
        return jsonResponse({ data: { data: [{ name: "main" }, { name: "v1.0" }] } })
      }
      return jsonResponse({ error: { msg: "comparison backend failed" }, status: 500 })
    })

    const wrapper = createWrapper()
    await waitForLoad()

    expect(wrapper.vm.comparisonError).toContain("comparison backend failed")
    expect(wrapper.vm.dataA.config).toBeNull()
    expect(wrapper.vm.dataB.config).toBeNull()
    expect(wrapper.vm.dataA.commitId).toBe("")
    expect(wrapper.vm.dataB.commitId).toBe("")
    expect(wrapper.text()).toContain("comparison backend failed")
  })

  it("does not display fabricated mock fallback data as real comparison results", async () => {
    const wrapper = createWrapper()
    await waitForLoad()

    expect(wrapper.vm.dataA.config).toEqual(MAIN_CONFIG)
    expect(wrapper.vm.dataB.config).toEqual(V10_CONFIG)
    expect(JSON.stringify(wrapper.vm.dataA)).not.toMatch(/placeholder|demo|fake|fabricated/i)
    expect(wrapper.vm.dataA.metrics).toEqual(MAIN_CONFIG.metrics)
  })
})
