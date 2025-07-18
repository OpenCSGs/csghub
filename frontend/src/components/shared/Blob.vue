<template>
  <div class="min-h-[300px] py-8 md:px-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center flex-wrap gap-4">
        <BranchDropdown
          @changeBranch="changeBranch"
          :current-branch="currentBranch"
        />
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <a
              @click.prevent="goToNamespace"
              >{{ namespacePath.split('/')[1] }}</a
            >
          </el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="(path, index) in breadcrumb"
            :key="path"
          >
            <a
              @click.prevent="goToBreadcrumb(path, index)"
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
            class="flex items-center gap-1 cursor-pointer"
          >
            <SvgIcon name="edit" />
            <a
              @click.prevent="goToEditFile"
              >{{ $t('shared.edit') }}</a
            >
          </div>
          <div
            v-if="canWrite"
            class="flex items-center gap-1 cursor-pointer"
          >
            <SvgIcon name="delete" />
            <a
              @click.prevent="deleteFile"
              >{{ $t('all.delete') }}</a
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
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
  import resolveContent from '../../packs/resolveContent'
  import { useI18n } from 'vue-i18n'
  import { createAndClickAnchor } from '../../packs/utils'
  import { useRepoTabStore } from '../../stores/RepoTabStore'

  const props = defineProps({
    // branches: Object,
    currentBranch: String,
    currentPath: String,
    namespacePath: String,
    canWrite: Boolean
  })

  const { t } = useI18n()
  const { repoTab, setRepoTab } = useRepoTabStore()
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
  const currentBranch = ref(props.currentBranch)
  const currentPath = ref(props.currentPath || '')

  let prefixPath = document.location.pathname.split('/')[1]
  let apiPrefixPath = document.location.pathname.split('/')[1]

  if (prefixPath === 'mcp') {
    prefixPath = 'mcp/servers'
    apiPrefixPath = 'mcps'
  }

  const extractNameFromPath = (path) => {
    const parts = path.split('/')
    return parts[parts.length - 1]
  }

  const updateBreadcrumb = () => {
    const breadcrumbArray = currentPath.value.split('/').filter(Boolean)
    let breadcrumbPath = ''
    breadcrumb.value = breadcrumbArray.map((item) => {
      breadcrumbPath += '/' + item
      return breadcrumbPath
    })
  }

  const detectFileType = () => {
    const parts = currentPath.value.split('.')
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

  const goToNamespace = () => {
    // :href="`/${prefixPath}/${namespacePath}/files/${currentBranch}`"
    setRepoTab({
      actionName: 'files',
      lastPath: ''
    }) 
  }

  const goToBreadcrumb = (path, index) => {
    // :href="`/${prefixPath}/${namespacePath}/${
    // index === breadcrumb.length - 1 ? 'blob' : 'files' }/${currentBranch}${path}`"
    const pathTmp = path.includes('/') ? path?.slice(1) : path
    setRepoTab({
      actionName: index === breadcrumb.value.length - 1 ? 'blob' : 'files',
      lastPath: pathTmp
    }) 
    fetchFileContent()
  }

  const goToEditFile = () => {
    // :href="`/${prefixPath}/${namespacePath}/edit/${currentBranch}/${currentPath}`"
    setRepoTab({
      actionName: 'edit_file',
      lastPath: currentPath.value
    })
  }

  const changeBranch = (branch) => {
    // if (branch !== props.currentBranch) {
    //   window.location.href = `/${apiPrefixPath}/${props.namespacePath}/blob/${branch}/${props.currentPath}`
    // }
    currentBranch.value = branch
    setRepoTab({
      currentBranch: branch,
      actionName: 'files',
      lastPath: ''
    })
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
      apiPrefixPath,
      data.content,
      props.namespacePath,
      currentBranch.value,
      currentPath.value,
      fileType.value
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
        `/${apiPrefixPath}/${props.namespacePath}/blob/${currentPath.value}?ref=${currentBranch.value}`
      ).json()

      if (data.value) {
        const result = data.value
        updateBreadcrumb()
        detectFileType()
        updateFileData(result.data)
        lfsContentRegex()
      } else {
        console.log(error.value.msg)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const lfsDownload = async () => {
    const url = `/${apiPrefixPath}/${props.namespacePath}/download/${lfsRelativePath.value}?ref=${currentBranch.value}&lfs=true&lfs_path=${lfsRelativePath.value}&save_as=${currentPath.value}`

    try {
      const { data, error } = await useFetchApi(url).json()

      if (error.value) {
        ElMessage({
          message: error.value.msg,
          type: 'warning'
        })
      } else {
        const { data: downloadUrl } = data.value
        createAndClickAnchor(downloadUrl, currentPath.value)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const normalFileDownload = async () => {
    const url = `/${apiPrefixPath}/${props.namespacePath}/download/${path.value}?ref=${currentBranch.value}`

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

  const deleteFile = async () => {
    ElMessageBox.confirm(
      t('shared.deleteFileConfirm'),
      t('shared.deleteFile'),
      {
        confirmButtonText: t('all.confirm'),
        cancelButtonText: t('all.cancel'),
        type: 'warning'
      }
    )
      .then(async () => {
        const url = `/${apiPrefixPath}/${props.namespacePath}/raw/${currentPath.value}`
        try {
          const { error } = await useFetchApi(url, {
            method: 'DELETE',
            body: JSON.stringify({
              message: `Delete ${extractNameFromPath(currentPath.value)}`,
              content: '',
              branch: currentBranch.value,
              new_branch: currentBranch.value,
              origin_path: '',
            })
          }).json()

          if (error.value) {
            ElMessage({
              message: error.value.msg,
              type: 'warning'
            })
          } else {
            ElMessage({
              message: t('all.deleteSuccess'),
              type: 'success'
            })
            window.location.href = `/${prefixPath}/${props.namespacePath}?tab=files`
          }
        } catch (error) {
          ElMessage({
            message: error.message,
            type: 'warning'
          })
        }
      })
      .catch(() => {})
  }

  onMounted(() => {
    fetchFileContent()
  })
</script>
