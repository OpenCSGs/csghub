<template>
  <div class="h-[50vh] py-[32px] flex flex-col items-center justify-center sm:px-[20px]">
    <p v-if="appStatus === 'Stopped'"
       class="text-gray-700 text-[16px]"
    >
       {{ $t('application_spaces.stoppedDesc') }}
   </p>

    <p v-if="appStatus === 'Sleeping'"
       class="text-gray-700 text-[16px]"
    >
       {{ $t('application_spaces.sleepingDesc') }}
    </p>

    <button v-if="isStopped && canWrite"
            class="border border-brand-600 bg-brand-600 rounded-md shadow-xs px-[16px] py-[10px] text-white font-[500] text-[16px] leading-[24px] mt-[24px]"
            @click="startSpace"
    >
      {{ $t('application_spaces.restart') }}
    </button>

    <button v-if="isSleeping"
            class="border border-brand-600 bg-brand-600 rounded-md shadow-xs px-[16px] py-[10px] text-white font-[500] text-[16px] leading-[24px] mt-[24px]"
            @click="wakeupSpace"
    >
      {{ $t('application_spaces.wakeup') }}
    </button>
  </div>
</template>

<script setup>
  import { computed, inject  } from 'vue';
  import { useCookies } from 'vue3-cookies'
  import { useI18n } from 'vue-i18n'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import refreshJWT from '../../packs/refreshJWT.js'
  import useFetchApi from '../../packs/useFetchApi'

  const props = defineProps({
    path: String,
    appStatus: String,
    canWrite: Boolean
  })

  const csghubServer = inject('csghubServer')

  const isStopped = computed(() => {
    return props.appStatus === 'Stopped' ? true : false
  })

  const isSleeping = computed(() => {
    return props.appStatus === 'Sleeping' ? true : false
  })

  const { cookies } = useCookies()
  const { t } = useI18n()

  async function startSpace() {
    const startUrl = `/spaces/${props.path}/run`
    const { error } = await useFetchApi(startUrl).post().json()

    if (!error.value) {
      ElMessage({message: t('application_spaces.errorPage.startSuccess'), type: "success"})
    } else {
      ElMessage({ message: error.value, type: 'warning' })
    }
  }

  async function wakeupSpace() {
    const wakeUrl = `/spaces/${props.path}/wakeup`
    const { error } = await useFetchApi(wakeUrl).post().json()

    if (!error.value) {
      ElMessage({message: t('application_spaces.errorPage.startSuccess'), type: "success"})
    } else {
      ElMessage({ message: error.value, type: 'warning' })
    }
  }
</script>