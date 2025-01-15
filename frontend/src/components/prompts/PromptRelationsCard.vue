<template>
  <div class="p-4 border-t border-gray-200">
    <h3 class="flex items-center gap-2">
      <SvgIcon
        name="prompts_relations_library"
        width="18px"
        height="18px"
      />
      <span class="font-medium text-gray-700 text-md leading-6">
        {{ $t('prompts.relationPrompts') }}
      </span>
      <span class="text-gray-500"> {{ prompts.length }} </span>
    </h3>
    <div
      class="flex items-center mt-4 gap-3 w-full flex-wrap overflow-hidden"
      v-if="thePrompts.length"
    >
      <a
        v-for="prompt in showPrompts"
        :href="`/prompts/library/${prompt.path}`"
      >
        <p
          class="rounded-sm text-sm text-gray-700 border border-gray-300 bg-white py-1 px-2 hover:bg-gray-50"
        >
          {{ prompt.path }}
        </p>
      </a>

      <div v-if="thePrompts.more">
        <div
          class="font-normal text-gray-500 cursor-pointer hover:text-brand-600"
          @click="thePrompts.isExpanded = !thePrompts.isExpanded"
          v-show="!thePrompts.isExpanded"
        >
          {{ $t('prompts.openUp') }}
          <el-icon>
            <arrow-down />
          </el-icon>
        </div>
        <div
          class="font-normal text-gray-500 cursor-pointer hover:text-brand-600"
          @click="thePrompts.isExpanded = !thePrompts.isExpanded"
          v-show="thePrompts.isExpanded"
        >
          {{ $t('prompts.closeUp') }}
          <el-icon>
            <arrow-up />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, computed } from 'vue'

  const props = defineProps({
    namespacePath: String,
    prompts: Array
  })

  const thePrompts = ref(props.prompts)

  const showPrompts = computed(() => {
    if (thePrompts.value.data) {
      return thePrompts.value.data.length <= 6 || thePrompts.value.isExpanded
        ? thePrompts.value.data
        : thePrompts.value.data.slice(0, 6)
    } else {
      return []
    }
  })

  onMounted(() => {
    const { length } = props.prompts
    thePrompts.value.data = props.prompts
    thePrompts.value.more = length > 6
    thePrompts.value.isExpanded = length <= 6
  })
</script>
