<template>
  <div class="flex items-center flex-wrap gap-2 pl-4 py-4 mt-4 md:pl-0 md:pb-0 z-10 border-t border-[#EBEEF5]">
    <div class="rounded border border-[#DCDFE6] flex items-center justify-center px-4 py-[5px] cursor-pointer hover:outline hover:outline-[#D0D5DD]" @click="dialogLibraryVisible = true">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M4.6665 3.5L1.1665 7L4.6665 10.5M9.33317 3.5L12.8332 7L9.33317 10.5" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="ml-2 text-[#606266] text-sm font-medium">Use in dataset library</div>
    </div>
    <div class="rounded border border-[#DCDFE6] flex items-center justify-center px-4 py-[5px] cursor-pointer hover:outline hover:outline-[#D0D5DD]" @click="cloneRepositoryVisible = true">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect opacity="0.12" x="1.3335" y="1.3335" width="13.3333" height="13.3333" rx="3.33333" fill="#2F384C"/>
        <path d="M6.66683 5.3335L4.00016 8.00016L6.66683 10.6668M9.3335 5.3335L12.0002 8.00016L9.3335 10.6668M6.66682 14.6668H9.3335C11.2003 14.6668 12.1338 14.6668 12.8468 14.3035C13.474 13.9839 13.9839 13.474 14.3035 12.8468C14.6668 12.1338 14.6668 11.2003 14.6668 9.3335V6.66683C14.6668 4.79999 14.6668 3.86657 14.3035 3.15353C13.9839 2.52632 13.474 2.01639 12.8468 1.69681C12.1338 1.3335 11.2003 1.3335 9.3335 1.3335H6.66683C4.79999 1.3335 3.86657 1.3335 3.15353 1.69681C2.52632 2.01639 2.01639 2.52632 1.69681 3.15353C1.3335 3.86657 1.3335 4.79999 1.3335 6.66682V9.3335C1.3335 11.2003 1.3335 12.1338 1.69681 12.8468C2.01639 13.474 2.52632 13.9839 3.15353 14.3035C3.86657 14.6668 4.79999 14.6668 6.66682 14.6668Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="ml-2 text-[#606266] text-sm font-medium">Clone repository</div>
    </div>
    <el-dialog v-model="dialogLibraryVisible" title="Dataset library is unknown" class="md:!w-[80%]">
      <div class="text-[#a0a1a7] p-2"># Type of dataset/library unknown.</div>
      <div class="text-[#a0a1a7] p-2"># Feel free to open a Pull request </div>
      <div class="text-[#a0a1a7] p-2"># for integration of the OpenCSG dataset hub</div>
      <div class="text-[#a0a1a7] p-2"># into the corresponding library =)</div>
    </el-dialog>
    <el-dialog v-model="cloneRepositoryVisible" title="" class="md:!w-[80%]">
      <div class="rounded-t border-t border-x border-[#EBEEF5] mt-4">
        <div class="flex items-center px-3 py-2 bg-[#F5F7FA] text-[#303133]">
          <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect opacity="0.12" x="1.3335" y="1.3335" width="13.3333" height="13.3333" rx="3.33333" fill="#2F384C"/>
            <path d="M6.66683 5.3335L4.00016 8.00016L6.66683 10.6668M9.3335 5.3335L12.0002 8.00016L9.3335 10.6668M6.66682 14.6668H9.3335C11.2003 14.6668 12.1338 14.6668 12.8468 14.3035C13.474 13.9839 13.9839 13.474 14.3035 12.8468C14.6668 12.1338 14.6668 11.2003 14.6668 9.3335V6.66683C14.6668 4.79999 14.6668 3.86657 14.3035 3.15353C13.9839 2.52632 13.474 2.01639 12.8468 1.69681C12.1338 1.3335 11.2003 1.3335 9.3335 1.3335H6.66683C4.79999 1.3335 3.86657 1.3335 3.15353 1.69681C2.52632 2.01639 2.01639 2.52632 1.69681 3.15353C1.3335 3.86657 1.3335 4.79999 1.3335 6.66682V9.3335C1.3335 11.2003 1.3335 12.1338 1.69681 12.8468C2.01639 13.474 2.52632 13.9839 3.15353 14.3035C3.86657 14.6668 4.79999 14.6668 6.66682 14.6668Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Clone repository
        </div>
      </div>
      <el-tabs v-model="activeCloneType" class="border border-[#EBEEF5] mb-8 clone-tabs">
        <el-tab-pane label="HTTPS" name="https">
          <div class="flex flex-col gap-1 px-3 py-2 border-t border-[#EBEEF5] bg-[#ffffff] text-[#303133] break-all">
            <div class="text-[#909399]"># Make sure you have git-lfs installed (https://git-lfs.com)</div>
            <div>git lfs install</div>
            <div>git clone https://opencsg.com:username/reponame</div>
            <div class="text-[#909399]"># if you want to clone without large files – just their pointers</div>
            <div class="text-[#909399]"># prepend your git clone with the following env var:</div>
            <div>GIT_LFS_SKIP_SMUDGE=1</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="SSH" name="ssh">
          <div class="flex flex-col gap-1 px-3 py-2 border-t border-[#EBEEF5] bg-[#ffffff] text-[#303133] break-all">
            <div class="text-[#909399]"># Make sure you have git-lfs installed (https://git-lfs.com)</div>
            <div>git lfs install</div>
            <div>git clone git@opencsg.com:username/reponame</div>
            <div class="text-[#909399]"># if you want to clone without large files – just their pointers</div>
            <div class="text-[#909399]"># prepend your git clone with the following env var:</div>
            <div>GIT_LFS_SKIP_SMUDGE=1</div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeCloneType = ref('https')
const dialogLibraryVisible = ref(false)
const cloneRepositoryVisible = ref(false)
</script>
