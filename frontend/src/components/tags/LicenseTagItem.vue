<template>
  <span
    class="text-sm text-gray-700 px-[8px] py-[3px] rounded-sm cursor-pointer flex items-center gap-[4px] border border-gray-200"
    :data-tag_name="tag.name"
    :style="setLicenseTagColor()"
    @click="emit('handleTagClick', 'license', tag.name)">
    <svg
      data-v-c2f76755=""
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none">
      <path
        data-v-c2f76755=""
        d="M6 2.99995V11M6 2.99995H4.28328C4.17763 2.99995 4.12481 2.99995 4.07307 3.00719C4.02712 3.01362 3.98186 3.02431 3.93789 3.0391C3.88837 3.05576 3.84112 3.07939 3.74663 3.12664L3 3.49995M6 2.99995H7.71672C7.82237 2.99995 7.87519 2.99995 7.92693 3.00719C7.97288 3.01362 8.01814 3.02431 8.06211 3.0391C8.11163 3.05576 8.15888 3.07939 8.25337 3.12664L9 3.49995M6 2.99995V1M6 11H8.5M6 11H3.5M1 3.99995H1.71672C1.82237 3.99995 1.87519 3.99995 1.92693 3.9927C1.97288 3.98627 2.01814 3.97559 2.06211 3.96079C2.11163 3.94413 2.15888 3.92051 2.25337 3.87326L3 3.49995M11 3.99995H10.2833C10.1776 3.99995 10.1248 3.99995 10.0731 3.9927C10.0271 3.98627 9.98186 3.97559 9.93789 3.96079C9.88837 3.94413 9.84112 3.92051 9.74663 3.87326L9 3.49995M3 3.49995L1.93102 7.06321C1.80356 7.48809 1.73982 7.70054 1.76796 7.87165C1.80739 8.11139 1.9605 8.31718 2.1788 8.42383C2.33461 8.49995 2.55641 8.49995 3 8.49995V8.49995C3.44359 8.49995 3.66539 8.49995 3.8212 8.42383C4.0395 8.31718 4.19261 8.11139 4.23204 7.87165C4.26018 7.70054 4.19644 7.48809 4.06898 7.06321L3 3.49995ZM9 3.49995L7.93102 7.06321C7.80356 7.48809 7.73982 7.70054 7.76796 7.87165C7.80739 8.11139 7.9605 8.31718 8.1788 8.42383C8.33461 8.49995 8.55641 8.49995 9 8.49995V8.49995V8.49995C9.44359 8.49995 9.66539 8.49995 9.8212 8.42383C10.0395 8.31718 10.1926 8.11139 10.232 7.87165C10.2602 7.70054 10.1964 7.48809 10.069 7.06321L9 3.49995Z"
        :stroke="active ? 'white' : '#606266'"
        stroke-linecap="round"
        stroke-linejoin="round"></path>
    </svg>
    {{ tagName }}
  </span>
</template>

<script setup>
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    tag: Object,
    active: Boolean
  })

  const emit = defineEmits(['handleTagClick'])

  const { locale } = useI18n()

  const setLicenseTagColor = () => {
    if (props.active) {
      return 'color: white; background-color: #4D6AD6'
    } else {
      return `color: #303133`
    }
  }

  const tagName = computed(() => {
    if (locale.value === 'en') {
      return props.tag.name.replace(/-/g, ' ')
    } else {
      return props.tag.show_name || props.tag.zh_name || props.tag.name.replace(/-/g, ' ')
    }
  })
</script>
