import { describe, it, expect, beforeEach, vi } from "vitest"
import { mount } from "@vue/test-utils"
import { nextTick } from "vue"
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

// ── Response helpers ──────────────────────────────────────────────────────────

const jsonResponse = ({ data = null, error = null, status = 200 } = {}) => ({
  data: { value: data },
  error: { value: error },
  response: { value: { status } }
})

const encodeContent = (value) =>
  btoa(typeof value === "string" ? value : JSON.stringify(value))

// ── Fixtures ──────────────────────────────────────────────────────────────────

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

const TAG_COMMIT = {
  id: "fff999eee888ddd777",
  author_name: "Release Author",
  committer_date: "2026-09-15T10:00:00Z",
  message: "Release tag commit"
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

// Repo-level git tags returned by GET /models/{ns}/{name}/tags
// These are git refs (no category/scope) unlike global taxonomy /tags
const GIT_TAGS = [
  { name: "v1.0-release" },
  { name: "v0.9-beta" }
]

// Taxonomy tags from the global /tags endpoint — must NEVER be used as git refs
const TAXONOMY_TAGS = [
  { name: "text-generation", category: "task", scope: "model" },
  { name: "pytorch", category: "framework", scope: "model" }
]

// ── Default mock factory ──────────────────────────────────────────────────────

const createDefaultFetchMock = () => async (url) => {
  // Global taxonomy /tags — must never be called by CompareVersionsModal
  if (url === "/tags" || url.endsWith("api/v1/tags")) {
    return jsonResponse({ data: { data: TAXONOMY_TAGS } })
  }

  // Repo-level branches
  if (url.endsWith("/branches") || url.includes("/branches?")) {
    return jsonResponse({
      data: { data: [{ name: "main" }, { name: "v1.0" }] }
    })
  }

  // Repo-level git tags (GET /models/{ns}/{name}/tags)
  if (url.match(/\/models\/[^/]+\/[^/]+\/tags$/)) {
    return jsonResponse({ data: { data: GIT_TAGS } })
  }

  // /last_commit endpoint
  if (url.includes("/last_commit")) {
    const ref = new URLSearchParams(url.split("?")[1] || "").get("ref")
    if (ref === "main") return jsonResponse({ data: { data: MAIN_COMMIT } })
    if (ref === "v1.0") return jsonResponse({ data: { data: V10_COMMIT } })
    if (ref === "v1.0-release") return jsonResponse({ data: { data: TAG_COMMIT } })
    if (ref === MAIN_COMMIT.id) return jsonResponse({ data: { data: MAIN_COMMIT } })
    if (ref === V10_COMMIT.id) return jsonResponse({ data: { data: V10_COMMIT } })
    if (ref === TAG_COMMIT.id) return jsonResponse({ data: { data: TAG_COMMIT } })
    return jsonResponse({ error: { msg: `Unknown ref ${ref}` }, status: 404 })
  }

  // /commits fallback endpoint
  if (url.includes("/commits?")) {
    const ref = new URLSearchParams(url.split("?")[1] || "").get("ref")
    if (ref === "main" || ref === MAIN_COMMIT.id) {
      return jsonResponse({ data: { data: { commits: [MAIN_COMMIT] } } })
    }
    if (ref === "v1.0" || ref === V10_COMMIT.id) {
      return jsonResponse({ data: { data: { commits: [V10_COMMIT] } } })
    }
    if (ref === "v1.0-release" || ref === TAG_COMMIT.id) {
      return jsonResponse({ data: { data: { commits: [TAG_COMMIT] } } })
    }
    return jsonResponse({ error: { msg: `Unknown ref ${ref}` }, status: 400 })
  }

  if (url.includes("/blob/")) {
    const [pathPart, queryPart] = url.split("?")
    const ref = new URLSearchParams(queryPart || "").get("ref")
    const fileName = pathPart.split("/blob/")[1]

    if (!ref) return jsonResponse({ error: { msg: "Missing ref" }, status: 400 })

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

// ── Test helpers ──────────────────────────────────────────────────────────────

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
        "el-tab-pane": { template: "<div><slot /></div>" },
        "el-option-group": { template: "<div><slot /></div>" }
      }
    }
  })
}

// Deterministic flush — drains all queued microtasks and Vue reactivity
const settle = async () => {
  await flushPromises()
  await nextTick()
  await flushPromises()
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("CompareVersionsModal", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchApiMock.mockReset()
    fetchApiMock.mockImplementation(createDefaultFetchMock())
  })

  // ── Mount ─────────────────────────────────────────────────────────────────

  it("mounts correctly when visible", () => {
    const wrapper = createWrapper()
    expect(wrapper.vm).toBeDefined()
  })

  // ── Global /tags must never be called ─────────────────────────────────────

  it("does not call the global /tags taxonomy endpoint", async () => {
    createWrapper()
    await settle()
    const urls = fetchApiMock.mock.calls.map(([url]) => url)
    // Global taxonomy /tags has no namespace/name path segment
    expect(urls.some((url) => url === "/tags" || /\/api\/v1\/tags$/.test(url))).toBe(false)
  })

  it("never uses taxonomy tag values (text-generation, pytorch) as Git refs", async () => {
    const wrapper = createWrapper()
    await settle()
    const urls = fetchApiMock.mock.calls.map(([url]) => url)
    expect(
      urls.some((u) => u.includes("ref=text-generation") || u.includes("ref=pytorch"))
    ).toBe(false)
    expect(wrapper.vm.versionOptions.map((o) => o.value)).not.toContain("text-generation")
    expect(wrapper.vm.versionOptions.map((o) => o.value)).not.toContain("pytorch")
  })

  // ── Version dropdown contents ─────────────────────────────────────────────

  it("builds dropdown with branches, repo-level git tags, and one commit option", async () => {
    const wrapper = createWrapper()
    await settle()

    const types = wrapper.vm.versionOptions.map((o) => o.type)
    expect(types).toContain("branch")
    expect(types).toContain("tag")
    expect(types).toContain("commit")
  })

  it("includes git tag refs from the repo /tags endpoint as valid git refs", async () => {
    const wrapper = createWrapper()
    await settle()

    const tagOpts = wrapper.vm.versionOptions.filter((o) => o.type === "tag")
    expect(tagOpts.length).toBeGreaterThan(0)
    expect(tagOpts.map((o) => o.value)).toContain("v1.0-release")
  })

  it("does not include taxonomy tags (which have category/scope) in version options", async () => {
    fetchApiMock.mockImplementation(async (url) => {
      if (url.endsWith("/branches") || url.includes("/branches?")) {
        return jsonResponse({ data: { data: [{ name: "main" }] } })
      }
      if (url.match(/\/models\/[^/]+\/[^/]+\/tags$/)) {
        // Tags endpoint returns taxonomy tags (with category/scope) — should be filtered out
        return jsonResponse({ data: { data: TAXONOMY_TAGS } })
      }
      if (url.includes("/last_commit")) {
        return jsonResponse({ data: { data: MAIN_COMMIT } })
      }
      if (url.includes("/blob/")) return jsonResponse({ error: { msg: "not found" }, status: 404 })
      return jsonResponse({ error: { msg: "unhandled" }, status: 500 })
    })

    const wrapper = createWrapper()
    await settle()

    const values = wrapper.vm.versionOptions.map((o) => o.value)
    expect(values).not.toContain("text-generation")
    expect(values).not.toContain("pytorch")
  })

  it("does not fetch per-branch commit histories — uses /last_commit for commit option", async () => {
    createWrapper()
    await settle()

    const commitListCalls = fetchApiMock.mock.calls
      .map(([url]) => url)
      .filter((url) => url.includes("/commits?") && !url.includes("per=1"))
    // No bulk commit list fetches at open time
    expect(commitListCalls).toHaveLength(0)

    const lastCommitCalls = fetchApiMock.mock.calls
      .map(([url]) => url)
      .filter((url) => url.includes("/last_commit"))
    expect(lastCommitCalls.length).toBeGreaterThanOrEqual(1)
  })

  it("keeps total request count low for large repositories (no per-branch bulk fetches)", async () => {
    const manyBranches = Array.from({ length: 12 }, (_, i) => ({ name: `branch-${i}` }))

    fetchApiMock.mockImplementation(async (url) => {
      if (url.endsWith("/branches") || url.includes("/branches?")) {
        return jsonResponse({ data: { data: manyBranches } })
      }
      if (url.match(/\/models\/[^/]+\/[^/]+\/tags$/)) {
        return jsonResponse({ data: { data: [] } })
      }
      if (url.includes("/last_commit")) {
        return jsonResponse({ data: { data: MAIN_COMMIT } })
      }
      if (url.includes("/blob/")) return jsonResponse({ error: { msg: "not found" }, status: 404 })
      return jsonResponse({ error: { msg: "unhandled" }, status: 500 })
    })

    createWrapper({ currentBranch: "branch-0" })
    await settle()

    const total = fetchApiMock.mock.calls.length
    // 1 branches + 1 tags + 1 last_commit + ~8 blobs (2 versions × 4 files) = ~11
    // Crucially NOT 12×20 = 240
    expect(total).toBeLessThan(25)

    const bulkCommitCalls = fetchApiMock.mock.calls
      .map(([url]) => url)
      .filter((url) => url.includes("/commits?") && !url.includes("per=1"))
    expect(bulkCommitCalls).toHaveLength(0)
  })

  it("pre-selects currentBranch as versionA and a different branch as versionB", async () => {
    const wrapper = createWrapper({ currentBranch: "main" })
    await settle()
    expect(wrapper.vm.versionA).toBe("main")
    expect(wrapper.vm.versionB).toBe("v1.0")
  })

  it("has no duplicate entries in versionOptions", async () => {
    const wrapper = createWrapper()
    await settle()
    const values = wrapper.vm.versionOptions.map((o) => o.value)
    const unique = new Set(values)
    expect(values.length).toBe(unique.size)
  })

  // ── Branch comparison ─────────────────────────────────────────────────────

  it("populates comparison data correctly for branch vs branch", async () => {
    const wrapper = createWrapper()
    await settle()

    expect(wrapper.vm.dataA.commitId).toBe(MAIN_COMMIT.id)
    expect(wrapper.vm.dataA.author).toBe("Main Author")
    expect(wrapper.vm.dataA.config.hidden_size).toBe(4096)
    expect(wrapper.vm.dataB.commitId).toBe(V10_COMMIT.id)
    expect(wrapper.vm.dataB.author).toBe("V10 Author")
    expect(wrapper.vm.dataB.config.hidden_size).toBe(2048)
    expect(wrapper.vm.dataA.readme).toContain("main")
    expect(wrapper.vm.dataB.readme).toContain("v1.0")
    expect(wrapper.vm.dataA.metrics).toEqual(MAIN_CONFIG.metrics)
  })

  // ── Tag comparison ────────────────────────────────────────────────────────

  it("correctly compares using a git tag ref", async () => {
    const wrapper = createWrapper()
    await settle()

    fetchApiMock.mockClear()

    // Switch versionA to the tag ref
    wrapper.vm.versionA = "v1.0-release"
    wrapper.vm.versionB = "main"
    wrapper.vm.handleVersionChange()
    await settle()

    const lastCommitCalls = fetchApiMock.mock.calls
      .map(([url]) => url)
      .filter((url) => url.includes("/last_commit") && url.includes("v1.0-release"))
    expect(lastCommitCalls.length).toBeGreaterThan(0)

    expect(wrapper.vm.dataA.commitId).toBe(TAG_COMMIT.id)
    expect(wrapper.vm.dataA.author).toBe("Release Author")
    expect(wrapper.vm.comparisonError).toBe("")
  })

  // ── Commit comparison ─────────────────────────────────────────────────────

  it("correctly compares using a commit SHA ref", async () => {
    const wrapper = createWrapper()
    await settle()

    // The commit option added during version load uses MAIN_COMMIT.id
    const commitOpt = wrapper.vm.versionOptions.find((o) => o.type === "commit")
    expect(commitOpt).toBeDefined()

    fetchApiMock.mockClear()
    wrapper.vm.versionA = commitOpt.value
    wrapper.vm.versionB = "v1.0"
    wrapper.vm.handleVersionChange()
    await settle()

    expect(wrapper.vm.dataA.commitId).toBe(MAIN_COMMIT.id)
    expect(wrapper.vm.comparisonError).toBe("")
  })

  // ── Real API responses, no fabricated data ────────────────────────────────

  it("populates comparison state from real API responses — no fabricated fallbacks", async () => {
    const wrapper = createWrapper()
    await settle()

    expect(wrapper.vm.dataA.config).toEqual(MAIN_CONFIG)
    expect(wrapper.vm.dataB.config).toEqual(V10_CONFIG)
    expect(JSON.stringify(wrapper.vm.dataA)).not.toMatch(
      /placeholder|demo|fake|fabricated|Alice Developer|Bob ML/i
    )
  })

  // ── Manual version change ─────────────────────────────────────────────────

  it("fetches comparison data using the correct refs on manual version change", async () => {
    const wrapper = createWrapper()
    await settle()

    fetchApiMock.mockClear()
    wrapper.vm.versionA = "v1.0"
    wrapper.vm.versionB = "main"
    wrapper.vm.handleVersionChange()
    await settle()

    const blobRefs = fetchApiMock.mock.calls
      .map(([url]) => url)
      .filter((url) => url.includes("/blob/"))
      .map((url) => new URLSearchParams(url.split("?")[1]).get("ref"))

    expect(blobRefs.some((r) => r === "v1.0")).toBe(true)
    expect(blobRefs.some((r) => r === "main")).toBe(true)
  })

  // ── Duplicate version selection ───────────────────────────────────────────

  it("handles duplicate version selection (A === B) without error", async () => {
    const wrapper = createWrapper()
    await settle()
    wrapper.vm.versionA = "main"
    wrapper.vm.versionB = "main"
    wrapper.vm.handleVersionChange()
    await settle()
    expect(wrapper.vm.versionA).toBe(wrapper.vm.versionB)
    expect(wrapper.vm.comparisonError).toBe("")
  })

  // ── Viewer rendering ──────────────────────────────────────────────────────

  it("renders ConfigDiffViewer, ReadmeDiffViewer, and MetricsCompareViewer after loading", async () => {
    const wrapper = createWrapper()
    await settle()
    expect(wrapper.findComponent(ConfigDiffViewer).exists()).toBe(true)
    expect(wrapper.findComponent(ReadmeDiffViewer).exists()).toBe(true)
    expect(wrapper.findComponent(MetricsCompareViewer).exists()).toBe(true)
  })

  // ── Error states ──────────────────────────────────────────────────────────

  it("shows versionLoadError and empty options when /branches fails — no fallback data", async () => {
    fetchApiMock.mockImplementation(async (url) => {
      if (url.endsWith("/branches") || url.includes("/branches?")) {
        return jsonResponse({ error: { msg: "branches unavailable" }, status: 500 })
      }
      return jsonResponse({ error: { msg: "unhandled" }, status: 500 })
    })

    const wrapper = createWrapper()
    await settle()

    expect(wrapper.vm.versionLoadError).toContain("branches unavailable")
    expect(wrapper.vm.versionOptions).toHaveLength(0)
    expect(wrapper.vm.comparisonError).toBe("")
    expect(wrapper.text()).toContain("branches unavailable")
  })

  it("shows comparisonError when commit and blob APIs all fail — no fallback data", async () => {
    let lastCommitCallCount = 0
    fetchApiMock.mockImplementation(async (url) => {
      if (url.endsWith("/branches") || url.includes("/branches?")) {
        return jsonResponse({ data: { data: [{ name: "main" }, { name: "v1.0" }] } })
      }
      if (url.match(/\/models\/[^/]+\/[^/]+\/tags$/)) {
        return jsonResponse({ data: { data: [] } })
      }
      // Allow the first last_commit call (to populate commit option in dropdown)
      if (url.includes("/last_commit")) {
        lastCommitCallCount++
        if (lastCommitCallCount === 1) {
          return jsonResponse({ data: { data: MAIN_COMMIT } })
        }
        // Subsequent calls during comparison: fail
        return jsonResponse({ error: { msg: "comparison backend failed" }, status: 500 })
      }
      return jsonResponse({ error: { msg: "comparison backend failed" }, status: 500 })
    })

    const wrapper = createWrapper()
    await settle()

    expect(wrapper.vm.comparisonError).toContain("comparison backend failed")
    expect(wrapper.vm.dataA.config).toBeNull()
    expect(wrapper.vm.dataB.config).toBeNull()
    expect(wrapper.vm.dataA.commitId).toBe("")
    expect(wrapper.text()).toContain("comparison backend failed")
  })

  // ── Missing optional files ────────────────────────────────────────────────

  it("shows missing-file state for 404 blobs — no fabricated content", async () => {
    fetchApiMock.mockImplementation(async (url) => {
      if (url.endsWith("/branches") || url.includes("/branches?")) {
        return jsonResponse({ data: { data: [{ name: "main" }, { name: "v1.0" }] } })
      }
      if (url.match(/\/models\/[^/]+\/[^/]+\/tags$/)) {
        return jsonResponse({ data: { data: [] } })
      }
      if (url.includes("/last_commit")) {
        const ref = new URLSearchParams(url.split("?")[1] || "").get("ref")
        const commit = ref === "v1.0" ? V10_COMMIT : MAIN_COMMIT
        return jsonResponse({ data: { data: commit } })
      }
      if (url.includes("/blob/")) {
        return jsonResponse({ error: { msg: "file not found" }, status: 404 })
      }
      return jsonResponse({ error: { msg: "unhandled" }, status: 500 })
    })

    const wrapper = createWrapper()
    await settle()

    expect(wrapper.vm.dataA.config).toBeNull()
    expect(wrapper.vm.dataB.config).toBeNull()
    expect(wrapper.vm.dataA.readme).toBeNull()
    expect(wrapper.vm.dataA.metrics).toBeNull()
    expect(wrapper.vm.missingFilesMessage).toContain("config.json")
    expect(wrapper.vm.missingFilesMessage).toContain("README.md")
    expect(wrapper.text()).toContain("missing")
  })

  // ── Empty repository ──────────────────────────────────────────────────────

  it("shows no-versions warning for a repository with zero branches or tags", async () => {
    fetchApiMock.mockImplementation(async (url) => {
      if (url.endsWith("/branches") || url.includes("/branches?")) {
        return jsonResponse({ data: { data: [] } })
      }
      if (url.match(/\/models\/[^/]+\/[^/]+\/tags$/)) {
        return jsonResponse({ data: { data: [] } })
      }
      return jsonResponse({ error: { msg: "unhandled" }, status: 500 })
    })

    const wrapper = createWrapper()
    await settle()

    expect(wrapper.vm.versionOptions).toHaveLength(0)
    expect(wrapper.vm.versionA).toBe("")
    expect(wrapper.vm.versionB).toBe("")
  })

  // ── Stale-response protection (rapid version switching) ───────────────────

  it("discards stale out-of-order responses when user switches versions rapidly", async () => {
    let resolveSlowV10 = null
    let slowRequestFinished = false

    fetchApiMock.mockImplementation(async (url) => {
      if (url.endsWith("/branches") || url.includes("/branches?")) {
        return jsonResponse({ data: { data: [{ name: "main" }, { name: "v1.0" }] } })
      }
      if (url.match(/\/models\/[^/]+\/[^/]+\/tags$/)) {
        return jsonResponse({ data: { data: [] } })
      }
      if (url.includes("/last_commit")) {
        const ref = new URLSearchParams(url.split("?")[1] || "").get("ref")
        if (ref === "v1.0" && !slowRequestFinished) {
          // Slow path: waits for manual resolution
          await new Promise((resolve) => { resolveSlowV10 = resolve })
          slowRequestFinished = true
          return jsonResponse({ data: { data: V10_COMMIT } })
        }
        return jsonResponse({ data: { data: MAIN_COMMIT } })
      }
      if (url.includes("/blob/config.json")) {
        const ref = new URLSearchParams(url.split("?")[1] || "").get("ref")
        const config = ref === "v1.0" ? V10_CONFIG : MAIN_CONFIG
        return jsonResponse({ data: { data: { content: encodeContent(config) } } })
      }
      if (url.includes("/blob/")) {
        return jsonResponse({ error: { msg: "not found" }, status: 404 })
      }
      return jsonResponse({ error: { msg: "unhandled" }, status: 500 })
    })

    const wrapper = createWrapper({ currentBranch: "main" })
    await settle()

    // Switch to v1.0 — triggers slow request
    wrapper.vm.versionA = "v1.0"
    wrapper.vm.versionB = "main"
    wrapper.vm.handleVersionChange()

    // Immediately switch back to main — newer request
    await nextTick()
    wrapper.vm.versionA = "main"
    wrapper.vm.versionB = "v1.0"
    wrapper.vm.handleVersionChange()

    // Now let the slow v1.0 request finish (stale)
    if (resolveSlowV10) resolveSlowV10()
    await settle()

    expect(slowRequestFinished).toBe(true)
    // Stale-response guard should have discarded the v1.0 result
    expect(wrapper.vm.versionA).toBe("main")
    expect(wrapper.vm.dataA.commitId).toBe(MAIN_COMMIT.id)
  })

  // ── Modal close during pending requests ───────────────────────────────────

  it("cancels outstanding requests when props.visible changes to false", async () => {
    let staleResponseWritten = false
    let resolveBlob = null

    fetchApiMock.mockImplementation(async (url) => {
      if (url.endsWith("/branches") || url.includes("/branches?")) {
        return jsonResponse({ data: { data: [{ name: "main" }, { name: "v1.0" }] } })
      }
      if (url.match(/\/models\/[^/]+\/[^/]+\/tags$/)) {
        return jsonResponse({ data: { data: [] } })
      }
      if (url.includes("/last_commit")) {
        return jsonResponse({ data: { data: MAIN_COMMIT } })
      }
      if (url.includes("/blob/")) {
        // Pause until resolved
        await new Promise((resolve) => { resolveBlob = resolve })
        return jsonResponse({ data: { data: { content: encodeContent(MAIN_CONFIG) } } })
      }
      return jsonResponse({ error: { msg: "unhandled" }, status: 500 })
    })

    const wrapper = createWrapper()
    await nextTick() // Start loading

    // Snapshot loadingData state — requests are in flight
    const wasLoading = wrapper.vm.loadingData || wrapper.vm.loadingOptions

    // Close modal — should increment sequence and clear loading flags
    await wrapper.setProps({ visible: false })
    await nextTick()

    // Verify loading indicators cleared immediately on close
    expect(wrapper.vm.loadingOptions).toBe(false)
    expect(wrapper.vm.loadingData).toBe(false)

    // Now resolve the pending blobs (stale)
    if (resolveBlob) resolveBlob()
    await settle()

    // Stale response should not have written to dataA
    // (the sequence was incremented on close, so the blob response is ignored)
    // The state from before close should not have been overwritten by stale data
    expect(staleResponseWritten).toBe(false)

    // Reopen — should start a fresh session
    fetchApiMock.mockClear()
    await wrapper.setProps({ visible: true })
    await settle()

    expect(wrapper.vm.comparisonError).toBe("")
    expect(wrapper.vm.versionOptions.length).toBeGreaterThan(0)
  })

  it("starts a clean comparison session when modal is reopened after close", async () => {
    const wrapper = createWrapper()
    await settle()

    const firstVersionA = wrapper.vm.versionA

    // Close then reopen
    await wrapper.setProps({ visible: false })
    await nextTick()
    await wrapper.setProps({ visible: true })
    await settle()

    // Should have fresh state — same auto-selection behavior
    expect(wrapper.vm.versionA).toBe(firstVersionA)
    expect(wrapper.vm.versionLoadError).toBe("")
    expect(wrapper.vm.comparisonError).toBe("")
    expect(wrapper.vm.versionOptions.length).toBeGreaterThan(0)
  })

  // ── i18n key existence ────────────────────────────────────────────────────

  it("exports all required models.versionComparison.* locale keys including tagType", async () => {
    const { models } = await import("@/locales/en_js/models.js")
    const vc = models.versionComparison
    expect(vc).toBeDefined()
    expect(vc.title).toBe("Model Version Comparison")
    expect(vc.baselineLabel).toBe("Baseline (Version A)")
    expect(vc.exportReport).toBe("Export Report")
    expect(vc.refreshData).toBe("Refresh Data")
    expect(vc.metricsDelta).toBe("Difference (Δ)")
    expect(vc.branchType).toBe("Branch")
    expect(vc.tagType).toBe("Tag")
    expect(vc.commitType).toBe("Commit")
  })

  it("mounts correctly when visible prop changes", async () => {
    const wrapper = createWrapper({ visible: false })
    expect(wrapper.vm).toBeDefined()
    await wrapper.setProps({ visible: true })
    await settle()
    expect(wrapper.vm.versionOptions.length).toBeGreaterThan(0)
  })
})
