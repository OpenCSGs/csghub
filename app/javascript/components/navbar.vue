<template>
  <div class="flex text-white bg-[#1C8B7F] justify-between items-center">
    <div class="flex">
      <div class="py-2 pl-4 mr-[100px] sm:mr-[30px]">
        <img src="/assets/opencsg_logo.png" height=51 width=157 alt="OpenCSG Logo" />
      </div>
      <ul class="flex justify-between items-center sm:hidden">
        <li class="px-4"> 应用空间 </li>
        <li class="px-4"> 企业社区 </li>
        <li class="px-4"> 技术专家 </li>
      </ul>
    </div>
    <div class="flex justify-between items-center px-4">
      <div>
        <p class="px-8 sm:px-4"> StarChain </p>
      </div>
      <el-dropdown class="hidden sm:block px-8">
        <span class="el-dropdown-link">
          目录
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>应用空间</el-dropdown-item>
            <el-dropdown-item>企业社区</el-dropdown-item>
            <el-dropdown-item>技术专家</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar :size="40" src="https://empty">
            <img src="/assets/opencsg_logo.png" />
          </el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <a :href="logout" @click="cleanUpAuthing" class="text-gray-800 dark:text-white bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-2 lg:px-3 py-2 lg:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"> Logout </a>
            </el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    logout: String
  },
  data() {
    return { }
  },
  methods: {
    cleanUpAuthing() {
      localStorage.removeItem('_guard_i18nextLng')
      localStorage.removeItem('_authing_token')
      localStorage.removeItem('_authing_user')
      localStorage.removeItem('__authing__multiple_accounts')
    }
  },
  mounted() {
    console.log(this.logout)
  }
}
</script>

<style>
  .el-dropdown {
    color: white;
  }
</style>