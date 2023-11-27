<template>
  <a href="/models/01ai/Yi-6B-200K" class="flex flex-col w-[410px] h-[219px] bg-white p-4 gap-y-2 rounded-lg border xl:w-full">
    <div class="flex gap-x-[16px]">
      <el-avatar shape="square" :size="56" :src="avatar"></el-avatar>
      <div class="flex flex-col gap-y-[4px] flex-1">
        <p class="text-xl font-semibold line-clamp-1" :title="title">{{ title }}</p>
        <p class="text-sm font-normal">{{ author }}</p>
      </div>
      <div ref="buttonRef" v-click-outside="onClickOutside" class="w-[24px] h-[24px] rounded cursor-pointer hover:bg-[#ECECEF]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g style="mix-blend-mode:multiply"><g clip-path="url(#clip0_532_475)"><path d="M6.99992 10.333C6.08325 10.333 5.33325 11.083 5.33325 11.9997C5.33325 12.9163 6.08325 13.6663 6.99992 13.6663C7.91659 13.6663 8.66659 12.9163 8.66659 11.9997C8.66659 11.083 7.91659 10.333 6.99992 10.333Z" fill="#2F384C"/><path d="M16.9999 10.333C16.0833 10.333 15.3333 11.083 15.3333 11.9997C15.3333 12.9163 16.0833 13.6663 16.9999 13.6663C17.9166 13.6663 18.6666 12.9163 18.6666 11.9997C18.6666 11.083 17.9166 10.333 16.9999 10.333Z" fill="#2F384C"/><path d="M10.3333 11.9997C10.3333 11.083 11.0833 10.333 11.9999 10.333C12.9166 10.333 13.6666 11.083 13.6666 11.9997C13.6666 12.9163 12.9166 13.6663 11.9999 13.6663C11.0833 13.6663 10.3333 12.9163 10.3333 11.9997Z" fill="#2F384C"/></g></g><defs><clipPath id="clip0_532_475"><rect width="16" height="16" fill="white" transform="translate(3.99988 4)"/></clipPath></defs></svg>
      </div>

      <el-popover
        ref="popoverRef"
        :virtual-ref="buttonRef"
        trigger="click"
        virtual-triggering
        :show-arrow="false"
        placement="bottom-end"
        popper-style="padding: 8px 0;"
      >
        <a
          :href="download_url"
          download
          class="pl-5 leading-[32px] block cursor-pointer hover:bg-[#ECF5FF] hover:text-[#409EFF] hover:font-semibold"
        >
          下载模型
        </a>
      </el-popover>
    </div>

    <div class="text-[14px] leading-[16px] text-[#303133]">
      开源协议：{{ license }}
    </div>

    <!--desc-->
    <el-popover
      :width="378"
      trigger="hover"
      :placement="bottom"
      effect="dark"
      :content="desc"
    >
      <template #reference>
        <p class="h-[69px] leading-[22px] text-[#606266] text-sm overflow-hidden overflow-ellipsis line-clamp-3 cursor-pointer">
          {{ desc }}
        </p>
      </template>
    </el-popover>

    <div class="flex gap-x-[7px] text-xs leading-[20px] text-[#606266]">
      <div v-for="tag in tagList" :key="tag" class="border rounded px-[8px]" >
        <span>{{ tag }}</span>
      </div>
    </div>
  </a>
</template>

<script setup>
  import { ref, unref } from 'vue';
  import { ClickOutside as vClickOutside } from 'element-plus'

  const props = defineProps({
    title: String,
    author: String,
    download_url: String,
    tags: String,
    license: String,
    desc: String,
    avatar: String,
  });

  const tagList = ref(props.tags ? props.tags.split(",") : []);

  const buttonRef = ref()
  const popoverRef = ref()
  const onClickOutside = () => {
    unref(popoverRef).popperRef?.delayHide?.()
  }
</script>
