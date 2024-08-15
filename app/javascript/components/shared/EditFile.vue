<template>
  <div class="flex flex-col gap-4 my-[30px] md:px-5">
    <div class="flex items-center gap-[10px]">
      <div class="whitespace-nowrap">{{ repoName }}</div>
      <div class="text-[#909399]">/</div>
      <el-input
        v-model="fileName"
        :maxLength="200"
        show-word-limit
        clearable
        :placeholder="$t('repo.edit.fileName')"
        @input="handleFileNameChange"
        class="w-full h-[40px] text-[#606266]"
      />
    </div>
    <code-editor
      v-model="codeContent"
      :fileName="fileName"
      :originalCodeContent="originalCodeContent"
    />
    <el-radio-group
      v-model="new_branch"
      class="my-4 py-4 border border-[#DCDFE6] border-l-0 border-r-0"
    >
      <el-radio
        label="main"
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
        class="w-full h-[40px] text-[#606266]"
      />
    </div>
    <CommunityMDTextarea
      desc=""
      :placeholder="$t('repo.edit.desc')"
      @inputChange="handleCommentInputChange"
    ></CommunityMDTextarea>
    <div>
      <el-button
        type="primary"
        @click="updateFile"
        :disabled="!commitValid || submiting"
        >{{ $t('repo.edit.update') }}</el-button
      >
      <el-button @click="cancel">{{ $t('repo.edit.cancel') }}</el-button>
    </div>
  </div>
</template>
<script setup>
  import { ref, onMounted } from 'vue'
  import CodeEditor from '../shared/CodeEditor.vue'
  import CommunityMDTextarea from '../community/CommunityMDTextarea.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { atob_utf8 } from '../../packs/utils'

  const props = defineProps({
    repoName: String,
    namespacePath: String,
    currentPath: String,
  })

  const originalCodeContent = ref('')
  const codeContent = ref('')
  const sha = ref('')

  const fileName = ref(props.currentPath)
  const commitTitle = ref('')
  const commitDesc = ref('')
  const new_branch = ref('main')
  const commitTitlePlaceholder = ref(`Update ${fileName.value}`)
  const commitValid = ref(true)
  const submiting = ref(false)

  const prefixPath = document.location.pathname.split('/')[1]

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
    const updateFileEndpoint = `/${prefixPath}/${props.namespacePath}/raw/${fileName.value}`
    const bodyData = {
      content: btoa_utf8(codeContent.value),
      message: buildCommitMessage(),
      branch: 'main',
      new_branch: 'main',
      sha: sha.value
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
    window.location.href = `/${prefixPath}/${props.namespacePath}/blob/main/${fileName.value}`
  }

  const cancel = () => {
    redirectToFilePreview()
  }

  const fetchFileContent = async () => {
    try {
      const { data, error } = await useFetchApi(
        `/${prefixPath}/${props.namespacePath}/blob/${props.currentPath}`
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
