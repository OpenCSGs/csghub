<template>
  <div class="mr-4">
    <el-dropdown>
      <el-button type="default" class="!rounded-lg">
        {{ t("all.deploy") }}
        <el-icon class="ml-1 el-icon--right">
          <arrow-down />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <a :href="`/endpoints/new?model_id=${modelId}`">{{ t("endpoints.new.dedicated") }}</a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
  import { useI18n } from "vue-i18n";

  const { t } = useI18n();

  const props = defineProps({
    modelId: String
  });
</script>
