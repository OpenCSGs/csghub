<template>
  <div class="flex flex-col gap-[16px] min-h-[300px] py-[32px] md:px-5">
    <div class="test-[14px]"><p>{{ repoName }}/</p></div>
    <div class="border border-gray-200 rounded-xs bg-gray-100">
      <div class="flex text-sm text-brand-500 leading-[22px]">
        <div class="px-[20px] py-[9px] border-r bg-white w-[140px]">
          {{ $t('all.uploadFile') }}
        </div>
        <div class="border-b w-full"></div>
      </div>

      <div class="px-[16px] py-[16px] bg-white cursor-pointer">
        <el-upload
            ref="uploadRef"
            class="upload-demo"
            drag
            multiple
            :limit="5"
            :headers="{}"
            :data="{ commit_title: commitTitle, commit_desc: commitDesc}"
            :auto-upload="false"
            @change="handleFileChange"
            :on-remove="handleRemove"
            :on-error="handleError"
        >
          <el-icon>
            <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.66663 12.3333L9.99996 9M9.99996 9L13.3333 12.3333M9.99996 9V16.5M16.6666 12.9524C17.6845 12.1117 18.3333 10.8399 18.3333 9.41667C18.3333 6.88536 16.2813 4.83333 13.75 4.83333C13.5679 4.83333 13.3975 4.73833 13.3051 4.58145C12.2183 2.73736 10.212 1.5 7.91663 1.5C4.46485 1.5 1.66663 4.29822 1.66663 7.75C1.66663 9.47175 2.36283 11.0309 3.48908 12.1613" stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </el-icon>
          <div class="el-upload__text py-[16px] px-[24px]">
            {{ $t('shared.dragOr') }} <em>{{ $t('all.clickUpload') }}</em>（{{ $t('shared.onlyFiveFiles') }}）
          </div>
          <template #tip>
            <div class="el-upload__tip">
              {{ $t('shared.uploadFile5Mb') }}
            </div>
          </template>
        </el-upload>
      </div>
    </div>

    <el-radio-group v-model="new_branch" class="my-4 py-4 border border-gray-200 border-l-0 border-r-0">
      <el-radio value="main" size="large">{{ $t('shared.commitToMain') }}</el-radio>
    </el-radio-group>

    <div>
      <p class="text-sm mb-[8px]">{{ $t('all.submitChange') }}</p>
      <el-input v-model="commitTitle" :maxLength="200" show-word-limit clearable
                :placeholder="commitTitlePlaceholder"></el-input>
    </div>
    <CommunityMDTextarea desc="" :placeholder="$t('all.provideMoreDesc')" @inputChange="handleCommentInputChange"></CommunityMDTextarea>
    <div>
      <el-button type="primary" @click="submitUpload" :disabled="filesList.length === 0">{{ $t('all.uploadFile') }}</el-button>
      <el-button @click="cancel">{{ $t('all.cancel') }}</el-button>
    </div>
  </div>
</template>
<script setup>
import CommunityMDTextarea from '../community/CommunityMDTextarea.vue'
import { ref } from 'vue'
import {ElMessage} from "element-plus"
import { useI18n } from 'vue-i18n'
import useFetchApi from '../../packs/useFetchApi'

const props = defineProps({
  repoName: String,
  namespacePath: String,
  currentBranch: String
})

const { t } = useI18n();
const uploadRef = ref();
const filesList = ref([])
const commitTitle = ref('')
const commitTitlePlaceholder = ref('Upload file')
const new_branch = ref('main')
const commitDesc = ref('')
let prefixPath = document.location.pathname.split('/')[1]
let apiPrefixPath = document.location.pathname.split('/')[1]

if (prefixPath === 'mcp') {
  prefixPath = 'mcp/servers'
  apiPrefixPath = 'mcps'
}

const handleCommentInputChange = (value) => {
  commitDesc.value = value
}

const submitUpload = () => {
  if (filesList.value.length === 0) {
    ElMessage({message: t('all.selectFilePls'), type: "warning"})
    return
  }
  for(let i = 0; i < filesList.value.length; i++) {
    if (filesList.value[i].raw.size / 1024 > 5000) {
      ElMessage({message: t('all.fileTooLarge'), type: "warning"})
      return
    }
  }
  syncUploadFile()
}

const handleFileChange = (file) => {
  commitTitlePlaceholder.value = `Upload ${file.name}`
  filesList.value.push(file)
}
const handleRemove = (file, fileList) => {
  filesList.value = fileList.filter(item => item !== file)
}

const cancel = () => {
  window.location.href = `/${prefixPath}/${props.namespacePath}/files/${props.currentBranch}`
}

const buildCommitMessage = () => {
  if (commitTitle.value.trim() === '' && commitDesc.value.trim() === '') {
    return commitTitlePlaceholder.value
  }
  return `${commitTitle.value.trim()} \n ${commitDesc.value.trim()}`
}

const appendFilesToFormData = (formData, files) => {
  files.forEach((file) => {
    formData.append('file', file.raw)
    formData.append('file_path', file.name)
  })
}

const syncUploadFile = async () => {
  const formData = new FormData()
  formData.append('branch', props.currentBranch)
  formData.append('message', buildCommitMessage())

  appendFilesToFormData(formData, filesList.value)

  try {
    const { error } = await useFetchApi(
      `/${apiPrefixPath}/${props.namespacePath}/upload_file`,
      {
        body: formData
      }
    ).post().json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'error' })
    } else {
      filesList.value = []
      window.location.href = `/${prefixPath}/${props.namespacePath}/files/${props.currentBranch}`
    }
  } catch (error) {
    console.error(error)
  }
}
</script>