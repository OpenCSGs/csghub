<template>
  <div class="p-4 border-t border-gray-200">
    <h3 class="flex items-center gap-2">
      <SvgIcon name="datasets" width="18px" height="18px" />
      <span class="font-medium text-gray-700 text-md leading-6">
        {{ $t('datasets.associated') }}
      </span>
      <span class="text-gray-500"> {{ datasets.length }} </span>
    </h3>
    <div class="mt-4 flex flex-col gap-3">
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
