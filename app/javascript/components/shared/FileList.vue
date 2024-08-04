<template>
  <div class="min-h-[300px] py-8 md:px-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center flex-wrap gap-4">
        <BranchDropdown @changeBranch="changeBranch"
                        :current-branch="currentBranch"
                        :branches="branches" />
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <a :href="`/${prefixPath}/${namespacePath}/files/${currentBranch}`">{{ namespacePath.split('/')[1] }}</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="path in breadcrumb" :key="path">
            <a :href="`/${prefixPath}/${namespacePath}/files/${currentBranch}${path}`">{{ extractNameFromPath(path) }}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div v-if="lastCommit" class="flex items-center text-sm text-[#606266]">
        <div class="flex items-center mr-4 py-[1px] md:hidden">
          <el-avatar :size="24" class="mr-1" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          1 {{ $t('all.contributors') }}
        </div>
        <a :href="`/${prefixPath}/${namespacePath}/commits`"
           class="ml-4 flex items-center px-4 py-[5px] border border-[#DCDFE6] rounded-[100px]">
          <SvgIcon name="commits" class="mr-2" />
          {{ $t('all.commits') }}
        </a>
        <el-dropdown v-if="canWrite" class="ml-4">
          <el-button type="default">
            + {{ $t('all.addFile') }}
            <el-icon class="el-icon--right pl-1"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <a :href="`/${prefixPath}/${namespacePath}/main/new`">
                <el-dropdown-item>{{ $t('all.createNewFile') }}</el-dropdown-item>
              </a>
              <a :href="`/${prefixPath}/${namespacePath}/main/upload`">
                <el-dropdown-item>{{ $t('all.uploadFile') }}</el-dropdown-item>
              </a>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div v-if="!loading" class="flex items-center justify-between min-h-[36px] mt-4 px-3 py-2 border border-[#DCDFE6] bg-[#F5F7FA] rounded-t-[4px]">
      <div v-if="lastCommit" class="flex items-center text-sm overflow-hidden mr-2">
        <div class="flex items-center mr-2">
          <el-avatar :size="24" class="mr-2" :src="lastCommitAvatar" />
          <a href="#" class="text-[#303133] hover:underline">{{ lastCommit.author_name }}</a>
        </div>
        <a :href="`/${prefixPath}/${namespacePath}/commit/${lastCommit.id}`" class="mr-2 text-[#606266] truncate hover:underline">{{ lastCommit.message }}</a>
        <a :href="`/${prefixPath}/${namespacePath}/commit/${lastCommit.id}`" class="rounded border border-[#DCDFE6] text-xs text-[#606266] px-3 py-[2px] hover:underline">
          {{ lastCommit.id && lastCommit.id.substring(0, 7) }}
        </a>
      </div>
      <div v-if="lastCommit" class="text-[#909399] text-sm cursor-pointer flex-shrink-0 md:hidden">
        <el-popover
          width="158"
          placement="top"
          effect="dark"
          trigger="hover"
          :content="beiJingTimeParser(lastCommit.committer_date)"
        >
          <template #reference>
            {{ format(beiJingTimeParser(lastCommit.committer_date), locale=='en' ? 'en_US' : 'zh_CN') }}
          </template>
        </el-popover>
      </div>
    </div>

    <div v-if="files" v-for="file in files" class="flex items-center justify-between px-3 py-2 border border-t-0 border-[#DCDFE6] last-of-type:rounded-b-[4px]">
      <div class="flex items-center w-[34%]" :title="file.name">
        <svg class="flex-shrink-0" v-if="file.type === 'dir'" xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
          <path d="M3.52949 1.229C2.5494 1.229 2.05935 1.229 1.68501 1.41974C1.35573 1.58752 1.08801 1.85524 0.920231 2.18452C0.729492 2.55887 0.729492 3.04891 0.729492 4.02901V10.0373C0.729492 11.3441 0.729492 11.9975 0.98381 12.4966C1.20751 12.9357 1.56447 13.2926 2.00351 13.5164C2.50264 13.7707 3.15604 13.7707 4.46283 13.7707H9.53783C10.8446 13.7707 11.498 13.7707 11.9971 13.5164C12.4362 13.2926 12.7931 12.9357 13.0168 12.4966C13.2712 11.9975 13.2712 11.3441 13.2712 10.0373V7.29567C13.2712 5.98888 13.2712 5.33549 13.0168 4.83636C12.7931 4.39731 12.4362 4.04036 11.9971 3.81666C11.498 3.56234 10.8446 3.56234 9.53783 3.56234H8.89755C8.58581 3.56234 8.42993 3.56234 8.2892 3.52677C8.05664 3.46799 7.84784 3.33894 7.69126 3.15722C7.59651 3.04725 7.5268 2.90784 7.38738 2.629V2.629C7.17826 2.21076 7.0737 2.00163 6.93157 1.83668C6.6967 1.56409 6.3835 1.37053 6.03465 1.28236C5.82356 1.229 5.58975 1.229 5.12213 1.229H3.52949Z" fill="#8AA2FF"/>
        </svg>
        <svg class="flex-shrink-0" v-else xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
          <path d="M8.16634 1.95817V1.95817C8.16634 3.08384 8.16634 3.64668 8.38433 4.0745C8.57608 4.45083 8.88204 4.75679 9.25836 4.94853C9.68618 5.16652 10.249 5.16652 11.3747 5.16652V5.16652M11.6663 5.90865V10.1332C11.6663 11.2533 11.6663 11.8133 11.4484 12.2412C11.2566 12.6175 10.9506 12.9234 10.5743 13.1152C10.1465 13.3332 9.58645 13.3332 8.46634 13.3332H5.53301C4.4129 13.3332 3.85285 13.3332 3.42503 13.1152C3.0487 12.9234 2.74274 12.6175 2.55099 12.2412C2.33301 11.8133 2.33301 11.2533 2.33301 10.1332V4.86651C2.33301 3.7464 2.33301 3.18635 2.55099 2.75852C2.74274 2.3822 3.0487 2.07624 3.42503 1.88449C3.85285 1.6665 4.4129 1.6665 5.53301 1.6665H7.42419C7.91337 1.6665 8.15796 1.6665 8.38814 1.72176C8.59221 1.77076 8.7873 1.85157 8.96624 1.96122C9.16808 2.08491 9.34103 2.25786 9.68693 2.60376L10.7291 3.64591C11.075 3.99182 11.2479 4.16477 11.3716 4.3666C11.4813 4.54555 11.5621 4.74063 11.6111 4.94471C11.6663 5.17488 11.6663 5.41947 11.6663 5.90865Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <a v-if="file.type === 'dir'" :href="`/${prefixPath}/${namespacePath}/files/${currentBranch}/${file.path}`" class="ml-2 text-sm text-[#303133] hover:underline whitespace-nowrap text-ellipsis overflow-hidden">
          {{ file.name }}
        </a>
        <a v-else-if="canPreview(file)" :href="`/${prefixPath}/${namespacePath}/blob/${currentBranch}/${file.path}`" class="ml-2 text-sm text-[#303133] hover:underline whitespace-nowrap text-ellipsis overflow-hidden">
          {{ file.name }}
        </a>
        <el-popover
          v-else
          placement="top"
          :width="270"
          trigger="hover"
          effect="dark"
          :content="!!lastCommit ? $t('all.notSupportPreview') : $t('all.syncNotSupportPreview')"
        >
          <template #reference>
            <div class="ml-2 text-sm text-[#303133] hover:underline text-ellipsis overflow-hidden max-w-[280px]">{{ file.name }}</div>
          </template>
        </el-popover>
      </div>
      <div class="flex items-center justify-end pr-3 text-sm text-[#606266] flex-shrink-0 text-right w-[14%]">
        <span v-if="file.type === 'file'">{{ formatBytes(file.size) }}</span>
        <span v-if="file.lfs" class="flex items-center gap-1 text-xs text-[#344054] ml-2 rounded px-1 border border-[#909399]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.12" d="M11 6.0001V3.64101C11 3.55359 10.9541 3.47258 10.8792 3.4276C10.7998 3.37995 10.7005 3.38034 10.6214 3.42859L8.3853 4.79381C7.58955 5.27964 7.19167 5.52255 6.77093 5.63443C6.26575 5.76876 5.73425 5.76876 5.22907 5.63443C4.80833 5.52255 4.41045 5.27964 3.61469 4.79381L1.37857 3.42859C1.29953 3.38034 1.20024 3.37995 1.12083 3.4276C1.04587 3.47258 1 3.55359 1 3.64101V6.0001C1 6.77867 1 7.16795 1.0882 7.5236C1.22 8.05511 1.49477 8.5404 1.88271 8.92687C2.14231 9.18548 2.47612 9.38577 3.14373 9.78634L3.53042 10.0183C4.42832 10.5571 4.87727 10.8265 5.35653 10.9317C5.78046 11.0248 6.21954 11.0248 6.64346 10.9317C7.12273 10.8265 7.57168 10.5571 8.46958 10.0183L8.85627 9.78634L8.85627 9.78633C9.52389 9.38577 9.85769 9.18548 10.1173 8.92687C10.5052 8.5404 10.78 8.05511 10.9118 7.5236C11 7.16795 11 6.77867 11 6.0001Z" fill="#2F384C"/>
            <path d="M3.74994 4.75L8.24998 2M6 6.25L10.5 3.5M6 6.25L1.5 3.5M6 6.25V11.25M1 4.4059V7.5941C1 7.92444 1 8.08961 1.0474 8.23802C1.08934 8.36936 1.15799 8.49061 1.24903 8.59414C1.35191 8.71114 1.49354 8.79612 1.77681 8.96608L5.17681 11.0061C5.47611 11.1857 5.62576 11.2755 5.78551 11.3105C5.92682 11.3416 6.07318 11.3416 6.21449 11.3105C6.37424 11.2755 6.52389 11.1857 6.82319 11.0061L10.2232 8.96608C10.5065 8.79612 10.6481 8.71114 10.751 8.59414C10.842 8.49061 10.9107 8.36936 10.9526 8.23802C11 8.08961 11 7.92444 11 7.5941V4.4059C11 4.07556 11 3.91039 10.9526 3.76198C10.9107 3.63064 10.842 3.50939 10.751 3.40586C10.6481 3.28886 10.5065 3.20388 10.2232 3.03392L6.82319 0.993916C6.52389 0.814336 6.37424 0.724546 6.21449 0.689464C6.07318 0.658433 5.92682 0.658433 5.78551 0.689464C5.62576 0.724546 5.47611 0.814336 5.17681 0.993916L1.77681 3.03392C1.49354 3.20388 1.35191 3.28886 1.24903 3.40586C1.15799 3.50939 1.08934 3.63064 1.0474 3.76198C1 3.91039 1 4.07556 1 4.4059Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          LFS
        </span>
        <span v-if="file.type === 'file' && canDownload(file)" class="ml-2 cursor-pointer" @click="downloadFile(file)">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
            <path d="M6.99967 1.6665V10.4165M6.99967 10.4165L10.4997 6.9165M6.99967 10.4165L3.49967 6.9165M2.33301 10.9998V11.7332C2.33301 12.2932 2.33301 12.5732 2.442 12.7872C2.53787 12.9753 2.69086 13.1283 2.87902 13.2242C3.09293 13.3332 3.37296 13.3332 3.93301 13.3332H10.0663C10.6264 13.3332 10.9064 13.3332 11.1203 13.2242C11.3085 13.1283 11.4615 12.9753 11.5573 12.7872C11.6663 12.5732 11.6663 12.2932 11.6663 11.7332V10.9998" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>
      <a href="#" class="text-[#606266] w-[37%] pl-3 text-sm truncate hover:underline">
        {{ file.commit.message }}
      </a>
      <div class="text-[#909399] w-[15%] text-sm text-right cursor-pointer md:hidden">
        <el-popover
          width="158"
          placement="top"
          effect="dark"
          trigger="hover"
          :content="beiJingTimeParser(file.commit.committer_date)"
        >
          <template #reference>
            {{ format(beiJingTimeParser(file.commit.committer_date), locale=='en' ? 'en_US' : 'zh_CN') }}
          </template>
        </el-popover>
      </div>
    </div>
    <el-skeleton v-if="loading" class="mt-4" :rows="5" animated />
  </div>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue'
  import { format } from 'timeago.js';
  import { ElMessage } from "element-plus"
  import { useI18n } from 'vue-i18n'
  import BranchDropdown from './BranchDropdown.vue';
  import jwtFetch from '../../packs/jwtFetch'
  import { createAndClickAnchor } from '../../packs/utils'

  const props = defineProps({
    branches: Object,
    currentBranch: String,
    currentPath: String,
    namespacePath: String,
    canWrite: Boolean
  })

  const csghubServer = inject('csghubServer')

  const { t, locale } = useI18n();
  const loading = ref(true)

  const breadcrumb = ref([])
  const files = ref([])
  const lastCommit = ref({})
  const lastCommitAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')
  const prefixPath = document.location.pathname.split('/')[1]

  const emit = defineEmits(['changeBranch'])

  const changeBranch = (branch) => {
    emit('changeBranch', branch)
  }

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

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']

  function formatBytes(bytes) {
    let level = 0;
    let n = parseInt(bytes, 10) || 0;

    while (n >= 1024 && ++level) {
      n = n / 1024;
    }

    return n.toFixed(n < 10 && level > 0 ? 1 : 0) + ' ' + units[level];
  }


  // 预览放行规则：非 LFS，文件大小不超过 10MB
  const canPreview = (file) => {
    if (!lastCommit.value) return false

    const isFileSizeLessThan10MB = file.size <= 10 * 1024 * 1024

    return isFileSizeLessThan10MB || file.lfs
  }

  const canDownload = (file) => {
    if (!lastCommit.value) return false

    return file.lfs || (file.size <= 10 * 1024 * 1024)
  }

  const lfsFileDownload = async (file) => {
    const url = `${csghubServer}/api/v1/${prefixPath}/${props.namespacePath}/download/${file.lfs_relative_path}?ref=${props.currentBranch}&lfs=true&lfs_path=${file.lfs_relative_path}&save_as=${file.path}`

    try {
      const response = await jwtFetch(url, { method: 'GET' })

      if (!response.ok) {
        const error = await response.json()
        ElMessage({
          message: error.msg,
          type: 'warning'
        })
      } else {
        const { data: downloadUrl } = await response.json()
        createAndClickAnchor(downloadUrl, file.path)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const normalFileDownload = async (file) => {
    const url = `${csghubServer}/api/v1/${prefixPath}/${props.namespacePath}/download/${file.path}?ref=${props.currentBranch}`

    try {
      const response = await jwtFetch(url, { method: 'GET' })

      if (!response.ok) {
        const error = await response.json()
        ElMessage({
          message: error.msg,
          type: 'warning'
        })
      } else {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        createAndClickAnchor(downloadUrl, file.path)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const downloadFile = (file) => {
    if (file.lfs) {
      lfsFileDownload(file)
    } else {
      normalFileDownload(file)
    }
  }

  const beiJingTimeParser = (utcTimeStr) => {
    utcTime = new Date(utcTimeStr)
    return utcTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  }

  const fetchFileListData = async () => {
    const url = `${csghubServer}/api/v1/${prefixPath}/${props.namespacePath}/tree?path=${props.currentPath}&ref=${props.currentBranch}`

    try {
      const response = await jwtFetch(url)
      const json = await response.json()
      if (!response.ok) {
        console.log(json.msg)
        location.href = '/errors/not-found'
      } else {
        files.value = json.data
      }
    } catch (error) {
      console.log(error)
      location.href = '/errors/not-found'
    } finally {
      loading.value = false
    }
  }

  const fetchLastCommit = async () => {
    const url = `${csghubServer}/api/v1/${prefixPath}/${props.namespacePath}/last_commit`
    try {
      const response = await jwtFetch(url)
      const json = await response.json()
      if (!response.ok) {
        console.log(json.msg)
      } else {
        lastCommit.value = json.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  onMounted(() => {
    updateBreadcrumb()
    fetchFileListData()
    fetchLastCommit()
  })
</script>