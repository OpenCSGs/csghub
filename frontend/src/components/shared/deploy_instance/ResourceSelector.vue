<template>
  <div class="w-full">
    <div v-if="Array.isArray(typeList) && typeList.length > 0" class="w-full sm:w-auto flex items-center justify-start gap-1 flex-wrap mb-4">
      <p
        v-for="item in typeList"
        :key="item"
        class="px-3 py-2 cursor-pointer text-md font-medium rounded-sm"
        :class="activeType === item ? 'bg-gray-50 text-gray-700' : 'bg-white text-gray-500'"
        @click="setActiveType(item)"
      >{{ item }}</p>
    </div>

    <div class="w-full grid grid-cols-3 items-center gap-6 mb-2 md:grid-cols-2 sm:grid-cols-1">
      <div
        v-for="item in selResourceList"
        :key="item.id"
        class="group flex flex-col items-center gap-2 text-center p-4 rounded-2xl border relative overflow-hidden"
        :class="[item.is_available ? 'cursor-pointer' : 'cursor-not-allowed', getCardBorderClass(item)]"
        @click="onSelect(item)"
      >
        <i v-if="showIndicator" class="block w-6 h-1 rounded-xs shadow-sm" :class="getIndicatorClass(item)" />
        <i v-else class="block w-6 h-1 rounded-xs bg-gray-400 shadow-sm" />

        <div v-if="showIndicator && isResourceInsufficient(item)" class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out text-sm text-warning-700 px-2.5 py-0.5 bg-warning-50 border border-warning-700 rounded-xl">
            {{ t('endpoints.lowMemory') }}
          </div>
        </div>

        <div v-if="!item.is_available" class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div class="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out text-sm text-gray-500 px-2.5 py-0.5 bg-gray-50 border border-gray-300 rounded-xl">
            {{ t('endpoints.resourceUnavailable') }}
          </div>
        </div>

        <p v-if="showType && getDisplayType(item)" class="text-md font-medium" :class="item.is_available ? 'text-gray-700' : 'text-gray-300'">
          {{ getDisplayType(item) }}
        </p>
        <p class="text-sm leading-5 min-h-[2lh] line-clamp-2 break-words" :class="item.is_available ? 'text-gray-700' : 'text-gray-300'">
          {{ getDisplayName(item) }}
        </p>
        <p
          v-if="showPrice && getDisplayPrice(item)"
          class="text-sm"
          :class="!item.is_available ? 'text-gray-300' : 'text-gray-700'"
        >
          {{ getDisplayPrice(item) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  categoryResources: { type: Array, default: () => [] },
  modelMinGpuMemory: { type: Number, default: 0 },
  selected: { type: [String, Number], default: '' },
  showIndicator: { type: Boolean, default: false },
  // display controls
  showType: { type: Boolean, default: true },
  showPrice: { type: Boolean, default: true },
  displayNameField: { type: String, default: 'name' },
  priceField: { type: String, default: 'priceValue' },
  // value format controls
  valueFormat: { type: String, default: 'pair' }, // 'pair' => `${id}/${order_detail_id}`; 'id' => id
  idField: { type: String, default: 'id' },
  orderDetailField: { type: String, default: 'order_detail_id' }
})

const emit = defineEmits(['update:selected'])
const { t } = useI18n()

const typeList = ref([])
const activeType = ref('')
const selResourceList = ref([])

const updateLists = () => {
  typeList.value = (props.categoryResources || []).map(item => item.label)
  activeType.value = typeList.value[0] || ''
  selResourceList.value = (props.categoryResources || []).find(item => item.label === activeType.value)?.options || []
}

watch(() => props.categoryResources, updateLists, { immediate: true, deep: true })

const setActiveType = (type) => {
  activeType.value = type
  selResourceList.value = (props.categoryResources || []).find(item => item.label === activeType.value)?.options || []
}

const onSelect = (item) => {
  if (!item?.is_available) return
  if (props.valueFormat === 'id') {
    emit('update:selected', item?.[props.idField])
  } else {
    const id = item?.[props.idField]
    const orderId = item?.[props.orderDetailField]
    emit('update:selected', `${id}/${orderId}`)
  }
}

const getDisplayType = (item) => {
  try {
    const resources = item?.resources
    if (resources && activeType.value) {
      return resources[activeType.value.toLowerCase()]?.type
    }
    return item?.type || ''
  } catch (_) {
    return ''
  }
}

const getDisplayName = (item) => {
  if (props.displayNameField && item && item[props.displayNameField] !== undefined) return item[props.displayNameField]
  return item?.name || ''
}

const getDisplayPrice = (item) => {
  if (!props.priceField) return ''
  const v = item?.[props.priceField]
  return v === undefined || v === null ? '' : v
}

const getResourceGpuMemoryGB = (item) => {
  try {
    const spec = item?.resources?.[activeType.value?.toLowerCase?.()] || {}
    const candidates = [
      spec.gpu_memory_gb,
      spec.memory_gb,
      spec.vram_gb,
      spec.gpu_memory,
      spec.vram,
      spec.memory
    ]
    const val = candidates.find(v => v !== undefined && v !== null)
    if (typeof val === 'number') return val
    if (typeof val === 'string') {
      const m = val.match(/([\d.]+)/)
      return m ? Number(m[1]) : null
    }
    return null
  } catch (_) {
    return null
  }
}

const isResourceInsufficient = (item) => {
  const recommend = Number(props.modelMinGpuMemory || 0)
  if (!recommend || recommend <= 0) return false
  const resourceMem = getResourceGpuMemoryGB(item)
  if (recommend && resourceMem) {
    return recommend > resourceMem
  }
  return recommend > 8
}

const getIndicatorClass = (item) => {
  if (!item?.is_available) return 'bg-gray-400'
  const recommend = Number(props.modelMinGpuMemory || 0)
  const resourceMem = getResourceGpuMemoryGB(item)
  if (recommend && resourceMem) {
    return recommend > resourceMem ? 'bg-warning-700' : 'bg-brand-700'
  }
  if (!recommend || recommend <= 8) return 'bg-brand-700'
  return 'bg-warning-700'
}

const getCardBorderClass = (item) => {
  if (!item?.is_available) return 'border-gray-300'
  const insuff = isResourceInsufficient(item)
  const isSelected = props.selected === `${item.id}/${item.order_detail_id}`
  if (isSelected && insuff) return 'border border-[2px] border-warning-700'
  if (isSelected) return 'border border-[2px] border-brand-500 bg-brand-25'
  return 'border-gray-400'
}
</script>

<style scoped>
</style>