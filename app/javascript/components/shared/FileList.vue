<template>
  <div class="min-h-[300px] py-8 md:px-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center flex-wrap">
        <div class="mr-4">
          <el-dropdown split-button>
            <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="8.75" cy="2.25" r="1.75" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="3.25" cy="9.5" r="1.75" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.25 4L3.25 7.75" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="3.25" cy="2.25" r="1.75" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.25 7.75V7.75C3.25 6.64543 4.14543 5.75 5.25 5.75H7C7.9665 5.75 8.75 4.9665 8.75 4V4" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ currentBranch }}
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="branch in branches" :key="branch.name" @click="emit('change-branch', branch.name)">{{ branch.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <a :href="`/models/${namespacePath}/files/${currentBranch}`">{{ namespacePath.split('/')[1] }}</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="path in breadcrumb" :key="path">
            <a :href="`/models/${namespacePath}/files/${currentBranch}${path}`">{{ extractNameFromPath(path) }}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="flex items-center text-sm text-[#606266]">
        <div class="flex items-center py-[1px] md:hidden">
          <el-avatar :size="24" class="mr-1" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          1 contributors
        </div>
        <a href="#" class="mx-4 flex items-center px-4 py-[5px] border border-[#DCDFE6] rounded-[100px] md:hidden">
          <svg class="mr-2" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <g clip-path="url(#clip0_3745_32637)">
              <path d="M7.00033 4.6665V6.99984L8.75033 8.1665M7.00033 12.8332C3.77866 12.8332 1.16699 10.2215 1.16699 6.99984C1.16699 3.77818 3.77866 1.1665 7.00033 1.1665C10.222 1.1665 12.8337 3.77818 12.8337 6.99984C12.8337 10.2215 10.222 12.8332 7.00033 12.8332Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_3745_32637">
                <rect width="14" height="14" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          history: 4 commits
        </a>
        <el-dropdown split-button>
            + 添加文件
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>创建新文件</el-dropdown-item>
                <el-dropdown-item>上传文件</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
      </div>
    </div>

    <div class="flex items-center justify-between mt-4 px-3 py-2 border border-[#DCDFE6] bg-[#F5F7FA] rounded-t-[4px]">
      <div class="flex items-center text-sm">
        <div class="flex items-center mr-2">
          <el-avatar :size="24" class="mr-2" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <a href="#" class="text-[#303133] hover:underline">{{ lastCommit.author_name }}</a>
        </div>
        <a href="#" class="mr-2 text-[#606266] hover:underline">{{ lastCommit.message }}</a>
        <a href="#" class="rounded border border-[#DCDFE6] text-xs text-[#606266] px-3 py-[2px] hover:underline">
          {{ lastCommit.id.substring(0, 7) }}
        </a>
      </div>
      <div class="text-[#909399] text-sm cursor-pointer md:hidden">
        <el-popover
          width="158"
          placement="top"
          effect="dark"
          trigger="hover"
          :content="lastCommit.committer_date"
        >
          <template #reference>
            {{ format(lastCommit.committer_date, 'zh_CN') }}
          </template>
        </el-popover>
      </div>
    </div>

    <div v-for="file in files" class="flex items-center justify-between px-3 py-2 border border-t-0 border-[#DCDFE6] last-of-type:rounded-b-[4px]">
      <div class="flex items-center mr-2 w-[30%]">
        <svg v-if="file.type === 'dir'" xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
          <path d="M3.52949 1.229C2.5494 1.229 2.05935 1.229 1.68501 1.41974C1.35573 1.58752 1.08801 1.85524 0.920231 2.18452C0.729492 2.55887 0.729492 3.04891 0.729492 4.02901V10.0373C0.729492 11.3441 0.729492 11.9975 0.98381 12.4966C1.20751 12.9357 1.56447 13.2926 2.00351 13.5164C2.50264 13.7707 3.15604 13.7707 4.46283 13.7707H9.53783C10.8446 13.7707 11.498 13.7707 11.9971 13.5164C12.4362 13.2926 12.7931 12.9357 13.0168 12.4966C13.2712 11.9975 13.2712 11.3441 13.2712 10.0373V7.29567C13.2712 5.98888 13.2712 5.33549 13.0168 4.83636C12.7931 4.39731 12.4362 4.04036 11.9971 3.81666C11.498 3.56234 10.8446 3.56234 9.53783 3.56234H8.89755C8.58581 3.56234 8.42993 3.56234 8.2892 3.52677C8.05664 3.46799 7.84784 3.33894 7.69126 3.15722C7.59651 3.04725 7.5268 2.90784 7.38738 2.629V2.629C7.17826 2.21076 7.0737 2.00163 6.93157 1.83668C6.6967 1.56409 6.3835 1.37053 6.03465 1.28236C5.82356 1.229 5.58975 1.229 5.12213 1.229H3.52949Z" fill="#8AA2FF"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
          <path d="M8.16634 1.95817V1.95817C8.16634 3.08384 8.16634 3.64668 8.38433 4.0745C8.57608 4.45083 8.88204 4.75679 9.25836 4.94853C9.68618 5.16652 10.249 5.16652 11.3747 5.16652V5.16652M11.6663 5.90865V10.1332C11.6663 11.2533 11.6663 11.8133 11.4484 12.2412C11.2566 12.6175 10.9506 12.9234 10.5743 13.1152C10.1465 13.3332 9.58645 13.3332 8.46634 13.3332H5.53301C4.4129 13.3332 3.85285 13.3332 3.42503 13.1152C3.0487 12.9234 2.74274 12.6175 2.55099 12.2412C2.33301 11.8133 2.33301 11.2533 2.33301 10.1332V4.86651C2.33301 3.7464 2.33301 3.18635 2.55099 2.75852C2.74274 2.3822 3.0487 2.07624 3.42503 1.88449C3.85285 1.6665 4.4129 1.6665 5.53301 1.6665H7.42419C7.91337 1.6665 8.15796 1.6665 8.38814 1.72176C8.59221 1.77076 8.7873 1.85157 8.96624 1.96122C9.16808 2.08491 9.34103 2.25786 9.68693 2.60376L10.7291 3.64591C11.075 3.99182 11.2479 4.16477 11.3716 4.3666C11.4813 4.54555 11.5621 4.74063 11.6111 4.94471C11.6663 5.17488 11.6663 5.41947 11.6663 5.90865Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <a v-if="file.type === 'dir'" :href="`/models/${namespacePath}/files/${currentBranch}/${file.path}`" class="ml-2 text-sm text-[#303133] hover:underline">
          {{ file.name }}
        </a>
        <a v-else href="#" class="ml-2 text-sm text-[#303133] hover:underline">
          {{ file.name }}
        </a>
      </div>
      <div class="text-sm text-[#606266] w-[20%]">
        <span v-if="file.type === 'file'">{{ file.size }} kb</span>
      </div>
      <a href="#" class="text-[#606266] w-[30%] text-sm hover:underline">
        {{ file.commit.message }}
      </a>
      <div class="text-[#909399] w-[20%] text-sm text-right cursor-pointer md:hidden">
        <el-popover
          width="158"
          placement="top"
          effect="dark"
          trigger="hover"
          :content="file.commit.created_at"
        >
          <template #reference>
            {{ format(file.commit.created_at, 'zh_CN') }}
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { format } from 'timeago.js';

  const props = defineProps({
    files: Object,
    lastCommit: Object,
    branches: Object,
    currentBranch: String,
    currentPath: String,
    namespacePath: String,
  })

  const breadcrumb = ref([])

  const extractNameFromPath = (path) => {
    const parts = path.split('/')
    return parts[parts.length - 1]
  };

  const updateBreadcrumb = () => {
    const breadcrumbArray = props.currentPath.split('/').filter(Boolean);
    let breadcrumbPath = ''
    breadcrumb.value = breadcrumbArray.map((item) => {
      breadcrumbPath += '/' + item
      return breadcrumbPath
    })
  }

  onMounted(() => {
    updateBreadcrumb()
  })
</script>
