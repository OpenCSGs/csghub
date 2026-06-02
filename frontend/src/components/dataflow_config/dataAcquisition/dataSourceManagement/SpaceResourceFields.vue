<template>
  <div
    class="region-space-resources"
    :class="{ 'region-space-resources--compact': compact }"
  >
    <p v-if="!compact" class="region-section-heading">
      {{ t("dataPipelines.selectRegion") }}
    </p>
    <div class="mt-[16px]" :class="compact ? 'w-full' : 'max-w-xl'">
      <p class="sr-form-section-label">
        <span class="text-red-500 mr-0.5" aria-hidden="true">*</span>{{ t("dataPipelines.selectRegion") }}
      </p>
      <el-select
        v-model="clusterId"
        :placeholder="
          t('all.pleaseSelect', { value: t('dataPipelines.selectRegion') })
        "
        clearable
        class="w-full"
        :loading="clusterLoading"
        @change="onClusterChange"
      >
        <el-option
          v-for="c in spaceClusters"
          :key="c.cluster_id"
          :label="c.region"
          :value="c.cluster_id"
        />
      </el-select>
    </div>

    <div class="space-resources-section mt-[24px]">
      <p class="sr-form-section-label">
        <span class="text-red-500 mr-0.5" aria-hidden="true">*</span>{{ t("dataPipelines.spaceCloudResources") }}
      </p>
      <div class="resource-type-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          class="resource-type-tab"
          :class="{ 'resource-type-tab--active': resourceTypeTab === 'cpu' }"
          :aria-selected="resourceTypeTab === 'cpu'"
          @click="setResourceTypeTab('cpu')"
        >
          {{ t("dataPipelines.resourceTabCpu") }}
        </button>
        <button
          type="button"
          role="tab"
          class="resource-type-tab"
          :class="{ 'resource-type-tab--active': resourceTypeTab === 'gpu' }"
          :aria-selected="resourceTypeTab === 'gpu'"
          @click="setResourceTypeTab('gpu')"
        >
          {{ t("dataPipelines.resourceTabGpu") }}
        </button>
      </div>

      <div
        v-loading="spaceResourcesLoading"
        class="resource-cards mt-[16px] flex flex-wrap gap-3 min-h-[80px]"
      >
        <template v-if="filteredSpaceResources.length">
          <div
            v-for="item in filteredSpaceResources"
            :key="item.id"
            class="resource-card"
            :class="{
              'resource-card--selected': spaceResourceId == item.id,
              'resource-card--disabled': !item.is_available,
            }"
            @click="selectSpaceResource(item)"
          >
            <div class="resource-card-top-bar" />
            <div class="resource-card-title">
              {{ getSpaceResourceCardTitle(item) }}
            </div>
            <div class="resource-card-spec">
              {{ item.name }}
            </div>
            <div class="resource-card-price">
              {{ item.priceValue || formatSpaceResourcePrice(item) }}
            </div>
            <div
              v-if="!item.is_available"
              class="resource-card-insufficient-layer"
            >
              <span class="resource-card-insufficient-pill">{{
                t("dataPipelines.resourceInsufficient")
              }}</span>
            </div>
          </div>
        </template>
        <p
          v-else-if="!spaceResourcesLoading && clusterId"
          class="text-gray-500 text-sm"
        >
          {{ t("dataPipelines.noData") }}
        </p>
        <p v-else-if="!clusterId" class="text-gray-500 text-sm">
          {{
            t("all.pleaseSelect", { value: t("dataPipelines.selectRegion") })
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import useFetchApi from "../../../../packs/useFetchApi";
import {
  normalizeClusterRow,
  normalizeSpaceResourceRow,
  resolveSpaceResourceNames,
} from "../../../../packs/spaceResourcePayload.js";
import { formatSpaceResourcePriceLabel } from "../../../../packs/spaceResourcePrice.js";

const props = defineProps({
  /** 弹框内紧凑布局：不展示「选择区域」大标题，区域下拉全宽 */
  compact: { type: Boolean, default: false },
  /** 与 reactive 父级绑定时请用 v-model:cluster-id，勿用 defineModel（易不同步） */
  clusterId: { type: [String, Number], default: "" },
  spaceResourceId: { type: [String, Number], default: "" },
  clusterName: { type: String, default: "" },
  resourceName: { type: String, default: "" },
});

const emit = defineEmits([
  "update:clusterId",
  "update:spaceResourceId",
  "update:clusterName",
  "update:resourceName",
]);

const clusterId = computed({
  get() {
    const v = props.clusterId;
    return v === null || v === undefined ? "" : v;
  },
  set(v) {
    emit("update:clusterId", v === null || v === undefined ? "" : v);
  },
});

const spaceResourceId = computed({
  get() {
    const v = props.spaceResourceId;
    return v === null || v === undefined ? "" : v;
  },
  set(v) {
    emit("update:spaceResourceId", v === null || v === undefined ? "" : v);
  },
});

const clusterName = computed({
  get() {
    return props.clusterName ?? "";
  },
  set(v) {
    emit("update:clusterName", v ?? "");
  },
});

const resourceName = computed({
  get() {
    return props.resourceName ?? "";
  },
  set(v) {
    emit("update:resourceName", v ?? "");
  },
});

const { t } = useI18n();

const syncClusterNameFromSelection = () => {
  const { cluster_name } = resolveSpaceResourceNames(
    { cluster_id: clusterId.value },
    spaceClusters.value,
    spaceResourcesList.value
  );
  clusterName.value = cluster_name;
};

const syncResourceNameFromSelection = () => {
  const { resource_name } = resolveSpaceResourceNames(
    {
      cluster_id: clusterId.value,
      space_resource_id: spaceResourceId.value,
    },
    spaceClusters.value,
    spaceResourcesList.value
  );
  resourceName.value = resource_name;
};

/** 提交前从当前列表解析名称，不依赖 v-model 是否已回写父表单 */
const resolveSelectionNames = () => {
  const names = resolveSpaceResourceNames(
    {
      cluster_id: clusterId.value,
      space_resource_id: spaceResourceId.value,
    },
    spaceClusters.value,
    spaceResourcesList.value
  );
  syncClusterNameFromSelection();
  syncResourceNameFromSelection();
  return names;
};

defineExpose({ resolveSelectionNames });

/** 兼容 { data: [] }、直接数组、或 { data: { list } } 等返回结构 */
const normalizeApiArray = (raw) => {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object") {
    if (Array.isArray(raw.data)) return raw.data;
    if (raw.data && Array.isArray(raw.data.list)) return raw.data.list;
  }
  return [];
};

/** 当前 Tab 下无数据时自动切到有数据的 CPU/GPU，避免接口有数据却显示「暂无数据」 */
const syncResourceTypeTabIfNeeded = () => {
  const list = spaceResourcesList.value;
  const count = (type) =>
    list.filter((r) => (r.type || "").toLowerCase() === type).length;
  const cpu = count("cpu");
  const gpu = count("gpu");
  const tab = (resourceTypeTab.value || "cpu").toLowerCase();
  if (tab === "gpu" && gpu === 0 && cpu > 0) {
    resourceTypeTab.value = "cpu";
  } else if (tab === "cpu" && cpu === 0 && gpu > 0) {
    resourceTypeTab.value = "gpu";
  }
};
const spaceClusters = ref([]);
const clusterLoading = ref(false);
const spaceResourcesList = ref([]);
const spaceResourcesLoading = ref(false);
const resourceTypeTab = ref("cpu");

const setResourceTypeTab = (tab) => {
  resourceTypeTab.value = tab;
};

const filteredSpaceResources = computed(() => {
  const tab = (resourceTypeTab.value || "cpu").toLowerCase();
  return spaceResourcesList.value.filter(
    (r) => (r.type || "").toLowerCase() === tab
  );
});

const pickDefaultSpaceResource = () => {
  const list = filteredSpaceResources.value;
  const cur = list.find((r) => r.id == spaceResourceId.value);
  if (cur) {
    syncResourceNameFromSelection();
    return;
  }
  const firstAvail = list.find((r) => r.is_available);
  if (firstAvail) {
    spaceResourceId.value = firstAvail.id;
    syncResourceNameFromSelection();
    return;
  }
  if (list[0]) {
    spaceResourceId.value = list[0].id;
    syncResourceNameFromSelection();
  } else {
    spaceResourceId.value = "";
    resourceName.value = "";
  }
};

/** 与新建 Notebook/微调/Endpoint、应用空间资源接口规则一致 */
const formatSpaceResourcePrice = (item) =>
  formatSpaceResourcePriceLabel(item, { t });

const getSpaceResourceCardTitle = (item) => {
  if (!item) return "";
  try {
    const raw = item.resources;
    if (raw) {
      const r = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (r?.gpu?.type) {
        return String(r.gpu.type).replace(/^NVIDIA[-_]?/i, "").slice(0, 16);
      }
      if (r?.cpu?.type) return String(r.cpu.type).slice(0, 16);
      if (r?.cpu && !r?.gpu) return t("dataPipelines.resourceTabCpu");
    }
  } catch {
    /* ignore */
  }
  const m = item.name?.match(/NVIDIA\s+([A-Za-z0-9]+)/i);
  if (m) return m[1];
  const parts = (item.name || "").split(/[·\s]/);
  return (parts[0] || "").slice(0, 16);
};

const selectSpaceResource = (item) => {
  if (!item?.is_available) return;
  const row = normalizeSpaceResourceRow(item);
  spaceResourceId.value = row?.id ?? item.id;
  resourceName.value = row?.name || "";
};

const fetchSpaceResources = async () => {
  if (!clusterId.value) {
    spaceResourcesList.value = [];
    spaceResourceId.value = "";
    return;
  }
  spaceResourcesLoading.value = true;
  const { data, error } = await useFetchApi(
    `/space_resources?cluster_id=${clusterId.value}&deploy_type=0`
  ).json();
  spaceResourcesLoading.value = false;
  if (error.value) {
    ElMessage.warning(error.value?.msg || t("dataPipelines.linkError"));
    spaceResourcesList.value = [];
    spaceResourceId.value = "";
    return;
  }
  spaceResourcesList.value = normalizeApiArray(data.value)
    .map(normalizeSpaceResourceRow)
    .filter(Boolean)
    .map((item) => ({
      ...item,
      priceValue: formatSpaceResourcePrice(item),
    }));
  syncResourceTypeTabIfNeeded();
  pickDefaultSpaceResource();
};

const fetchClusters = async () => {
  clusterLoading.value = true;
  const { data, error } = await useFetchApi("/cluster").json();
  clusterLoading.value = false;
  if (error.value) {
    ElMessage.warning(error.value?.msg || t("dataPipelines.linkError"));
    return;
  }
  spaceClusters.value = normalizeApiArray(data.value)
    .map(normalizeClusterRow)
    .filter(Boolean);
  if (spaceClusters.value.length && !clusterId.value) {
    clusterId.value = spaceClusters.value[0].cluster_id;
  }
  if (clusterId.value) {
    syncClusterNameFromSelection();
  }
  await nextTick();
  await fetchSpaceResources();
};

const onClusterChange = (value) => {
  // value 是 el-select @change 事件提供的新选中值，直接用来更新 clusterName 并拉取资源
  const id = value ?? clusterId.value
  const { cluster_name } = resolveSpaceResourceNames(
    { cluster_id: id },
    spaceClusters.value,
    spaceResourcesList.value
  );
  clusterName.value = cluster_name;
  spaceResourceId.value = "";
  resourceName.value = "";
  fetchSpaceResourcesWithId(id);
};

const fetchSpaceResourcesWithId = async (id) => {
  if (!id) {
    spaceResourcesList.value = [];
    spaceResourceId.value = "";
    return;
  }
  spaceResourcesLoading.value = true;
  const { data, error } = await useFetchApi(
    `/space_resources?cluster_id=${id}&deploy_type=0`
  ).json();
  spaceResourcesLoading.value = false;
  if (error.value) {
    ElMessage.warning(error.value?.msg || t("dataPipelines.linkError"));
    spaceResourcesList.value = [];
    spaceResourceId.value = "";
    return;
  }
  spaceResourcesList.value = normalizeApiArray(data.value)
    .map(normalizeSpaceResourceRow)
    .filter(Boolean)
    .map((item) => ({
      ...item,
      priceValue: formatSpaceResourcePrice(item),
    }));
  syncResourceTypeTabIfNeeded();
  pickDefaultSpaceResource();
};

watch(resourceTypeTab, () => {
  pickDefaultSpaceResource();
});

watch(clusterId, () => {
  if (spaceClusters.value.length) syncClusterNameFromSelection();
});

watch(spaceResourceId, () => {
  if (spaceResourcesList.value.length) syncResourceNameFromSelection();
});

onMounted(() => {
  fetchClusters();
});
</script>

<style lang="less" scoped>
.region-space-resources {
  p.region-section-heading {
    margin: 0;
    padding: 0;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 500;
    color: #111827;
  }

  &.region-space-resources--compact {
    margin-top: 0;
  }

  /** 与数据流表单小标题一致（#667085），避免仅依赖 Tailwind 时被 dialog 正文色覆盖 */
  .sr-form-section-label {
    margin: 0 0 8px;
    padding: 0;
    font-size: 12px;
    line-height: 1.5;
    font-weight: 400;
    color: #667085;
  }

  .space-resources-section {
    font-size: var(--el-font-size-base, 14px);
  }

  .resource-type-tabs {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .resource-type-tab {
    margin: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 400;
    color: #98a2b3;
    transition: color 0.15s ease, background 0.15s ease;
  }

  .resource-type-tab:hover:not(.resource-type-tab--active) {
    color: #667085;
  }

  .resource-type-tab--active {
    background: #f2f4f7;
    color: #101828;
    font-weight: 500;
  }

  .resource-cards {
    gap: 12px;
  }

  .resource-card {
    box-sizing: border-box;
    position: relative;
    width: 200px;
    min-height: 148px;
    padding: 14px 12px 12px;
    border-radius: 12px;
    border: 1px solid #e4e7ec;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  }

  .resource-card-top-bar {
    width: 40px;
    height: 4px;
    border-radius: 2px;
    background: #1570ef;
    margin-bottom: 10px;
    flex-shrink: 0;
  }

  .resource-card-title {
    font-size: 15px;
    font-weight: 600;
    color: #101828;
    line-height: 1.35;
    margin-bottom: 6px;
    word-break: break-word;
  }

  .resource-card-spec {
    font-size: 12px;
    line-height: 1.45;
    color: #475467;
    flex: 1 1 auto;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    overflow: hidden;
    word-break: break-word;
  }

  .resource-card-price {
    font-size: 12px;
    font-weight: 500;
    color: #1570ef;
    margin-top: auto;
    padding-top: 10px;
    line-height: 1.35;
  }

  .resource-card:hover:not(.resource-card--disabled):not(.resource-card--selected) {
    border-color: #cbd5e1;
  }

  .resource-card--selected {
    border: 2px solid #1570ef;
    background: #eff8ff;
    box-shadow: none;
  }

  .resource-card--selected .resource-card-top-bar {
    background: #1570ef;
  }

  .resource-card--disabled {
    cursor: not-allowed;
    border: 1px solid #d0d5dd;
    background: #fff;
  }

  .resource-card--disabled .resource-card-top-bar {
    background: #d0d5dd;
  }

  .resource-card--disabled .resource-card-title,
  .resource-card--disabled .resource-card-spec,
  .resource-card--disabled .resource-card-price {
    color: #d0d5dd;
  }

  .resource-card-insufficient-layer {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.28s ease;
  }

  .resource-card--disabled:hover .resource-card-insufficient-layer {
    opacity: 1;
  }

  .resource-card-insufficient-pill {
    padding: 5px 14px;
    border: 1px solid #d0d5dd;
    border-radius: 9999px;
    font-size: 12px;
    line-height: 1.35;
    font-weight: 500;
    color: #98a2b3;
    background: #fff;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
  }

  .resource-card--disabled.resource-card--selected {
    border: 1px solid #d0d5dd;
    background: #fff;
  }
}
</style>
