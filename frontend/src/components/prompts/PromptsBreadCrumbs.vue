<template>
  <div class="w-full bg-[#FFFFFF] text-[#475467] md:border-b border-[#EAECF0] px-8 md:px-[50px] sm:px-[20px] py-[10px] flex gap-2 items-center text-sm relative">
    <PromptsMobileMenu />
    <div class="hidden md:flex">
      /
    </div>
    <div class="flex gap-2" :class="{ 'md:hidden': title }">
      <a :href="firstHref" 
         class="hover:text-[#3250BD]"
         :class="{ 'text-[#344054] font-medium': !title }"
      >
        {{ $t(firstHrefName) }}
      </a>
      <a
        :href="`/prompts/library/${path}`"
        class="flex gap-2"
        v-if="path"
      >
        <span>/</span>
        <span class="hover:text-[#3250BD]">
          {{ pathTitle }}
        </span>
      </a>
      <div
        class="flex gap-2"
        v-if="title"
      >
        <span>/</span>
        <span @click="redirectPromptsList" class="hover:text-[#3250BD] cursor-pointer text-[#344054] font-medium">{{ title }}</span>
      </div>
    </div>
    <div v-if="title" class="hidden md:flex gap-2">
      <a :href="!pathTitle ? '/prompts/library': `/prompts/library/${path}`" 
         class="hover:text-[#3250BD]" 
      >
        ...
      </a>
         /
      <span @click="redirectPromptsList" class="hover:text-[#3250BD] text-[#344054] cursor-pointer font-medium">
        {{ title }}
      </span>
    </div>
    <div v-if="currentComponent == 'newPromptsList'" class="flex gap-2">
      <span>/</span>
      {{ $t('prompts.newPromptsList') }}
    </div>
    <div v-if="currentComponent == 'promptsListSettings'" class="flex gap-2">
      <span>/</span>
      {{ $t('prompts.settings') }}
    </div>
    <div v-if="currentComponent == 'newPrompt'" class="flex gap-2">
      <span>/</span>
      {{ $t('prompts.newPrompt') }}
    </div>
    <div v-if="currentComponent == 'editPrompt'" class="flex gap-2">
      <span>/</span>
      {{ $t('prompts.editPrompt') }}
    </div>
  </div>
</template>

<script setup>
  import PromptsMobileMenu from './PromptsMobileMenu.vue';
  const props = defineProps({
    firstHref: String,
    firstHrefName: String,
    title: String,
    namespace: String,
    name: String,
    path: String,
    pathTitle: String,
    filePath: String,
    currentComponent: String
  })

  const redirectPromptsList = () => {
    if (props.path) {
      window.location.href = `/prompts/library/${props.path}/${props.title}`
    } else {
      window.location.href = `/prompts/library/${props.namespace}/${props.name}`
    }
  }
</script>
