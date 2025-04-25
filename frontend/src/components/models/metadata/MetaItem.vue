<template>
  <div
    class="rounded-md border border-gray-300 inline-flex justify-center items-center"
    :class="{
      'gap-[3px] px-2 py-[3px]': !quantization,
      'px-[6px] py-[2px]': quantization
    }"
  >
    <div
      class="text-xs"
      :class="{ 'text-gray-700': quantization, 'text-gray-500': !quantization }"
    >
      {{ title }}
    </div>
    <SvgIcon name="vertical_divider2" />
    <div
      class="text-xs"
      :class="{
        'text-gray-400': quantization,
        'text-gray-700 font-medium': !quantization
      }"
    >
      {{ formattedValue }}
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    title: String,
    value: String,
    quantization: {
      type: Boolean,
      default: false
    },
    params: {
      type: Boolean,
      default: false
    }
  })

  const formattedValue = computed(() => {
    let result = `${props.value}`

    if (props.params) {
      result += 'B params'
    } else if (props.quantization) {
      result += ' GB'
    }

    return result
  })
</script>
