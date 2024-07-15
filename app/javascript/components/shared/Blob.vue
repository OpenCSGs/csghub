<template>
  <div class="min-h-[300px] py-8 md:px-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center flex-wrap gap-4">
        <BranchDropdown
          @changeBranch="changeBranch"
          :current-branch="currentBranch"
          :branches="branches"
        />
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <a
              :href="`/${prefixPath}/${namespacePath}/files/${currentBranch}`"
              >{{ namespacePath.split('/')[1] }}</a
            >
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(path, index) in breadcrumb"
            :key="path"
          >
            <a
              :href="`/${prefixPath}/${namespacePath}/${
                index === breadcrumb.length - 1 ? 'blob' : 'files'
              }/${currentBranch}${path}`"
              >{{ extractNameFromPath(path) }}</a
            >
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="flex items-center text-sm text-[#606266]">
        <div class="flex items-center py-[1px] md:hidden">
          <el-avatar
            :size="24"
            class="mr-1"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          1 contributors
        </div>
        <!-- Todo 暂时先隐藏 -->
        <a
          href="#"
          class="ml-4 items-center px-4 py-[5px] border border-[#DCDFE6] rounded-[100px] hidden"
        >
          <SvgIcon
            name="commits"
            class="mr-2"
          />
          {{ $t('all.commits') }}
        </a>
      </div>
    </div>
    <div
      v-if="lastCommit"
      class="flex items-center justify-between mt-4 px-3 py-2 border border-[#DCDFE6] bg-[#F5F7FA] rounded-t-[4px]"
    >
      <div class="flex items-center text-sm overflow-hidden mr-2">
        <div class="flex items-center mr-2">
          <el-avatar
            :size="24"
            class="mr-2"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <a
            href="#"
            class="text-[#303133] hover:underline"
            >{{ lastCommit.author_name }}</a
          >
        </div>
        <a
          href="#"
          class="mr-2 text-[#606266] truncate hover:underline"
          >{{ lastCommit.message }}</a
        >
        <a
          href="#"
          class="rounded border border-[#DCDFE6] text-xs text-[#606266] px-3 py-[2px] hover:underline"
        >
          {{ lastCommit.id?.substring(0, 7) }}
        </a>
      </div>
      <div
        class="text-[#909399] text-sm cursor-pointer flex-shrink-0 md:hidden"
      >
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
    <div
      v-if="!lfs || isImage()"
      class="border border-t-0 border-[#DCDFE6] rounded-b"
    >
      <div
        class="text-xs text-[#303133] px-4 py-2 flex items-center justify-between border-b border-[#DCDFE6]"
      >
        <div class="flex items-center gap-4">
          <div
            class="bg-[#F0F2F5] px-3 py-[2px] flex items-center justify-center rounded"
          >
            {{ $t('shared.preview') }}
          </div>
          <div
            v-if="canWrite && !isImage()"
            class="flex items-center gap-1"
          >
            <SvgIcon name="edit" />
            <a
              :href="`/${prefixPath}/${namespacePath}/edit/main/${currentPath}`"
              >{{ $t('shared.edit') }}</a
            >
          </div>
        </div>
        <div>{{ formatBytes(size) }}</div>
      </div>
      <div class="p-4">
        <MarkdownViewer
          v-if="['jpg', 'png', 'jpeg', 'gif', 'svg', 'md'].includes(fileType)"
          :content="content"
        />
        <CodeViewer
          v-else
          :extension="fileType"
          :content="content"
        />
      </div>
    </div>
    <div
      v-else
      class="border border-t-0 border-[#DCDFE6] rounded-b"
    >
      <div
        class="text-xs text-[#303133] px-4 py-2 flex items-center justify-end border-b border-[#DCDFE6]"
      >
        <div>{{ formatBytes(size) }}</div>
      </div>
      <div
        class="flex items-center justify-center px-4 py-10 border-b border-[#DCDFE6] font-medium text-[#667085] text-[14px] whitespace-pre-wrap"
      >
        <p>
          {{ $t('shared.lfs1') }}
          <a
            :href="version"
            target="_blank"
            class="underline"
            >{{ $t('shared.lfs2') }}</a
          >{{ $t('shared.lfs3') }}
          <a
            :href="`/${prefixPath}/${namespacePath}/resolve/${currentBranch}/${currentPath}?download=true&lfs=${lfs}&lfs_path=${lfsRelativePath}`"
            download
            class="underline"
            >{{ $t('shared.lfs4') }}
          </a>
          {{ $t('shared.lfs5') }}
        </p>
      </div>
      <div class="p-4 flex flex-col gap-[4px] text-sm font-medium">
        <p class="mb-[4px]">{{ $t('shared.lfs6') }}</p>
        <div class="flex">
          <p class="">SHA256:&nbsp;</p>
          <p class="text-[12px] font-light">{{ sha }}</p>
        </div>
        <div class="flex">
          <p class="">{{ $t('shared.lfs7') }}:&nbsp;</p>
          <p class="text-[12px] font-light">
            {{ formatBytes(lfsPointerSize) }}
          </p>
        </div>
        <div class="flex">
          <p>{{ $t('shared.lfs8') }}:&nbsp;</p>
          <p class="text-[12px] font-light">{{ formatBytes(size) }}</p>
        </div>
        <div class="flex items-center mt-[4px] mr-[4px]">
          <SvgIcon
            name="file"
            class="mr-1.5"
          />
          <a
            :href="`/${prefixPath}/${namespacePath}/resolve/${currentBranch}/${currentPath}`"
            target="_blank"
            class="underline text-[12px]"
            >{{ $t('shared.lfs9') }}</a
          >
        </div>
        <div
          class="flex items-center mt-[4px] text-[#667085] text-[12px] font-light"
        >
          <p>{{ $t('shared.lfs10') }}</p>
          <a
            :href="version"
            target="_blank"
            class="underline"
            >{{ $t('shared.lfs11') }}</a
          >.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, inject, onMounted } from 'vue'
  import { format } from 'timeago.js'
  import MarkdownViewer from './viewers/MarkdownViewer.vue'
  import TextViewer from './viewers/TextViewer.vue'
  import CodeViewer from './viewers/CodeViewer.vue'
  import BranchDropdown from './BranchDropdown.vue'
  import { ElMessage } from 'element-plus'
  import jwtFetch from '../../packs/jwtFetch'
  import resolveContent from '../../packs/resolveContent'

  const props = defineProps({
    branches: Object,
    currentBranch: String,
    currentPath: String,
    namespacePath: String,
    canWrite: Boolean
  })

  const csghubServer = inject('csghubServer')

  const breadcrumb = ref([])
  const fileType = ref('')
  const version = ref('')
  const sha = ref('')
  const lfsPointerSize = ref(0)
  const lfsRelativePath = ref('')
  const lfs = ref(false)
  const size = ref(0)
  const content = ref('')
  const lastCommit = ref({})

  const prefixPath = document.location.pathname.split('/')[1]

  const extractNameFromPath = (path) => {
    const parts = path.split('/')
    return parts[parts.length - 1]
  }

  const updateBreadcrumb = () => {
    const breadcrumbArray = props.currentPath.split('/').filter(Boolean)
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

  const isImage = () => {
    return ['jpg', 'png', 'jpeg', 'gif', 'svg'].includes(fileType.value)
  }

  const lfsContentRegex = () => {
    if (lfs.value && !isImage()) {
      const versionRegex = /version\s+(\S+)/
      const oidRegex = /sha256:(\S+)/
      version.value = content.value.match(versionRegex)[1]
      sha.value = content.value.match(oidRegex)[1]
    }
  }

  const changeBranch = (branch) => {
    if (branch !== props.currentBranch) {
      window.location.href = `/${prefixPath}/${props.namespacePath}/blob/${branch}/${props.currentPath}`
    }
  }

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']

  function formatBytes(bytes) {
    let level = 0
    let n = parseInt(bytes, 10) || 0

    while (n >= 1024 && ++level) {
      n = n / 1024
    }

    return n.toFixed(n < 10 && level > 0 ? 1 : 0) + ' ' + units[level]
  }

  const updateFileData = (data) => {
    content.value = resolveContent(
      prefixPath,
      data.content,
      props.namespacePath
    )
    lastCommit.value = data.commit
    size.value = data.size
    lfs.value = data.lfs
    lfsRelativePath.value = data.lfs_relative_path
    lfsPointerSize.value = data.lfs_pointer_size
  }

  const fetchFileContent = async () => {
    try {
      const response = await jwtFetch(
        `${csghubServer}/api/v1/${prefixPath}/${props.namespacePath}/blob/${props.currentPath}?ref=${props.currentBranch}`
      )

      const result = await response.json()

      if (response.ok) {
        updateFileData(result.data)
        updateBreadcrumb()
        detectFileType()
        lfsContentRegex()
      } else {
        ElMessage({ message: result.msg, type: 'error' })
      }
    } catch (err) {
      ElMessage({ message: err.message, type: 'error' })
    }
  }

  onMounted(() => {
    fetchFileContent()
  })
</script>
