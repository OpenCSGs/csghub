<template>
  <div>
    <el-dropdown>
      <el-button type="default">
        <SvgIcon name="branch" class="mr-1 el-icon--right" />
        {{ currentBranch }}
        <el-icon class="ml-1"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="branch in branches" :key="branch.name" @click="handleClick(branch.name)">{{ branch.name }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
  const props = defineProps({
    currentBranch: String,
    branches: Array
  })

  const emit = defineEmits(['changeBranch'])

  const handleClick = (branch) => {
    emit('changeBranch', branch)
  }
</script>
