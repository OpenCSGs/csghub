<template>
  <div class="border border-[#DCDFE6] rounded-[4px] bg-[#F5F7FA]">
    <div class="flex text-[14px] leading-[22px]">
      <div
        class="px-[20px] py-[9px] whitespace-nowrap border-r"
        :class="activeTab == 'Edit' ? 'bg-white' : 'border-b'"
        @click="activeTab = 'Edit'"
      >
        {{ $t('community.MD.edit') }}
      </div>
      <div
        class="px-[20px] py-[9px] whitespace-nowrap border-r"
        :class="activeTab == 'Preview' ? 'bg-white' : 'border-b'"
        @click="activeTab = 'Preview'"
      >
      {{ $t('community.MD.preview') }}
      </div>
      <div class="border-b w-full"></div>
    </div>
    <div
      class="px-[16px] py-[16px] bg-white"
      v-show="activeTab == 'Edit'"
      @dragover.prevent
      @drop="handleDrop"
    >
      <textarea ref="commentTextareaRef"
                rows="4"
                cols="10"
                @input="handleInput"
                v-model="theDesc"
                class="w-full text-[#606266] mb-[10px] p-[8px] border border-gray-300 shadow-xs rounded-md focus:outline-none focus:ring-0.5 focus:border-blue-300"
                :placeholder="placeholder==='留下评论' ? $t('community.MD.default'): placeholder"
      ></textarea>
      <div class="flex items-center gap-[8px] text-[#909399] text-[14px] leading-[22px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.99992 11.9997L4.51355 9.48605C5.03457 8.96503 5.29507 8.70452 5.59611 8.60523C5.86095 8.51788 6.14652 8.51577 6.41263 8.5992C6.7151 8.69403 6.97943 8.95066 7.50809 9.46393L9.65733 11.5506M14.3333 11.7913L13.3834 10.8415C12.8554 10.3135 12.5914 10.0495 12.2869 9.95055C12.0192 9.86354 11.7307 9.86354 11.4629 9.95055C11.1585 10.0495 10.8943 10.3136 10.3661 10.8418C9.96312 11.2448 9.65733 11.5506 9.65733 11.5506M12.3333 14.2265L9.65733 11.5506M11.9999 5.33301C11.9999 6.06939 11.403 6.66634 10.6666 6.66634C9.93021 6.66634 9.33325 6.06939 9.33325 5.33301C9.33325 4.59663 9.93021 3.99967 10.6666 3.99967C11.403 3.99967 11.9999 4.59663 11.9999 5.33301ZM7.73325 14.6663H8.26658C10.5068 14.6663 11.6269 14.6663 12.4825 14.2304C13.2352 13.8469 13.8471 13.235 14.2306 12.4823C14.6666 11.6267 14.6666 10.5066 14.6666 8.26634V7.73301C14.6666 5.4928 14.6666 4.37269 14.2306 3.51705C13.8471 2.7644 13.2352 2.15248 12.4825 1.76898C11.6269 1.33301 10.5068 1.33301 8.26659 1.33301H7.73325C5.49304 1.33301 4.37294 1.33301 3.51729 1.76898C2.76464 2.15248 2.15272 2.7644 1.76923 3.51705C1.33325 4.37269 1.33325 5.4928 1.33325 7.73301V8.26634C1.33325 10.5066 1.33325 11.6267 1.76923 12.4823C2.15272 13.235 2.76464 13.8469 3.51729 14.2304C4.37294 14.6663 5.49304 14.6663 7.73325 14.6663Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <label for="fileInput" class="cursor-pointer">
          {{ $t('community.MD.desc') }}
          <span class="underline">{{ $t('community.MD.click') }}</span>
          <input
            id="fileInput"
            type="file"
            @change="handleFileInput"
            class="hidden" />
        </label>
      </div>
    </div>
    <div
      class="px-[16px] markdown-body py-[16px] bg-white"
      v-show="activeTab == 'Preview'"
      v-html="renderMarkdown(theDesc)"
    ></div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import MarkdownIt from "markdown-it"
  import csrfFetch from "../../packs/csrfFetch.js"
  import { ElMessage } from 'element-plus'
  import Tribute from "tributejs";

  const props = defineProps({
    placeholder: {
      type: String,
      default: '留下评论'
    },
    desc: String
  })

  const activeTab = ref('Edit')
  const theDesc = ref(props.desc)
  const userList = ref([])
  const commentTextareaRef = ref(null)

  const emit = defineEmits(['inputChange'])

  onMounted(() => {
    const tribute = new Tribute({
      values: function(text, cb) {
        getTributeUsers(text, users => cb(users))
      },
      selectTemplate: function(item) {
        return '`@'+item.original.value+'`'
      },
      menuItemTemplate: function(item) {
        return '<img src="'+item.original.avatar+'">' + item.original.key;
      }
    });
    tribute.attach(commentTextareaRef.value)
  })

  const getTributeUsers = (text, cb) => {
    getUsers(text).then(data => {
      userList.value = data.users.slice(0, 6).map((user) => ({key: user.name, value: user.name, avatar: user.avatar}))
      cb(userList.value)
    }).catch(err => {
      ElMessage({
        message: err.message,
        type: 'warning'
      })
    })
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    uploadImage(file);
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    uploadImage(file);
  }

  const uploadImage = async(file) => {
    const uploadEndpoint = '/internal_api/upload';
    const formData = new FormData()
    if ( file != undefined) {
      formData.append("file", file)
    }
    const options = {
      method: 'POST',
      body: formData
    }
    const response = await csrfFetch(uploadEndpoint, options)

    if (!response.ok) {
      response.json().then(data => {
        ElMessage({
          message: data.message,
          type: 'warning'
        })
      })
    } else {
      response.json().then((data) => {
        theDesc.value = theDesc.value + '![' + file.name+']' + '('+ data.url + ')'
        emit('inputChange', theDesc.value)
      })
    }
  }

  const renderMarkdown = (text) => {
    const mdParser = new MarkdownIt();
    return mdParser.render(text);
  }

  const handleInput = () => {
    emit('inputChange', theDesc.value)
  }

  const quote = (content) => {
    theDesc.value = content + '\n' + '\n'
  }

  const clearTextarea = () => {
    theDesc.value = ''
  }

  const getUsers = async(username) => {
    const usersEndpoint = `/internal_api/users?name=${username}`;
    const options = {
      method:'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }
    const response = await csrfFetch(usersEndpoint, options)
    if (!response.ok) {
      return response.json().then(data => { throw new Error(data.message) })
    } else {
      return response.json();
    }
  }

  defineExpose({ quote, clearTextarea });
</script>
