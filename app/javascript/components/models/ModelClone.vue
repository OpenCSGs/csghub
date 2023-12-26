<template>
  <div class="flex items-center absolute top-0 right-0 md:relative md:pl-5 md:pb-4 z-10">
<!--    <el-dropdown>-->
<!--      <div class="rounded border border-[#DCDFE6] flex items-center justify-center w-[46px] h-8 mr-2 cursor-pointer">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">-->
<!--          <path d="M6.70833 4.08317C7.51042 4.08317 8.16667 3.42692 8.16667 2.62484C8.16667 1.82275 7.51042 1.1665 6.70833 1.1665C5.90625 1.1665 5.25 1.82275 5.25 2.62484C5.25 3.42692 5.90625 4.08317 6.70833 4.08317Z" fill="#606266"/>-->
<!--          <path d="M6.70833 5.5415C5.90625 5.5415 5.25 6.19775 5.25 6.99984C5.25 7.80192 5.90625 8.45817 6.70833 8.45817C7.51042 8.45817 8.16667 7.80192 8.16667 6.99984C8.16667 6.19775 7.51042 5.5415 6.70833 5.5415Z" fill="#606266"/>-->
<!--          <path d="M5.25 11.3748C5.25 10.5728 5.90625 9.9165 6.70833 9.9165C7.51042 9.9165 8.16667 10.5728 8.16667 11.3748C8.16667 12.1769 7.51042 12.8332 6.70833 12.8332C5.90625 12.8332 5.25 12.1769 5.25 11.3748Z" fill="#606266"/>-->
<!--        </svg>-->
<!--      </div>-->
<!--      <el-dropdown-item @click="cloneRepositoryVisible = true">-->
<!--        <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">-->
<!--          <rect opacity="0.12" x="1.3335" y="1.3335" width="13.3333" height="13.3333" rx="3.33333" fill="#2F384C"/>-->
<!--          <path d="M6.66683 5.3335L4.00016 8.00016L6.66683 10.6668M9.3335 5.3335L12.0002 8.00016L9.3335 10.6668M6.66682 14.6668H9.3335C11.2003 14.6668 12.1338 14.6668 12.8468 14.3035C13.474 13.9839 13.9839 13.474 14.3035 12.8468C14.6668 12.1338 14.6668 11.2003 14.6668 9.3335V6.66683C14.6668 4.79999 14.6668 3.86657 14.3035 3.15353C13.9839 2.52632 13.474 2.01639 12.8468 1.69681C12.1338 1.3335 11.2003 1.3335 9.3335 1.3335H6.66683C4.79999 1.3335 3.86657 1.3335 3.15353 1.69681C2.52632 2.01639 2.01639 2.52632 1.69681 3.15353C1.3335 3.86657 1.3335 4.79999 1.3335 6.66682V9.3335C1.3335 11.2003 1.3335 12.1338 1.69681 12.8468C2.01639 13.474 2.52632 13.9839 3.15353 14.3035C3.86657 14.6668 4.79999 14.6668 6.66682 14.6668Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--        </svg>-->
<!--        Clone repository-->
<!--      </el-dropdown-item>-->
<!--      <template #dropdown>-->
<!--        <el-dropdown-menu>-->
<!--          <el-dropdown-item @click="cloneRepositoryVisible = true">-->
<!--            <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">-->
<!--              <rect opacity="0.12" x="1.3335" y="1.3335" width="13.3333" height="13.3333" rx="3.33333" fill="#2F384C"/>-->
<!--              <path d="M6.66683 5.3335L4.00016 8.00016L6.66683 10.6668M9.3335 5.3335L12.0002 8.00016L9.3335 10.6668M6.66682 14.6668H9.3335C11.2003 14.6668 12.1338 14.6668 12.8468 14.3035C13.474 13.9839 13.9839 13.474 14.3035 12.8468C14.6668 12.1338 14.6668 11.2003 14.6668 9.3335V6.66683C14.6668 4.79999 14.6668 3.86657 14.3035 3.15353C13.9839 2.52632 13.474 2.01639 12.8468 1.69681C12.1338 1.3335 11.2003 1.3335 9.3335 1.3335H6.66683C4.79999 1.3335 3.86657 1.3335 3.15353 1.69681C2.52632 2.01639 2.01639 2.52632 1.69681 3.15353C1.3335 3.86657 1.3335 4.79999 1.3335 6.66682V9.3335C1.3335 11.2003 1.3335 12.1338 1.69681 12.8468C2.01639 13.474 2.52632 13.9839 3.15353 14.3035C3.86657 14.6668 4.79999 14.6668 6.66682 14.6668Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--            </svg>-->
<!--            Clone repository-->
<!--          </el-dropdown-item>-->
<!--        </el-dropdown-menu>-->
<!--      </template>-->
<!--    </el-dropdown>-->
<!--    <div class="rounded border border-[#DCDFE6] flex items-center justify-center w-[158px] h-8 cursor-pointer" @click="dialogLibraryVisible = true">-->
<!--      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">-->
<!--        <path d="M4.6665 3.5L1.1665 7L4.6665 10.5M9.33317 3.5L12.8332 7L9.33317 10.5" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>-->
<!--      </svg>-->
<!--      <div class="ml-2 text-[#606266] text-sm font-medium">Use with library</div>-->
<!--    </div>-->
    <div class="rounded border border-[#DCDFE6] flex items-center justify-center w-[158px] h-8 cursor-pointer" @click="cloneRepositoryVisible = true">
      <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect opacity="0.12" x="1.3335" y="1.3335" width="13.3333" height="13.3333" rx="3.33333" fill="#2F384C"/>
        <path
            d="M6.66683 5.3335L4.00016 8.00016L6.66683 10.6668M9.3335 5.3335L12.0002 8.00016L9.3335 10.6668M6.66682 14.6668H9.3335C11.2003 14.6668 12.1338 14.6668 12.8468 14.3035C13.474 13.9839 13.9839 13.474 14.3035 12.8468C14.6668 12.1338 14.6668 11.2003 14.6668 9.3335V6.66683C14.6668 4.79999 14.6668 3.86657 14.3035 3.15353C13.9839 2.52632 13.474 2.01639 12.8468 1.69681C12.1338 1.3335 11.2003 1.3335 9.3335 1.3335H6.66683C4.79999 1.3335 3.86657 1.3335 3.15353 1.69681C2.52632 2.01639 2.01639 2.52632 1.69681 3.15353C1.3335 3.86657 1.3335 4.79999 1.3335 6.66682V9.3335C1.3335 11.2003 1.3335 12.1338 1.69681 12.8468C2.01639 13.474 2.52632 13.9839 3.15353 14.3035C3.86657 14.6668 4.79999 14.6668 6.66682 14.6668Z"
            stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="ml-2 text-[#606266] text-sm font-medium">下载模型</div>
    </div>
    <el-dialog v-model="dialogLibraryVisible" title="Model library is unknown" class="md:!w-[80%]">
      <div class="text-[#a0a1a7] p-2"># Type of model/library unknown.</div>
      <div class="text-[#a0a1a7] p-2"># Feel free to open a Pull request </div>
      <div class="text-[#a0a1a7] p-2"># for integration of the OpenCSG model hub</div>
      <div class="text-[#a0a1a7] p-2"># into the corresponding library =)</div>
    </el-dialog>
    <el-dialog v-model="cloneRepositoryVisible" title="" class="md:!w-[80%]">
      <div class="rounded-t border-t border-x border-[#EBEEF5] mt-4">
        <div class="flex items-center px-3 py-2 bg-[#F5F7FA] text-[#303133]">
          <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect opacity="0.12" x="1.3335" y="1.3335" width="13.3333" height="13.3333" rx="3.33333" fill="#2F384C"/>
            <path d="M6.66683 5.3335L4.00016 8.00016L6.66683 10.6668M9.3335 5.3335L12.0002 8.00016L9.3335 10.6668M6.66682 14.6668H9.3335C11.2003 14.6668 12.1338 14.6668 12.8468 14.3035C13.474 13.9839 13.9839 13.474 14.3035 12.8468C14.6668 12.1338 14.6668 11.2003 14.6668 9.3335V6.66683C14.6668 4.79999 14.6668 3.86657 14.3035 3.15353C13.9839 2.52632 13.474 2.01639 12.8468 1.69681C12.1338 1.3335 11.2003 1.3335 9.3335 1.3335H6.66683C4.79999 1.3335 3.86657 1.3335 3.15353 1.69681C2.52632 2.01639 2.01639 2.52632 1.69681 3.15353C1.3335 3.86657 1.3335 4.79999 1.3335 6.66682V9.3335C1.3335 11.2003 1.3335 12.1338 1.69681 12.8468C2.01639 13.474 2.52632 13.9839 3.15353 14.3035C3.86657 14.6668 4.79999 14.6668 6.66682 14.6668Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          下载模型数据
        </div>
      </div>
      <el-tabs v-model="activeCloneType" class="border border-[#EBEEF5] mb-8 clone-tabs">
        <el-tab-pane label="HTTPS" name="https">
          <div class="flex flex-col gap-1 px-3 py-2 border-t border-[#EBEEF5] bg-[#ffffff] text-[#303133] break-all">
            <div class="text-[#909399]"># 在下载前请确认您安装了git-lfs  (https://git-lfs.com)</div>
            <div>git lfs install</div>
            <div>git clone {{ cloneHttpUrl }}</div>
            <div class="text-[#909399]"># 如果您不想下载LFS文件的内容，请在环境变量中添加</div>
            <div>GIT_LFS_SKIP_SMUDGE=1</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="SSH" name="ssh">
          <div class="flex flex-col gap-1 px-3 py-2 border-t border-[#EBEEF5] bg-[#ffffff] text-[#303133] break-all">
            <div class="text-[#909399]"># 在下载前请确认您安装了git-lfs  (https://git-lfs.com)</div>
            <div>git lfs install</div>
            <div>git clone {{ cloneSshUrl }}</div>
            <div class="text-[#909399]"># 如果您不想下载LFS文件的内容，请在环境变量中添加</div>
            <div>GIT_LFS_SKIP_SMUDGE=1</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  cloneHttpUrl: String,
  cloneSshUrl: String,
})

const activeCloneType = ref('https')
const dialogLibraryVisible = ref(false)
const cloneRepositoryVisible = ref(false)
</script>
