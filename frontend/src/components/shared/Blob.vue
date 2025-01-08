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
      <div class="flex items-center text-sm text-gray-500">
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
          class="ml-4 items-center px-4 py-[5px] border border-gray-200 rounded-full hidden"
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
      class="flex items-center justify-between mt-4 px-3 py-2 border border-gray-200 bg-gray-100 rounded-t-[4px]"
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
            class="text-gray-700 hover:underline"
            >{{ lastCommit.author_name }}</a
          >
        </div>
        <a
          href="#"
          class="mr-2 text-gray-500 truncate hover:underline"
          >{{ lastCommit.message }}</a
        >
        <a
          href="#"
          class="rounded border border-gray-200 text-xs text-gray-500 px-3 py-[2px] hover:underline"
        >
          {{ lastCommit.id?.substring(0, 7) }}
        </a>
      </div>
      <div
        class="text-gray-500 text-sm cursor-pointer flex-shrink-0 md:hidden"
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
      v-if="!lfs && previewCode !== 1"
      class="border border-t-0 border-gray-200 rounded-b"
    >
      <div
        class="text-xs text-gray-700 px-4 py-2 flex items-center justify-between border-b border-gray-200"
      >
        <div class="flex items-center gap-4">
          <div
            class="bg-gray-100 px-3 py-[2px] flex items-center justify-center rounded-xs"
          >
            {{ $t('shared.preview') }}
          </div>
          <div
            v-if="canWrite && !isImage()"
            class="flex items-center gap-1"
          >
            <SvgIcon name="edit" />
            <a
              :href="`/${prefixPath}/${namespacePath}/edit/${currentBranch}/${currentPath}`"
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
    <div v-else-if="!lfs && previewCode === 1 " class="border border-t-0 border-gray-200 rounded-b">
      <div
        class="text-xs text-gray-700 px-4 py-2 flex items-center justify-end border-b border-gray-200"
      >
        <div>{{ formatBytes(size) }}</div>
      </div>
      <div
        class="flex items-center justify-center px-4 py-10 border-b border-gray-200 font-medium text-gray-500 text-sm whitespace-pre-wrap"
      >
        <p>
          {{ $t('shared.tooLargeFile') }}
          <span
            class="underline cursor-pointer"
            @click="normalFileDownload"
            >{{ $t('shared.tooLargeFile2') }}
          </span>
          {{ $t('shared.tooLargeFile3') }}
        </p>
      </div>
    </div>
    <div
      v-else
      class="border border-t-0 border-gray-200 rounded-b"
    >
      <div
        class="text-xs text-gray-700 px-4 py-2 flex items-center justify-end border-b border-gray-200"
      >
        <div>{{ formatBytes(size) }}</div>
      </div>
      <div
        class="flex items-center justify-center px-4 py-10 border-b border-gray-200 font-medium text-gray-500 text-sm whitespace-pre-wrap"
      >
        <p>
          {{ $t('shared.lfs1') }}
          <a
            :href="version"
            target="_blank"
            class="underline"
            >{{ $t('shared.lfs2') }}</a
          >{{ $t('shared.lfs3') }}
          <span
            class="underline cursor-pointer"
            @click="lfsDownload"
            >{{ $t('shared.lfs4') }}
          </span>
          {{ $t('shared.lfs5') }}
        </p>
      </div>
      <div class="p-4 flex flex-col gap-[4px] text-sm font-medium">
        <p class="mb-[4px]">{{ $t('shared.lfs6') }}</p>
        <div class="flex">
          <p class="">SHA256:&nbsp;</p>
          <p class="text-xs font-light">{{ sha }}</p>
        </div>
        <div class="flex">
          <p class="">{{ $t('shared.lfs7') }}:&nbsp;</p>
          <p class="text-xs font-light">
            {{ formatBytes(lfsPointerSize) }}
          </p>
        </div>
        <div class="flex">
          <p>{{ $t('shared.lfs8') }}:&nbsp;</p>
          <p class="text-xs font-light">{{ formatBytes(size) }}</p>
        </div>
        <div class="flex items-center mt-[4px] mr-[4px]">
          <SvgIcon
            name="file"
            class="mr-1.5"
          />
          <a
            :href="`/${prefixPath}/${namespacePath}/resolve/${currentBranch}/${currentPath}`"
            target="_blank"
            class="underline text-xs"
            >{{ $t('shared.lfs9') }}</a
          >
        </div>
        <div
          class="flex items-center mt-[4px] text-gray-500 text-xs font-light"
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
  import { ref, onMounted } from 'vue'
  import { format } from 'timeago.js'
  import MarkdownViewer from './viewers/MarkdownViewer.vue'
  import TextViewer from './viewers/TextViewer.vue'
  import CodeViewer from './viewers/CodeViewer.vue'
  import BranchDropdown from './BranchDropdown.vue'
  import { ElMessage } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import resolveContent from '../../packs/resolveContent'
  import { useI18n } from 'vue-i18n'
  import { createAndClickAnchor } from '../../packs/utils'

  const props = defineProps({
    branches: Object,
    currentBranch: String,
    currentPath: String,
    namespacePath: String,
    canWrite: Boolean
  })

  const { t } = useI18n()

  const breadcrumb = ref([])
  const fileType = ref('')
  const version = ref('')
  const sha = ref('')
  const lfsPointerSize = ref(0)
  const lfsRelativePath = ref('')
  const path = ref('')
  const lfs = ref(false)
  const previewCode = ref(0)
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
      props.namespacePath,
      props.currentBranch
    )
    lastCommit.value = data.commit
    size.value = data.size
    lfs.value = data.lfs
    path.value = data.path
    previewCode.value = data.preview_code ?? ''
    lfsRelativePath.value = data.lfs_relative_path
    lfsPointerSize.value = data.lfs_pointer_size
  }

  const fetchFileContent = async () => {
    try {
      const { data, error } = await useFetchApi(
        `/${prefixPath}/${props.namespacePath}/blob/${props.currentPath}?ref=${props.currentBranch}`
      ).json()

      if (data.value) {
        const result = data.value
        updateFileData(result.data)
        updateBreadcrumb()
        detectFileType()
        lfsContentRegex()
      } else {
        console.log(error.value.msg)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const lfsDownload = async () => {
    const url = `/${prefixPath}/${props.namespacePath}/download/${lfsRelativePath.value}?ref=${props.currentBranch}&lfs=true&lfs_path=${lfsRelativePath.value}&save_as=${props.currentPath}`

    try {
      const { data, error } = await useFetchApi(url).json()

      if (error.value) {
        ElMessage({
          message: error.value.msg,
          type: 'warning'
        })
      } else {
        const { data: downloadUrl } = data.value
        createAndClickAnchor(downloadUrl, props.currentPath)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const normalFileDownload = async () => {
    const url = `/${prefixPath}/${props.namespacePath}/download/${path.value}?ref=${props.currentBranch}`

    try {
      const { data, error } = await useFetchApi(url).blob()

      if (error.value) {
        ElMessage({
          message: error.value.msg,
          type: 'warning'
        })
      } else {
        const downloadUrl = window.URL.createObjectURL(data.value)
        createAndClickAnchor(downloadUrl, path.value)
      }
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(() => {
    fetchFileContent()
  })
</script>
