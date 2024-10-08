<template>
  <div class="h-[50vh] py-[32px] flex flex-col items-center justify-center sm:px-[20px]">
    <p v-if="['Building','Deploying','Startup'].includes(appStatus)"
       class="text-[#6B7280] text-[16px]"
    >
       {{ $t('application_spaces.buildDesc') }}
    </p>

    <p v-if="['DeployFailed','BuildingFailed','RuntimeError'].includes(appStatus)"
       class="text-[#6B7280] text-[16px]"
    >
       {{ $t('application_spaces.errorDesc') }}
       <p v-if="canWrite"
          class="text-brand-700] font-[400] text-[12px] mt-[12px] cursor-pointer"
          @click="showLogs"
       >
         {{ $t('application_spaces.errorPage.showErrorLogs') }}
       </p>
    </p>
  </div>
</template>

<script setup>
  const props = defineProps({
    appStatus: String,
    canWrite: Boolean
  })

  const emit = defineEmits(['showSpaceLogs']);

  const showLogs = () => {
    emit('showSpaceLogs')
  }
</script>