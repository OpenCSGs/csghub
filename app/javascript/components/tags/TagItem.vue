<template>
  <span class="text-[14px] text-[#344054] cursor-pointer flex items-center">
    <div class="px-[8px] py-[6px] bg-[#F0F3FF] border border-r-0 border-[#D0D5DD] rounded-l-[6px]">
      <img 
        :src="'/images/tags/' + tag.name + '.svg'"
        class="w-[14px] h-[14px]"
        alt=""
        onerror="this.style.display='none'" 
      />
    </div>
    <p 
      class="h-[28px] pl-[4px] pr-[8px] py-[3px] border border-[#D0D5DD] rounded-r-[6px]"
      @click="emit('handleTagClick', tag)"
      :class="{ 'bg-[#4D6AD6]': active, 'text-white': active, 'border-[#4D6AD6]': active }"
    >
      {{ tagName }}
    </p>
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
