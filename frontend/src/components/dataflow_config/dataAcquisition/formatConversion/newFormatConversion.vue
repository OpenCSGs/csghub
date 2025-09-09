<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-5">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p
        class="text-gray-700 text-sm font-medium cursor-pointer hover:text-brand-700"
        @click="router.back()"
      >
        {{ t("dataPipelines.formatConversion") }}
      </p>
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium">
        {{ t("dataPipelines.dataFormatConversion") }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">
      {{ t("dataPipelines.dataFormatConversion") }}
    </p>

    <p class="text-gray-900 text-2xl font-medium mt-[20px]">
      {{ t("dataPipelines.dataSource") }}
    </p>
    <el-form label-position="top" :rules="rules" :model="form" ref="formData">
      <el-row :gutter="20" class="border rounded-md p-[10px]">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item prop="name" class="mt-[12px]">
            <template #label>
              <p class="text-gray-500 text-xs">
                {{ t("dataPipelines.taskName") }}
              </p>
            </template>
            <el-input
              v-model="form.name"
              :placeholder="`${t('dataPipelines.toInput')}${t(
                'dataPipelines.taskName'
              )}`"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item prop="des" class="mt-[12px]">
            <template #label>
              <p class="text-gray-500 text-xs">
                {{ t("dataPipelines.taskDescription") }}
              </p>
            </template>
            <el-input
              v-model="form.des"
              :placeholder="`${t('dataPipelines.toInput')}${t(
                'dataPipelines.taskDescription'
              )}`"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item prop="from_csg_hub_repo_id" class="mt-[12px]">
            <template #label>
              <p class="text-gray-500 text-xs">
                {{ t("dataPipelines.dataSource") }}
              </p>
            </template>
            <el-select
              v-model="form.from_csg_hub_repo_id"
              :placeholder="`${t('dataPipelines.toSel')}${t(
                'dataPipelines.dataSource'
              )}`"
              @change="fetchBranchList"
            >
              <el-option
                v-for="item in selListData"
                :key="item.id"
                :label="item.name"
                :value="item.path"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item prop="from_csg_hub_dataset_branch" class="mt-[12px]">
            <template #label>
              <p class="text-gray-500 text-xs">
                {{ t("dataPipelines.dataSourceBranch") }}
              </p>
            </template>
            <el-select
              v-model="form.from_csg_hub_dataset_branch"
              :placeholder="t('dataPipelines.toSel')"
            >
              <el-option
                v-for="item in branchList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <p class="text-gray-900 text-2xl font-medium my-4">
        {{ t("dataPipelines.dataSourceManagement") }}
      </p>
      <el-row
        :gutter="20"
        class="border rounded-md p-[10px] mb-4"
        v-for="(group, groupKey) in dataObj"
        :key="groupKey"
      >
        <!-- 源格式 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item prop="from_data_type" class="mt-[12px]">
            <template #label>
              <p class="text-gray-500 text-xs">
                {{ t("dataPipelines.sourceFormat") }}
              </p>
            </template>
            <el-radio-group
              v-model="form.from_data_type"
              @change="handleSourceChange(groupKey)"
            >
              <el-radio
                v-for="format in group.from_format_types"
                :key="`${groupKey}-from-${format.value}`"
                :label="format.value"
                size="large"
              >
                {{ format.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <!-- 目标格式 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item prop="to_data_type" class="mt-[12px]">
            <template #label>
              <p class="text-gray-500 text-xs">
                {{ t("dataPipelines.targetFormat") }}
              </p>
            </template>
            <el-radio-group v-model="form.to_data_type">
              <el-radio
                v-for="format in group.to_format_types"
                :key="`${groupKey}-to-${format.value}`"
                :label="format.value"
                :disabled="activeGroup !== groupKey"
                size="large"
              >
                {{ format.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <p class="text-gray-900 text-2xl font-medium my-2">
        {{ t("dataPipelines.dataFlow") }}
      </p>
      <el-row :gutter="20" class="border rounded-md p-[10px]">
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item prop="to_csg_hub_repo_id" class="mt-[12px]">
            <template #label>
              <p class="text-gray-500 text-xs">
                {{ t("dataPipelines.dataFlow") }}
              </p>
            </template>
            <el-select
              v-model="form.to_csg_hub_repo_id"
              :placeholder="`${t('dataPipelines.toSel')}${t(
                'dataPipelines.dataFlow'
              )}`"
              clearable
              @change="selListDataChange"
            >
              <el-option
                v-for="item in selListData"
                :label="item.name"
                :value="item.path"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <el-form-item
            prop="to_csg_hub_dataset_default_branch"
            class="mt-[12px]"
          >
            <template #label>
              <p class="text-gray-500 text-xs">
                {{ t("dataPipelines.dataFlowBranch") }}
              </p>
            </template>
            <!-- <el-select
              v-model="form.to_csg_hub_dataset_default_branch"
              style="width: 100%"
              :placeholder="t('dataPipelines.toSel')"
            >
              <el-option
                v-for="item in to_branchList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              />
            </el-select> -->
            <el-input
              v-model="form.to_csg_hub_dataset_default_branch"
              :placeholder="`${t('dataPipelines.toInput')}${t(
                'dataPipelines.dataFlowBranch'
              )}`"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="flex items-center justify-end gap-2 pt-5 bottomBtnGroup">
      <CsgButton
        class="btn btn-primary btn-md whitespace-nowrap mr-[5px]"
        v-loading="formLoading"
        @click="submit"
        :name="`${t('dataPipelines.startExecution')}`"
      />
      <CsgButton
        class="btn btn-secondary-gray btn-md whitespace-nowrap"
        @click="router.back()"
        :name="t('dataPipelines.cancel')"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, inject, computed, watch } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import useFetchApi from "@/packs/useFetchApi";
import useUserStore from "@/stores/UserStore";
import { useI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();
const formLoading = ref(false);
const userStore = useUserStore();
// 表单
const form = ref({
  // from_format_types: null,
  // to_data_type: null,
});
// 表单校验
const formData = ref();
const rules = ref({
  name: [
    {
      required: true,
      message: `${t("dataPipelines.toInput")}${t("dataPipelines.taskName")}`,
      trigger: "blur",
    },
  ],
  des: [
    {
      required: false,
      message: `${t("dataPipelines.toInput")}${t(
        "dataPipelines.taskDescription"
      )}`,
      trigger: "blur",
    },
  ],
  from_csg_hub_repo_id: [
    {
      required: true,
      message: `${t("dataPipelines.toSel")}${t("dataPipelines.dataSource")}`,
      trigger: "blur",
    },
  ],
  from_csg_hub_dataset_branch: [
    {
      required: true,
      message: `${t("dataPipelines.toSel")}${t(
        "dataPipelines.dataSourceBranch"
      )}`,
      trigger: "blur",
    },
  ],
  from_data_type: [
    {
      required: true,
      message: `${t("dataPipelines.toSel")}${t("dataPipelines.sourceFormat")}`,
      trigger: "blur",
    },
  ],
  to_data_type: [
    {
      required: true,
      message: `${t("dataPipelines.toSel")}${t("dataPipelines.targetFormat")}`,
      trigger: "blur",
    },
  ],
  to_csg_hub_repo_id: [
    {
      required: true,
      message: `${t("dataPipelines.toSel")}${t("dataPipelines.dataFlow")}`,
      trigger: "change",
    },
  ],
  to_csg_hub_dataset_default_branch: [
    {
      required: true,
      message: `${t("dataPipelines.toSel")}${t(
        "dataPipelines.dataFlowBranch"
      )}`,
      trigger: "change",
    },
  ],
});

// 数据源下拉框列表
const selListData = ref([]);
const csg_hub_dataset_info = ref({});
// 格式转换
const dataObj = ref([]);

// 数据来源分支
const branchList = ref([]);
// 数据流向分支
const to_branchList = ref([]);

const activeGroup = ref(null);

// 处理源格式变化
const handleSourceChange = (groupKey) => {
  console.log(form.value.from_data_type, "-------------------");
  console.log(groupKey, "groupKeygroupKeygroupKey");
  activeGroup.value = groupKey;
  form.value.to_data_type = null; // 重置目标格式选择
};

onMounted(() => {
  getSelListData();
  getFormatTypeList();
  fetchUserToken();
});

const fetchUserToken = async () => {
  // if (!userStore.username) return

  const { data } = await useFetchApi(
    // ${userStore.username}
    `/user/${userStore.username}/tokens?app=git`
  ).json();
  if (data.value) {
    const body = data.value;
    if (body.data) {
      accessToken.value = body.data[0].token;
    }
  }
};

/**
 * 查询数据来源分支
 */
const fetchBranchList = async (val) => {
  if (val) {
    let params = selListData.value.find((item) => item.path === val);
    form.value.from_csg_hub_dataset_name = params.name;
    form.value.from_csg_hub_dataset_id = params.id;
  } else {
    form.value.from_csg_hub_dataset_name = "";
    form.value.from_csg_hub_dataset_id = "";
  }
  form.value.from_csg_hub_dataset_branch = "";

  const url = `/datasets/${form.value.from_csg_hub_repo_id}/branches`;
  let options = {
    headers: {
      Authorization: `Bearer ${cookies.get("user_token")}`,
      cookie: `previous_path=${cookies.get(
        "previous_path"
      )};user_token=${cookies.get("user_token")};`,
    },
  };
  const { data } = await useFetchApi(url, options).get().json();
  if (data.value && data.value.data) {
    branchList.value = data.value.data;
  }
};

/**
 * 查询数据流向分支
 * @param val
 */
const selListDataChange = async (val) => {
  if (val) {
    let params = selListData.value.find((item) => item.path === val);
    form.value.to_csg_hub_dataset_name = params.name;
    form.value.to_csg_hub_dataset_id = params.id;
  } else {
    form.value.to_csg_hub_dataset_name = "";
    form.value.to_csg_hub_dataset_id = "";
  }
  form.value.to_csg_hub_dataset_default_branch = "";

  const url = `/datasets/${form.value.to_csg_hub_repo_id}/branches`;
  let options = {
    headers: {
      Authorization: `Bearer ${cookies.get("user_token")}`,
      cookie: `previous_path=${cookies.get(
        "previous_path"
      )};user_token=${cookies.get("user_token")};`,
    },
  };
  const { data } = await useFetchApi(url, options).get().json();
  if (data.value && data.value.data) {
    to_branchList.value = data.value.data;
  }
};

/**
 * 获取数据流向
 * @param type
 */
const getSelListData = async (type) => {
  let options = {
    headers: {
      Authorization: `Bearer ${cookies.get("user_token")}`,
      cookie: `previous_path=${cookies.get(
        "previous_path"
      )};user_token=${cookies.get("user_token")};`,
    },
  };
  const { data } = await useFetchApi(
    `/user/${userStore.username}/datasets?per=50&page=1`,
    options
  )
    .get()
    .json();
  console.log(data, "datadatadatadatadatadata");
  selListData.value = data.value.data;
};

/**
 * 获取数据格式类型列表
 */
const getFormatTypeList = async () => {
  let url = "/dataflow/formatify/formatify/get_format_type_list";
  const { data } = await useFetchApi(url).get().json();
  if (data.value?.code === 200) {
    dataObj.value = data.value.data;
  }
};

const submit = async () => {
  formData.value.validate(async (valid, fields) => {
    console.log(valid, "validvalidvalidvalid");
    if (valid) {
      // formLoading.value = true;
      console.log(form.value, "-----------------------------");
      let params = {
        ...form.value,
      };

      console.log(params, "paramsparamsparamsparamsparamsparamsparamsparams");

      const options = {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      };
      formLoading.value = true;
      const loading = ElLoading.service({
        lock: true,
        text: `${t("dataPipelines.inProgress")}...`,
        background: "rgba(0, 0, 0, 0.7)",
      });
      const { data, error } = await useFetchApi(
        "/dataflow/formatify/formatify/create",
        options
      )
        .post()
        .json();
      formLoading.value = false;
      loading.close();
      console.log(data, "datadatadatadatadatadatadatadatadata");
      if (data.value.code === 200) {
        ElMessage.success(t("dataPipelines.operationSuccessful"));
        router.back();
      } else {
        ElMessage.error(data.value.msg);
      }
    }
  });
};
</script>
<style lang="less" scoped>
:deep(.settingsTableBtn) {
  .el-button {
    padding: 0 !important;
    margin-right: 20px !important;
    font-size: 14px !important;
    color: #667085 !important;
    font-weight: 400 !important;
    &:hover {
      color: #3250bd !important;
    }
  }
}

:deep(.tableCont) {
  .el-button--text {
    background: transparent !important;
  }
}

:deep(.el-form--inline) {
  .el-form-item {
    margin-right: 12px;
  }
}
.borderBox {
  border-radius: var(--spacing-lg, 12px);
  border: var(--spacing-none, 1px) solid
    var(--colors-gray-light-mode-200, #eaecf0);
  background: var(--Base-White, #fff);
  overflow: hidden;
}
:deep(.el-table__header) {
  background: var(--Gray-50, #f9fafb);
}
:deep(.el-table) {
  .el-table__cell {
    padding: 16px 24px;
  }
}
:deep(.tableCont) {
  .el-button--text {
    border: none;
  }
  .el-table__cell {
    font-size: 14px;
    color: #101828;
    font-weight: 400;
  }
}
:deep(.tableHeader) {
  font-size: 12px !important;
  font-weight: normal !important;
  color: #475467;
  padding: 12px 24px !important;
  border-bottom: 1px solid var(--colors-gray-light-mode-200, #eaecf0);
  background: var(--Gray-50, #f9fafb) !important;
}

:deep(.el-form) {
  padding: 15px;
}
</style>
