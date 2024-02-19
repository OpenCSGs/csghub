<template>
  <div>
    <h3 class="text-[16px] text-[#344054] font-[500] mb-[16px]">在线体验</h3>
    <p class="text-[#344054] text-[14px] mb-[6px]">测试内容</p>
    <el-input
      v-model="textInput"
      :rows="3"
      type="textarea"
      placeholder="Please input"
    />
    <div>
      <div class="flex px-[12px] py-[8px] justify-center items-center gap-[4px] border rounded-[8px] shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.5 6.66675L12.5 6.66675M12.5 6.66675C12.5 8.04746 13.6193 9.16675 15 9.16675C16.3807 9.16675 17.5 8.04746 17.5 6.66675C17.5 5.28604 16.3807 4.16675 15 4.16675C13.6193 4.16675 12.5 5.28604 12.5 6.66675ZM7.5 13.3334L17.5 13.3334M7.5 13.3334C7.5 14.7141 6.38071 15.8334 5 15.8334C3.61929 15.8334 2.5 14.7141 2.5 13.3334C2.5 11.9527 3.61929 10.8334 5 10.8334C6.38071 10.8334 7.5 11.9527 7.5 13.3334Z" stroke="#344054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>参数调整</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        textInput: '',
        textOutput: ''
      }
    }
  }
</script>