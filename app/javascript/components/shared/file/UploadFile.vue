<template>
  <div class="flex flex-col gap-[16px] min-h-[300px] py-[32px] md:px-5">
    <div class="test-[14px]"><p>repo/</p></div>
    <div class="border border-[#DCDFE6] rounded-[4px] bg-[#F5F7FA]">
      <div class="flex text-[14px] text-[#4D6AD6] leading-[22px]">
        <div class="px-[20px] py-[9px] border-r bg-white w-[140px]">
          Upload file(s)
        </div>
        <div class="border-b w-full"></div>
      </div>
      <!--上传文件-->
      <div class="px-[16px] py-[16px] bg-white cursor-pointer">
        <a @click="clickFileInput">
          <input id="fileInput" type="file" @change="handleFileInput" class="hidden"/>
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

    <el-divider/>

    <div class="flex flex-col">
      <div class="flex gap-[8px] items-center">
        <svg v-if="showCommit === true" class="cursor-pointer" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="10" height="10" rx="5" fill="white"/>
          <rect x="2" y="2" width="10" height="10" rx="5" stroke="#4D6AD6" stroke-width="4"/>
        </svg>
        <svg v-else @click="showCommit = true" class="cursor-pointer" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="13" height="13" rx="6.5" fill="white"/>
          <rect x="0.5" y="0.5" width="13" height="13" rx="6.5" stroke="#DCDFE6"/>
        </svg>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8.00002" cy="7.99984" r="2.33333" stroke="#606266" stroke-linecap="round"
                  stroke-linejoin="round"/>
          <path d="M5.66664 8L1.33331 8" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14.6667 8L10.6667 8" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>commit directly to the main branch</p>
      </div>
      <div class="flex gap-[8px] items-center mt-[8px]">
        <svg v-if="showCommit === false" class="cursor-pointer" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="10" height="10" rx="5" fill="white"/>
          <rect x="2" y="2" width="10" height="10" rx="5" stroke="#4D6AD6" stroke-width="4"/>
        </svg>
        <svg v-else @click="showCommit = false" class="cursor-pointer" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="13" height="13" rx="6.5" fill="white"/>
          <rect x="0.5" y="0.5" width="13" height="13" rx="6.5" stroke="#DCDFE6"/>
        </svg>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12.3333" cy="12.3333" r="2.33333" stroke="#606266" stroke-linecap="round"
                  stroke-linejoin="round"/>
          <ellipse cx="3.66665" cy="12.3333" rx="2.33333" ry="2.33333" stroke="#606266" stroke-linecap="round"
                   stroke-linejoin="round"/>
          <path d="M3.66669 6L3.66669 10" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="3.66665" cy="3.66683" r="2.33333" stroke="#606266" stroke-linecap="round"
                  stroke-linejoin="round"/>
          <path
              d="M12.3334 9.6668V6.53347C12.3334 5.41336 12.3334 4.85331 12.1154 4.42548C11.9236 4.04916 11.6177 3.7432 11.2413 3.55145C10.8135 3.33346 10.2535 3.33346 9.13335 3.33346H8.66669M8.66669 3.33346L10.6667 1.3335M8.66669 3.33346L10.6667 5.3335"
              stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>Open as a pull request to the main branch</p>
      </div>
    </div>

    <el-divider/>

    <div>
      <p class="text-[14px] mb-[8px]">Commit changes</p>
      <el-input v-model="commitChanges" placeholder="Upload 0 files"></el-input>
    </div>

    <div class="border border-[#DCDFE6] rounded-[4px] bg-[#F5F7FA]">
      <div class="flex text-[14px] leading-[22px]">
        <div class="px-[20px] py-[9px] border-r" :class="activeTab==='Edit'?'bg-white':'border-b'"
             @click="activeTab='Edit'">Edit
        </div>
        <div class="px-[20px] py-[9px] border-r" :class="activeTab==='Preview'?'bg-white':'border-b'"
             @click="activeTab='Preview'">Preview
        </div>
        <div class="border-b w-full"></div>
      </div>
      <div class="px-[16px] py-[16px] bg-white" v-show="activeTab==='Edit'" @dragover.prevent @drop="handleDrop">
        <el-input v-model="desc"
                  clearable
                  type="textarea"
                  :rows="5"
                  placeholder="Add an extended description..."
                  class="w-full h-auto text-[#606266] mb-[10px]"/>
        <div class="flex gap-[8px] text-[#909399] text-[14px] leading-[22px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
                d="M1.99992 11.9997L4.51355 9.48605C5.03457 8.96503 5.29507 8.70452 5.59611 8.60523C5.86095 8.51788 6.14652 8.51577 6.41263 8.5992C6.7151 8.69403 6.97943 8.95066 7.50809 9.46393L9.65733 11.5506M14.3333 11.7913L13.3834 10.8415C12.8554 10.3135 12.5914 10.0495 12.2869 9.95055C12.0192 9.86354 11.7307 9.86354 11.4629 9.95055C11.1585 10.0495 10.8943 10.3136 10.3661 10.8418C9.96312 11.2448 9.65733 11.5506 9.65733 11.5506M12.3333 14.2265L9.65733 11.5506M11.9999 5.33301C11.9999 6.06939 11.403 6.66634 10.6666 6.66634C9.93021 6.66634 9.33325 6.06939 9.33325 5.33301C9.33325 4.59663 9.93021 3.99967 10.6666 3.99967C11.403 3.99967 11.9999 4.59663 11.9999 5.33301ZM7.73325 14.6663H8.26658C10.5068 14.6663 11.6269 14.6663 12.4825 14.2304C13.2352 13.8469 13.8471 13.235 14.2306 12.4823C14.6666 11.6267 14.6666 10.5066 14.6666 8.26634V7.73301C14.6666 5.4928 14.6666 4.37269 14.2306 3.51705C13.8471 2.7644 13.2352 2.15248 12.4825 1.76898C11.6269 1.33301 10.5068 1.33301 8.26659 1.33301H7.73325C5.49304 1.33301 4.37294 1.33301 3.51729 1.76898C2.76464 2.15248 2.15272 2.7644 1.76923 3.51705C1.33325 4.37269 1.33325 5.4928 1.33325 7.73301V8.26634C1.33325 10.5066 1.33325 11.6267 1.76923 12.4823C2.15272 13.235 2.76464 13.8469 3.51729 14.2304C4.37294 14.6663 5.49304 14.6663 7.73325 14.6663Z"
                stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <label for="fileInput" class="cursor-pointer hover:text-[#6C757D]">Upload images, audio, and videos by
            dragging in the text input, pasting, or
            <label class="underline cursor-pointer">click here<input id="fileInput" type="file"
                                                                     @change="handleFileInput"
                                                                     class="hidden"/></label>.</label>
        </div>
      </div>
      <div class="px-[16px] markdown-body py-[16px] bg-white" v-show="activeTab==='Preview'"
           v-html="renderMarkdown(desc)"></div>
    </div>

    <div>
      <el-button type="primary" @click="uploadImage">Commit new file to main</el-button>
      <el-button @click="cancel">Cancel</el-button>
    </div>
  </div>
</template>
<script setup>
import {getCurrentInstance} from 'vue'
import MarkdownIt from "markdown-it"
import {ref} from 'vue'
import {ElMessage} from "element-plus";

const props = defineProps({})

let activeTab = ref('Edit')
let desc = ref('')
const instance = getCurrentInstance()
let filesList = ref([])
let uploadDoneList = ref([])
let commitChanges = ref('')
let showCommit = ref(true)

function create() {
  instance.emit("changeFlag", 'fileList')
}

function cancel() {
  instance.emit("changeFlag", 'fileList')
}

function renderMarkdown(text) {
  const mdParser = new MarkdownIt()
  return mdParser.render(text)
}

function clickFileInput() {
  document.getElementById('fileInput').click()
}

// drop上传文件
function handleDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer.files[0]
  this.uploadImage(file)
}

// 点击上传文件
function handleFileInput(e) {
  const file = e.target.files[0]
  const fileKb = file.size / 1024
  filesList.value.push({
    fileImage: getFileImage(file.name),
    fileSize: fileKb.toFixed(2),
    file: file,
    percentage: '0',
    status: ''
  })
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
</script>

