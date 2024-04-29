<template>
  <div class="sm:w-[100%] sm:mt-[36px] mb-[36px]">
    <a :href="`/profile/${name}`"
       class="flex items-center w-[150px] mr-[10px] pl-[18px] py-[5px] border border-[#DCDFE6] rounded-[4px] text-[14px] leading-[22px] font-medium hover:bg-[#EAECF0] hover:text-[#808080]">
      <SvgIcon class="mr-[4px]" name="arrow" />
      {{ $t('profile.return') }}
    </a>
    <div class="mt-[32px] font-medium text-xl">
      {{ $t('profile.myCollect') }}
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    name: String
  })
</script>
