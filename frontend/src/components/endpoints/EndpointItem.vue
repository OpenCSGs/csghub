<template>
  <a
    :href="`/endpoints/${endpoint.model_id}/${endpoint.deploy_id}`"
    class="focus:outline focus:outline-4 focus:outline-gray-200 hover:shadow-md border border-gray-200 rounded-xl pt-4 w-full"
  >
    <div class="flex justify-between items-center mb-2 px-4">
      <div class="w-full flex items-center justify-between">
        <h3 class="flex-1 text-gray-700 text-md font-normal leading-6 truncate mr-[8px]">
          {{ endpoint.deploy_name }}
        </h3>
        <div class="flex gap-2">
          <AppPayMode :payMode="endpoint.pay_mode" />
          <AppStatus :appStatus="endpoint.status" :spaceResource="endpoint.hardware" />
        </div>
      </div>
    </div>
    <div class="flex  gap-2 text-sm leading-snug text-[#606266] mb-3 px-4">
      <span>image segmentation</span>
      <span>·</span>
      <span>{{ endpoint.provider }}</span>
      <span>·</span>
      <span>8x Intel Sanpppp</span>
    </div>
    <div class="rounded-b-xl border-t text-sm leading-snug text-gray-500 bg-[#F9FBFA] flex justify-between">
      <div class="px-4 py-2">{{ theEndpoint }}</div>
      <div @click="copyUrl" v-if="endpoint.status === 'Running'" class="bg-white border-l rounded-br-xl p-2">
        <SvgIcon name="copy" />
      </div>
    </div>
  </a>
</template>

<script setup>
  import { computed } from "vue"
  import AppStatus from "../application_spaces/AppStatus.vue";
  import AppPayMode from "../application_spaces/AppPayMode.vue";
  import { copyToClipboard } from "../../packs/clipboard";

  const props = defineProps({
    endpoint: Object,
    namespace: String
  })

  const copyUrl = (event) => {
    event.preventDefault()
    copyToClipboard(props.endpoint.endpoint)
  }

  const theEndpoint = computed(() => {
    if (props.endpoint?.status == 'Running'&& props.endpoint?.endpoint){
      return props.endpoint.endpoint 
    }else{
      return 'Not running'
    }
  })
</script>
