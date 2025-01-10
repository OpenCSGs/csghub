<template>
  <span class="text-sm text-gray-700 px-[8px] py-[3px] rounded-sm cursor-pointer flex items-center gap-[3px] border border-gray-300"
        :class="{ 'bg-brand-500': active, 'text-white': active, 'border-brand-500': active }"
        @click="emit('handleTagClick', 'task', tag)">
    <img :src="'/images/tags/' + tag.name + '.svg'"
         class="w-[14px] h-[14px]"
         :style="active ? 'filter: drop-shadow(1000px 0 0 white); transform: translate(-1000px);' : ''"
         alt=""
         onerror="this.style.display='none'" />
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

  const { locale } = useI18n()

  const tagName = computed(() => {
    return locale.value === 'en' ? props.tag.name.replace(/-/g, ' ') : props.tag.show_name || props.tag.zh_name
  })

  const emit = defineEmits(['handleTagClick'])
</script>
