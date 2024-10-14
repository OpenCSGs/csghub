<template>
  <a
    :href="detailLink"
    :class="`${repoType}-card  hover:active-${repoType}-card `"
    class="focus:outline focus:outline-4 focus:outline-gray-200 hover:shadow-md p-4 mlg:w-full border border-gray-200 rounded-xl"
  >
    <div class="flex items-center justify-between mb-1">
      <div
        :class="`${repoType}-path`"
        class="text-md text-gray-700 font-normal text-ellipsis overflow-hidden whitespace-nowrap"
      >
        {{ repo.deploy_name }}
      </div>
      <div class="flex gap-2">
        <AppPayMode :payMode="repo.pay_mode"/>
        <AppStatus
          :appStatus="repo.status || 'NoAppFile'"
          :spaceResource="repo.hardware"
        />
      </div>
    </div>

    <div
      class="flex flex-nowrap overflow-hidden text-ellipsis items-center gap-[8px] text-xs text-gray-500"
    >
      <div class="overflow-hidden text-ellipsis whitespace-nowrap">
        {{ repo.model_id }} {{ repo.updated_at.substring(0, 10) }}
      </div>
    </div>
  </a>
</template>

<script setup>
  import { computed } from 'vue'
  import AppStatus from '../application_spaces/AppStatus.vue'
  import AppPayMode from '../application_spaces/AppPayMode.vue'

  const props = defineProps({
    repo: Object,
    repoType: String,
    cardType: {
      type: String,
      default: 'index'
    }
  })

  const detailLink = computed(() => {
    return `/finetune/${props.repo.model_id}/${props.repo.deploy_name}/${props.repo.deploy_id}`
  })
</script>
