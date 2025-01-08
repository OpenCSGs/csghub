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
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'

  const props = defineProps({
    currentBranch: String
  })

  const branches = ref([])

  const emit = defineEmits(['changeBranch'])

  const handleClick = (branch) => {
    emit('changeBranch', branch)
  }

  const prefixPath = document.location.pathname.split('/')[1]
  const namespace = document.location.pathname.split('/')[2]
  const repoName = document.location.pathname.split('/')[3]

  const fetchBranches = async () => {
    const url = `/${prefixPath}/${namespace}/${repoName}/branches`

    const { data, error } = await useFetchApi(url).json()

    if (data.value) {
      branches.value = data.value.data
    } else {
      ElMessage.warning(error.value.msg)
    }
  }

  onMounted(() => {
    fetchBranches()
  })
</script>
