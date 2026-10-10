<template>
  <el-dialog
    v-model="dialogVisible"
    title="Model Version Comparison"
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
            <span class="text-sm font-semibold text-gray-700">Baseline (Version A):</span>
            <el-select
              v-model="versionA"
              placeholder="Select Baseline Version"
              class="w-60"
              filterable
              :loading="loadingOptions"
              :disabled="!!versionLoadError || versionOptions.length === 0"
              @change="handleVersionChange"
            >
              <el-option
                v-for="opt in versionOptions"
                :key="`${opt.type}-${opt.value}`"
                :label="opt.label"
                :value="opt.value"
              >
                <div class="flex items-center justify-between">
                  <span>{{ opt.value }}</span>
                  <el-tag size="small" :type="opt.type === 'branch' ? 'primary' : 'info'">
                    {{ opt.type }}
                  </el-tag>
                </div>
              </el-option>
            </el-select>
          </div>

          <span class="text-gray-400 font-bold text-lg hidden sm:inline">VS</span>

          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold text-gray-700">Target (Version B):</span>
            <el-select
              v-model="versionB"
              placeholder="Select Target Version"
              class="w-60"
              filterable
              :loading="loadingOptions"
              :disabled="!!versionLoadError || versionOptions.length === 0"
              @change="handleVersionChange"
            >
              <el-option
                v-for="opt in versionOptions"
                :key="`${opt.type}-${opt.value}`"
                :label="opt.label"
                :value="opt.value"
              >
                <div class="flex items-center justify-between">
                  <span>{{ opt.value }}</span>
                  <el-tag size="small" :type="opt.type === 'branch' ? 'primary' : 'info'">
                    {{ opt.type }}
                  </el-tag>
                </div>
              </el-option>
            </el-select>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3">
          <CsgButton
            class="btn btn-secondary-gray btn-sm"
            name="Export Report"
            svgName="download"
            :disabled="loadingData || !versionA || !versionB || !!comparisonError"
            @click="exportReport"
          />
          <CsgButton
            class="btn btn-primary btn-sm"
            name="Refresh Data"
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
        title="No branches or commits were returned for this repository."
      />

      <el-alert
        v-if="versionWarning"
        type="warning"
        :closable="false"
        show-icon
        :title="versionWarning"
      />

      <el-alert
        v-if="comparisonError"
        type="error"
        :closable="false"
        show-icon
        :title="comparisonError"
      />

      <el-alert
        v-if="missingFilesMessage"
        type="warning"
        :closable="false"
        show-icon
        :title="missingFilesMessage"
      />

      <!-- Warning for same version selection -->
      <el-alert
        v-if="versionA && versionB && versionA === versionB"
        type="info"
        :closable="false"
        show-icon
        title="Same version selected for both Baseline and Target. Select different versions to see differences."
      />
    </div>

    <div v-if="loadingOptions" class="py-8">
      <el-skeleton :rows="4" animated />
    </div>

    <!-- Side-by-side Version Context Header Card -->
    <div
      v-else-if="!loadingData && versionA && versionB && !comparisonError"
      class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
    >
      <!-- Version A Metadata Card -->
      <div class="p-4 rounded-lg border border-indigo-200 bg-indigo-50/40">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-indigo-900 uppercase tracking-wide">Version A (Baseline)</span>
          <el-tag size="small" type="primary">{{ versionA }}</el-tag>
        </div>
        <div class="text-xs space-y-1 text-gray-700 font-mono">
          <div><span class="text-gray-500 font-sans">Commit:</span> {{ formatCommitId(dataA.commitId) }}</div>
          <div><span class="text-gray-500 font-sans">Author:</span> {{ dataA.author || 'Unavailable' }}</div>
          <div><span class="text-gray-500 font-sans">Date:</span> {{ dataA.date || 'Unavailable' }}</div>
          <div class="truncate text-gray-600 font-sans mt-1" :title="dataA.message">
            <span class="text-gray-500">Message:</span> {{ dataA.message || 'Unavailable' }}
          </div>
          <div v-if="dataA.errors.length" class="text-red-600 font-sans mt-2">
            {{ dataA.errors.join('; ') }}
          </div>
        </div>
      </div>

      <!-- Version B Metadata Card -->
      <div class="p-4 rounded-lg border border-emerald-200 bg-emerald-50/40">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-emerald-900 uppercase tracking-wide">Version B (Target)</span>
          <el-tag size="small" type="success">{{ versionB }}</el-tag>
        </div>
        <div class="text-xs space-y-1 text-gray-700 font-mono">
          <div><span class="text-gray-500 font-sans">Commit:</span> {{ formatCommitId(dataB.commitId) }}</div>
          <div><span class="text-gray-500 font-sans">Author:</span> {{ dataB.author || 'Unavailable' }}</div>
          <div><span class="text-gray-500 font-sans">Date:</span> {{ dataB.date || 'Unavailable' }}</div>
          <div class="truncate text-gray-600 font-sans mt-1" :title="dataB.message">
            <span class="text-gray-500">Message:</span> {{ dataB.message || 'Unavailable' }}
          </div>
          <div v-if="dataB.errors.length" class="text-red-600 font-sans mt-2">
            {{ dataB.errors.join('; ') }}
          </div>
        </div>
      </div>
    </div>

    <!-- Comparison Main Tabs -->
    <el-tabs v-if="!loadingOptions && !versionLoadError && versionA && versionB && !comparisonError" v-model="activeTab" class="compare-tabs">
      <!-- Parameters / Config Tab -->
      <el-tab-pane label="Configuration & Parameters" name="config">
        <ConfigDiffViewer
          :configA="dataA.config"
          :configB="dataB.config"
          :loading="loadingData"
        />
      </el-tab-pane>

      <!-- README / Model Card Tab -->
      <el-tab-pane label="Model Card / README" name="readme">
        <ReadmeDiffViewer
          :readmeA="dataA.readme"
          :readmeB="dataB.readme"
          :loading="loadingData"
        />
      </el-tab-pane>

      <!-- Performance Metrics Tab -->
      <el-tab-pane label="Performance Metrics" name="metrics">
        <MetricsCompareViewer
          :metricsA="dataA.metrics"
          :metricsB="dataB.metrics"
          :versionALabel="versionA"
          :versionBLabel="versionB"
          :loading="loadingData"
        />
      </el-tab-pane>

      <!-- Version History Context Tab -->
      <el-tab-pane label="Version History Context" name="history">
        <div class="py-4">
          <div class="text-xs font-semibold text-gray-600 uppercase mb-4">Recent Model Commits Timeline</div>
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
                <el-tag v-if="commit.id === dataA.commitId" size="small" type="primary">Version A</el-tag>
                <el-tag v-if="commit.id === dataB.commitId" size="small" type="success">Version B</el-tag>
              </div>
              <div class="text-xs text-gray-500 font-mono mt-1">
                {{ commit.id?.substring(0, 8) }} by {{ commit.author_name }}
              </div>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else description="No version history available" />
        </div>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button @click="handleClose">Close</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import useFetchApi from '../../packs/useFetchApi'
import { atob_utf8, createAndClickAnchor } from '../../packs/utils'
import CsgButton from '../shared/CsgButton.vue'
import ConfigDiffViewer from './ConfigDiffViewer.vue'
import ReadmeDiffViewer from './ReadmeDiffViewer.vue'
import MetricsCompareViewer from './MetricsCompareViewer.vue'

const METRICS_FILES = ['metrics.json', 'eval_results.json']

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
const versionWarning = ref('')
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

const apiPrefix = computed(() => `${props.repoType}s/${props.namespace}/${props.name}`)

const missingFilesMessage = computed(() => {
  const parts = []
  if (dataA.value.missingFiles?.length) {
    parts.push(`Version A missing: ${dataA.value.missingFiles.join(', ')}`)
  }
  if (dataB.value.missingFiles?.length) {
    parts.push(`Version B missing: ${dataB.value.missingFiles.join(', ')}`)
  }
  return parts.join('. ')
})

const handleClose = () => {
  dialogVisible.value = false
}

const extractErrorMessage = (error) => {
  if (!error) return 'Request failed'
  if (typeof error === 'string') return error
  return error.msg || error.message || 'Request failed'
}

const formatCommitId = (commitId) => {
  if (!commitId) return 'Unavailable'
  return commitId.substring(0, 8)
}

const resetComparisonState = () => {
  versionA.value = ''
  versionB.value = ''
  versionOptions.value = []
  versionLoadError.value = ''
  versionWarning.value = ''
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

const fetchVersionOptions = async () => {
  if (!props.namespace || !props.name) {
    versionLoadError.value = 'Repository namespace and name are required to load versions.'
    return
  }

  loadingOptions.value = true
  versionLoadError.value = ''
  versionWarning.value = ''
  commitsError.value = ''

  const options = []
  const existingValues = new Set()

  try {
    const branchesUrl = `/${apiPrefix.value}/branches`
    const tagsUrl = `/${apiPrefix.value}/tags`
    const commitsUrl = `/${apiPrefix.value}/commits?per=20`

    const [{ data: branchRes, error: branchError }, { data: tagRes }, { data: commitRes, error: commitError }] = await Promise.all([
      useFetchApi(branchesUrl).json(),
      useFetchApi(tagsUrl).json(),
      useFetchApi(commitsUrl).json()
    ])

    if (branchError?.value) {
      versionLoadError.value = extractErrorMessage(branchError.value)
      ElMessage.error(versionLoadError.value)
      versionOptions.value = []
      return
    }

    if (branchRes?.value?.data && Array.isArray(branchRes.value.data)) {
      branchRes.value.data.forEach((b) => {
        if (b.name && !existingValues.has(b.name)) {
          existingValues.add(b.name)
          options.push({ label: `${b.name} (Branch)`, value: b.name, type: 'branch' })
        }
      })
    }

    if (tagRes?.value?.data && Array.isArray(tagRes.value.data)) {
      tagRes.value.data.forEach((t) => {
        const tagName = t.name || t.tag_name
        if (tagName && !existingValues.has(tagName)) {
          existingValues.add(tagName)
          options.push({ label: `${tagName} (Tag)`, value: tagName, type: 'tag' })
        }
      })
    }

    if (commitError?.value) {
      commitsError.value = extractErrorMessage(commitError.value)
      versionWarning.value = `Commit history could not be loaded: ${commitsError.value}`
    } else if (commitRes?.value) {
      const commitList = parseCommitList(commitRes.value)
      allCommits.value = commitList
      commitList.forEach((c) => {
        const commitId = c.id || c.sha || ''
        const shortSha = commitId.substring(0, 7)
        if (commitId && !existingValues.has(commitId)) {
          existingValues.add(commitId)
          options.push({
            label: `${shortSha} - ${(c.message || 'Commit').slice(0, 30)} (Commit)`,
            value: commitId,
            type: 'commit'
          })
        }
      })
    }

    versionOptions.value = options

    if (options.length === 0) {
      versionLoadError.value = ''
      ElMessage.warning('No comparable versions were returned by the repository APIs.')
      return
    }

    const preferred = props.currentBranch && existingValues.has(props.currentBranch)
      ? props.currentBranch
      : options[0].value
    const alternate = options.find((opt) => opt.value !== preferred)?.value || preferred

    if (!versionA.value) versionA.value = preferred
    if (!versionB.value) versionB.value = alternate
    await fetchComparisonData()
  } catch (error) {
    versionLoadError.value = extractErrorMessage(error)
    versionOptions.value = []
    ElMessage.error(versionLoadError.value)
  } finally {
    loadingOptions.value = false
  }
}

const fetchBlobFile = async (filePath, refStr) => {
  const url = `/${apiPrefix.value}/blob/${filePath}?ref=${encodeURIComponent(refStr)}`
  const { data, error, response } = await useFetchApi(url).json()
  const status = response?.value?.status

  if (status === 404 || (!data.value?.data && !error.value)) {
    return { content: null, missing: true, error: null }
  }

  if (error.value || !data.value?.data) {
    return {
      content: null,
      missing: false,
      error: extractErrorMessage(error.value) || `Failed to load ${filePath}`
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

const fetchSingleVersionData = async (refStr) => {
  const result = emptyVersionData()

  if (!refStr) return result

  const [commitResult, configResult, readmeResult, metricsResult, evalResult] = await Promise.all([
    (async () => {
      const { data: commitsData } = await useFetchApi(
        `/${apiPrefix.value}/commits?ref=${encodeURIComponent(refStr)}&per=1`
      ).json()
      const commitObj = extractCommitObj(commitsData.value)
      if (commitObj) return { commit: commitObj }

      const { data: lastData } = await useFetchApi(
        `/${apiPrefix.value}/last_commit?ref=${encodeURIComponent(refStr)}`
      ).json()
      const lastCommitObj = extractCommitObj(lastData.value)
      if (lastCommitObj) return { commit: lastCommitObj }

      return { error: 'Failed to load commit metadata' }
    })(),
    fetchBlobFile('config.json', refStr),
    fetchBlobFile('README.md', refStr),
    fetchBlobFile('metrics.json', refStr),
    fetchBlobFile('eval_results.json', refStr)
  ])

  if (commitResult.commit) {
    const c = commitResult.commit
    result.commitId = c.id || ''
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

  const activeMetricsRes = !metricsResult.missing && !metricsResult.error ? metricsResult : !evalResult.missing && !evalResult.error ? evalResult : null
  if (activeMetricsRes && activeMetricsRes.content) {
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

const fetchComparisonData = async () => {
  if (!versionA.value || !versionB.value) return

  loadingData.value = true
  comparisonError.value = ''
  dataA.value = emptyVersionData()
  dataB.value = emptyVersionData()

  try {
    const [resA, resB] = await Promise.all([
      fetchSingleVersionData(versionA.value),
      fetchSingleVersionData(versionB.value)
    ])
    dataA.value = resA
    dataB.value = resB

    const hardFailures = [...resA.errors, ...resB.errors]
    if (hardFailures.length && !resA.commitId && !resB.commitId && !resA.config && !resB.config && !resA.readme && !resB.readme) {
      comparisonError.value = hardFailures.join('; ')
      ElMessage.error(comparisonError.value)
    } else if (hardFailures.length) {
      ElMessage.warning(hardFailures.join('; '))
    }
  } catch (error) {
    comparisonError.value = extractErrorMessage(error)
    dataA.value = emptyVersionData()
    dataB.value = emptyVersionData()
    ElMessage.error(comparisonError.value)
  } finally {
    loadingData.value = false
  }
}

const handleVersionChange = () => {
  fetchComparisonData()
}

const retryCurrentRequest = () => {
  if (versionLoadError.value || versionOptions.value.length === 0) {
    fetchVersionOptions()
    return
  }
  fetchComparisonData()
}

const exportReport = () => {
  if (comparisonError.value) return

  const content = `# CSGHub Model Version Comparison Report

**Model:** \`${props.namespace}/${props.name}\`  
**Generated:** ${new Date().toLocaleString()}  

---

## Version Metadata

| Attribute | Version A (Baseline) | Version B (Target) |
|---|---|---|
| **Version/Ref** | \`${versionA.value}\` | \`${versionB.value}\` |
| **Commit SHA** | \`${dataA.value.commitId || 'Unavailable'}\` | \`${dataB.value.commitId || 'Unavailable'}\` |
| **Author** | ${dataA.value.author || 'Unavailable'} | ${dataB.value.author || 'Unavailable'} |
| **Date** | ${dataA.value.date || 'Unavailable'} | ${dataB.value.date || 'Unavailable'} |
| **Message** | ${dataA.value.message || 'Unavailable'} | ${dataB.value.message || 'Unavailable'} |

---

## Configuration / Parameters Summary

- **Version A Config Available:** ${dataA.value.config ? 'Yes' : 'No'}
- **Version B Config Available:** ${dataB.value.config ? 'Yes' : 'No'}

\`\`\`json
${dataA.value.config ? JSON.stringify(dataA.value.config, null, 2) : 'Not available'}
\`\`\`

\`\`\`json
${dataB.value.config ? JSON.stringify(dataB.value.config, null, 2) : 'Not available'}
\`\`\`

---

## Performance Metrics Comparison

${dataA.value.metrics || dataB.value.metrics ? JSON.stringify({ versionA: dataA.value.metrics, versionB: dataB.value.metrics }, null, 2) : 'No performance metrics file was returned by the API.'}

---

## Model Card / README Status

- **Version A README:** ${dataA.value.readme ? 'Available' : 'Not available'}
- **Version B README:** ${dataB.value.readme ? 'Available' : 'Not available'}
`

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  createAndClickAnchor(url, `comparison-${props.name}-${versionA.value}-vs-${versionB.value}.md`)
}

watch(() => props.visible, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    resetComparisonState()
    fetchVersionOptions()
  }
}, { immediate: true })
</script>

<style scoped>
:deep(.compare-versions-dialog) {
  border-radius: 12px;
}
</style>
