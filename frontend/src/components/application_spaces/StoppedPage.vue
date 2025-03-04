<template>
  <div class="h-[50vh] py-8 flex flex-col items-center justify-center sm:px-5">
    <p v-if="appStatus === 'Stopped'"
       class="text-gray-700 text-md"
    >
       {{ $t('application_spaces.stoppedDesc') }}
   </p>

    <p v-if="appStatus === 'Sleeping'"
       class="text-gray-700 text-md"
    >
       {{ $t('application_spaces.sleepingDesc') }}
    </p>

    <CsgButton v-if="isStopped && canWrite"
            class="btn btn-primary btn-md mt-6"
            @click="startSpace"
            :name="$t('application_spaces.restart')"
    />

    <CsgButton v-if="isSleeping"
            class="btn btn-primary btn-md mt-6"
            @click="wakeupSpace"
            :name="$t('application_spaces.wakeup')"
    />

  </div>
</template>

<script setup>
  import { computed, inject  } from 'vue';
  import { useCookies } from 'vue3-cookies'
  import { useI18n } from 'vue-i18n'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import refreshJWT from '../../packs/refreshJWT.js'
  import useFetchApi from '../../packs/useFetchApi'
import CsgButton from '../shared/CsgButton.vue';

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