<template>
  <el-radio-group
    v-model="visibility"
    class="!block"
    @change="$emit('update:value', $event)"
  >
    <el-radio
      class="w-full !border-[1px] mr-0 mb-[32px] !rounded-md !h-auto !items-start !p-4"
      label="public"
      size="large"
      border
    >
      {{ t('all.public') }}
      <p class="whitespace-normal text-gray-600 text-sm font-light">
        {{ props.publicDesc }}
      </p>
    </el-radio>
    <el-radio
      class="w-full !border-[1px] mr-0 !rounded-md !h-auto !items-start !p-4"
      label="private"
      size="large"
      border
    >
      {{ t('all.private') }}
      <p class="whitespace-normal text-gray-600 text-sm font-light">
        {{ props.privateDesc }}
      </p>
    </el-radio>
  </el-radio-group>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n()
  const props = defineProps({
    value: {
      type: String,
      default: 'public'
    },
    publicDesc: {
      type: String,
      default: ''
    },
    privateDesc: {
      type: String,
      default: ''
    }
  })
  const visibility = ref(props.value)

  watch(() => props.value, (value) => {
    visibility.value = value
  });

</script>

<style scoped>
  :deep(.el-radio__input) {
    margin-top: 10px;
  }

  :deep(.el-radio__label) {
    color: #344054 !important;
    font-weight: 400;
  }

  :deep(.el-radio.is-bordered.is-checked) {
    border: 1px solid #3250bd;
  }

  :deep(.el-radio__input.is-checked .el-radio__inner) {
    background: #3250bd;
    border-color: #3250bd;
  }
</style>
