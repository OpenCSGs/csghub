<template>
  <div class="task-namespace-fields">
    <p v-if="showHeading" class="task-namespace-heading">
      <span class="text-red-500 mr-0.5" aria-hidden="true">*</span
      >{{ t("dataPipelines.taskAttribute") }}
    </p>
    <div v-loading="namespacesLoading" class="task-namespace-box">
      <el-radio-group
        class="namespace-type-radio-group"
        :model-value="namespaceType"
        @update:model-value="onNamespaceTypeUpdate"
      >
        <el-radio value="personal">{{
          t("dataPipelines.taskScopePersonal")
        }}</el-radio>
        <el-radio
          value="organization"
          :disabled="!organizationOptions.length"
        >
          {{ t("dataPipelines.taskScopeOrganization") }}
        </el-radio>
      </el-radio-group>
      <p
        v-if="!organizationOptions.length && !namespacesLoading"
        class="task-namespace-hint"
      >
        {{ t("dataPipelines.noOrganizationNamespace") }}
      </p>
      <div v-if="namespaceType === 'organization'" class="mt-[16px] max-w-md">
        <p class="task-namespace-label">
          <span class="text-red-500 mr-0.5" aria-hidden="true">*</span
          >{{ t("dataPipelines.organization") }}
        </p>
        <el-select
          :key="organizationSelectKey"
          :model-value="organizationSelectValue"
          :placeholder="t('dataPipelines.pleaseSelectOrganization')"
          clearable
          class="w-full"
          @update:model-value="onNamespaceUuidUpdate"
        >
          <el-option
            v-for="org in organizationOptions"
            :key="org.id"
            :label="org.label"
            :value="org.id"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";
import useUserStore from "@/stores/UserStore.js";
import {
  isValidOrganizationNamespaceUuid,
  NAMESPACE_TYPE_ORGANIZATION,
  NAMESPACE_TYPE_PERSONAL,
  useDataflowNamespaces,
} from "@/packs/useDataflowNamespaces.js";

defineProps({
  showHeading: { type: Boolean, default: true },
});

const namespaceType = defineModel("namespaceType", {
  type: String,
  default: NAMESPACE_TYPE_PERSONAL,
});
const namespaceUuid = defineModel("namespaceUuid", { type: String, default: "" });

const emit = defineEmits(["loaded"]);

const { t } = useI18n();
const userStore = useUserStore();

const {
  loading: namespacesLoading,
  loadError,
  organizationOptions,
  personalNamespace,
  ownerPathOptions,
  isNamespaceReady,
  load,
} = useDataflowNamespaces();

/** 组织模式下 el-select 仅绑定组织 uuid，与个人 uuid 隔离 */
const organizationSelectValue = computed(() => {
  if (namespaceType.value !== NAMESPACE_TYPE_ORGANIZATION) return "";
  const uuid = String(namespaceUuid.value ?? "").trim();
  return isValidOrganizationNamespaceUuid(uuid, organizationOptions.value)
    ? uuid
    : "";
});

const organizationSelectKey = computed(
  () =>
    `org-select-${organizationOptions.value.map((o) => o.id).join(",")}-${namespaceType.value}`
);

const clearStaleUuidForOrganizationMode = () => {
  if (namespaceType.value !== NAMESPACE_TYPE_ORGANIZATION) return;
  namespaceType.value = NAMESPACE_TYPE_ORGANIZATION;
  const uuid = String(namespaceUuid.value ?? "").trim();
  if (!isValidOrganizationNamespaceUuid(uuid, organizationOptions.value)) {
    namespaceUuid.value = "";
  }
};

const syncNamespaceFields = () => {
  if (namespaceType.value === NAMESPACE_TYPE_ORGANIZATION) {
    clearStaleUuidForOrganizationMode();
    return;
  }

  namespaceType.value = NAMESPACE_TYPE_PERSONAL;
  if (personalNamespace.value?.uuid) {
    namespaceUuid.value = personalNamespace.value.uuid;
  }
};

const onNamespaceTypeUpdate = (type) => {
  if (type === NAMESPACE_TYPE_ORGANIZATION) {
    namespaceType.value = NAMESPACE_TYPE_ORGANIZATION;
    namespaceUuid.value = "";
    return;
  }
  namespaceType.value = NAMESPACE_TYPE_PERSONAL;
  namespaceUuid.value = personalNamespace.value?.uuid ?? "";
};

const onNamespaceUuidUpdate = (uuid) => {
  namespaceType.value = NAMESPACE_TYPE_ORGANIZATION;
  namespaceUuid.value = uuid ?? "";
};

const buildLoadedPayload = () => ({
  personalNamespace: personalNamespace.value,
  organizationOptions: organizationOptions.value,
  ownerPathOptions: ownerPathOptions.value,
  isReady: isNamespaceReady.value,
});

const initNamespaces = async () => {
  const username = userStore.username;
  if (!username) return;

  await load(username);
  if (loadError.value) {
    ElMessage.warning(loadError.value);
    emit("loaded", { ...buildLoadedPayload(), error: loadError.value });
    return;
  }

  syncNamespaceFields();
  emit("loaded", buildLoadedPayload());
};

onMounted(() => {
  initNamespaces();
});

watch(personalNamespace, () => {
  if (namespaceType.value === NAMESPACE_TYPE_PERSONAL) {
    syncNamespaceFields();
  }
});

watch(organizationOptions, () => {
  clearStaleUuidForOrganizationMode();
});

watch(namespaceType, (type) => {
  if (type === NAMESPACE_TYPE_ORGANIZATION) {
    clearStaleUuidForOrganizationMode();
  } else if (type === NAMESPACE_TYPE_PERSONAL) {
    syncNamespaceFields();
  }
});

watch(
  () => userStore.username,
  (name) => {
    if (name) initNamespaces();
  }
);

defineExpose({
  namespacesLoading,
  isNamespaceReady,
  reload: initNamespaces,
});
</script>

<style lang="less" scoped>
.task-namespace-heading {
  margin: 0 0 12px;
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 500;
  color: #111827;
}

.task-namespace-box {
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 16px;
}

.task-namespace-label {
  margin: 0 0 8px;
  font-size: 12px;
  color: #6b7280;
}

.task-namespace-hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #98a2b3;
}
</style>
