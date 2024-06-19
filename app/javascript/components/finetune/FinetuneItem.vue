<template>
  <a
    :href="`/finetune/${namespace}/${finetune.deploy_name}/${finetune.deploy_id}`"
    class="focus:outline focus:outline-4 focus:outline-[#EAECF0] hover:shadow-md border border-gray-200 rounded-xl p-4 w-full"
  >
    <div class="flex justify-between items-center mb-1">
      <div class="w-full flex items-center justify-between">
        <h3
          class="flex-1 text-[#303133] font-semibold leading-6 truncate mr-[8px]"
        >
        微调实例名称
        </h3>
        <div class="flex gap-2">
          <span
            class="px-[8px] py-[3px] flex items-center justify-center border rounded-md text-[#344054] text-[12px]"
            >{{ finetune.visibility }}</span
          >
          <AppStatus
            :appStatus="finetune.status || 'NoAppFile'"
            :spaceResource="finetune.hardware"
          />
        </div>
      </div>
    </div>
    <div class="text-sm leading-snug text-[#606266] flex justify-between">
      <p>
        <span class="mr-2">THUDM</span>
        <span class="mr-2">/</span>
        <span>glm-4-9b-chat</span>
      </p>
    </div>
  </a>
</template>

<script setup>
  import { useI18n } from 'vue-i18n'
  import AppStatus from '../application_spaces/AppStatus.vue'

  const props = defineProps({
    finetune: Object,
    namespace: String
  })
</script>
