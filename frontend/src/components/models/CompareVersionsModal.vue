<template>
  <el-dialog
    v-model="dialogVisible"
    :title="t('models.versionComparison.title')"
    width="90%"
    top="5vh"
    custom-class="compare-versions-dialog"
    destroy-on-close
    :before-close="handleClose"
  >
    <!-- Modal Header bar with selection and actions -->
    <div class="space-y-4 mb-6">
      <div class="flex items-center justify-between flex-wrap gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <!-- Version Selectors -->
        <div class="flex items-center flex-wrap gap-4 flex-1 min-w-[300px]">
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700">{{ t('models.versionComparison.baselineLabel') }}:</span>
            <el-select
              v-model="versionA"
              :placeholder="t('models.versionComparison.selectBaseline')"
              class="w-60"
              filterable
              :loading="loadingOptions"
              :disabled="!!versionLoadError || versionOptions.length === 0"
              @change="handleVersionChange"
            >
              <el-option-group
                v-for="group in groupedOptions"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="opt in group.options"
                  :key="`${opt.type}-${opt.value}`"
                  :label="opt.label"
                  :value="opt.value"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-xs">{{ opt.value }}</span>
                    <el-tag size="small" :type="optTagType(opt.type)" class="ml-2">
                      {{ t(`models.versionComparison.${opt.type}Type`) }}
                    </el-tag>
                  </div>
                </el-option>
              </el-option-group>
            </el-select>
          </div>

          <span class="text-gray-400 font-bold text-lg hidden sm:inline">{{ t('models.versionComparison.vsLabel') }}</span>

          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700">{{ t('models.versionComparison.targetLabel') }}:</span>
            <el-select
              v-model="versionB"
              :placeholder="t('models.versionComparison.selectTarget')"
              class="w-60"
              filterable
              :loading="loadingOptions"
              :disabled="!!versionLoadError || versionOptions.length === 0"
              @change="handleVersionChange"
            >
              <el-option-group
                v-for="group in groupedOptions"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="opt in group.options"
                  :key="`${opt.type}-${opt.value}`"
                  :label="opt.label"
                  :value="opt.value"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-mono text-xs">{{ opt.value }}</span>
                    <el-tag size="small" :type="optTagType(opt.type)" class="ml-2">
                      {{ t(`models.versionComparison.${opt.type}Type`) }}
                    </el-tag>
                  </div>
                </el-option>
              </el-option-group>
            </el-select>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3">
          <CsgButton
            class="btn btn-secondary-gray btn-sm"
            :name="t('models.versionComparison.exportReport')"
            svgName="download"
            :disabled="loadingData || !versionA || !versionB || !!comparisonError"
            @click="exportReport"
          />
          <CsgButton
            class="btn btn-primary btn-sm"
            :name="t('models.versionComparison.refreshData')"
            :loading="loadingData || loadingOptions"
            @click="retryCurrentRequest"
          />
        </div>
      </div>

      <el-alert
        v-if="versionLoadError"
        type="error"
        :closable="false"
        show-icon
        :title="versionLoadError"
      />

      <el-alert
        v-else-if="!loadingOptions && versionOptions.length === 0"
        type="warning"
        :closable="false"
        show-icon
        :title="t('models.versionComparison.noVersionsAvailable')"
      />
    </div>

    <!-- Loading state -->
    <el-skeleton v-if="loadingOptions" :rows="4" animated />

    <!-- Error state -->
    <el-alert
      v-else-if="comparisonError"
      type="error"
      :closable="false"
      show-icon
      :title="comparisonError"
      class="mb-4"
    />

    <!-- Version metadata cards -->
    <div
      v-else-if="!loadingOptions && versionA && versionB && !versionLoadError"
      class="grid grid-cols-2 gap-4 mb-4"
    >
      <!-- Version A Metadata Card -->
      <div class="p-4 rounded-lg border border-indigo-200 bg-indigo-50/40">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-indigo-900 uppercase tracking-wide">{{ t('models.versionComparison.baselineLabel') }}</span>
          <el-tag size="small" :type="optTagType(resolveVersionOption(versionA).type)">{{ versionA }}</el-tag>
        </div>
        <div class="text-xs space-y-1 text-gray-700 font-mono">
          <div><span class="text-gray-500 font-sans">{{ t('models.versionComparison.commitLabel') }}:</span> {{ formatCommitId(dataA.commitId) }}</div>
          <div><span class="text-gray-500 font-sans">{{ t('models.versionComparison.authorLabel') }}:</span> {{ dataA.author || t('models.versionComparison.unavailable') }}</div>
          <div><span class="text-gray-500 font-sans">{{ t('models.versionComparison.dateLabel') }}:</span> {{ dataA.date || t('models.versionComparison.unavailable') }}</div>
          <div class="truncate text-gray-600 font-sans mt-1" :title="dataA.message">
            <span class="text-gray-500">{{ t('models.versionComparison.messageLabel') }}:</span> {{ dataA.message || t('models.versionComparison.unavailable') }}
          </div>
          <div v-if="dataA.errors.length" class="text-red-600 font-sans mt-2">
            {{ dataA.errors.join('; ') }}
          </div>
        </div>
      </div>

      <!-- Version B Metadata Card -->
      <div class="p-4 rounded-lg border border-emerald-200 bg-emerald-50/40">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-emerald-900 uppercase tracking-wide">{{ t('models.versionComparison.targetLabel') }}</span>
          <el-tag size="small" :type="optTagType(resolveVersionOption(versionB).type)">{{ versionB }}</el-tag>
        </div>
        <div class="text-xs space-y-1 text-gray-700 font-mono">
          <div><span class="text-gray-500 font-sans">{{ t('models.versionComparison.commitLabel') }}:</span> {{ formatCommitId(dataB.commitId) }}</div>
          <div><span class="text-gray-500 font-sans">{{ t('models.versionComparison.authorLabel') }}:</span> {{ dataB.author || t('models.versionComparison.unavailable') }}</div>
          <div><span class="text-gray-500 font-sans">{{ t('models.versionComparison.dateLabel') }}:</span> {{ dataB.date || t('models.versionComparison.unavailable') }}</div>
          <div class="truncate text-gray-600 font-sans mt-1" :title="dataB.message">
            <span class="text-gray-500">{{ t('models.versionComparison.messageLabel') }}:</span> {{ dataB.message || t('models.versionComparison.unavailable') }}
          </div>
          <div v-if="dataB.errors.length" class="text-red-600 font-sans mt-2">
            {{ dataB.errors.join('; ') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Missing files notice -->
    <el-alert
      v-if="missingFilesMessage"
      type="info"
      :closable="false"
      show-icon
      :title="missingFilesMessage"
      class="mb-4"
    />

    <!-- Comparison Main Tabs -->
    <el-tabs v-if="!loadingOptions && !versionLoadError && versionA && versionB && !comparisonError" v-model="activeTab" class="compare-tabs">
      <!-- Parameters / Config Tab -->
      <el-tab-pane :label="t('models.versionComparison.configTab')" name="config">
        <ConfigDiffViewer
          :configA="dataA.config"
          :configB="dataB.config"
          :loading="loadingData"
        />
      </el-tab-pane>

      <!-- README / Model Card Tab -->
      <el-tab-pane :label="t('models.versionComparison.readmeTab')" name="readme">
        <ReadmeDiffViewer
          :readmeA="dataA.readme"
          :readmeB="dataB.readme"
          :loading="loadingData"
        />
      </el-tab-pane>

      <!-- Performance Metrics Tab -->
      <el-tab-pane :label="t('models.versionComparison.metricsTab')" name="metrics">
        <MetricsCompareViewer
          :metricsA="dataA.metrics"
          :metricsB="dataB.metrics"
          :versionALabel="versionA"
          :versionBLabel="versionB"
          :loading="loadingData"
        />
      </el-tab-pane>

      <!-- Version History Context Tab -->
      <el-tab-pane :label="t('models.versionComparison.historyTab')" name="history">
        <div class="py-4">
          <div class="text-xs font-semibold text-gray-600 uppercase mb-4">{{ t('models.versionComparison.recentCommitsTitle') }}</div>
          <el-alert
            v-if="commitsError"
            type="warning"
            :closable="false"
            show-icon
            :title="commitsError"
            class="mb-4"
          />
          <el-timeline v-else-if="allCommits.length > 0">
            <el-timeline-item
              v-for="commit in allCommits"
              :key="commit.id"
              :timestamp="commit.committer_date"
              :type="commit.id === dataA.commitId ? 'primary' : commit.id === dataB.commitId ? 'success' : 'info'"
            >
              <div class="flex items-center gap-2">
                <span class="font-bold text-sm text-gray-800">{{ commit.message }}</span>
                <el-tag v-if="commit.id === dataA.commitId" size="small" type="primary">{{ t('models.versionComparison.versionALabel') }}</el-tag>
                <el-tag v-if="commit.id === dataB.commitId" size="small" type="success">{{ t('models.versionComparison.versionBLabel') }}</el-tag>
              </div>
              <div class="text-xs text-gray-500 font-mono mt-1">
                {{ commit.id?.substring(0, 8) }} by {{ commit.author_name }}
              </div>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else :description="t('models.versionComparison.noHistoryAvailable')" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import useFetchApi from '../../packs/useFetchApi'
import { atob_utf8, createAndClickAnchor } from '../../packs/utils'
import CsgButton from '../shared/CsgButton.vue'
import ConfigDiffViewer from './ConfigDiffViewer.vue'
import ReadmeDiffViewer from './ReadmeDiffViewer.vue'
import MetricsCompareViewer from './MetricsCompareViewer.vue'

const { t } = useI18n()

const props = defineProps({
  visible: Boolean,
  namespace: String,
  name: String,
  currentBranch: String,
  repoType: { type: String, default: 'model' }
})

const emit = defineEmits(['update:visible'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const activeTab = ref('config')
const loadingOptions = ref(false)
const loadingData = ref(false)

const versionOptions = ref([])
const versionA = ref('')
const versionB = ref('')
const versionLoadError = ref('')
const comparisonError = ref('')
const commitsError = ref('')

const emptyVersionData = () => ({
  commitId: '',
  author: '',
  date: '',
  message: '',
  config: null,
  readme: null,
  metrics: null,
  missingFiles: [],
  errors: []
})

const dataA = ref(emptyVersionData())
const dataB = ref(emptyVersionData())
const allCommits = ref([])

// ── Request-sequence stale-response protection ────────────────────────────────
// Incremented each time a new request batch begins (version change, modal open,
// modal close). Every async function captures this value at start; before
// writing any state, it checks token === currentRequestSeq. Stale responses
// are discarded silently.
// NOTE: CompareVersionsModal is kept mounted while props.visible === false
// (parent uses v-bind:visible, not v-if). destroy-on-close only removes the
// dialog slot content, not the Vue component. onUnmounted fires only on page
// navigation. We therefore also watch props.visible to cancel on close.
let currentRequestSeq = 0

const apiPrefix = computed(() => `${props.repoType}s/${props.namespace}/${props.name}`)

// ── Grouped dropdown options for el-option-group ──────────────────────────────
const groupedOptions = computed(() => {
  const branches = versionOptions.value.filter((o) => o.type === 'branch')
  const tags = versionOptions.value.filter((o) => o.type === 'tag')
  const commits = versionOptions.value.filter((o) => o.type === 'commit')
  const groups = []
  if (branches.length) groups.push({ label: t('models.versionComparison.branchType'), options: branches })
  if (tags.length) groups.push({ label: t('models.versionComparison.tagType'), options: tags })
  if (commits.length) groups.push({ label: t('models.versionComparison.commitType'), options: commits })
  return groups
})

const optTagType = (type) => {
  if (type === 'branch') return 'primary'
  if (type === 'tag') return 'warning'
  return 'info'
}

const missingFilesMessage = computed(() => {
  const parts = []
  if (dataA.value.missingFiles?.length) {
    parts.push(`${t('models.versionComparison.missingVersionA')}: ${dataA.value.missingFiles.join(', ')}`)
  }
  if (dataB.value.missingFiles?.length) {
    parts.push(`${t('models.versionComparison.missingVersionB')}: ${dataB.value.missingFiles.join(', ')}`)
  }
  return parts.join('. ')
})

const handleClose = () => {
  dialogVisible.value = false
}

const extractErrorMessage = (error) => {
  if (!error) return t('models.versionComparison.versionLoadError')
  if (typeof error === 'string') return error
  return error.msg || error.message || t('models.versionComparison.versionLoadError')
}

const formatCommitId = (commitId) => {
  if (!commitId) return t('models.versionComparison.unavailable')
  return commitId.substring(0, 8)
}

const resetComparisonState = () => {
  versionA.value = ''
  versionB.value = ''
  versionOptions.value = []
  versionLoadError.value = ''
  comparisonError.value = ''
  commitsError.value = ''
  dataA.value = emptyVersionData()
  dataB.value = emptyVersionData()
  allCommits.value = []
}

const parseCommitList = (payload) => {
  if (Array.isArray(payload?.data?.commits)) return payload.data.commits
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

const extractCommitObj = (resData) => {
  if (!resData) return null
  const d = resData.data || resData
  if (d.commits?.[0]) return d.commits[0]
  if (Array.isArray(d) && d[0]) return d[0]
  if (d.id || d.sha) return d
  return null
}

const getCommitId = (commitObj) => commitObj?.id || commitObj?.sha || ''

const commitMatchesRef = (commitId, refStr) => {
  if (!commitId || !refStr) return false
  return commitId === refStr || commitId.startsWith(refStr) || refStr.startsWith(commitId)
}

const resolveVersionOption = (value) => {
  return versionOptions.value.find((opt) => opt.value === value) || { value, type: 'branch', label: value }
}

/**
 * Fetch version options efficiently:
 *
 * 1. GET /branches → branch options       (1 request)
 * 2. GET /{ns}/{name}/tags → repo git-tag options (1 request)
 *    These are git tags (e.g. v1.0.0, release-2.1) that are valid git refs for
 *    blob and commit lookups. They are NOT the global /tags taxonomy endpoint.
 * 3. GET /last_commit?ref=<preferred> → 1 recent commit option (1 request)
 *
 * Total: 3 requests on open regardless of branch/tag count.
 * Compared to previous implementation: 1 + N×20 requests.
 */
const fetchVersionOptions = async () => {
  if (!props.namespace || !props.name) {
    versionLoadError.value = 'Repository namespace and name are required to load versions.'
    return
  }

  const seq = ++currentRequestSeq

  loadingOptions.value = true
  versionLoadError.value = ''
  comparisonError.value = ''
  commitsError.value = ''
  allCommits.value = []

  const options = []
  const existingValues = new Set()

  try {
    // 1. Fetch branches and repo-level git tags in parallel
    const [branchResult, tagResult] = await Promise.all([
      useFetchApi(`/${apiPrefix.value}/branches`).json(),
      useFetchApi(`/${apiPrefix.value}/tags`).json()
    ])

    if (seq !== currentRequestSeq) return

    if (branchResult.error?.value) {
      versionLoadError.value = extractErrorMessage(branchResult.error.value)
      ElMessage.error(versionLoadError.value)
      versionOptions.value = []
      return
    }

    const branches = Array.isArray(branchResult.data?.value?.data)
      ? branchResult.data.value.data : []
    branches.forEach((b) => {
      if (b.name && !existingValues.has(b.name)) {
        existingValues.add(b.name)
        options.push({
          label: `${b.name} [${t('models.versionComparison.branchType')}]`,
          value: b.name,
          type: 'branch'
        })
      }
    })

    // Repo-level git tags — these have a `name` field representing the tag ref
    // (e.g. "v1.0", "release-2") and are distinct from the global taxonomy /tags
    // which have category/scope fields and are not git refs.
    if (!tagResult.error?.value) {
      const repoTags = Array.isArray(tagResult.data?.value?.data)
        ? tagResult.data.value.data : []
      repoTags
        .filter((tag) => tag.name && !tag.category && !tag.scope)  // git tags have no taxonomy fields
        .forEach((tag) => {
          if (!existingValues.has(tag.name)) {
            existingValues.add(tag.name)
            options.push({
              label: `${tag.name} [${t('models.versionComparison.tagType')}]`,
              value: tag.name,
              type: 'tag'
            })
          }
        })
    }

    if (seq !== currentRequestSeq) return

    if (options.length === 0) {
      versionOptions.value = []
      ElMessage.warning(t('models.versionComparison.noBranchesOrCommits'))
      return
    }

    // 2. Fetch the latest commit on the preferred branch to add as a commit option
    // This provides commit-level granularity without fetching N×20 commits.
    const branchNames = options.filter((o) => o.type === 'branch').map((o) => o.value)
    const preferred = (props.currentBranch && branchNames.includes(props.currentBranch))
      ? props.currentBranch : branchNames[0]

    if (preferred) {
      const { data: lastCommitData, error: lastCommitError } = await useFetchApi(
        `/${apiPrefix.value}/last_commit?ref=${encodeURIComponent(preferred)}`
      ).json()

      if (seq !== currentRequestSeq) return

      if (!lastCommitError?.value && lastCommitData?.value) {
        const commitObj = extractCommitObj(lastCommitData.value)
        const commitId = getCommitId(commitObj)
        if (commitObj && commitId && !existingValues.has(commitId)) {
          existingValues.add(commitId)
          options.push({
            label: `${commitId.substring(0, 8)} — ${commitObj.message?.substring(0, 40) || ''} [${t('models.versionComparison.commitType')}]`,
            value: commitId,
            type: 'commit'
          })
          allCommits.value = [commitObj]
        }
      }
    }

    if (seq !== currentRequestSeq) return

    versionOptions.value = options

    // Auto-select: preferred branch as A, second branch (or first tag) as B
    const alternate = branchNames.find((b) => b !== preferred)
      || options.filter((o) => o.type === 'tag')[0]?.value
      || options[0]?.value

    if (!versionA.value) versionA.value = preferred || options[0]?.value || ''
    if (!versionB.value) versionB.value = alternate || preferred || ''

    await fetchComparisonData(seq)
  } catch (error) {
    if (seq !== currentRequestSeq) return
    versionLoadError.value = extractErrorMessage(error)
    versionOptions.value = []
    ElMessage.error(versionLoadError.value)
  } finally {
    if (seq === currentRequestSeq) {
      loadingOptions.value = false
    }
  }
}

const isNotFoundError = (status, errorValue) => {
  if (status === 404) return true
  const message = extractErrorMessage(errorValue)
  return /not found|404/i.test(message)
}

const fetchBlobFile = async (filePath, refStr) => {
  if (!refStr) {
    return { content: null, missing: false, error: `Missing Git ref for ${filePath}` }
  }

  const url = `/${apiPrefix.value}/blob/${filePath}?ref=${encodeURIComponent(refStr)}`
  const { data, error, response } = await useFetchApi(url).json()
  const status = response?.value?.status

  if (status === 404) {
    return { content: null, missing: true, error: null }
  }

  if (error.value) {
    if (isNotFoundError(status, error.value)) {
      return { content: null, missing: true, error: null }
    }
    return {
      content: null,
      missing: false,
      error: extractErrorMessage(error.value) || `Failed to load ${filePath}`
    }
  }

  if (!data.value?.data) {
    return {
      content: null,
      missing: false,
      error: `Failed to load ${filePath} for ref "${refStr}"`
    }
  }

  if (!data.value.data.content) {
    return { content: null, missing: true, error: null }
  }

  try {
    return { content: atob_utf8(data.value.data.content), missing: false, error: null }
  } catch (decodeError) {
    return { content: null, missing: false, error: `Failed to decode ${filePath}` }
  }
}

const parseJsonFile = (raw, filePath) => {
  try {
    return { value: JSON.parse(raw), error: null }
  } catch (e) {
    return { value: null, error: `${filePath} is not valid JSON` }
  }
}

/**
 * Fetch commit metadata for a ref using /last_commit (single commit, lightweight).
 * Falls back to /commits?per=1 if last_commit returns nothing.
 * Validates commit SHA matches when refType is 'commit'.
 */
const fetchCommitMetadata = async (refStr, refType) => {
  const { data, error } = await useFetchApi(
    `/${apiPrefix.value}/last_commit?ref=${encodeURIComponent(refStr)}`
  ).json()

  if (!error?.value && data?.value) {
    const commitObj = extractCommitObj(data.value)
    const commitId = getCommitId(commitObj)
    if (commitObj && commitId) {
      if (refType === 'commit' && !commitMatchesRef(commitId, refStr)) {
        return { error: `Commit metadata did not match selected ref "${refStr}"` }
      }
      return { commit: commitObj }
    }
  }

  // Fallback: /commits?per=1
  const { data: commitsData, error: commitsErr } = await useFetchApi(
    `/${apiPrefix.value}/commits?ref=${encodeURIComponent(refStr)}&per=1`
  ).json()

  if (commitsErr?.value) {
    return { error: `Failed to load commit metadata for "${refStr}": ${extractErrorMessage(commitsErr.value)}` }
  }

  const commitList = parseCommitList(commitsData?.value)
  const commitObj = commitList[0] || extractCommitObj(commitsData?.value)
  const commitId = getCommitId(commitObj)

  if (!commitObj || !commitId) {
    return { error: `No commit found for ref "${refStr}"` }
  }

  if (refType === 'commit' && !commitMatchesRef(commitId, refStr)) {
    return { error: `Commit metadata did not match selected ref "${refStr}"` }
  }

  return { commit: commitObj }
}

const fetchSingleVersionData = async (refStr, refType) => {
  const result = emptyVersionData()

  if (!refStr) {
    result.errors.push('A valid Git branch, tag, or commit is required')
    return result
  }

  const [commitResult, configResult, readmeResult, metricsResult, evalResult] = await Promise.all([
    fetchCommitMetadata(refStr, refType),
    fetchBlobFile('config.json', refStr),
    fetchBlobFile('README.md', refStr),
    fetchBlobFile('metrics.json', refStr),
    fetchBlobFile('eval_results.json', refStr)
  ])

  if (commitResult.commit) {
    const c = commitResult.commit
    result.commitId = getCommitId(c)
    result.author = c.author_name || c.committer_name || ''
    result.date = c.committer_date || c.created_at || ''
    result.message = c.message || ''
  } else if (commitResult.error) {
    result.errors.push(`Commit metadata: ${commitResult.error}`)
  }

  if (configResult.missing) {
    result.missingFiles.push('config.json')
  } else if (configResult.error) {
    result.errors.push(`config.json: ${configResult.error}`)
  } else if (configResult.content) {
    const parsed = parseJsonFile(configResult.content, 'config.json')
    result.config = parsed.error ? configResult.content : parsed.value
    if (parsed.error) {
      result.errors.push(parsed.error)
    } else if (typeof result.config === 'object' && (result.config?.metrics || result.config?.results)) {
      result.metrics = result.config.metrics || result.config.results
    }
  }

  if (readmeResult.missing) {
    result.missingFiles.push('README.md')
  } else if (readmeResult.error) {
    result.errors.push(`README.md: ${readmeResult.error}`)
  } else {
    result.readme = readmeResult.content
  }

  const activeMetricsRes = !metricsResult.missing && !metricsResult.error ? metricsResult
    : !evalResult.missing && !evalResult.error ? evalResult : null
  if (activeMetricsRes?.content) {
    const parsed = parseJsonFile(activeMetricsRes.content, 'metrics')
    if (parsed.error) {
      result.errors.push(parsed.error)
    } else {
      result.metrics = parsed.value
    }
  } else {
    if (metricsResult.missing && evalResult.missing) {
      result.missingFiles.push('metrics.json')
    }
    if (metricsResult.error) result.errors.push(`metrics.json: ${metricsResult.error}`)
    if (evalResult.error) result.errors.push(`eval_results.json: ${evalResult.error}`)
  }

  return result
}

/**
 * Fetches comparison data for the currently selected versionA and versionB.
 * Accepts an optional seq token for stale-response protection.
 */
const fetchComparisonData = async (seq) => {
  if (!versionA.value || !versionB.value) return

  const token = (seq !== undefined) ? seq : ++currentRequestSeq

  loadingData.value = true
  comparisonError.value = ''
  dataA.value = emptyVersionData()
  dataB.value = emptyVersionData()

  try {
    const optionA = resolveVersionOption(versionA.value)
    const optionB = resolveVersionOption(versionB.value)
    const [resA, resB] = await Promise.all([
      fetchSingleVersionData(optionA.value, optionA.type),
      fetchSingleVersionData(optionB.value, optionB.type)
    ])

    if (token !== currentRequestSeq) return

    dataA.value = resA
    dataB.value = resB

    const hardFailures = [...resA.errors, ...resB.errors]
    const hasAnyData = !!(resA.commitId || resB.commitId || resA.config || resB.config || resA.readme || resB.readme)

    if (hardFailures.length && !hasAnyData) {
      comparisonError.value = hardFailures.join('; ')
      dataA.value = emptyVersionData()
      dataB.value = emptyVersionData()
      ElMessage.error(comparisonError.value)
    } else if (hardFailures.length) {
      ElMessage.warning(hardFailures.join('; '))
    }
  } catch (error) {
    if (token !== currentRequestSeq) return
    comparisonError.value = extractErrorMessage(error)
    dataA.value = emptyVersionData()
    dataB.value = emptyVersionData()
    ElMessage.error(comparisonError.value)
  } finally {
    if (token === currentRequestSeq) {
      loadingData.value = false
    }
  }
}

const handleVersionChange = () => {
  fetchComparisonData(++currentRequestSeq)
}

const retryCurrentRequest = () => {
  if (versionLoadError.value || versionOptions.value.length === 0) {
    fetchVersionOptions()
    return
  }
  fetchComparisonData(++currentRequestSeq)
}

// Cancel all outstanding requests when the component fully unmounts
// (page navigation, v-if removal). For modal close without unmount, see watcher.
onUnmounted(() => {
  currentRequestSeq++
})

const exportReport = () => {
  if (comparisonError.value) return

  const content = `# ${t('models.versionComparison.reportTitle')}

**${t('models.versionComparison.reportModel')}:** \`${props.namespace}/${props.name}\`
**${t('models.versionComparison.reportGenerated')}:** ${new Date().toLocaleString()}

---

## ${t('models.versionComparison.reportVersionMetadata')}

| ${t('models.versionComparison.reportVersionRef')} | ${t('models.versionComparison.versionALabel')} | ${t('models.versionComparison.versionBLabel')} |
|---|---|---|
| **${t('models.versionComparison.reportVersionRef')}** | \`${versionA.value}\` | \`${versionB.value}\` |
| **${t('models.versionComparison.reportCommitSha')}** | \`${dataA.value.commitId || t('models.versionComparison.unavailable')}\` | \`${dataB.value.commitId || t('models.versionComparison.unavailable')}\` |
| **${t('models.versionComparison.reportAuthor')}** | ${dataA.value.author || t('models.versionComparison.unavailable')} | ${dataB.value.author || t('models.versionComparison.unavailable')} |
| **${t('models.versionComparison.reportDate')}** | ${dataA.value.date || t('models.versionComparison.unavailable')} | ${dataB.value.date || t('models.versionComparison.unavailable')} |
| **${t('models.versionComparison.reportMessage')}** | ${dataA.value.message || t('models.versionComparison.unavailable')} | ${dataB.value.message || t('models.versionComparison.unavailable')} |

---

## ${t('models.versionComparison.reportConfigSection')}

- **${t('models.versionComparison.reportVersionAConfig')}:** ${dataA.value.config ? t('models.versionComparison.reportAvailable') : t('models.versionComparison.reportNotAvailable')}
- **${t('models.versionComparison.reportVersionBConfig')}:** ${dataB.value.config ? t('models.versionComparison.reportAvailable') : t('models.versionComparison.reportNotAvailable')}

\`\`\`json
${dataA.value.config ? JSON.stringify(dataA.value.config, null, 2) : t('models.versionComparison.reportNotAvailable')}
\`\`\`

\`\`\`json
${dataB.value.config ? JSON.stringify(dataB.value.config, null, 2) : t('models.versionComparison.reportNotAvailable')}
\`\`\`

---

## ${t('models.versionComparison.reportMetricsSection')}

${dataA.value.metrics || dataB.value.metrics ? JSON.stringify({ versionA: dataA.value.metrics, versionB: dataB.value.metrics }, null, 2) : t('models.versionComparison.reportNoMetrics')}

---

## ${t('models.versionComparison.reportReadmeSection')}

- **${t('models.versionComparison.reportVersionAReadme')}:** ${dataA.value.readme ? t('models.versionComparison.reportAvailable') : t('models.versionComparison.reportNotAvailable')}
- **${t('models.versionComparison.reportVersionBReadme')}:** ${dataB.value.readme ? t('models.versionComparison.reportAvailable') : t('models.versionComparison.reportNotAvailable')}
`

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  createAndClickAnchor(url, `comparison-${props.name}-${versionA.value}-vs-${versionB.value}.md`)
}

watch(() => props.visible, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    // Modal opened (or first render with visible: true) — start fresh
    resetComparisonState()
    fetchVersionOptions()
  } else if (!newVal && oldVal) {
    // Modal closed — invalidate all outstanding requests immediately.
    // The component stays mounted (not v-if), so onUnmounted does not fire here.
    // Incrementing the sequence ensures no in-flight response can write state
    // and then appear stale/confusing when the modal reopens.
    currentRequestSeq++
    loadingOptions.value = false
    loadingData.value = false
  }
}, { immediate: true })
</script>

<style scoped>
:deep(.compare-versions-dialog) {
  border-radius: 12px;
}

:deep(.compare-tabs .el-tabs__nav-wrap::after) {
  height: 1px;
}
</style>
