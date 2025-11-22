<template>
  <a
    @click.prevent="detailLink"
    class="focus:outline focus:outline-4 focus:outline-gray-200 hover:shadow-md border border-gray-200 rounded-xl pt-4 w-full  cursor-pointer"
  >
    <div class="flex justify-between items-center mb-2 px-4">
      <div class="w-full flex items-center justify-between">
        <h3 class="flex-1 text-gray-700 text-md font-normal leading-6 truncate mr-[8px]">
          {{ notebook.deploy_name }}
        </h3>
        <div class="flex gap-2">
          <AppPayMode :payMode="notebook.pay_mode" />
          <AppStatus :appStatus="notebook.status" :spaceResource="notebook.hardware" />
        </div>
      </div>
    </div>
    <div class="flex xs:flex-wrap justify-between items-start gap-2 px-4 mb-3">
      <div class="flex items-center gap-2 text-sm leading-snug text-gray-500 xs:w-full">
        <span class="flex items-center gap-1 max-w-full">
          <img src="/images/icons/model_gray.svg" 
               class="w-3 h-3 flex-shrink-0"
               :style="'filter: invert(60%) sepia(9%) saturate(374%) hue-rotate(175deg) brightness(93%) contrast(92%);'"
               alt=""
               onerror="this.style.display='none'" />
          <span class="truncate">{{ notebook.runtime_framework + ' ' + notebook.runtime_framework_version || '未指定模型' }} | {{ notebook.resource_name }}</span>
        </span>
      </div>
      <!-- <div class="flex flex-row gap-2 text-sm leading-snug text-gray-500 w-1/2 xs:w-full justify-end xs:justify-start overflow-hidden">
        <span v-if="notebook.repo_tag" class="flex items-center gap-1 min-w-0">
          <img :src="'/images/tags/' + notebook.repo_tag + '.svg'"
               class="w-3 h-3"
               :style="'filter: invert(60%) sepia(9%) saturate(374%) hue-rotate(175deg) brightness(93%) contrast(92%);'"
               alt=""
               onerror="this.style.display='none'" />
          <span class="truncate w-full">{{ notebook.repo_tag }}</span>
        </span>
        <span v-if="notebook.repo_tag && (notebook.provider || notebook.resource_type)" class="flex-shrink-0">·</span>
        <span v-if="notebook.provider" class="truncate min-w-0 max-w-[30%]">{{ notebook.provider }}</span>
        <span v-if="notebook.provider && notebook.resource_type" class="flex-shrink-0">·</span>
        <span v-if="notebook.resource_type" class="truncate min-w-0 max-w-[30%]">{{ notebook.resource_type }}</span>
        <span v-if="notebook.resource_name" class="truncate min-w-0 max-w-[30%]">{{ notebook.resource_name }}</span>
      </div> -->
    </div>
    <div class="rounded-b-xl border-t text-sm leading-snug text-gray-500 bg-gray-50 flex justify-between">
      <div class="px-4 py-2">{{ theNotebook }}</div>
      <div @click.stop="copyUrl" v-if="notebook.status === 'Running' && notebook.endpoint" class="bg-white border-l rounded-br-xl p-2">
        <SvgIcon name="copy" />
      </div>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import AppStatus from "../application_spaces/AppStatus.vue";
import AppPayMode from "../application_spaces/AppPayMode.vue";
import { copyToClipboard } from "../../packs/clipboard";

const props = defineProps({
  notebook: Object
})

const copyUrl = (event) => {
  event.preventDefault()
  if (props.notebook?.endpoint) {
    copyToClipboard(props.notebook.endpoint)
  }
}

const theNotebook = computed(() => {
  if (props.notebook?.status == 'Running' && props.notebook?.endpoint){
    return props.notebook.endpoint 
  }else{
    return 'Not running'
  }
})

const detailLink = () => {
  if (props.notebook?.id) {
    window.location.href = `/notebooks/${props.notebook.id}`
  } else if (props.notebook?.deploy_id) {
    window.location.href = `/notebooks/${props.notebook.deploy_id}`
  } else {
    window.location.href = `/notebooks`
  }
}
</script>
