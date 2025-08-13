<template>
  <div>
    <el-dropdown class="h-9">
      <el-button plain type="default" class="btn btn-secondary-gray btn-sm !h-full">
        <SvgIcon name="deploy" class="mr-1" />
        <div class="text-gray-700">{{ t("all.deploy") }}</div>
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
