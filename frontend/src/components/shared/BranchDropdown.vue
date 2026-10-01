<template>
  <div>
    <el-dropdown :max-height="350" class="branch-dropdown" trigger="click">
      <CsgButton
        class="btn btn-secondary-gray btn-sm"
        :name="currentBranch"
        svgName="chevron-down"
        svgPosition="right"
      />
      <template #dropdown>
        <el-dropdown-menu class="branch-dropdown-menu !p-0 overflow-hidden">
          <!-- Search Input Box -->
          <div class="p-2 border-b border-gray-100 bg-white" @click.stop data-testid="branch-search-box">
            <el-input
              v-model="searchQuery"
              :placeholder="$t('all.filterBranches')"
              size="small"
              clearable
              class="branch-search-input"
              data-testid="branch-search-input"
            >
              <template #prefix>
                <SvgIcon name="search" class="w-3.5 h-3.5 text-gray-400" />
              </template>
            </el-input>
          </div>

          <!-- Branch Count Header -->
          <div
            class="px-3 py-1.5 text-2xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100 flex items-center justify-between"
            data-testid="branch-count-header"
          >
            <span>{{ $t('all.branches') }}</span>
            <span class="text-gray-400 font-mono">({{ filteredBranches.length }})</span>
          </div>

          <!-- Branch List Items -->
          <div class="max-h-[220px] overflow-y-auto py-1">
            <el-dropdown-item
              v-for="branch in filteredBranches"
              :key="branch.name"
              @click="handleClick(branch.name)"
              :class="[
                'branch-dropdown-item flex items-center justify-between gap-2',
                branch.name === currentBranch ? 'selected !bg-brand-50 !text-brand-700 font-medium' : ''
              ]"
              data-testid="branch-item"
            >
              <div class="flex items-center gap-1.5 min-w-0">
                <SvgIcon name="branch" class="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                <span class="truncate">{{ branch.name }}</span>
              </div>
              <SvgIcon
                v-if="branch.name === currentBranch"
                name="check_circle"
                class="w-3.5 h-3.5 text-brand-600 flex-shrink-0"
                data-testid="active-branch-indicator"
              />
            </el-dropdown-item>

            <!-- Empty Search State -->
            <div
              v-if="filteredBranches.length === 0"
              class="px-3 py-4 text-xs text-gray-400 text-center"
              data-testid="no-branches-found"
            >
              {{ $t('all.noMatchingBranches') }}
            </div>
          </div>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import { useRepoTabStore } from '../../stores/RepoTabStore'

  const props = defineProps({
    currentBranch: String
  })

  const { resetFileNotFound } = useRepoTabStore()
  const branches = ref([])
  const searchQuery = ref('')

  const emit = defineEmits(['changeBranch'])

  const filteredBranches = computed(() => {
    if (!searchQuery.value) return branches.value || []
    const q = searchQuery.value.trim().toLowerCase()
    return (branches.value || []).filter((branch) =>
      branch.name?.toLowerCase().includes(q)
    )
  })

  const handleClick = (branch) => {
    resetFileNotFound()
    searchQuery.value = ''
    emit('changeBranch', branch)
  }

  let prefixPath = document.location.pathname.split('/')[1]
  let namespace = document.location.pathname.split('/')[2]
  let repoName = document.location.pathname.split('/')[3]

  if (prefixPath === 'mcp') {
    prefixPath = 'mcps'
    namespace = document.location.pathname.split('/')[3]
    repoName = document.location.pathname.split('/')[4]
  }

  const fetchBranches = async () => {
    const url = `/${prefixPath}/${namespace}/${repoName}/branches`

    const { data, error } = await useFetchApi(url).json()

    if (data.value) {
      branches.value = data.value.data

      const branchExists = (branches.value || []).some(branch => branch.name === props.currentBranch)

      if (!branchExists && branches.value.length > 0) {
        const defaultBranch = branches.value[0].name
        emit('changeBranch', defaultBranch)
      }
    } else {
      ElMessage.warning(error.value.msg)
    }
  }

  onMounted(() => {
    fetchBranches()
  })

  defineExpose({
    branches,
    searchQuery,
    filteredBranches,
    handleClick,
    fetchBranches
  })
</script>

<style scoped>
.branch-button {
  border: 1px solid var(--Gray-300);
  border-radius: 8px;
  padding: 10px 12px !important;
  height: auto !important;
  font-size: 14px;
  font-weight: 400;
  color: var(--Gray-700);
  background-color: white;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1;
}

.branch-button:hover {
  border-color: var(--Gray-300) !important;
  background-color: var(--Gray-50) !important;
  color: var(--Gray-800) !important;
}

:deep(.branch-dropdown-menu) {
  border-radius: 8px;
  min-width: 220px;
  max-width: 320px;
  border: 1px solid var(--Gray-200);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
}

:deep(.branch-dropdown-item) {
  padding: 8px 12px;
  font-size: 13px;
  color: var(--Gray-700);
  border-radius: 6px;
  margin: 1px 4px;
}

:deep(.branch-dropdown-item:hover) {
  background-color: var(--Gray-50);
  color: var(--Gray-800);
}

:deep(.branch-dropdown-item.selected) {
  background-color: var(--brand-50, #F9F5FF) !important;
  color: var(--brand-700, #6941C6) !important;
  font-weight: 500;
}

:deep(.branch-search-input .el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.branch-search-input .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3250BD inset;
}
</style>
