<template>
  <div :class="compact ? 'w-full' : ''">
    <!-- 区域 — 与应用空间完全一致 -->
    <div class="mb-[18px]">
      <p class="text-sm text-gray-700 leading-5 font-medium mb-[8px]">
        <span class="text-red-500 mr-0.5">*</span>{{ t("dataPipelines.selectRegion") }}
      </p>
      <el-select
        v-model="clusterId"
        :placeholder="t('all.pleaseSelect', { value: t('dataPipelines.selectRegion') })"
        size="large"
        style="width: 100%"
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

    <!-- 空间云资源 -->
    <div>
      <p class="text-sm text-gray-700 leading-5 font-medium mb-[8px]">
        <span class="text-red-500 mr-0.5">*</span>{{ t("dataPipelines.spaceCloudResources") }}
      </p>

      <!-- 资源类型 Tab -->
      <div class="resource-type-tabs" role="tablist">
        <button
          v-if="hasCpu"
          type="button"
          role="tab"
          class="resource-type-tab"
          :class="{ 'resource-type-tab--active': resourceTypeTab === 'cpu' }"
          @click="setResourceTypeTab('cpu')"
        >
          CPU
        </button>
        <button
          v-if="hasNpu"
          type="button"
          role="tab"
          class="resource-type-tab"
          :class="{ 'resource-type-tab--active': resourceTypeTab === 'npu' }"
          @click="setResourceTypeTab('npu')"
        >
          NPU
        </button>
        <button
          v-if="hasGpu"
          type="button"
          role="tab"
          class="resource-type-tab"
          :class="{ 'resource-type-tab--active': resourceTypeTab === 'gpu' }"
          @click="setResourceTypeTab('gpu')"
        >
          GPU
        </button>
      </div>

      <!-- 九宫格卡片 -->
      <div v-loading="spaceResourcesLoading" class="resource-cards mt-[16px] flex flex-wrap gap-3 min-h-[80px]">
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
              {{ getCardTitle(item) }}
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
        <p v-else-if="!spaceResourcesLoading && clusterId" class="text-gray-500 text-sm">
          {{ t("dataPipelines.noData") }}
        </p>
        <p v-else-if="!clusterId" class="text-gray-500 text-sm">
          {{ t("all.pleaseSelect", { value: t("dataPipelines.selectRegion") }) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import useFetchApi from "../../../../packs/useFetchApi";
import { formatSpaceResourcePriceLabel } from "../../../../packs/spaceResourcePrice.js";

const props = defineProps({
  compact: { type: Boolean, default: false },
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

const spaceClusters = ref([]);
const spaceResourcesList = ref([]);
const spaceResourcesLoading = ref(false);
const resourceTypeTab = ref("cpu");

const hasCpu = computed(() =>
  spaceResourcesList.value.some((r) => (r.type || "").toLowerCase() === "cpu")
);
const hasNpu = computed(() =>
  spaceResourcesList.value.some((r) => (r.type || "").toLowerCase() === "npu")
);
const hasGpu = computed(() =>
  spaceResourcesList.value.some((r) => (r.type || "").toLowerCase() === "gpu")
);

/** 无数据时自动切到第一个有数据的 Tab */
const autoPickAvailableTab = () => {
  const tab = resourceTypeTab.value;
  const list = spaceResourcesList.value;
  const count = (t) => list.filter((r) => (r.type || "").toLowerCase() === t).length;
  if (tab === "gpu" && count("gpu") === 0 && count("cpu") > 0) {
    resourceTypeTab.value = "cpu";
  } else if (tab === "gpu" && count("gpu") === 0 && count("npu") > 0) {
    resourceTypeTab.value = "npu";
  } else if (tab === "npu" && count("npu") === 0 && count("cpu") > 0) {
    resourceTypeTab.value = "cpu";
  } else if (tab === "npu" && count("npu") === 0 && count("gpu") > 0) {
    resourceTypeTab.value = "gpu";
  } else if (tab === "cpu" && count("cpu") === 0 && count("gpu") > 0) {
    resourceTypeTab.value = "gpu";
  } else if (tab === "cpu" && count("cpu") === 0 && count("npu") > 0) {
    resourceTypeTab.value = "npu";
  }
};

const setResourceTypeTab = (tab) => {
  resourceTypeTab.value = tab;
};

const filteredSpaceResources = computed(() => {
  const tab = (resourceTypeTab.value || "cpu").toLowerCase();
  return spaceResourcesList.value.filter(
    (r) => (r.type || "").toLowerCase() === tab
  );
});

/** 卡片标题：GPU 型号 / CPU / NPU */
const getCardTitle = (item) => {
  if (!item) return "";
  const type = (item.type || "").toLowerCase();
  if (type === "gpu") {
    const name = item.name || "";
    const m = name.match(/NVIDIA\s+([A-Za-z0-9]+)/i);
    if (m) return m[1];
    return name.split(/[·\s]/)[0]?.slice(0, 16) || "GPU";
  }
  if (type === "npu") return "NPU";
  return "CPU";
};

/** 格式化资源价格显示 */
const formatSpaceResourcePrice = (item) =>
  formatSpaceResourcePriceLabel(item, { t });

/** 点击卡片 */
const selectSpaceResource = (item) => {
  if (!item?.is_available) return;
  spaceResourceId.value = item.id;
  resourceName.value = item.name || "";
};

/** Tab 切换时自动选第一个可用 */
const pickDefaultForCurrentTab = () => {
  const list = filteredSpaceResources.value;
  const cur = list.find((r) => String(r.id) === String(spaceResourceId.value));
  if (cur) {
    resourceName.value = cur.name || "";
    return;
  }
  const firstAvail = list.find((r) => r.is_available);
  if (firstAvail) {
    spaceResourceId.value = firstAvail.id;
    resourceName.value = firstAvail.name || "";
    return;
  }
  if (list[0]) {
    spaceResourceId.value = list[0].id;
    resourceName.value = list[0].name || "";
  } else {
    spaceResourceId.value = "";
    resourceName.value = "";
  }
};

// ========== 数据加载（与应用空间完全一致） ==========

const fetchSpaceResources = async (cid) => {
  const id = cid ?? clusterId.value;
  if (!id) {
    spaceResourcesList.value = [];
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
    return;
  }
  const body = data.value;
  spaceResourcesList.value = (body?.data || []).map((item) => ({
    ...item,
    priceValue: formatSpaceResourcePrice(item),
  }));

  autoPickAvailableTab();
  // 自动选中第一个可用
  const firstAvailable = spaceResourcesList.value.find((item) => item.is_available);
  spaceResourceId.value = firstAvailable?.id || "";
  resourceName.value = firstAvailable?.name || "";
};

const fetchClusters = async () => {
  const { data, error } = await useFetchApi("/cluster").json();
  if (error.value) {
    ElMessage.warning(error.value?.msg || t("dataPipelines.linkError"));
    return;
  }
  const body = data.value;
  spaceClusters.value = body?.data || [];

  if (spaceClusters.value.length && !clusterId.value) {
    const first = spaceClusters.value[0];
    clusterId.value = first.cluster_id;
    clusterName.value = first.region || "";
  }

  if (clusterId.value) {
    const matched = spaceClusters.value.find(
      (x) => String(x.cluster_id) === String(clusterId.value)
    );
    clusterName.value = matched?.region || "";
  }

  // 传递显式 id，避免 computed 双绑 emit 未同步导致读空
  fetchSpaceResources(clusterId.value || spaceClusters.value[0]?.cluster_id);
};

const onClusterChange = (value) => {
  // value 是 el-select @change 事件提供的新选中值，避免读取尚未更新的 props.clusterId
  const id = value ?? clusterId.value
  const c = spaceClusters.value.find(
    (x) => String(x.cluster_id) === String(id)
  );
  clusterName.value = c?.region || "";
  spaceResourceId.value = "";
  resourceName.value = "";
  resourceTypeTab.value = "cpu";
  fetchSpaceResources(id);
};

const resolveSelectionNames = () => {
  const c = spaceClusters.value.find(
    (x) => String(x.cluster_id) === String(clusterId.value)
  );
  const r = spaceResourcesList.value.find(
    (x) => String(x.id) === String(spaceResourceId.value)
  );
  clusterName.value = c?.region || "";
  resourceName.value = r?.name || "";
  return {
    cluster_name: clusterName.value,
    resource_name: resourceName.value,
  };
};

watch(resourceTypeTab, () => {
  pickDefaultForCurrentTab();
});

defineExpose({ resolveSelectionNames });

onMounted(() => {
  fetchClusters();
});
</script>

<style lang="less" scoped>
/* Tab 按钮 — 与原 SpaceResourceFields 一致 */
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

/* 卡片 — 与原 SpaceResourceFields 完全一致 */
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
</style>
