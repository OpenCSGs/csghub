<template>
  <div class="p-[16px] border-t border-[#EBEEF5]">
    <h3 class="flex items-center gap-[8px]">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect opacity="0.12" x="1.5" y="1.5" width="15" height="15" rx="5" fill="#667085"/>
        <path d="M7.5 6L4.5 9L7.5 12M10.5 6L13.5 9L10.5 12M6.3 16.5H11.7C13.3802 16.5 14.2202 16.5 14.862 16.173C15.4265 15.8854 15.8854 15.4265 16.173 14.862C16.5 14.2202 16.5 13.3802 16.5 11.7V6.3C16.5 4.61984 16.5 3.77976 16.173 3.13803C15.8854 2.57354 15.4265 2.1146 14.862 1.82698C14.2202 1.5 13.3802 1.5 11.7 1.5H6.3C4.61984 1.5 3.77976 1.5 3.13803 1.82698C2.57354 2.1146 2.1146 2.57354 1.82698 3.13803C1.5 3.77976 1.5 4.61984 1.5 6.3V11.7C1.5 13.3802 1.5 14.2202 1.82698 14.862C2.1146 15.4265 2.57354 15.8854 3.13803 16.173C3.77976 16.5 4.61984 16.5 6.3 16.5Z" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="font-[500] text-[#344054] text-[16px] leading-[24px]"> 关联代码 </span>
      <span class="text-[#344054]"> {{ namespacePath }} </span>
    </h3>
    <div class="mt-[16px] flex flex-col gap-[12px]">
      <RepoItem v-for="code in codes" :repo="code" repoType="code" cardType="relations" />
    </div>
  </div>
</template>

<script setup>
  import RepoItem from '../shared/RepoItem.vue';

  const props = defineProps({
    namespacePath: String,
    codes: Array
  })
</script>