<template>
  <div class="py-5 mb-4 overflow-scroll">
    <div class="mt-3 md:px-5">
      <div
        class="flex flex-col gap-1 h-fit p-4 min-w-[492px] w-fit md:w-full md:min-w-full border border-gray-200 rounded-xl"
      >
        <div class="flex items-center text-sm text-gray-700 font-medium">
          <SvgIcon
            name="space_endpoint"
            class="w-4 h-4 mr-2"
          />
          {{ $t('application_spaces.endpointUrl') }}
        </div>
        <p
          class="w-full h-fit leading-[22px] text-gray-500 text-sm flex items-center justify-between"
        >
          {{ appEndpoint }}
          <SvgIcon
            name="copy"
            class="w-4 h-4 cursor-pointer"
            @click="copyText(appEndpoint)"
          />
        </p>
      </div>
    </div>
    <McpSpaceExample :appEndpoint="appEndpoint" />
  </div>
</template>

<script setup>
  import { copyToClipboard } from '@/packs/clipboard'
  import McpSpaceExample from './McpSpaceExample.vue'

  const props = defineProps({
    appEndpoint: String
  })

  const copyText = (text) => {
    copyToClipboard(text)
  }
</script>
