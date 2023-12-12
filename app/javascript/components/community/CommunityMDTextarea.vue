<template>
  <div class="border border-[#DCDFE6] rounded-[4px] bg-[#F5F7FA]">
    <div class="flex text-[14px] leading-[22px]">
      <div
        class="px-[20px] py-[9px] border-r"
        :class="activeTab == 'Edit' ? 'bg-white' : 'border-b'"
        @click="activeTab = 'Edit'"
      >
        Edit
      </div>
      <div
        class="px-[20px] py-[9px] border-r"
        :class="activeTab == 'Preview' ? 'bg-white' : 'border-b'"
        @click="activeTab = 'Preview'"
      >
        Preview
      </div>
      <div class="border-b w-full"></div>
    </div>
    <div
      class="px-[16px] py-[16px] bg-white"
      v-show="activeTab == 'Edit'"
      @dragover.prevent
      @drop="handleDrop"
    >
      <el-input
        @input="handleInput"
        v-model="theDesc"
        clearable
        type="textarea"
        placeholder="Add an extended description..."
        class="w-full h-auto text-[#606266] mb-[10px]"
      />
      <div class="flex items-center gap-[8px] text-[#909399] text-[14px] leading-[22px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.99992 11.9997L4.51355 9.48605C5.03457 8.96503 5.29507 8.70452 5.59611 8.60523C5.86095 8.51788 6.14652 8.51577 6.41263 8.5992C6.7151 8.69403 6.97943 8.95066 7.50809 9.46393L9.65733 11.5506M14.3333 11.7913L13.3834 10.8415C12.8554 10.3135 12.5914 10.0495 12.2869 9.95055C12.0192 9.86354 11.7307 9.86354 11.4629 9.95055C11.1585 10.0495 10.8943 10.3136 10.3661 10.8418C9.96312 11.2448 9.65733 11.5506 9.65733 11.5506M12.3333 14.2265L9.65733 11.5506M11.9999 5.33301C11.9999 6.06939 11.403 6.66634 10.6666 6.66634C9.93021 6.66634 9.33325 6.06939 9.33325 5.33301C9.33325 4.59663 9.93021 3.99967 10.6666 3.99967C11.403 3.99967 11.9999 4.59663 11.9999 5.33301ZM7.73325 14.6663H8.26658C10.5068 14.6663 11.6269 14.6663 12.4825 14.2304C13.2352 13.8469 13.8471 13.235 14.2306 12.4823C14.6666 11.6267 14.6666 10.5066 14.6666 8.26634V7.73301C14.6666 5.4928 14.6666 4.37269 14.2306 3.51705C13.8471 2.7644 13.2352 2.15248 12.4825 1.76898C11.6269 1.33301 10.5068 1.33301 8.26659 1.33301H7.73325C5.49304 1.33301 4.37294 1.33301 3.51729 1.76898C2.76464 2.15248 2.15272 2.7644 1.76923 3.51705C1.33325 4.37269 1.33325 5.4928 1.33325 7.73301V8.26634C1.33325 10.5066 1.33325 11.6267 1.76923 12.4823C2.15272 13.235 2.76464 13.8469 3.51729 14.2304C4.37294 14.6663 5.49304 14.6663 7.73325 14.6663Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <label for="fileInput" class="cursor-pointer">
          Upload images, audio, and videos by dragging in the text input,pasting, or
          <span class="underline">click here</span>
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
<script>
import MarkdownIt from "markdown-it";
import 'github-markdown-css';
export default {
  props:{
    desc: String
  },
  data() {
    return {
      activeTab:'Edit',
      theDesc:this.desc
    };
  },
  methods: {
    handleDrop(e) {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      this.uploadImage(file);
    },
    handleFileInput(e) {
      const file = e.target.files[0];
      this.uploadImage(file);
    },
    uploadImage(file) {
      console.log(file);
      // 这里可以使用 FormData 或者其他方式上传图片到后端，获取图片地址
      // 假设已经获取到图片地址 imageUrl 和图片名称 imageName
      let imageUrl = 'https://cdn-uploads.huggingface.co/production/uploads/6548417d2fe2a1e686ab71d2/g28SIbJ-lfdEiIXdD30_Y.jpeg';
      let imageName = '微信图片_20230717004756.jpg';
      this.theDesc = this.theDesc + '![' + imageName+']' + '('+ imageUrl + ')'
    },
    renderMarkdown(text) {
      const mdParser = new MarkdownIt();
      return mdParser.render(text);
    },
    handleInput(value) {
      this.$emit('inputChange', value);
    },
    clearTextarea(){
        this.theDesc=''
    }
  },
};
</script>
