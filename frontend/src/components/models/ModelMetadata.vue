<template>
  <div class="p-4 border-t border-gray-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1">
        <SvgIcon
          :name="`metadata_${framework}`"
          width="16"
          height="16"
        />
        <span class="font-medium text-gray-700 text-md leading-6">
          {{ framework }}
        </span>
      </div>
      <div
        v-if="framework === 'GGUF'"
        class="flex items-center gap-2"
      >
        <MetaItem
          :title="$t('models.metadata.modelSize')"
          :value="data.model_params"
          :params="true"
        />
        <MetaItem
          :title="$t('models.metadata.architecture')"
          :value="data.architecture"
        />
      </div>
    </div>
    <div
      v-if="framework === 'Safetensors'"
      class="flex items-center gap-2 mt-4"
    >
      <MetaItem
        :title="$t('models.metadata.modelSize')"
        :value="data.model_params"
        :params="true"
      />
      <MetaItem
        :title="$t('models.metadata.tensorType')"
        :value="data.tensor_type"
      />
    </div>
    <div
      v-if="
        framework === 'GGUF' &&
        data.quantizations &&
        data.quantizations.length > 0
      "
      class="mt-4"
    >
      <div
        v-for="quantization in quantizations"
        :key="quantization.version"
        class="flex items-center justify-between gap-4 py-2 text-gray-500 text-sm border-b border-gray-300 last:border-b-0"
      >
        <div class="w-10">{{ quantization.version }}</div>
        <div class="flex flex-1 items-center gap-2 flex-wrap justify-end">
          <MetaItem
            v-for="type in getQuantizationTypes(quantization)"
            :key="type"
            :title="type"
            :value="quantization.mini_gpu_memory_gb"
            :quantization="true"
          />
        </div>
      </div>
      <div
        class="flex justify-end mt-2"
        v-if="moreFiles"
      >
        <div
          class="rounded-sm border border-gray-300 text-gray-700 text-xs inline-flex justify-center items-center px-[6px] py-[2px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer hover:bg-gray-50"
          @click="goToFiles"
        >
          {{ $t('all.view') }} +{{ moreFilesCount }} {{ $t('all.files') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import MetaItem from './metadata/MetaItem.vue'

  const props = defineProps({
    framework: String,
    data: Object,
    namespacePath: String,
    currentBranch: String
  })

  const MORE_QUANTIZATIONS_LIMIT = 7

  const quantizations = computed(() => {
    const qs = props.data.quantizations
    if (qs && qs.length > 0) {
      return qs
        .sort((a, b) => {
          const aNum = parseInt(a.version.split('-')[0])
          const bNum = parseInt(b.version.split('-')[0])
          return aNum - bNum
        })
        .slice(0, MORE_QUANTIZATIONS_LIMIT)
    }
    return []
  })

  const moreFiles = computed(() => {
    return (
      props.data.quantizations &&
      props.data.quantizations.length > MORE_QUANTIZATIONS_LIMIT
    )
  })

  const moreFilesCount = computed(() => {
    return (
      props.data.quantizations &&
      props.data.quantizations.length - MORE_QUANTIZATIONS_LIMIT
    )
  })

  const getQuantizationTypes = (quantization) =>
    quantization.type ? quantization.type.split('/') : []

  const goToFiles = () => {
    window.location.href = `/models/${props.namespacePath}/files/${props.currentBranch}`
  }
</script>
