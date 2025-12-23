<template>
  <div class="flex flex-col gap-4 my-8 md:px-5">
    <div class="flex items-center gap-3">
      <div class="whitespace-nowrap ">{{ repoName }}</div>
      <div class="text-gray-500">/</div>
      <el-input
        v-model="fileName"
        :maxLength="200"
        show-word-limit
        clearable
        :placeholder="$t('repo.edit.fileName')"
        @input="handleFileNameChange"
        class="w-full h-10 text-gray-500"
      />
    </div>
    <code-editor
      v-model="codeContent"
      :fileName="fileName"
      :originalCodeContent="originalCodeContent"
    />
    <el-radio-group
      v-model="new_branch"
      class="my-4 py-4 border border-gray-200 border-l-0 border-r-0"
    >
      <el-radio
        value="main"
        size="large"
        >{{ $t('repo.edit.main') }}</el-radio
      >
    </el-radio-group>
    <div>
      <div class="mb-2 text-sm">{{ $t('repo.edit.submit') }}</div>
      <el-input
        v-model="commitTitle"
        :maxLength="200"
        show-word-limit
        clearable
        :placeholder="commitTitlePlaceholder"
        class="w-full h-10 text-gray-500"
      />
    </div>
    <CommunityMDTextarea
      desc=""
      :placeholder="$t('repo.edit.desc')"
      @inputChange="handleCommentInputChange"
    ></CommunityMDTextarea>
    <div>
      <div class="flex items-center gap-2">
        <CsgButton
        class="btn btn-primary btn-md"
        :name="$t('repo.edit.update')"
        :disabled="!commitValid || submiting"
        @click="updateFile"
        />
        <CsgButton
          class="btn btn-secondary-gray btn-md"
          :name="$t('repo.edit.cancel')"
          @click="cancel"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import CodeEditor from '../shared/CodeEditor.vue'
  import CommunityMDTextarea from '../community/CommunityMDTextarea.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { atob_utf8 } from '../../packs/utils'
  import { useRepoTabStore } from '../../stores/RepoTabStore'
  
  const props = defineProps({
    repoName: String,
    namespacePath: String,
    currentPath: String,
    currentBranch: String
  })

  const originalCodeContent = ref('')
  const { repoTab, setRepoTab } = useRepoTabStore()
  const router = useRouter()

  const codeContent = ref('')
  const sha = ref('')

  const fileName = ref(props.currentPath)
  const originalFileName = props.currentPath
  const commitTitle = ref('')
  const commitDesc = ref('')
  const new_branch = ref('main')
  const commitTitlePlaceholder = ref(`Update ${fileName.value}`)
  const commitValid = ref(true)
  const submiting = ref(false)

  let prefixPath = document.location.pathname.split('/')[1]
  let apiPrefixPath = document.location.pathname.split('/')[1]

  if (prefixPath === 'mcp') {
    prefixPath = 'mcp/servers'
    apiPrefixPath = 'mcps'
  }

  const handleCommentInputChange = (value) => {
    commitDesc.value = value
  }

  const handleFileNameChange = (value) => {
    if (value.trim() === '') {
      commitTitlePlaceholder.value = `Update ${fileName.value}`
      commitValid.value = false
    } else {
      commitTitlePlaceholder.value = `Update ${value}`
      commitValid.value = true
    }
  }

  const buildCommitMessage = () => {
    if (commitTitle.value.trim() === '' && commitDesc.value.trim() === '') {
      return `Update ${fileName.value}`
    }
    return `${commitTitle.value.trim()} \n ${commitDesc.value.trim()}`
  }

  const btoa_utf8 = (value) => {
    return btoa(String.fromCharCode(...new TextEncoder('utf-8').encode(value)))
  }

  const updateFile = async () => {
    submiting.value = true
    // TODO: main branch for now; should support different branches
    const updateFileEndpoint = `/${apiPrefixPath}/${props.namespacePath}/raw/${fileName.value}`
    const bodyData = {
      content: btoa_utf8(codeContent.value),
      message: buildCommitMessage(),
      branch: props.currentBranch,
      new_branch: props.currentBranch,
      sha: sha.value,
      origin_path: originalFileName,
    }
    const option = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    }
    const { error } = await useFetchApi(updateFileEndpoint, option).put().json()

    if (!error.value) {
      redirectToFilePreview()
    } else {
      ElMessage({ message: error.value.msg, type: 'warning' })
    }

    submiting.value = false
  }

  const redirectToFilePreview = () => {
    // window.location.href = `/${prefixPath}/${props.namespacePath}/blob/${props.currentBranch}/${fileName.value}`
    // 确保路径不带开头的 /
    const normalizedPath = fileName.value.startsWith('/') ? fileName.value.slice(1) : fileName.value
    
    const query = {
      tab: 'files',
      actionName: 'blob',
      path: normalizedPath,
      branch: props.currentBranch
    }
    
    setRepoTab({
      actionName: 'blob',
      lastPath: normalizedPath
    })
    
    router.push({
      query
    })
  }

  const cancel = () => {
    // redirectToFilePreview()
    // 确保路径不带开头的 /
    const normalizedPath = fileName.value.startsWith('/') ? fileName.value.slice(1) : fileName.value
    
    const query = {
      tab: 'files',
      actionName: 'blob',
      path: normalizedPath,
      branch: props.currentBranch
    }
    
    setRepoTab({
      actionName: 'blob',
      lastPath: normalizedPath
    })
    
    router.push({
      query
    })
  }

  const fetchFileContent = async () => {
    try {
      const { data, error } = await useFetchApi(
        `/${apiPrefixPath}/${props.namespacePath}/blob/${props.currentPath}?ref=${props.currentBranch}`
      ).json()

      if (!error.value) {
        const result = data.value
        originalCodeContent.value = atob_utf8(result.data.content)
        codeContent.value = originalCodeContent.value
        sha.value = result.data.sha
      } else {
        ElMessage({ message: error.value.msg, type: 'error' })
      }
    } catch (err) {
      ElMessage({ message: err.message, type: 'error' })
    }
  }

  onMounted(() => {
    fetchFileContent()
  })
</script>

<style scoped>
  :deep(.el-radio__label) {
    color: #303133 !important;
    font-weight: 400;
  }
</style>
