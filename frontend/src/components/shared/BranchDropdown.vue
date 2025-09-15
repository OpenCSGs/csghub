<template>
  <div>
    <el-dropdown :max-height="300" class="branch-dropdown">
      <CsgButton
        class="btn btn-secondary-gray btn-sm"
        :name="currentBranch"
        svgName="chevron-down"
        svgPosition="right"
      />
      <template #dropdown>
        <el-dropdown-menu class="branch-dropdown-menu">
          <el-dropdown-item
            v-for="branch in branches"
            :key="branch.name"
            @click="handleClick(branch.name)"
            class="branch-dropdown-item"
          >
            {{ branch.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import { useRepoTabStore } from '../../stores/RepoTabStore'

  const props = defineProps({
    currentBranch: String
  })

  const { resetFileNotFound } = useRepoTabStore()
  const branches = ref([])

  const emit = defineEmits(['changeBranch'])

  const handleClick = (branch) => {
    resetFileNotFound()
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
  padding: 4px;
  min-width: 200px;
  border: 1px solid var(--Gray-200);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.branch-dropdown-item) {
  padding: 8px 16px;
  font-size: 14px;
  color: var(--Gray-700);
  border-radius: 6px;
  margin: 2px 2px;
}

:deep(.branch-dropdown-item:hover) {
  background-color: var(--Gray-50);
  color: var(--Gray-800);
}

:deep(.branch-dropdown-item.selected) {
  color: var(--Gray-50);
  font-weight: 500;
}

:deep(.el-icon) {
  font-size: 14px;
  margin: 0 0 0 6px;
}

.mr-1\.5 {
  margin-right: 6px;
}

.ml-1\.5 {
  margin-left: 6px;
}
</style>
