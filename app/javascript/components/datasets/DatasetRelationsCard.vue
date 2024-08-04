<template>
  <div class="p-[16px] border-t border-[#EBEEF5]">
    <h3 class="flex items-center gap-[8px]">
      <SvgIcon name="datasets" width="18px" height="18px" />
      <span class="font-[500] text-[#344054] text-[16px] leading-[24px]">
        {{ $t('datasets.datasetsUsedToTrain') }}
      </span>
      <span class="text-[#344054]"> {{ namespacePath }} </span>
    </h3>
    <div class="mt-[16px] flex flex-col gap-[12px]">
      <RepoItem
        v-for="dataset in datasets"
        :repo="dataset"
        repoType="dataset"
        cardType="relations" />
    </div>
  </div>
</template>

<script setup>
  import RepoItem from '../shared/RepoItem.vue'

  const props = defineProps({
    namespacePath: String,
    datasets: Array
  })
</script>
