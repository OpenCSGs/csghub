<template>
  <div class="flex flex-col gap-4 my-[30px] md:px-5">
    <div class="flex items-center gap-[10px]">
      <div class="whitespace-nowrap">{{ repoName + repoTab.lastPath }}</div>
      <div class="text-gray-500">/</div>
      <el-input
        v-model="fileName"
        :maxLength="200"
        show-word-limit
        clearable
        :placeholder="$t('all.fileName')"
        @input="handleFileNameChange"
        class="w-full h-[40px] text-gray-500"
      />
    </div>
    <CodeEditor
      v-model="codeContent"
      originalCodeContent=""
      :fileName="fileName"
    />
    <el-radio-group
      v-model="new_branch"
      class="my-4 py-4 border border-gray-200 border-l-0 border-r-0"
    >
      <el-radio
        value="main"
        size="large"
        >{{ $t('shared.commitToMain') }}</el-radio
      >
    </el-radio-group>
    <div>
      <div class="mb-2 text-sm">{{ $t('all.submitNewFile') }}</div>
      <el-input
        v-model="commitTitle"
        :maxLength="200"
        show-word-limit
        clearable
        :placeholder="commitTitlePlaceholder"
        class="w-full h-[40px] text-gray-500"
      />
    </div>
    <CommunityMDTextarea
      desc=""
      :placeholder="$t('all.provideMoreDesc')"
      @inputChange="handleCommentInputChange"
    ></CommunityMDTextarea>
    <div>
      <el-button
        type="primary"
        @click="createFile"
        :disabled="!commitValid || submiting"
        >{{ $t('all.createFile') }}</el-button
      >
      <el-button @click="cancel">{{ $t('all.cancel') }}</el-button>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue'
  import CodeEditor from '../shared/CodeEditor.vue'
  import CommunityMDTextarea from '../community/CommunityMDTextarea.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useRepoTabStore } from '../../stores/RepoTabStore'

  const props = defineProps({
    originalCodeContent: String,
    repoName: String,
    namespacePath: String,
    currentBranch: String
  })

  const { repoTab, setRepoTab } = useRepoTabStore()

  const codeContent = ref(props.originalCodeContent)
  const commitTitle = ref('')
  const commitDesc = ref('')
  const fileName = ref('')
  const new_branch = ref('main')
  const commitTitlePlaceholder = ref('Create new file')
  const commitValid = ref(false)
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
      commitTitlePlaceholder.value = `Create new file`
      commitValid.value = false
    } else {
      commitTitlePlaceholder.value = `Create ${value}`
      commitValid.value = true
    }
  }

  const buildCommitMessage = () => {
    if (commitTitle.value.trim() === '' && commitDesc.value.trim() === '') {
      return `Create ${fileName.value}`
    }
    return `${commitTitle.value.trim()} \n ${commitDesc.value.trim()}`
  }

  const btoa_utf8 = (value) => {
    return btoa(String.fromCharCode(...new TextEncoder('utf-8').encode(value)))
  }

  const createFile = async () => {
    submiting.value = true
    // TODO: main branch for now; should support different branches
    const createFileEndpoint = `/${apiPrefixPath}/${props.namespacePath}/raw${repoTab.lastPath}/${fileName.value}`
    const bodyData = {
      content: btoa_utf8(codeContent.value),
      message: buildCommitMessage(),
      branch: props.currentBranch,
      new_branch: props.currentBranch
    }
    const option = {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    }
    const { error } = await useFetchApi(createFileEndpoint, option).post().json()
    if (!error.value) {
      redirectToFilePreview()
    } else {
      ElMessage({ message: error.value.msg, type: 'warning' })
    }

    submiting.value = false
  }

  const redirectToFilePreview = () => {
    // window.location.href = `/${prefixPath}/${props.namespacePath}/blob/${props.currentBranch}/${fileName.value}`
    setRepoTab({
      actionName: 'blob',
      lastPath: repoTab.lastPath + '/' + fileName.value
    })
  }

  const cancel = () => {
    // window.location.href = `/${prefixPath}/${props.namespacePath}/files/${props.currentBranch}`
    setRepoTab({
      actionName: 'files',
      lastPath: ''
    })
  }
</script>

<style scoped>
  :deep(.el-radio__label) {
    color: #303133 !important;
    font-weight: 400;
  }
</style>
