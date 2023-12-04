<template>
  <div class="min-h-[300px] pt-8 md:px-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div>
          <el-dropdown split-button>
            <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="8.75" cy="2.25" r="1.75" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="3.25" cy="9.5" r="1.75" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.25 4L3.25 7.75" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="3.25" cy="2.25" r="1.75" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3.25 7.75V7.75C3.25 6.64543 4.14543 5.75 5.25 5.75H7C7.9665 5.75 8.75 4.9665 8.75 4V4" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            main
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>1.0.1</el-dropdown-item>
                <el-dropdown-item>1.0.0</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="flex items-center">
        <div class="flex items-center border border-[#DCDFE6] rounded-[100px] px-4 py-[1px] md:hidden">
          <el-avatar :size="24" class="mr-1" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          1 contributors
        </div>
        <a href="#" class="mx-4 md:hidden">history: 4 commits</a>
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

    <div class="flex items-center justify-between mt-4 px-3 py-2 border border-[#DCDFE6] border-b-0 bg-[#F5F7FA] rounded-t-[4px]">
      <div class="flex items-center">
        <div class="flex items-center mr-2">
          <el-avatar :size="24" class="mr-2" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <a href="#" class="text-[#303133]">{{ lastCommit.author_name }}</a>
        </div>
        <a href="#" class="mr-2 text-[#606266]">{{ lastCommit.message }}</a>
        <div class="rounded border border-[#DCDFE6] text-xs text-[#606266] px-3 py-[2px]">
          {{ lastCommit.id.substring(0, 7) }}
        </div>
      </div>
      <div class="text-[#909399] md:hidden">
        {{ format(lastCommit.committer_dat, 'zh_CN') }}
      </div>
    </div>

    <div v-for="file in files" class="flex items-center justify-between px-3 py-2 border border-[#DCDFE6] last-of-type:border-t-0 last-of-type:rounded-b-[4px]">
      <div class="flex items-center mr-2 w-[30%]">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
          <path d="M8.16634 1.95817V1.95817C8.16634 3.08384 8.16634 3.64668 8.38433 4.0745C8.57608 4.45083 8.88204 4.75679 9.25836 4.94853C9.68618 5.16652 10.249 5.16652 11.3747 5.16652V5.16652M11.6663 5.90865V10.1332C11.6663 11.2533 11.6663 11.8133 11.4484 12.2412C11.2566 12.6175 10.9506 12.9234 10.5743 13.1152C10.1465 13.3332 9.58645 13.3332 8.46634 13.3332H5.53301C4.4129 13.3332 3.85285 13.3332 3.42503 13.1152C3.0487 12.9234 2.74274 12.6175 2.55099 12.2412C2.33301 11.8133 2.33301 11.2533 2.33301 10.1332V4.86651C2.33301 3.7464 2.33301 3.18635 2.55099 2.75852C2.74274 2.3822 3.0487 2.07624 3.42503 1.88449C3.85285 1.6665 4.4129 1.6665 5.53301 1.6665H7.42419C7.91337 1.6665 8.15796 1.6665 8.38814 1.72176C8.59221 1.77076 8.7873 1.85157 8.96624 1.96122C9.16808 2.08491 9.34103 2.25786 9.68693 2.60376L10.7291 3.64591C11.075 3.99182 11.2479 4.16477 11.3716 4.3666C11.4813 4.54555 11.5621 4.74063 11.6111 4.94471C11.6663 5.17488 11.6663 5.41947 11.6663 5.90865Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="ml-2 text-sm">
          {{ file.name }}
        </div>
      </div>
      <div class="text-sm text-[#606266] w-[20%]">
        {{ file.size }} kb
      </div>
      <a href="#" class="text-[#606266] w-[30%]">
        {{ file.commit.message }}
      </a>
      <div class="text-[#909399] w-[20%] text-right md:hidden">
        {{ format(file.commit.created_at, 'zh_CN') }}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { format } from 'timeago.js';

  defineProps({
    files: Object,
    lastCommit: Object,
  })
</script>
