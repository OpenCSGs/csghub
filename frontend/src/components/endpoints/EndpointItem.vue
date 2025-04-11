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
    <div class="flex xs:flex-wrap justify-between items-start gap-2 px-4 mb-3">
      <div class="flex items-center gap-2 text-sm leading-snug text-gray-500 w-1/2 xs:w-full">
        <span class="flex items-center gap-1 max-w-full">
          <img src="/images/icons/model_gray.svg" 
               class="w-3 h-3 flex-shrink-0"
               :style="'filter: invert(60%) sepia(9%) saturate(374%) hue-rotate(175deg) brightness(93%) contrast(92%);'"
               alt=""
               onerror="this.style.display='none'" />
          <span class="truncate">{{ endpoint.model_id || '未指定模型' }}</span>
        </span>
      </div>
      <div class="flex flex-row gap-2 text-sm leading-snug text-gray-500 w-1/2 xs:w-full justify-end xs:justify-start overflow-hidden">
        <span v-if="endpoint.repo_tag" class="flex items-center gap-1 min-w-0">
          <img :src="'/images/tags/' + endpoint.repo_tag + '.svg'"
               class="w-3 h-3"
               :style="'filter: invert(60%) sepia(9%) saturate(374%) hue-rotate(175deg) brightness(93%) contrast(92%);'"
               alt=""
               onerror="this.style.display='none'" />
          <span class="truncate w-full">{{ endpoint.repo_tag }}</span>
        </span>
        <span v-if="endpoint.repo_tag && (endpoint.provider || endpoint.resource_type)" class="flex-shrink-0">·</span>
        <span v-if="endpoint.provider" class="truncate min-w-0 max-w-[30%]">{{ endpoint.provider }}</span>
        <span v-if="endpoint.provider && endpoint.resource_type" class="flex-shrink-0">·</span>
        <span v-if="endpoint.resource_type" class="truncate min-w-0 max-w-[30%]">{{ endpoint.resource_type }}</span>
      </div>
    </div>
    <div class="rounded-b-xl border-t text-sm leading-snug text-gray-500 bg-gray-50 flex justify-between">
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
