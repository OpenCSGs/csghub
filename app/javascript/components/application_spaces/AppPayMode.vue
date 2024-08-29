<template>
  <span
    class="px-[8px] py-[3px] flex items-center justify-center border rounded-md text-[#344054] text-[12px]"
    >{{ thePayMode }}
  </span>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    payMode: String
  })
  const thePayMode = computed(() => {
    switch (props.payMode) {
      case 'free':
        return t('resourceConsole.free')
      case 'minute':
        return t('resourceConsole.minute')
      case 'year':
      case 'month':
        return t('resourceConsole.yearMonth')
      default:
        return t('resourceConsole.others')
    }
  })
</script>
