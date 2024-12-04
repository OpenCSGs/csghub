<template>
  <div class="p-[16px] border-t border-[#EBEEF5]">
    <h3 class="flex items-center gap-[8px]">
      <SvgIcon
        name="prompts_relations_library"
        width="18px"
        height="18px"
      />
      <span class="font-[500] text-[#344054] text-[16px] leading-[24px]">
        {{ $t('prompts.relationPrompts') }}
      </span>
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
          class="rounded-md text-[#344054] border border-gray-300 bg-white py-0.5 pr-2.5 pl-1.5"
        >
          {{ prompt.path }}
        </p>
      </a>

      <div v-if="thePrompts.more">
        <div
          class="font-normal text-[#667085] cursor-pointer hover:text-[#3250BD]"
          @click="thePrompts.isExpanded = !thePrompts.isExpanded"
          v-show="!thePrompts.isExpanded"
        >
          {{ $t('prompts.openUp') }}
          <el-icon>
            <arrow-down />
          </el-icon>
        </div>
        <div
          class="font-normal text-[#667085] cursor-pointer hover:text-[#3250BD]"
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
