<template>
  <div
    v-if="reposData.repository_type === 'space'"
    class="w-full xl:flex-col xl:pl-4 md:pl-0 flex flex-wrap gap-2"
  >
    <application-space-item
      :repo="reposData"
      :repo-type="reposData.repository_type"
      :isCollection="true"
    />
  </div>
  <div
    v-else
    class="w-full xl:flex-col xl:w-full flex flex-wrap justify-between gap-y-2 mb-2"
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
