<template>
  <div class="flex flex-col gap-4 my-[30px] md:px-5">
    <div class="flex items-center gap-[10px]">
      <div class="whitespace-nowrap">{{ repoName }}</div>
      <div class="text-[#909399]"> / </div>
      <el-input v-model="fileName"
                :maxLength="200"
                show-word-limit
                clearable
                placeholder="文件名"
                @input="handleFileNameChange"
                class="w-full h-[40px] text-[#606266]" />
    </div>
    <code-editor
      v-model="codeContent"
      :fileName="fileName"
      :originalCodeContent="originalCodeContent"
    />
    <el-radio-group v-model="new_branch" class="my-4 py-4 border border-[#DCDFE6] border-l-0 border-r-0">
      <el-radio label="main" size="large">直接提交到 main 分支</el-radio>
    </el-radio-group>
    <div>
      <div class="mb-2 text-sm">提交更新</div>
      <el-input v-model="commitTitle"
                :maxLength="200"
                show-word-limit
                clearable
                :placeholder="commitTitlePlaceholder"
                class="w-full h-[40px] text-[#606266]" />
    </div>
    <CommunityMDTextarea desc="" placeholder="提供更多描述" @inputChange="handleCommentInputChange"></CommunityMDTextarea>
    <div>
      <el-button type="primary" @click="updateFile" :disabled="!commitValid || submiting">更新文件</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import CodeEditor from '../shared/CodeEditor.vue'
import CommunityMDTextarea from '../community/CommunityMDTextarea.vue'
import csrfFetch from "../../packs/csrfFetch"
import { ElMessage } from 'element-plus'

const props = defineProps({
  originalCodeContent: String,
  repoName: String,
  namespacePath: String,
  currentPath: String,
  sha: String
})

const codeContent = ref(props.originalCodeContent)

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

const updateFile = async () => {
  submiting.value = true
  // TODO: main branch for now; should support different branches
  const updateFileEndpoint = `/internal_api/${prefixPath}/${props.namespacePath}/files/main`
  const bodyData = {
    path: fileName.value,
    content: codeContent.value,
    commit_title: commitTitle.value,
    commit_desc: commitDesc.value,
    sha: props.sha
  }
  const option = {
    method:'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData)
  }
  const response = await csrfFetch(updateFileEndpoint, option)
  if (response.ok) {
    redirectToFilePreview()
  } else {
    response.json().then(data => {
      ElMessage({ message: data.message, type: "warning" })
    }).finally(() => {
      submiting.value = false
    })
  }
}

const redirectToFilePreview = () => {
  window.location.href = `/${prefixPath}/${props.namespacePath}/blob/main/${fileName.value}`
}

const cancel = () => {
  redirectToFilePreview()
}
</script>

<style scoped>
  :deep(.el-radio__label) {
    color: #303133 !important;
    font-weight: 400;
  }
</style>
