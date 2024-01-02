<template>
  <div class="flex min-h-[300px] md:px-5 md:flex-col-reverse">
    <div class="max-w-[80%] sm:max-w-[100%] pt-4 pb-10 pr-5 sm:pr-0 break-words flex-1 border-t border-b border-[#EBEEF5] md:border-t-0">
      <MarkdownViewer
        :content="readme"
        :setDefaultText="true"
      >
      </MarkdownViewer>
    </div>
    <div class="py-4 w-[20%] border-l border-[#EBEEF5] md:border-l-0 md:border-b md:w-full md:pl-0">
      <div class="text-[#606266] text-base font-medium leading-[22px] pl-4 md:pl-0">下载量</div>
      <div class="text-[#303133] text-base font-semibold leading-6 mt-1 pl-4 md:pl-0">{{ downloadCount }}</div>
    </div>
  </div>
</template>

<script setup>
  import MarkdownViewer from '../../components/shared/viewers/MarkdownViewer.vue'

  const props = defineProps({
    readme: String,
    downloadCount: Number
  })
</script>