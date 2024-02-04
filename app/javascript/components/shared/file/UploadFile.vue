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
      <!--上传文件-->
      <div class="px-[16px] py-[16px] bg-white cursor-pointer">
        <a @click="clickFileInput">
          <input id="fileUploadInput" type="file" @change="handleUploadFileInput" class="hidden"/>
          <div class="flex flex-col justify-center items-center py-[16px] px-[24px] border rounded-xl" @dragover.prevent
               @drop="handleDrop">
            <div class="flex justify-center items-center mb-[12px] w-[40px] h-[40px] border rounded-lg">
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M6.66663 12.3333L9.99996 9M9.99996 9L13.3333 12.3333M9.99996 9V16.5M16.6666 12.9524C17.6845 12.1117 18.3333 10.8399 18.3333 9.41667C18.3333 6.88536 16.2813 4.83333 13.75 4.83333C13.5679 4.83333 13.3975 4.73833 13.3051 4.58145C12.2183 2.73736 10.212 1.5 7.91663 1.5C4.46485 1.5 1.66663 4.29822 1.66663 7.75C1.66663 9.47175 2.36283 11.0309 3.48908 12.1613"
                    stroke="#475467" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p class="font-light text-[12px] text-[#475467]">Drag files/folders here or click to browse from your
              computer.</p>
          </div>
        </a>
      </div>

      <!--展示文件-->
      <div v-for="(file, index) in filesList" class="bg-white px-[16px] pb-[16px]">
        <div class="flex p-[16px] border rounded-[12px]">
          <img :src="file.fileImage" class="w-[40px] h-[40px]" alt="PDF Image">
          <div class="ml-[16px] w-full">
            <div>
              <a @click="deleteFile(index)" class="cursor-pointer">
                <svg v-if="!uploadDoneList.includes(index)" class="float-right" width="18" height="20"
                     viewBox="0 0 18 20"
                     fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M12.3333 4.99984V4.33317C12.3333 3.39975 12.3333 2.93304 12.1517 2.57652C11.9919 2.26292 11.7369 2.00795 11.4233 1.84816C11.0668 1.6665 10.6001 1.6665 9.66667 1.6665H8.33333C7.39991 1.6665 6.9332 1.6665 6.57668 1.84816C6.26308 2.00795 6.00811 2.26292 5.84832 2.57652C5.66667 2.93304 5.66667 3.39975 5.66667 4.33317V4.99984M7.33333 9.58317V13.7498M10.6667 9.58317V13.7498M1.5 4.99984H16.5M14.8333 4.99984V14.3332C14.8333 15.7333 14.8333 16.4334 14.5608 16.9681C14.3212 17.4386 13.9387 17.821 13.4683 18.0607C12.9335 18.3332 12.2335 18.3332 10.8333 18.3332H7.16667C5.76654 18.3332 5.06647 18.3332 4.53169 18.0607C4.06129 17.821 3.67883 17.4386 3.43915 16.9681C3.16667 16.4334 3.16667 15.7333 3.16667 14.3332V4.99984"
                      stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <!--              <svg v-if="uploadDoneList.includes(index)" class="float-right" width="16" height="16" viewBox="0 0 16 16"-->
              <!--                   fill="none" xmlns="http://www.w3.org/2000/svg">-->
              <!--                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="#3250BD"/>-->
              <!--                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#3250BD"/>-->
              <!--                <path d="M12 5L6.5 10.5L4 8" stroke="white" stroke-width="1.6666" stroke-linecap="round"-->
              <!--                      stroke-linejoin="round"/>-->
              <!--              </svg>-->
              <p class="text-[14px]">{{ file.file.name }}</p>
            </div>
            <p class="font-light text-[14px] text-[#475467]">{{ file.fileSize }} KB</p>
            <!--展示进度条-->
            <div :id="'progress-bar-' + index" class="hidden">
              <el-progress :status="filesList[index].status" :percentage="filesList[index].percentage" stroke-width="10" :duration="30" striped striped-flow/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-radio-group v-model="new_branch" class="my-4 py-4 border border-[#DCDFE6] border-l-0 border-r-0">
      <el-radio label="main" size="large">直接提交到 main 分支</el-radio>
    </el-radio-group>

    <div>
      <p class="text-[14px] mb-[8px]">上传文件</p>
      <el-input v-model="commitTitle" :maxLength="200" show-word-limit clearable :placeholder="commitTitlePlaceholder"></el-input>
    </div>
    <CommunityMDTextarea desc="" @inputChange="handleCommentInputChange"></CommunityMDTextarea>
    <div>
      <el-button type="primary" @click="uploadImage">上传文件</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import CommunityMDTextarea from '../../community/CommunityMDTextarea.vue'
import {ref} from 'vue'
import {ElMessage} from "element-plus";

const props = defineProps({
  repoName: String,
  namespacePath: String
})
let filesList = ref([])
let uploadDoneList = ref([])
const commitTitle = ref('')
const commitTitlePlaceholder = ref('Upload file')
const new_branch = ref('main')
const commitDesc = ref('')
const prefixPath = document.location.pathname.split('/')[1]


function clickFileInput() {
  document.getElementById('fileUploadInput').click()
}

const handleCommentInputChange = (value) => {
  commitDesc.value = value
}

// drop上传文件
function handleDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer.files[0]
  this.uploadImage(file)
}

// 点击上传文件
function handleUploadFileInput(e) {
  const file = e.target.files[0]
  const fileKb = file.size / 1024

  // 目前只支持单文件上传
  if (filesList.value.length === 1) {
    filesList.value[0] = {
      fileImage: getFileImage(file.name),
      fileSize: fileKb.toFixed(2),
      file: file,
      percentage: '0',
      status: ''
    }
    return
  }

  filesList.value.push({
    fileImage: getFileImage(file.name),
    fileSize: fileKb.toFixed(2),
    file: file,
    percentage: '0',
    status: ''
  })

  commitTitlePlaceholder.value = `Upload ${file.name}`
}

// 传入文件名，筛选文件图片
function getFileImage(fileName) {
  // 使用正则表达式匹配文件名中的后缀部分
  // const parts = fileName.split('.')
  // const extension = parts.length > 1 ? parts.pop().toLowerCase() : null  // 转换为小写，以避免大小写不敏感的问题
  // if (extension === 'pdf') {
  //   return '/assets/files/PDF.png'
  // } else if (extension === 'png') {
  //   return '/assets/files/PNG.png'
  // } else if (extension === 'txt') {
  //   return '/assets/files/TXT.png'
  // } else if (extension === 'zip') {
  //   return '/assets/files/ZIP.png'
  // } else { return '/assets/files/Default.png' }

  return '/images/files/Default.png'  // 先使用默认图片
}

// 删除文件
function deleteFile(index) {
  filesList.value.splice(index, 1);
  commitTitlePlaceholder.value = `Upload file`
}

// 上传文件
async function uploadImage() {
  if (!filesList.value[0]) {
    ElMessage({message: "请选择文件", type: "warning"})
    return
  }

  for (let [index, item] of filesList.value.entries()) {
    let formData = new FormData()
    formData.append('file' + index.toString(), item.file)

    let xhr = new XMLHttpRequest()

    // 上传进度回调事件
    xhr.upload.addEventListener('progress', function (event) {
      if (event.lengthComputable) {
        let percentComplete = (event.loaded / event.total) * 100
        updateProgressBar(percentComplete, index)
      }
    });

    // 上传完成回调
    xhr.addEventListener('load', function () {
      filesList.value[index].status = 'success'
      uploadDoneList.value.push(index)
      ElMessage({message: "上传完成", type: "success"})
    });

    // 上传错误回调
    xhr.addEventListener('error', function () {
      filesList.value[index].status = 'exception'
      ElMessage({message: "上传异常", type: "warning"})
      // resetProgressBar(index)   设置进度条为0
    });

    // 设置请求
    xhr.open('POST', 'http://127.0.0.1:8000/api/upload', true)
    xhr.send(formData)

    // 显示进度条
    document.getElementById('progress-bar-' + index).style.display = 'block'
  }
}

function updateProgressBar(percentComplete, index) {
  filesList.value[index].percentage = Math.round(percentComplete).toString()
}

function resetProgressBar(index) {
  filesList.value[index].percentage = '0'
}

const redirectToFilePreview = () => {
  window.location.href = `/${prefixPath}/${props.namespacePath}/blob/main/${fileName.value}`
}

const cancel = () => {
  window.location.href = `/${prefixPath}/${props.namespacePath}/files/main`
}
</script>