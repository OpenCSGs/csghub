<template>
  <div class="h-[50vh] py-8 flex flex-col items-center justify-center sm:px-5">
    <p v-if="['Building','Deploying','Startup'].includes(appStatus)"
       class="text-gray-700 text-md"
    >
       <InstanceInBuilding :loadingText="$t('application_spaces.buildDesc')"/>
    </p>

    <p v-if="['DeployFailed','BuildingFailed','RuntimeError'].includes(appStatus)"
       class="text-gray-700 text-md"
    >
       {{ $t('application_spaces.errorDesc') }}
       <CsgButton v-if="canWrite"
          class="btn btn-primary btn-sm mt-6"
          @click="showLogs"
          :name="$t('application_spaces.errorPage.showErrorLogs')"
       />
    </p>
  </div>
</template>

<script setup>
  import InstanceInBuilding from '../shared/InstanceInBuilding.vue';

  const props = defineProps({
    appStatus: String,
    canWrite: Boolean
  })

  const emit = defineEmits(['showSpaceLogs']);

  const showLogs = () => {
    emit('showSpaceLogs')
  }
</script>