<template>
  <div>
    <el-dropdown>
      <el-button type="default">
        <SvgIcon
          name="branch"
          class="mr-1"
        />
        {{ currentBranch }}
        <el-icon class="ml-1 el-icon--right">
          <arrow-down />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="branch in branches"
            :key="branch.name"
            @click="handleClick(branch.name)"
          >
            {{ branch.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
  import { ref, inject, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import jwtFetch from '../../packs/jwtFetch'

  const props = defineProps({
    currentBranch: String
  })

  const csghubServer = inject('csghubServer')
  const branches = ref([])

  const emit = defineEmits(['changeBranch'])

  const handleClick = (branch) => {
    emit('changeBranch', branch)
  }

  const prefixPath = document.location.pathname.split('/')[1]
  const namespace = document.location.pathname.split('/')[2]
  const repoName = document.location.pathname.split('/')[3]

  const fetchBranches = async () => {
    const url = `${csghubServer}/api/v1/${prefixPath}/${namespace}/${repoName}/branches`

    const response = await jwtFetch(url, { method: 'GET' })

    const result = await response.json()

    if (response.ok) {
      branches.value = result.data
    } else {
      ElMessage({ message: data.msg, type: 'warning' })
    }
  }

  onMounted(() => {
    fetchBranches()
  })
</script>
