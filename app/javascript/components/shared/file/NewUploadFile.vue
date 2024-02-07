<template>
  <div class="flex flex-col gap-[16px] min-h-[300px] py-[32px] md:px-5">
    <div class="test-[14px]"><p>{{ repoName }}/</p></div>
    <div class="border border-[#DCDFE6] rounded-[4px] bg-[#F5F7FA]">
      <div class="flex text-[14px] text-[#4D6AD6] leading-[22px]">
        <div class="px-[20px] py-[9px] border-r bg-white w-[140px]">
          上传文件
        </div>
        <div class="border-b w-full"></div>
      </div>

      <div class="px-[16px] py-[16px] bg-white cursor-pointer">
        <el-upload
            ref="uploadRef"
            class="upload-demo"
            drag
            multiple
            :headers="{ 'X-CSRF-TOKEN': csrf_token }"
            :data="{ commit_title: commitTitle, commit_desc: commitDesc}"
            :auto-upload="false"
            :action="`/internal_api/${prefixPath}/${props.namespacePath}/files/main/upload_file`"
            :limit="1"
            @change="handleFileChange"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="handleBeforeUpload"
        >
          <el-icon class="el-icon--upload">
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M6.66663 12.3333L9.99996 9M9.99996 9L13.3333 12.3333M9.99996 9V16.5M16.6666 12.9524C17.6845 12.1117 18.3333 10.8399 18.3333 9.41667C18.3333 6.88536 16.2813 4.83333 13.75 4.83333C13.5679 4.83333 13.3975 4.73833 13.3051 4.58145C12.2183 2.73736 10.212 1.5 7.91663 1.5C4.46485 1.5 1.66663 4.29822 1.66663 7.75C1.66663 9.47175 2.36283 11.0309 3.48908 12.1613"
                  stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </el-icon>
          <div class="el-upload__text py-[16px] px-[24px]">
            拖拽文件到这里或者 <em>点击上传</em>（只支持单个文件）
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 5M 以内大小的文件上传
            </div>
          </template>
        </el-upload>
      </div>
    </div>

    <el-radio-group v-model="new_branch" class="my-4 py-4 border border-[#DCDFE6] border-l-0 border-r-0">
      <el-radio label="main" size="large">直接提交到 main 分支</el-radio>
    </el-radio-group>

    <div>
      <p class="text-[14px] mb-[8px]">提交变更</p>
      <el-input v-model="commitTitle" :maxLength="200" show-word-limit clearable
                :placeholder="commitTitlePlaceholder"></el-input>
    </div>
    <CommunityMDTextarea desc="" placeholder="提供更多描述" @inputChange="handleCommentInputChange"></CommunityMDTextarea>
    <div>
      <el-button type="primary" @click="submitUpload" :disabled="filesList.length === 0">上传文件</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import CommunityMDTextarea from '../../community/CommunityMDTextarea.vue'
import {ref} from 'vue'
import {ElMessage} from "element-plus"

const props = defineProps({
  repoName: String,
  namespacePath: String
})

const uploadRef = ref();
let filesList = ref([])
const commitTitle = ref('')
const commitTitlePlaceholder = ref('Upload file')
const new_branch = ref('main')
const commitDesc = ref('')
const prefixPath = document.location.pathname.split('/')[1]
const csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

const handleCommentInputChange = (value) => {
  commitDesc.value = value
}

const submitUpload = () => {
  if (filesList.value.length === 0) {
    ElMessage({message: "请选择文件", type: "warning"})
    return
  }
  uploadRef.value.submit()
}

const handleBeforeUpload = (file) => {
  if (file.size / 1024 <= 5000) {
    return true
  } else {
    ElMessage({message: "文件过大", type: "warning"})
    return false
  }
}

const handleFileChange = (file) => {
  commitTitlePlaceholder.value = `Upload ${file.name}`
  filesList.value.push(file.raw)
}

const handleSuccess = (response, file, fileList) => {
  ElMessage({message: "上传完成", type: "success"})
  filesList.value = []
  window.location.href = `/${prefixPath}/${props.namespacePath}/blob/main/${file.name}`
};

const handleError = (err, file, fileList) => {
  ElMessage({message: "上传错误", type: "warning"})
  filesList.value.splice(-1, 1)
}

const cancel = () => {
  window.location.href = `/${prefixPath}/${props.namespacePath}/files/main`
}
</script>