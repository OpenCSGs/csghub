<template>
  <div class="storage-size-field mt-[24px]">
    <p class="sr-form-section-label">
      <span class="text-red-500 mr-0.5" aria-hidden="true">*</span
      >{{ t("dataPipelines.storageSize") }}
    </p>
    <el-select
      v-model="innerValue"
      class="w-full max-w-xl"
      filterable
      allow-create
      default-first-option
      :placeholder="
        t('all.pleaseSelect', { value: t('dataPipelines.storageSize') })
      "
      @change="onChange"
      @blur="onBlur"
    >
      <el-option
        v-for="item in STORAGE_SIZE_PRESETS"
        :key="item"
        :label="item"
        :value="item"
      />
    </el-select>
    <p v-if="hint" class="storage-size-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  DEFAULT_STORAGE_SIZE,
  STORAGE_SIZE_PRESETS,
  normalizeStorageSize,
} from "@/packs/storageSize.js";

const props = defineProps({
  modelValue: { type: String, default: DEFAULT_STORAGE_SIZE },
  hint: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

const { t } = useI18n();

const innerValue = computed({
  get() {
    return props.modelValue || DEFAULT_STORAGE_SIZE;
  },
  set(value) {
    emit("update:modelValue", value ?? DEFAULT_STORAGE_SIZE);
  },
});

const commitNormalized = (value) => {
  try {
    const normalized = normalizeStorageSize(value);
    if (normalized !== innerValue.value) {
      innerValue.value = normalized;
    } else {
      emit("update:modelValue", normalized);
    }
  } catch {
    innerValue.value = DEFAULT_STORAGE_SIZE;
  }
};

const onChange = (value) => {
  commitNormalized(value);
};

const onBlur = () => {
  commitNormalized(innerValue.value);
};

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      innerValue.value = DEFAULT_STORAGE_SIZE;
      return;
    }
    try {
      const normalized = normalizeStorageSize(value);
      if (normalized !== value) {
        innerValue.value = normalized;
      }
    } catch {
      innerValue.value = DEFAULT_STORAGE_SIZE;
    }
  },
  { immediate: true }
);
</script>

<style lang="less" scoped>
.storage-size-field {
  .sr-form-section-label {
    margin: 0 0 8px;
    padding: 0;
    font-size: 12px;
    line-height: 1.5;
    font-weight: 400;
    color: #667085;
  }

  .storage-size-hint {
    margin: 8px 0 0;
    font-size: 12px;
    line-height: 1.5;
    color: #98a2b3;
  }
}
</style>
