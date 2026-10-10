<template>
  <div class="config-diff-viewer">
    <el-skeleton v-if="loading" :rows="6" animated />

    <div v-else-if="!configA && !configB" class="py-12">
      <el-empty :description="$t('shared.noData') || 'No configuration files available for comparison'" />
    </div>

    <div v-else class="space-y-6">
      <!-- Missing file warnings if only one exists -->
      <el-alert
        v-if="!configA"
        type="warning"
        :closable="false"
        show-icon
        title="Baseline (Version A) does not contain config.json. Comparison is limited to the available file."
        class="mb-4"
      />
      <el-alert
        v-if="!configB"
        type="warning"
        :closable="false"
        show-icon
        title="Target (Version B) does not contain config.json. Comparison is limited to the available file."
        class="mb-4"
      />
      <el-alert
        v-if="invalidJsonMessage"
        type="warning"
        :closable="false"
        show-icon
        :title="invalidJsonMessage"
        class="mb-4"
      />

      <pre
        v-if="!canCompare"
        class="font-mono text-xs rounded border border-gray-200 overflow-x-auto bg-gray-900 text-gray-100 p-4 leading-relaxed"
      >{{ formatVal(parsedObjA || parsedObjB || configA || configB) }}</pre>

      <!-- View mode toggle & Summary bar -->
      <div v-if="canCompare" class="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">Parameter Changes:</span>
          <el-tag size="small" type="success" effect="plain" v-if="diffResult.added.length">
            +{{ diffResult.added.length }} Added
          </el-tag>
          <el-tag size="small" type="danger" effect="plain" v-if="diffResult.removed.length">
            -{{ diffResult.removed.length }} Removed
          </el-tag>
          <el-tag size="small" type="warning" effect="plain" v-if="diffResult.changed.length">
            Δ {{ diffResult.changed.length }} Changed
          </el-tag>
          <el-tag size="small" type="info" effect="plain">
            {{ diffResult.unchanged.length }} Unchanged
          </el-tag>
        </div>

        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button value="structured" label="structured">Key Summary</el-radio-button>
          <el-radio-button value="raw" label="raw">Raw JSON Diff</el-radio-button>
        </el-radio-group>
      </div>

      <!-- Structured Key-Value View -->
      <div v-if="canCompare && viewMode === 'structured'" class="space-y-4">
        <!-- Changed Parameters Table -->
        <div v-if="diffResult.changed.length > 0" class="border border-amber-200 rounded overflow-hidden">
          <div class="bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-2">
            <span>Δ Changed Parameters ({{ diffResult.changed.length }})</span>
          </div>
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 border-b border-amber-200 text-xs text-gray-500 uppercase">
              <tr>
                <th class="px-4 py-2">Parameter</th>
                <th class="px-4 py-2 w-1/3">Version A</th>
                <th class="px-4 py-2 w-1/3">Version B</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in diffResult.changed" :key="item.key" class="hover:bg-amber-50/50">
                <td class="px-4 py-2.5 font-mono text-xs text-gray-800 font-semibold">{{ item.key }}</td>
                <td class="px-4 py-2.5 font-mono text-xs bg-red-50/60 text-red-700 break-all">{{ formatVal(item.valA) }}</td>
                <td class="px-4 py-2.5 font-mono text-xs bg-green-50/60 text-green-700 break-all">{{ formatVal(item.valB) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Added Parameters Table -->
        <div v-if="diffResult.added.length > 0" class="border border-green-200 rounded overflow-hidden">
          <div class="bg-green-50 px-4 py-2 text-xs font-semibold text-green-800 uppercase tracking-wider flex items-center gap-2">
            <span>+ Added Parameters ({{ diffResult.added.length }})</span>
          </div>
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 border-b border-green-200 text-xs text-gray-500 uppercase">
              <tr>
                <th class="px-4 py-2">Parameter</th>
                <th class="px-4 py-2">Value in Version B</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in diffResult.added" :key="item.key" class="bg-green-50/30 hover:bg-green-50/70">
                <td class="px-4 py-2.5 font-mono text-xs text-green-900 font-semibold">{{ item.key }}</td>
                <td class="px-4 py-2.5 font-mono text-xs text-green-700 break-all">{{ formatVal(item.valB) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Removed Parameters Table -->
        <div v-if="diffResult.removed.length > 0" class="border border-red-200 rounded overflow-hidden">
          <div class="bg-red-50 px-4 py-2 text-xs font-semibold text-red-800 uppercase tracking-wider flex items-center gap-2">
            <span>- Removed Parameters ({{ diffResult.removed.length }})</span>
          </div>
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 border-b border-red-200 text-xs text-gray-500 uppercase">
              <tr>
                <th class="px-4 py-2">Parameter</th>
                <th class="px-4 py-2">Value in Version A</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in diffResult.removed" :key="item.key" class="bg-red-50/30 hover:bg-red-50/70">
                <td class="px-4 py-2.5 font-mono text-xs text-red-900 font-semibold line-through">{{ item.key }}</td>
                <td class="px-4 py-2.5 font-mono text-xs text-red-700 break-all">{{ formatVal(item.valA) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Unchanged Collapsible -->
        <el-collapse v-if="diffResult.unchanged.length > 0">
          <el-collapse-item name="unchanged">
            <template #title>
              <span class="text-xs text-gray-500 font-medium px-2">
                Show Unchanged Parameters ({{ diffResult.unchanged.length }})
              </span>
            </template>
            <table class="w-full text-left text-sm border border-gray-200 rounded mt-2">
              <thead class="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th class="px-4 py-2">Parameter</th>
                  <th class="px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="item in diffResult.unchanged" :key="item.key" class="hover:bg-gray-50">
                  <td class="px-4 py-2 font-mono text-xs text-gray-600">{{ item.key }}</td>
                  <td class="px-4 py-2 font-mono text-xs text-gray-500 break-all">{{ formatVal(item.valA) }}</td>
                </tr>
              </tbody>
            </table>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- Raw JSON Diff View -->
      <div v-else-if="canCompare" class="raw-diff-container font-mono text-xs rounded border border-gray-200 overflow-x-auto bg-gray-900 text-gray-100 p-4 leading-relaxed">
        <div v-for="(part, index) in rawJsonDiff" :key="index" :class="getDiffClass(part)">
          <span class="select-none inline-block w-6 opacity-60 text-right mr-3">{{ part.added ? '+' : part.removed ? '-' : ' ' }}</span>
          <span>{{ part.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { diffJson } from 'diff'

const props = defineProps({
  configA: [Object, String, null],
  configB: [Object, String, null],
  loading: Boolean
})

const viewMode = ref('structured')

const tryParse = (config) => {
  if (!config) return { obj: null, invalid: false }
  if (typeof config === 'object') return { obj: config, invalid: false }
  try {
    return { obj: JSON.parse(config), invalid: false }
  } catch (e) {
    return { obj: null, invalid: true }
  }
}

const parsedA = computed(() => tryParse(props.configA))
const parsedB = computed(() => tryParse(props.configB))
const parsedObjA = computed(() => parsedA.value.obj)
const parsedObjB = computed(() => parsedB.value.obj)
const canCompare = computed(() => !!parsedObjA.value && !!parsedObjB.value)

const invalidJsonMessage = computed(() => {
  const parts = []
  if (parsedA.value.invalid) parts.push('Version A config.json is not valid JSON')
  if (parsedB.value.invalid) parts.push('Version B config.json is not valid JSON')
  return parts.join('. ')
})

const formatVal = (val) => {
  if (val === undefined) return 'undefined'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

const diffResult = computed(() => {
  if (!canCompare.value) {
    return { added: [], removed: [], changed: [], unchanged: [] }
  }

  const objA = parsedObjA.value
  const objB = parsedObjB.value

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  const allKeys = Array.from(new Set([...keysA, ...keysB])).sort()

  const added = []
  const removed = []
  const changed = []
  const unchanged = []

  for (const key of allKeys) {
    const hasA = Object.prototype.hasOwnProperty.call(objA, key)
    const hasB = Object.prototype.hasOwnProperty.call(objB, key)

    if (hasA && !hasB) {
      removed.push({ key, valA: objA[key] })
    } else if (!hasA && hasB) {
      added.push({ key, valB: objB[key] })
    } else {
      const valAStr = JSON.stringify(objA[key])
      const valBStr = JSON.stringify(objB[key])

      if (valAStr !== valBStr) {
        changed.push({ key, valA: objA[key], valB: objB[key] })
      } else {
        unchanged.push({ key, valA: objA[key] })
      }
    }
  }

  return { added, removed, changed, unchanged }
})

const rawJsonDiff = computed(() => {
  if (!canCompare.value) return []
  return diffJson(parsedObjA.value, parsedObjB.value)
})

const getDiffClass = (part) => {
  if (part.added) {
    return 'bg-green-950 text-green-300 font-semibold px-2 py-0.5 rounded-sm my-0.5'
  }
  if (part.removed) {
    return 'bg-red-950 text-red-300 font-semibold px-2 py-0.5 rounded-sm my-0.5 opacity-80'
  }
  return 'text-gray-400 opacity-70 px-2'
}
</script>

<style scoped>
.raw-diff-container {
  max-height: 500px;
  overflow-y: auto;
}
</style>
