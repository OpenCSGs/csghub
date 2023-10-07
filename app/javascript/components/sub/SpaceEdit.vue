<template>
  <el-button text @click="dialogVisible = true" class="px-2 py-0 h-4">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13 7.99999C13 7.85399 13.0468 7.73416 13.1405 7.64049C13.2342 7.54682 13.354 7.49999 13.5 7.49999C13.646 7.49999 13.7658 7.54682 13.8595 7.64049C13.9532 7.73416 14 7.85399 14 7.99999V13.5C14 13.646 13.9532 13.7658 13.8595 13.8595C13.7658 13.9532 13.646 14 13.5 14H2.5C2.354 14 2.23417 13.9532 2.1405 13.8595C2.04683 13.7658 2 13.646 2 13.5V2.49999C2 2.35399 2.04683 2.23416 2.1405 2.14049C2.23417 2.04682 2.354 1.99999 2.5 1.99999H8C8.146 1.99999 8.26583 2.04682 8.3595 2.14049C8.45317 2.23416 8.5 2.35399 8.5 2.49999C8.5 2.64599 8.45317 2.76582 8.3595 2.85949C8.26583 2.95315 8.146 2.99999 8 2.99999H3V13H13V7.99999ZM7.344 8.65649L8.172 8.54699L13.2345 3.46899C13.3698 3.33366 13.4142 3.17482 13.3675 2.99249C13.3208 2.81016 13.2037 2.69299 13.016 2.64099C12.8283 2.58899 12.6668 2.63066 12.5315 2.76599L7.4535 7.82849L7.344 8.65649ZM13.9375 2.06249C14.2292 2.35415 14.375 2.70566 14.375 3.11699C14.375 3.52832 14.2292 3.88515 13.9375 4.18749L8.7655 9.35949C8.68217 9.44282 8.58317 9.49499 8.4685 9.51599L6.828 9.75049C6.66133 9.77149 6.52067 9.72199 6.406 9.60199C6.29133 9.48199 6.2445 9.33882 6.2655 9.17249L6.5 7.53199C6.51033 7.41732 6.55717 7.32349 6.6405 7.25049L11.828 2.06299C12.13 1.77132 12.4815 1.62549 12.8825 1.62549C13.2835 1.62549 13.635 1.77132 13.937 2.06299L13.9375 2.06249Z" fill="#606266"/>
    </svg>
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="30%"
    @close="closeEditDialog"
  >

    <h3 class="mb-2">Tags</h3>
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      class="mx-1"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>

    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="ml-1 w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />

    <el-button v-else class="button-new-tag ml-1 mt-1" size="small" @click="showInput">
      + New Tag
    </el-button>

    <div class="mt-2">
      <p>点击选择系统默认 tag:</p>
      <div class="flex gap-2 my-2 flex-wrap">
        <p v-for="tag in globalDefaultTags" class="rounded px-2 h-4 flex items-center text-xs bg-[#E7F4F6]">
          <span :class="[`text-[${tag.color}]`]" class="cursor-pointer" @click="selectTag"> {{ tag.name }}</span>
        </p>
      </div>
    </div>

    <h3 class="mb-2 mt-4">Space Type</h3>
    <el-radio-group v-model="radio">
      <el-radio :label="'private'">private</el-radio>
      <el-radio :label="'public'">public</el-radio>
    </el-radio-group>

    <h3 class="mb-2 mt-4">图片</h3>
    <input ref="fileInput" type="file" class="hidden" @change="previewImage" />
    <div class="relative">
      <img v-if="imageUrl" :src="imageUrl" class="rounded w-full h-[140px] object-cover" />
      <span
        v-if="imageDeleteEnable"
        @click="handleRemove"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer h-[38px] w-[38px] bg-white opacity-80 rounded flex items-center justify-center"
      >
        <el-icon size="28"><Delete /></el-icon>
      </span>
    </div>
    <div v-if="imageUploadEnable" @click="uploadCoverImage" class="w-full border-dotted border border-[#DCDFE6] bg-[#FAFAFA] rounded h-[140px] flex items-center justify-center cursor-pointer">
      <el-icon size="28"><Plus /></el-icon>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitTheForm" class="bg-[#409EFF]">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { nextTick, ref, inject, onMounted } from 'vue'
  import { ElInput, ElMessage } from 'element-plus'

  const emit = defineEmits(['retriveSpaceCard'])

  const props = defineProps({
    title: String,
    tags: String,
    starChainId: String,
    rawImageUrl: String,
    spaceType: String
  })

  const gloalDefaultTagsString = inject('defaultTags') as string
  const globalDefaultTags = ref(JSON.parse(gloalDefaultTagsString))

  const spaceTagsNameArray = JSON.parse(props.tags).map(tag => tag.name)

  const dialogVisible = ref(false)
  const inputValue = ref('')
  const dynamicTags = ref(spaceTagsNameArray)
  const inputVisible = ref(false)
  const InputRef = ref<InstanceType<typeof ElInput>>()

  const closeEditDialog = () => {
    dialogVisible.value = false
  }

  const handleClose = (tag: string) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  }

  const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
      InputRef.value!.input!.focus()
    })
  }

  const handleInputConfirm = () => {
    if (inputValue.value) {
      dynamicTags.value.push(inputValue.value)
    }
    inputVisible.value = false
    inputValue.value = ''
  }

  const selectTag = (event) => {
    const currentSelectedTag = event.target.innerHTML
    if (dynamicTags.value.includes(currentSelectedTag)) {
      ElMessage({
        message: '当前 Tag 已经添加！',
        type: 'warning'
      })
    } else {
      dynamicTags.value.push(event.target.innerHTML)
    }
  }

  const radio = ref(props.spaceType)

  const fileInput = ref(null)
  const imageUrl = ref(props.rawImageUrl)
  const imageDeleteEnable = ref(true)
  const imageUploadEnable = ref(false)
  const uploadCoverImage = () => {
    fileInput.value.click()
  }
  const previewImage = () => {
    imageUrl.value = URL.createObjectURL(fileInput.value.files[0])
    imageDeleteEnable.value = true
    imageUploadEnable.value = false
  }
  const handleRemove = () => {
    fileInput.value.value = null
    imageUrl.value = ''
    imageDeleteEnable.value = false
    imageUploadEnable.value = true
  }
  const submitTheForm = () => {
    updateSpace().then((data) => {
      emit('retriveSpaceCard', data)
    })
    dialogVisible.value = false
  }

  async function updateSpace() {
    const spaceUpdateEndpoint = `spaces/${props.starChainId}`;
    const formData = new FormData()
    const file = fileInput.value.files[0]
    formData.append("tags", dynamicTags.value);
    if ( file != undefined) {
      formData.append("cover_image", file);
    }
    formData.append("space_type", `${radio.value}_s`)
    const options = {
      method: 'PUT',
      body: formData 
    };

    const response = await fetch(spaceUpdateEndpoint, options);
    return response.json();
  }
  
  onMounted(() => {
    console.log('Mounted Edit')
  })
</script>

<style scoped>
  .dialog-footer button:first-child {
    margin-right: 10px; 
  }
</style>