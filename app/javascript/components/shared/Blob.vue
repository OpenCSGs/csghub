<template>
  <div class="min-h-[300px] py-8 md:px-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center flex-wrap gap-4">
        <div>
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
                <el-dropdown-item v-for="branch in branches" :key="branch.name" @click="$emit('change-branch', branch.name)">{{ branch.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <a :href="`/${prefixPath}/${namespacePath}/files/${currentBranch}`">{{ namespacePath.split('/')[1] }}</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="path, index in breadcrumb" :key="path">
            <a :href="`/${prefixPath}/${namespacePath}/${ index === breadcrumb.length - 1 ? 'blob' : 'files' }/${currentBranch}${path}`">{{ extractNameFromPath(path) }}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="flex items-center text-sm text-[#606266]">
        <div class="flex items-center py-[1px] md:hidden">
          <el-avatar :size="24" class="mr-1" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          1 contributors
        </div>
        <!-- Todo 暂时先隐藏 -->
        <a href="#" class="mx-4 flex items-center px-4 py-[5px] border border-[#DCDFE6] rounded-[100px] md:hidden hidden">
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
<!--        <el-dropdown split-button>-->
<!--            + 添加文件-->
<!--            <template #dropdown>-->
<!--              <el-dropdown-menu>-->
<!--                <el-dropdown-item>创建新文件</el-dropdown-item>-->
<!--                <el-dropdown-item>上传文件</el-dropdown-item>-->
<!--              </el-dropdown-menu>-->
<!--            </template>-->
<!--          </el-dropdown>-->
      </div>
    </div>

    <div class="flex items-center justify-between mt-4 px-3 py-2 border border-[#DCDFE6] bg-[#F5F7FA] rounded-t-[4px]">
      <div class="flex items-center text-sm overflow-hidden mr-2">
        <div class="flex items-center mr-2">
          <el-avatar :size="24" class="mr-2" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <a href="#" class="text-[#303133] hover:underline">{{ lastCommit.author_name }}</a>
        </div>
        <a href="#" class="mr-2 text-[#606266] truncate hover:underline">{{ lastCommit.message }}</a>
        <a href="#" class="rounded border border-[#DCDFE6] text-xs text-[#606266] px-3 py-[2px] hover:underline">
          {{ lastCommit.id.substring(0, 7) }}
        </a>
      </div>
      <div class="text-[#909399] text-sm cursor-pointer flex-shrink-0 md:hidden">
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

    <div class="border border-t-0 border-[#DCDFE6] rounded-b">
      <div v-if="canWrite" class="text-xs text-[#303133] px-4 py-2 flex items-center justify-between border-b border-[#DCDFE6]">
        <div class="flex items-center gap-4">
          <div class="bg-[#F0F2F5] px-3 py-[2px] flex items-center justify-center rounded">预览</div>
          <div class="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 10.5H2M8 2C7.875 2.875 8.625 3.625 9.5 3.5M3.5 8L3.57005 7.71979C3.73008 7.07967 3.8101 6.7596 3.93877 6.4612C4.05301 6.19627 4.19557 5.94448 4.36397 5.71022C4.55366 5.44635 4.78694 5.21307 5.25351 4.74651L8.25006 1.74999C8.66428 1.33578 9.33585 1.33579 9.75005 1.75001V1.75001C10.1642 2.16422 10.1642 2.83577 9.75003 3.24997L6.75349 6.24651C6.28693 6.71307 6.05364 6.94636 5.78978 7.13604C5.55553 7.30443 5.30374 7.44699 5.03881 7.56123C4.74041 7.6899 4.42035 7.76991 3.78023 7.92994L3.5 8Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <a :href="`/${prefixPath}/${namespacePath}/edit/main/${currentPath}`">编辑</a>
          </div>
        </div>
        <div>{{ formatBytes(size) }}</div>
      </div>
      <div class="p-4">
        <MarkdownViewer v-if="fileType === 'md'" :content="content" />
        <CodeViewer v-else :extension="fileType" :content="content" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { format } from 'timeago.js';
  import MarkdownViewer from './viewers/MarkdownViewer.vue';
  import TextViewer from './viewers/TextViewer.vue';
  import CodeViewer from './viewers/CodeViewer.vue';

  const props = defineProps({
    content: String,
    lastCommit: Object,
    branches: Object,
    currentBranch: String,
    currentPath: String,
    namespacePath: String,
    size: String,
    canWrite: Boolean
  })

  const breadcrumb = ref([])
  const fileType = ref('')

  const prefixPath = document.location.pathname.split('/')[1]

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

  const detectFileType = () => {
    const parts = props.currentPath.split('.')
    const extension = parts[parts.length - 1]
    fileType.value = extension
  }

  updateBreadcrumb()
  detectFileType()

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']

  function formatBytes(bytes) {
    let level = 0;
    let n = parseInt(bytes, 10) || 0;

    while (n >= 1024 && ++level) {
      n = n / 1024;
    }

    return n.toFixed(n < 10 && level > 0 ? 1 : 0) + ' ' + units[level];
  }
</script>
