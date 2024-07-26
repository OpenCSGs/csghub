<template>
  <div
    v-if="reposData.repository_type === 'space'"
    class="w-full xl:flex-col xl:pl-4 md:pl-0 flex flex-wrap gap-4 mt-[16px]"
  >
    <application-space-item
      :repo="reposData"
      :repo-type="reposData.repository_type"
      :isCollection="true"
    />
  </div>
  <div
    v-else
    class="w-full xl:flex-col xl:w-full flex flex-wrap justify-between gap-y-4 mb-4 mt-[16px]"
  >
    <repo-item
      :repo="reposData"
      :repo-type="reposData.repository_type"
      :isCollection="true"
    />
  </div>
</template>
<script setup>
  import { ref, computed } from 'vue'
  import RepoItem from '../shared/RepoItem.vue'
  import ApplicationSpaceItem from '../application_spaces/ApplicationSpaceItem.vue'
  const props = defineProps({
    reposData: Object
  })
</script>
