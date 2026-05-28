<template>
  <div class="tool-param-field w-full">
    <el-slider
      v-if="item.type == 'from_2_to_20'"
      v-model="item.value"
      size="small"
      :min="2"
      :max="20"
      style="width: 98%"
    />
    <el-select
      v-else-if="item.type == 'STRING' && Array.isArray(item.option_values)"
      v-model="item.value"
      class="w-full"
      :placeholder="item.name"
    >
      <el-option
        v-for="selItem in item.option_values"
        :key="selItem.key"
        :label="selItem.label"
        :value="selItem.key"
      />
    </el-select>
    <div
      v-else-if="item.type == 'search-select'"
      class="w-full"
    >
      <el-select
        v-model="item.value"
        class="w-full"
        :placeholder="item.name"
        filterable
        allow-create
        default-first-option
        @change="$emit('search-select-change', $event, item)"
      >
        <el-option
          v-for="selItem in getSearchSelectOptions(item)"
          :key="selItem.key"
          :label="selItem.label"
          :value="selItem.key"
        />
      </el-select>
      <p v-if="isSearchingModel(item)" class="text-gray-400 text-xs mt-1">
        {{ t("dataPipelines.searchingModel") }}
      </p>
      <p class="text-gray-400 text-xs mt-1">
        {{ t("dataPipelines.searchSelectHint") }}
      </p>
    </div>
    <el-input
      v-else-if="
        item.type == 'STRING' &&
        !Array.isArray(item.option_values) &&
        isTextareaParam(item)
      "
      type="textarea"
      :rows="4"
      :placeholder="`${item.name}`"
      style="width: 100%"
      v-model="item.value"
    />
    <el-input
      v-else-if="item.type == 'STRING' && !Array.isArray(item.option_values)"
      :placeholder="`${item.name}`"
      style="width: 100%"
      v-model="item.value"
    />
    <el-input
      v-else-if="item.type == 'FLOAT'"
      type="number"
      :step="0.01"
      :precision="2"
      style="width: 100%"
      v-model="item.value"
    />
    <el-input
      v-else-if="item.type == 'INTEGER'"
      type="number"
      :min="0"
      :precision="0"
      :step="1"
      style="width: 100%"
      v-model="item.value"
    />
    <el-input
      v-else-if="item.type == 'PositiveFloat'"
      type="number"
      :min="0"
      style="width: 100%"
      v-model="item.value"
    />
    <el-slider
      v-else-if="item.type == 'ClosedUnitInterval'"
      size="small"
      v-model="item.value"
      :min="0"
      :max="1"
      :step="0.01"
      style="width: 98%"
    />
    <div
      v-else-if="item.type == 'LIST'"
      class="w-full flex flex-wrap gap-2 tagInputCont"
    >
      <el-tag
        v-for="tag in item.value"
        :key="tag"
        closable
        :disable-transitions="false"
        @close="$emit('remove-tag', tag, item)"
      >
        {{ tag }}
      </el-tag>
      <el-input
        v-model="item.tempVal"
        :placeholder="item.name"
        style="width: 100%"
        @keyup.enter="$emit('input-confirm', item, 'tempVal')"
      />
    </div>
    <el-checkbox
      v-else-if="item.type == 'BOOLEAN'"
      v-model="item.value"
      :label="item.name"
      class="block my-2.5"
    />
    <div v-else-if="item.type == 'select-model'" class="w-full">
      <el-select
        v-model="item.value"
        class="w-full"
        :placeholder="item.name"
        filterable
      >
        <el-option
          v-for="selItem in getSearchSelectOptions(item)"
          :key="selItem.key"
          :label="selItem.label"
          :value="selItem.key"
        />
        <template #footer>
          <div @click.stop>
            <CsgButton
              class="btn btn-primary btn-sm"
              :name="t('dataPipelines.moreModels')"
              @click.stop="$emit('open-model-dialog', item)"
            />
          </div>
        </template>
      </el-select>
      <p v-if="isSearchingModel(item)" class="text-gray-400 text-xs mt-1">
        {{ t("dataPipelines.searchingModel") }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

defineProps({
  item: { type: Object, required: true },
  getSearchSelectOptions: { type: Function, required: true },
  isSearchingModel: { type: Function, required: true },
});

defineEmits([
  "search-select-change",
  "open-model-dialog",
  "input-confirm",
  "remove-tag",
]);

const { t } = useI18n();

const isTextareaParam = (param) => {
  if (param?.type !== "STRING" || Array.isArray(param.option_values)) {
    return false;
  }
  const sample = String(param.value ?? param.tempVal ?? "");
  return sample.includes("\n") || sample.length > 100;
};
</script>
