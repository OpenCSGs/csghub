<template>
  <div class="w-[640px] m-auto flex flex-col items-center md:w-full md:p-5">
    <div>
      <SvgIcon name="endpoint" width="36" height="36" />
    </div>
    <h3 class="text-[#303133] text-xl font-semibold mt-6 mb-3">
      {{ $t("endpoints.new.title") }}
    </h3>
    <p class="text-[#606266] text-base font-medium md:text-center">
      {{ $t("endpoints.new.desc") }}
    </p>
    <div class="mt-9">
      <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t("endpoints.new.name") }}</p>
          <el-input
            v-model="endpointName"
            :placeholder="$t('rule.nameRule')"
            input-style="width: 100%"
          />
        </div>
        <div class="flex-1">
          <p class="text-[#303133] text-sm mb-2">{{ $t("endpoints.new.modelId") }}</p>
          <el-autocomplete
            clearable
            v-model="modelId"
            :fetch-suggestions="fetchModels"
            :placeholder="$t('endpoints.new.modelIdTip')"
          />
        </div>
      </div>

      <div class="mt-9">
        <div class="w-full flex sm:flex-col gap-2 mb-9 md:gap-9">
          <div class="flex-1">
            <p class="mb-2 text-[#303133]">{{ $t("endpoints.new.minReplica") }}</p>
            <el-select
              v-model="minReplica"
              :placeholder="$t('all.select')"
              size="large"
              style="width: 100%"
            >
              <el-option v-for="item in replicaRanges" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
          <div class="flex-1">
            <p class="mb-2 text-[#303133]">{{ $t("endpoints.new.maxReplica") }}</p>
            <el-select
              v-model="maxReplica"
              :placeholder="$t('all.select')"
              size="large"
              style="width: 100%"
            >
              <el-option v-for="item in replicaRanges" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
        </div>
      </div>

      <div class="mb-9 text-sm w-full">
        <p class="mb-2 text-[#303133]">{{ $t("endpoints.new.resource") }}</p>
        <el-select
          v-model="endpointResource"
          :placeholder="$t('all.select')"
          size="large"
          style="width: 100%"
        >
          <el-option
            v-for="item in endpointResources"
            :key="item.name"
            :label="item.name"
            :value="item.resources"
          />
        </el-select>
        <p class="text-[#475467] mt-2 font-light">
          {{ $t("endpoints.new.resourceTip1") }}
        </p>
        <p class="text-[#475467] font-light">
          {{ $t("endpoints.new.resourceTip2") }}
        </p>
      </div>

      <div class="mb-9 text-sm w-full">
        <p class="mb-2 text-[#303133]">{{ $t("endpoints.new.framework") }}</p>
        <el-select
          v-model="endpointFramework"
          :placeholder="$t('all.select')"
          size="large"
          style="width: 100%"
        >
          <el-option
            v-for="item in endpointFrameworks"
            :key="item.id"
            :label="item.frame_name"
            :value="item.id"
          />
        </el-select>
      </div>

      <div class="mb-9 text-sm w-full">
        <p class="mb-2 text-[#303133]">{{ $t("endpoints.new.cluster") }}</p>
        <el-select
          v-model="endpointCluster"
          :placeholder="$t('all.select')"
          size="large"
          style="width: 100%"
        >
          <el-option
            v-for="item in endpointClusters"
            :key="item.cluster_id"
            :label="item.region"
            :value="item.cluster_id"
          />
        </el-select>
      </div>

      <div class="mb-9">
        <el-radio-group v-model="visibility" class="!block">
          <el-radio
            class="w-full mr-0 mb-9 !rounded-xl !h-auto !items-start !p-4"
            value="public"
            size="large"
            border
          >
            {{ $t("endpoints.new.public") }}
            <p class="whitespace-normal text-[#475467] font-light">
              {{ $t("endpoints.new.publicDesc") }}
            </p>
          </el-radio>
          <el-radio
            class="w-full mr-0 !rounded-xl !h-auto !items-start !p-4"
            value="private"
            size="large"
            border
          >
            {{ $t("endpoints.new.private") }}
            <p class="whitespace-normal text-[#475467] font-light">
              {{ $t("endpoints.new.privateDesc") }}
            </p>
          </el-radio>
        </el-radio-group>
      </div>
      <div class="flex justify-end">
        <button
          class="bg-[#3250BD] w-[118px] h-9 rounded-lg text-white flex items-center justify-center border disabled:text-[#98A2B3] disabled:bg-[#F2F4F7] disabled:border-[#EAECF0]"
          :disabled="!canCreateEndpoint || hasCreateEndpoint"
          @click="createEndpoint"
        >
          {{ $t("endpoints.new.createEndpoint") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  :deep(.el-input) {
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  :deep(.el-radio__input) {
    margin-top: 4px;
  }

  :deep(.el-radio__label) {
    color: #344054 !important;
    font-weight: 400;
  }

  :deep(.el-radio.is-bordered.is-checked) {
    border: 2px solid #3250bd;
  }

  :deep(.el-radio__input.is-checked .el-radio__inner) {
    background: #3250bd;
    border-color: #3250bd;
  }

  :deep(.el-select) {
    width: 240px;
    height: 40px;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
  }

  :deep(.el-input .el-input__wrapper) {
    border-radius: 8px;
  }
</style>

<script setup>
  import { ref, computed, onMounted, inject, watch } from "vue";
  import { ElInput, ElMessage } from "element-plus";
  import csrfFetch from "../../packs/csrfFetch.js";
  import jwtFetch from "../../packs/jwtFetch";
  import { useI18n } from "vue-i18n";

  const props = defineProps({
    namespace: String,
  })

  const searchParams = new URLSearchParams(window.location.search);

  const { t } = useI18n();
  const csghubServer = inject("csghubServer");
  const nameRule = inject("nameRule");

  const endpointName = ref("");
  const modelId = ref(searchParams.get("model_id") || "");
  const visibility = ref("private");
  const hasCreateEndpoint = ref(false);
  const endpointResources = ref([]);
  const endpointResource = ref("");
  const endpointFrameworks = ref([]);
  const endpointFramework = ref("");
  const endpointClusters = ref([]);
  const endpointCluster = ref("");
  const replicaRanges = ["1", "2", "3", "4", "5"];
  const minReplica = ref("1");
  const maxReplica = ref("5");

  const canCreateEndpoint = computed(() => {
    const modelIdRegex = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
    return (
      nameRule.test(endpointName.value) &&
      modelIdRegex.test(modelId.value) &&
      maxReplica.value >= minReplica.value
    );
  });

  const fetchResources = async () => {
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    };
    const res = await jwtFetch(`${csghubServer}/api/v1/space_resources`, options);
    if (!res.ok) {
      ElMessage({ message: t("all.fetchError"), type: "warning" });
    } else {
      res.json().then((body) => {
        endpointResource.value = body.data[0]?.resources || "";
        endpointResources.value = body.data;
      });
    }
  };

  const fetchClusters = async () => {
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    };
    const res = await jwtFetch(`${csghubServer}/api/v1/cluster`, options);
    if (!res.ok) {
      ElMessage({ message: t("all.fetchError"), type: "warning" });
    } else {
      res.json().then((body) => {
        endpointCluster.value = body.data[0]?.cluster_id || "";
        endpointClusters.value = body.data;
      });
    }
  };

  const fetchModels = async (query, cb) => {
    const res = await jwtFetch(`${csghubServer}/api/v1/runtime_framework/models?search=${query}`);
    if (!res.ok) {
      ElMessage({ message: t("all.fetchError"), type: "warning" });
    } else {
      res.json().then((body) => {
        const paths = body.data?.map((model) => {
          return { key: model.path, value: model.path };
        });
        cb(paths);
      });
    }
  };

  const createEndpoint = async () => {
    try {
      const res = await submitEndpointForm();
      ElMessage.success(t("endpoints.new.createSuccess"));
      toEndpointDetail(res.endpoint_id);
    } catch (err) {
      ElMessage.warning(err.message);
    }
  };

  async function submitEndpointForm() {
    const endpointCreateUri = `/internal_api/endpoints`;
    const formData = new FormData();
    formData.append("name", endpointName.value);
    formData.append("model_path", modelId.value);
    formData.append("min_replica", minReplica.value);
    formData.append("max_replica", maxReplica.value);
    formData.append("cloud_resource", endpointResource.value);
    formData.append("framework_id", endpointFramework.value);
    formData.append("cluster_id", endpointCluster.value);
    formData.append("visibility", visibility.value);

    const options = { method: "POST", body: formData };
    hasCreateEndpoint.value = true;

    const response = await csrfFetch(endpointCreateUri, options);
    if (!response.ok) {
      hasCreateEndpoint.value = false;
      const data = await response.json();
      throw new Error(data.message);
    } else {
      hasCreateEndpoint.value = false;
      return response.json();
    }
  }

  const toEndpointDetail = (endpointId) => {
    window.location.pathname = `/endpoints/${props.namespace}/${endpointName.value}/${endpointId}`;
  };

  const updateRuntimeFramework = async () => {
    const res = await jwtFetch(`${csghubServer}/api/v1/models/${modelId.value}/runtime_framework`);
    if (!res.ok) {
      endpointFramework.value = ""
      endpointFrameworks.value = ""
    } else {
      res.json().then((body) => {
        endpointFramework.value = body.data == null ? "" : body.data[0].id;
        endpointFrameworks.value = body.data;
      })
    }
  }

  watch(modelId, () => {
    updateRuntimeFramework();
  });

  onMounted(() => {
    fetchResources();
    updateRuntimeFramework();
    fetchClusters();
  });
</script>
