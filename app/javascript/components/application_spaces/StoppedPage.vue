<template>
  <div class="h-[50vh] py-[32px] flex flex-col items-center justify-center sm:px-[20px]">
    <p v-if="appStatus === 'Stopped'"
       class="text-[#6B7280] text-[16px]"
    >
       {{ $t('application_spaces.stoppedDesc') }}
   </p>

    <p v-if="appStatus === 'Sleeping'"
       class="text-[#6B7280] text-[16px]"
    >
       {{ $t('application_spaces.sleepingDesc') }}
    </p>

    <button v-if="isStopped && canWrite"
            class="border border-[#3250BD] bg-[#3250BD] rounded-[8px] shadow-xs px-[16px] py-[10px] text-white font-[500] text-[16px] leading-[24px] mt-[24px]"
            @click="startSpace"
    >
      {{ $t('application_spaces.restart') }}
    </button>

    <button v-if="isSleeping"
            class="border border-[#3250BD] bg-[#3250BD] rounded-[8px] shadow-xs px-[16px] py-[10px] text-white font-[500] text-[16px] leading-[24px] mt-[24px]"
            @click="wakeupSpace"
    >
      {{ $t('application_spaces.wakeup') }}
    </button>
  </div>
</template>

<script setup>
  import { computed  } from 'vue';
  import { useCookies } from 'vue3-cookies'
  import { useI18n } from 'vue-i18n'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import refreshJWT from '../../packs/refreshJWT.js'

  const props = defineProps({
    path: String,
    appStatus: String,
    canWrite: Boolean
  })

  const isStopped = computed(() => {
    return props.appStatus === 'Stopped' ? true : false
  })

  const isSleeping = computed(() => {
    return props.appStatus === 'Sleeping' ? true : false
  })

  const { cookies } = useCookies()
  const { t } = useI18n()

  async function startSpace() {
    const startUrl = `${csghubServer}/api/v1/spaces/${props.path}/run`
    const response = await fetch(startUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.get('user_token')}`,
      }
    })

    if (response.ok) {
      ElMessage({message: t('application_spaces.errorPage.startSuccess'), type: "success"})
    } else {
      if (response.status === 401) {
        refreshJWT()
      } else {
        response.json().then(data => {
          ElMessage({
            message: data.msg,
            type: 'warning'
          })
        })
      }
    }
  }

  async function wakeupSpace() {
    const wakeUrl = `${csghubServer}/api/v1/spaces/${props.path}/wakeup`
    const response = await fetch(wakeUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookies.get('user_token')}`,
      }
    })

    if (response.ok) {
      ElMessage({message: t('application_spaces.errorPage.startSuccess'), type: "success"})
    } else {
      if (response.status === 401) {
        refreshJWT()
      } else {
        response.json().then(data => {
          ElMessage({
            message: data.msg,
            type: 'warning'
          })
        })
      }
    }
  }
</script>../../packs/refreshJWT.js