<template>
  <div class="h-[50vh] py-[32px] flex flex-col items-center justify-center sm:px-[20px]">
    <p v-if="['Building','Deploying','Startup'].includes(appStatus)"
       class="text-gray-700 text-md"
    >
       <Loading :loadingText="$t('application_spaces.buildDesc')"/>
    </p>

    <p v-if="['DeployFailed','BuildingFailed','RuntimeError'].includes(appStatus)"
       class="text-gray-700 text-md"
    >
       {{ $t('application_spaces.errorDesc') }}
       <p v-if="canWrite"
          class="text-brand-700 font-[400] text-xs mt-[12px] cursor-pointer"
          @click="showLogs"
       >
         {{ $t('application_spaces.errorPage.showErrorLogs') }}
       </p>
    </p>
  </div>
</template>

<script setup>
  import Loading from '../loading/loading.vue'
  const props = defineProps({
    appStatus: String,
    canWrite: Boolean
  })

  const emit = defineEmits(['showSpaceLogs']);

  const showLogs = () => {
    emit('showSpaceLogs')
  }
</script>