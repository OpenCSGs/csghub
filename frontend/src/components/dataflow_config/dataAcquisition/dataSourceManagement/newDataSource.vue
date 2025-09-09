<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-5">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p
        class="text-gray-700 text-sm font-medium cursor-pointer hover:text-brand-700"
        @click="navigateToPage"
      >
        {{ t("dataPipelines.dataSourceManagement") }}
      </p>
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-700 text-sm font-medium">
        {{ t("dataPipelines.addDataSource") }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">
      {{ t("dataPipelines.addDataSource") }}
    </p>
    <!-- <p class="text-gray-600 text-md mt-[2px]">
      {{ t('dataPipelines.dataProcessingDescription') }}
    </p> -->

    <!-- S top -->
    <el-row :gutter="20" class="mt-[16px]">
      <el-col
        :xs="24"
        :sm="12"
        :md="6"
        :lg="6"
        :xl="6"
        v-for="item in dataList"
        :key="item.id"
      >
        <el-card
          shadow="hover"
          @click="selectDataSource(item.name, item.id)"
          :class="item.name === typeVal ? `card-border${item.id}` : ''"
        >
          <div class="top-card">
            <el-icon v-if="item.name === typeVal" class="type-checkbox"
              ><Check
            /></el-icon>
            <div class="flex items-center justify-center">
              <div
                class="w-[36px] h-[36px] rounded-full flex justify-center items-center mr-[10px] bg-slate-50"
              >
                <SvgIcon
                  class="w-[20px] h-[20px]"
                  :name="`${item.name}_color`"
                />
              </div>
              <div
                class="title truncate w-full flex-1"
                :title="$t(`dataPipelines.dataSourceInfo.${item.name}.title`)"
              >
                {{ $t(`dataPipelines.dataSourceInfo.${item.name}.title`) }}
              </div>
            </div>
            <div
              class="desc text-xs mt-[5px]"
              :title="$t(`dataPipelines.dataSourceInfo.${item.name}.desc`)"
            >
              {{ $t(`dataPipelines.dataSourceInfo.${item.name}.desc`) }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- E top -->

    <el-card
      v-if="typeVal === 'Mysql' || typeVal === 'Mongodb' || typeVal === 'Hive'"
      shadow="never"
      class="mt-[16px]"
    >
      <p class="text-gray-900 text-2xl font-medium">
        {{ t("dataPipelines.dataConnectionConfiguration") }}
      </p>

      <el-form
        label-position="top"
        :model="formInline"
        :rules="rules"
        ref="ruleFormRef"
      >
        <el-row :gutter="20" class="mt-[16px]">
          <el-col
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="12"
            v-if="typeVal !== 'File'"
          >
            <el-form-item prop="name" class="mt-[12px]">
              <template #label>
                <p class="text-gray-500 text-xs">
                  {{ t("dataPipelines.collectionSourceName") }}
                </p>
              </template>
              <el-input
                v-model="formInline.name"
                :placeholder="`${t('dataPipelines.toInput')}${t(
                  'dataPipelines.collectionSourceName'
                )}`"
                clearable
              >
                <template #prefix>
                  <SvgIcon
                    class="w-5 h-5 mx-2 text-gray-500"
                    name="CollectionSourceName"
                  />
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col
            v-if="typeVal !== 'File'"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item prop="des" class="mt-[12px]">
              <template #label>
                <p class="text-gray-500 text-xs">
                  {{ t("dataPipelines.collectionSourceDesc") }}
                </p>
              </template>
              <el-input
                v-model="formInline.des"
                :placeholder="`${t('dataPipelines.toInput')}${t(
                  'dataPipelines.collectionSourceDesc'
                )}`"
                clearable
              >
                <template #prefix>
                  <SvgIcon
                    class="w-5 h-5 mx-2 text-gray-500"
                    name="description"
                  />
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item prop="database" class="mt-[12px]">
              <template #label>
                <p class="text-gray-500 text-xs">
                  {{ t("dataPipelines.DatabaseName") }}
                </p>
              </template>
              <el-input
                v-model="formInline.database"
                :placeholder="`${t('dataPipelines.toInput')}${t(
                  'dataPipelines.DatabaseName'
                )}`"
                clearable
              >
                <template #prefix>
                  <SvgIcon
                    class="w-5 h-5 mx-2 text-gray-500"
                    name="datasets1"
                  />
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item prop="host" class="mt-[12px]">
              <template #label>
                <p class="text-gray-500 text-xs">
                  {{ t("dataPipelines.ServerAddress") }}
                </p>
              </template>
              <el-input
                v-model="formInline.host"
                :placeholder="`${t('dataPipelines.toInput')}${t(
                  'dataPipelines.ServerAddress'
                )}`"
                clearable
              >
                <template #prefix>
                  <SvgIcon
                    class="w-5 h-5 mx-2 text-gray-500"
                    name="server-fill"
                  />
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col
            v-if="typeVal === 'Mysql' || typeVal === 'Hive'"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item prop="port" class="mt-[12px]">
              <template #label>
                <p class="text-gray-500 text-xs">
                  {{ t("dataPipelines.port") }}
                </p>
              </template>
              <el-input
                v-model="formInline.port"
                :placeholder="`${t('dataPipelines.toInput')}${t(
                  'dataPipelines.port'
                )}`"
                clearable
              >
                <template #prefix>
                  <SvgIcon
                    class="w-5 h-5 mx-2 text-gray-500"
                    name="port-number"
                  />
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col
            v-if="typeVal === 'Mysql' || typeVal === 'Hive'"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item prop="username" class="mt-[12px]">
              <template #label>
                <p class="text-gray-500 text-xs">
                  {{ t("dataPipelines.username") }}
                </p>
              </template>
              <el-input
                v-model="formInline.username"
                :placeholder="`${t('dataPipelines.toInput')}${t(
                  'dataPipelines.username'
                )}`"
                clearable
              >
                <template #prefix>
                  <SvgIcon class="w-5 h-5 mx-2 text-gray-500" name="user-1" />
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col
            v-if="typeVal === 'Mysql' || typeVal === 'Hive'"
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item prop="password" class="mt-[12px]">
              <template #label>
                <p class="text-gray-500 text-xs">
                  {{ t("dataPipelines.password") }}
                </p>
              </template>
              <el-input
                v-model="formInline.password"
                :placeholder="`${t('dataPipelines.toInput')}${t(
                  'dataPipelines.password'
                )}`"
                type="password"
                show-password
                clearable
              >
                <template #prefix>
                  <SvgIcon
                    class="w-5 h-5 mx-2 text-gray-500"
                    name="auth-icon"
                  />
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="12"
            v-if="typeVal === 'Hive'"
          >
            <el-form-item prop="auth_type" class="mt-[12px]">
              <template #label>
                <p class="text-gray-500 text-xs">
                  {{ t("dataPipelines.authType") }}
                </p>
              </template>
              <el-select
                v-model="formInline.auth_type"
                :placeholder="`${t('dataPipelines.toSel')}${t(
                  'dataPipelines.authType'
                )}`"
                clearable
              >
                <el-option
                  :label="t('dataPipelines.authType_option_NONE')"
                  value="NONE"
                ></el-option>
                <el-option
                  :label="t('dataPipelines.authType_option_LDAP')"
                  value="LDAP"
                ></el-option>
                <el-option
                  :label="t('dataPipelines.authType_option_KERBEROS')"
                  value="KERBEROS"
                ></el-option>
              </el-select>
              <span class="text-gray-400 text-xs font-light mt-[10px]">{{
                t("dataPipelines.authType_placeholder")
              }}</span>
            </el-form-item>
          </el-col>

          <el-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="24"
            :xl="24"
            class="text-right"
          >
            <CsgButton
              class="btn btn-primary btn-sm whitespace-nowrap"
              :name="t('dataPipelines.testLink')"
              v-loading="subLoading"
              :isElementIcon="true"
              svgName="Link"
              @click="testLink(ruleFormRef)"
            />
          </el-col>
        </el-row>
      </el-form>

      <!-- S 数据筛选配置 -->
      <p class="text-gray-900 text-2xl font-medium filter-title">
        {{ t("dataPipelines.dataFilteringConfiguration") }}
        <!-- <el-checkbox-group v-model="checkList">
          <el-checkbox label="使用数据源采集数据" value="1" />
          <el-checkbox v-if="typeVal === 'Mysql'" label="使用SQL语句采集数据" value="2" />
          <el-checkbox v-if="typeVal === 'Mongodb'" label="使用查询语句采集数据" value="3" />
        </el-checkbox-group> -->

        <el-radio-group v-model="filterType">
          <!-- <el-radio value="" size="large">使用数据源采集数据</el-radio>
          <el-radio value="sql" size="large">使用SQL语句采集数据</el-radio> -->
          <!-- <el-radio value="3" size="large" v-if="typeVal === 'Mongodb'">使用查询语句采集数据</el-radio> -->
        </el-radio-group>
      </p>
      <!-- E 数据筛选配置 -->

      <div v-if="filterType === ''">
        <!-- S 选择集合 -->
        <p class="text-gray-500 text-sm text-xs mt-[16px]">
          {{ t("dataPipelines.selectionSet") }}
        </p>
        <div class="table-field-select mt-[16px]">
          <!-- 左侧表名选择区域 -->
          <div class="left-section">
            <el-input
              v-model="searchLeft"
              :placeholder="t('dataPipelines.searchForTheTableName')"
              prefix-icon="Search"
              class="search-input"
            />
            <el-checkbox
              v-model="checkAllLeft"
              :indeterminate="isIndeterminateLeft"
              @change="handleCheckAllLeft"
              >{{ t("dataPipelines.selectAll") }}</el-checkbox
            >
            <el-checkbox-group v-model="selectedLeftTables">
              <el-checkbox
                v-for="table in filteredLeftTables"
                :key="table"
                :label="table"
                @change="handleLeftTableChange"
                ><span :title="table" class="truncate inline-block w-[110px]">{{
                  table
                }}</span></el-checkbox
              >
            </el-checkbox-group>
          </div>

          <!-- 中间已选表名展示区域 -->
          <div class="middle-section" v-if="typeVal !== 'Mongodb'">
            <el-input
              v-model="searchMiddle"
              :placeholder="t('dataPipelines.searchForTheTableName')"
              prefix-icon="Search"
              class="search-input cursor-pointer"
            />
            <div class="selected-tables">
              <el-tag
                v-for="(table, index) in filteredMiddleTables"
                :key="index"
                closable
                @close="handleCloseMiddleTable(table)"
                :type="currentTable === table ? 'primary' : ''"
                @click="handleSelectMiddleTable(table)"
                class="middle-table-tag"
                >{{ table }}</el-tag
              >
            </div>
          </div>

          <!-- 右侧字段选择区域 -->
          <div class="right-section" v-if="typeVal !== 'Mongodb'">
            <div class="text-gray-500 text-sm text-xs mb-[16px]">
              {{ t("dataPipelines.allFields") }} ({{ currentTable }})
            </div>
            <!-- <div v-else class="empty-field">请从中间选择表名查看字段</div> -->
            <el-checkbox-group
              v-model="currentSelectedFields"
              v-if="currentTable"
            >
              <el-checkbox
                v-for="field in currentFields"
                :key="field"
                :label="field"
                ><span :title="field" class="truncate inline-block w-[110px]">{{
                  field
                }}</span></el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
        <!-- E 选择集合 -->
      </div>

      <!-- <div v-else class="sql-select">
        <p class="text-gray-500 text-xs mb-[12px]">SQL查询语句</p>
        <el-input
          v-model="sqlValue"
          :rows="6"
          type="textarea"
          placeholder="输入SQL查询语句..."
        />
        <div class="text-right mt-[12px]">
          <CsgButton
            class="btn btn-primary btn-sm whitespace-nowrap"
            name="测试SQL"
            :isElementIcon="true"
            svgName="Check"
            @click="testSql"
          />
        </div>
      </div> -->

      <!-- S 数据流向 -->
      <el-form
        label-position="top"
        :rules="rules2"
        ref="ruleFormRef2"
        :model="formInline"
      >
        <el-row :gutter="20" class="mt-[16px]">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item prop="dataFlow" class="mt-[12px]">
              <template #label>
                <p class="text-gray-500 text-xs">
                  {{ t("dataPipelines.dataFlow") }}
                </p>
              </template>
              <el-select
                v-model="formInline.dataFlow"
                :placeholder="`${t('dataPipelines.toSel')}${t(
                  'dataPipelines.dataFlow'
                )}`"
                clearable
                @change="selListDataChange"
              >
                <el-option
                  v-for="val in selListData"
                  :label="val.name"
                  :value="val.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item
              prop="extra_config.csg_hub_dataset_name"
              class="mt-[12px]"
            >
              <template #label>
                <p class="text-gray-500 text-xs">{{ t("dataPipelines.dataFlowBranch") }}</p>
              </template>
              <el-input
                v-model="formInline.extra_config.csg_hub_dataset_name"
                :placeholder="`${t('dataPipelines.toInput')}${t('dataPipelines.dataFlowBranch')}`"
                clearable
              >
                <!-- <template #prefix>
                  <SvgIcon
                    class="w-5 h-5 mx-2 text-gray-500"
                    name="datasets1"
                  />
                </template> -->
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- E 数据流向 -->
    </el-card>

    <el-card v-if="typeVal === 'File'" shadow="never" class="mt-[16px]">
      <p class="text-gray-900 text-2xl font-medium">
        {{ t("dataPipelines.fileUpload") }}
      </p>

      <el-form label-position="top" :model="formInline">
        <el-row :gutter="20" class="mt-[16px]">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item>
              <template #label>
                <p class="text-gray-500 text-xs mt-[12px]">
                  {{ t("dataPipelines.dataFlow") }}
                </p>
              </template>

              <div style="width: 100%" class="w-full flex">
                <el-select
                  v-model="formInline.dataFlow"
                  :placeholder="`${t('dataPipelines.toSel')}${t(
                    'dataPipelines.dataFlow'
                  )}`"
                  clearable
                  @change="selListDataChange"
                >
                  <el-option
                    v-for="val in selListData"
                    :label="val.name"
                    :value="val.name"
                  />
                </el-select>

                <CsgButton
                  class="btn btn-primary btn-sm whitespace-nowrap ml-[20px]"
                  :name="t('dataPipelines.jumpLink')"
                  :isElementIcon="true"
                  svgName="Link"
                  @click="jumpLink"
                />
              </div>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <el-form-item>
              <template #label>
                <p class="text-gray-500 text-xs mt-[12px]">数据流向分支</p>
              </template>
              <div style="width: 100%">
                <el-select
                  v-model="formInline.format2"
                  placeholder="请选择数据流向分支"
                  clearable
                  style="width: calc(100% - 102px)"
                >
                  <el-option label="Zone one" value="shanghai" />
                  <el-option label="Zone two" value="beijing" />
                </el-select>

                <CsgButton
                  class="btn btn-primary btn-sm whitespace-nowrap ml-[12px]"
                  name="测试连接"
                  :isElementIcon="true"
                  svgName="Link"
                />
              </div>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
    </el-card>

    <div
      class="flex items-center justify-end gap-2 pt-5 bottomBtnGroup"
      v-if="typeVal !== 'File'"
    >
      <CsgButton
        class="btn btn-secondary-gray btn-md whitespace-nowrap"
        @click="geback"
        :name="t('dataPipelines.cancel')"
      />
      <CsgButton
        class="btn btn-primary btn-md whitespace-nowrap"
        v-loading="subLoading"
        :name="t('dataPipelines.saveTheConfiguration')"
        @click="submit"
      />
      <CsgButton
        class="btn btn-primary btn-md whitespace-nowrap"
        v-loading="subLoading"
        :name="t('dataPipelines.saveAndExecute')"
        @click="centerDialogVisible = true"
      />
    </div>

    <el-dialog
      v-model="centerDialogVisible"
      :title="t('dataPipelines.saveAndExecute')"
      width="500"
      align-center
    >
      <el-radio-group v-model="is_run" class="execute-type">
        <el-radio :value="true" size="large">
          {{ t("dataPipelines.executeImmediately") }}</el-radio
        >
        <el-radio :value="false" size="large">
          {{ t("dataPipelines.selectTheExecutionTime") }}</el-radio
        >
      </el-radio-group>

      <el-date-picker
        v-if="is_run === false"
        v-model="formInline.task_run_time"
        value-format="YYYY-MM-DD HH:mm:ss"
        type="datetime"
        :placeholder="t('dataPipelines.PleaseSelectTime')"
        style="width: 100%"
      />

      <template #footer>
        <div class="flex justify-end gap-2">
          <CsgButton
            class="btn btn-secondary-gray btn-md whitespace-nowrap"
            @click="centerDialogVisible = false"
            :name="t('dataPipelines.cancel')"
          />
          <CsgButton
            class="btn btn-primary btn-md whitespace-nowrap ml-[12px]"
            v-loading="subLoading"
            :name="t('dataPipelines.sure')"
            @click="submit(2)"
          />
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, watch, reactive, computed } from "vue";
import { ElMessage, ElLoading } from "element-plus";
import useUserStore from "@/stores/UserStore";
import useFetchApi from "../../../../packs/useFetchApi";
import zhOps from "../../../../locales/zh_js/operator_zh.json";
import enOps from "../../../../locales/en_js/operator_en.json";
import FieldMapping from "./components/fieldMapping.vue";
import ConnectAttribute from "./components/connectAttribute.vue";
import Sortable from "sortablejs";
import { useI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const router = useRouter();
const userStore = useUserStore();
const { t, locale } = useI18n();
const dataList = ref([]);
const dataSourceList = ref([]);
const templateList = ref([]);
const subLoading = ref(false);
const dataflowOps = {
  zh: zhOps,
  en: enOps,
};
const route = useRoute();
const selTemplate = ref(
  route.query.templateId ? route.query.templateId * 1 : 0
);
const taskUseType = ref(route.query.type ? route.query.type : "ops");
const seltool = ref({});
const form = ref({
  project_name: "",
  dataset_path: "",
  export_path: "",
  text_keys: "text",
  owner: "",
  repo_id: route.query.datasetPath || "",
  branch: "",
  selTemplate: route.query.templateId ? route.query.templateId * 1 : 0,
  selToolIndex: 0,
  process: [],
});
const sqlValue = ref("");
const ruleFormRef = ref(null);
const ruleFormRef2 = ref(null);
const rules = ref({
  database: [
    {
      required: true,
      message: `${t("dataPipelines.toInput")}${t(
        "dataPipelines.DatabaseName"
      )}`,
      trigger: "blur",
    },
  ],
  host: [
    {
      required: true,
      message: `${t("dataPipelines.toInput")}${t(
        "dataPipelines.ServerAddress"
      )}`,
      trigger: "blur",
    },
  ],
  port: [
    {
      required: true,
      message: `${t("dataPipelines.toInput")}${t("dataPipelines.port")}`,
      trigger: "blur",
    },
  ],
  username: [
    {
      required: true,
      message: `${t("dataPipelines.toSel")}${t("dataPipelines.username")}`,
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: `${t("dataPipelines.toInput")}${t("dataPipelines.password")}`,
      trigger: "blur",
    },
  ],
  auth_type: [
    {
      required: true,
      message: `${t("dataPipelines.toSel")}${t("dataPipelines.authType")}`,
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message: `${t("dataPipelines.toInput")}${t(
        "dataPipelines.collectionSourceName"
      )}`,
      trigger: "change",
    },
  ],
  des: [
    {
      required: true,
      message: `${t("dataPipelines.toInput")}${t("dataPipelines.description")}`,
      trigger: "change",
    },
  ],
  // dataFlow: [
  //   {
  //     required: true,
  //     message: `请选择数据流向` ,
  //     trigger: "blur",
  //   },
  // ],
});
const rules2 = ref({
  dataFlow: [
    {
      required: true,
      message: `${t('dataPipelines.toSel')}${t('dataPipelines.dataFlow')}`,
      trigger: "blur",
    },
  ],
  // "extra_config.csg_hub_dataset_name": [
  //   {
  //     required: true,
  //     message: `请输入数据流向分支`,
  //     trigger: "change",
  //   },
  // ],
});

// 数据转换配置
// 模拟初始数据
const idField = ref({
  source: "_id",
  target: "Mongodb_id",
  method: "keep",
});
const nestedField = ref({
  source: "host",
  prefix: "addr_",
  method: "flatten",
});
const addedRules = ref([]);

// 左侧表名列表
const allTables = ref([]);
const searchLeft = ref("");
const selectedLeftTables = ref([]);
const checkAllLeft = ref(false);

// 中间已选表名
const selectedMiddleTables = ref([]);
const searchMiddle = ref("");

// 当前选中的表和字段
const currentTable = ref(null);
const selectedFields = ref([]);

// =======================================================
const formInline = reactive({
  extra_config: {
    csg_hub_dataset_name: "",
  },
  // --------------mysql----------------------
  // database: "mysql",
  // host: "net-power.9free.com.cn",
  // port: "18126",
  // username: "z275748353",
  // password: "zQ5*yH2m!B8pD^3x",
  // name: "采集源名称",
  // des: "描述",
  // --------------mongodb----------------------
  // database: "admin",
  // host: "mongodb://z275748353:example@net-power.9free.com.cn:18123",
  // name: "采集源名称",
  // des: "描述",
  // --------------hive----------------------
  // database: "suudent",
  // host: "net-power.9free.com.cn",
  // port: "18133",
  // username: "hive",
  // password: "hive",
  // name: "采集源名称",
  // des: "描述",
});

const typeVal = ref("Mysql");
const typeId = ref(1);
const centerDialogVisible = ref(false);
const is_run = ref(true);
const tableData = ref([]);

const checkList = ref(["1"]);
const filterType = ref("");

const openSSL = ref(true);
const dataConversion = ref([]);
// 模拟表结构数据
const tableStructure = ref([]);
// 数据源下拉框列表
const selListData = ref([]);
const csg_hub_dataset_info = ref({});

// 计算属性
const filteredLeftTables = computed(() => {
  return allTables.value.filter((table) =>
    table.toLowerCase().includes(searchLeft.value.toLowerCase())
  );
});

const filteredMiddleTables = computed(() => {
  return selectedMiddleTables.value.filter((table) =>
    table.toLowerCase().includes(searchMiddle.value.toLowerCase())
  );
});

const isIndeterminateLeft = computed(() => {
  const filteredCount = filteredLeftTables.value.length;
  const selectedCount = selectedLeftTables.value.filter((table) =>
    filteredLeftTables.value.includes(table)
  ).length;

  return selectedCount > 0 && selectedCount < filteredCount;
});

const currentFields = computed(() => {
  if (!currentTable.value) return [];
  const tableObj = tableStructure.value.find(
    (t) => t.table_name === currentTable.value
  );

  if (typeId.value === 4)
    return tableObj ? tableObj.columns.map((col) => col) : [];
  return tableObj ? tableObj.columns.map((col) => col.column_name) : [];
});

const selectedFieldsByTable = ref({});
// 初始化表字段选择
const initTableSelection = (table) => {
  if (!selectedFieldsByTable.value[table]) {
    const tableObj = tableStructure.value.find((t) => t.table_name === table);
    if (tableObj) {
      // 默认全选所有字段
      if (typeId.value === 4) {
        selectedFieldsByTable.value[table] = tableObj.columns.map((col) => col);
      } else {
        selectedFieldsByTable.value[table] = tableObj.columns.map(
          (col) => col.column_name
        );
      }
    }
  }
};
const currentSelectedFields = computed({
  get() {
    if (!currentTable.value) return [];
    initTableSelection(currentTable.value); // 确保已初始化
    return selectedFieldsByTable.value[currentTable.value] || [];
  },
  set(val) {
    if (currentTable.value) {
      selectedFieldsByTable.value[currentTable.value] = val;
    }
  },
});

const changeTaskType = async () => {
  if (taskUseType.value === "ops") {
    const tableBody = document.querySelector(".el-table__body-wrapper tbody");
    Sortable.create(tableBody, {
      handle: ".drag-handle",
      animation: 300,
      onEnd({ newIndex, oldIndex }) {
        const [removedItem] = tableData.value.splice(oldIndex, 1);
        tableData.value.splice(newIndex, 0, removedItem);
      },
    });
  }
};

onMounted(() => {
  updateOwner();
  // getTemplateData();
  getDataSourceTypeList();
  // if (route.query.datasetPath) {
  //   if (!form.value.repo_id) {
  //     form.value.repo_id = route.query.datasetPath;
  //   }
  // }
  changeTaskType();
});

/**
 * 测试链接接口
 */
const testLink = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let params = {
        ...formInline,
        source_type: typeId.value,
      };
      const options = {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      };
      const newEndpoint = "/dataflow/datasource/datasource/test-connection";
      const loading = ElLoading.service({
        lock: true,
        text: `${t("dataPipelines.testingConnection")}...`,
        background: "rgba(0, 0, 0, 0.7)",
      });
      const { data, error } = await useFetchApi(newEndpoint, options)
        .post()
        .json();
      loading.close();
      if (data.value.code === 200) {
        // MongoDB
        if (typeId.value === 2) {
          getDatasourceTables(options);
        } else {
          getDatasourceTableAndColumns(options);
        }
      } else {
        ElMessage.error(t("dataPipelines.linkError"));
      }
    }
  });
};

const selListDataChange = (val) => {
  if (val) {
    csg_hub_dataset_info.value = selListData.value.find(
      (item) => item.name === val
    );
  } else {
    csg_hub_dataset_info.value = {};
  }

  console.log(
    csg_hub_dataset_info.value,
    "csg_hub_dataset_info.valuecsg_hub_dataset_info.value"
  );
};

// 跳转链接
const jumpLink = () => {
  if (!formInline.dataFlow || !formInline.dataFlow?.length)
    return ElMessage.warning(
      `${t("dataPipelines.toSel")}${t("dataPipelines.dataFlow")}`
    );
  setTimeout(() => {
    window.open(
      // http://net-power.9free.com.cn:18120
      `${window.location.origin}/datasets/${userStore.username}/${formInline.dataFlow}?tab=files`,
      "_blank"
    );
  });
};

/**
 * 测试通过后查询所有的表
 * @param params
 */
const getDatasourceTables = async (params) => {
  const { data } = await useFetchApi(
    `/dataflow/datasource/datasource/tables`,
    params
  )
    .post()
    .json();

  if (data.value.code === 200) {
    tableStructure.value = data.value.data;
    allTables.value = data.value.data;
    ElMessage.success(t("dataPipelines.linkSuccess"));
  } else {
    ElMessage.error(data.value.msg);
  }
};

/**
 * 测试通过后查询所有的表和下面的字段
 * @param params
 */
const getDatasourceTableAndColumns = async (params) => {
  const { data } = await useFetchApi(
    `/dataflow/datasource/datasource/tables_and_columns`,
    params
  )
    .post()
    .json();

  if (data.value.code === 200) {
    tableStructure.value = data.value.data;
    allTables.value = data.value.data.map((table) => table.table_name);
    ElMessage.success(t("dataPipelines.linkSuccess"));
  } else {
    ElMessage.error(data.value.msg);
  }
};

// const getDatasourceTableColumns = async (table_name, params) => {
//   const { data } = await useFetchApi(
//     `/dataflow/datasource/datasource/table_columns?table_name=${table_name}`,
//     params
//   )
//     .post()
//     .json();
//   if (data.value.code === 200) {
//     if (
//       Array.isArray(tableStructure[table_name]) &&
//       !tableStructure[table_name].length
//     ) {
//       tableStructure[table_name] = data.value.data.map((item) => {
//         return item.column_name;
//       });
//     }
//   }
// };

/**
 * 测试sql
 */
const testSql = async () => {
  let url = "";
  // sqlValue.value  // sql的值
  const { data } = await useFetchApi(url);
  console.log(data, "datadatadatadatadatadatadatadatadatadatadatadata");
};

const getSelListData = async (type) => {
  // let url = `/user/${form.value.owner}/datasets?per=50&page=1`;
  // if (form.value.owner !== userStore.username) {
  //   url = `/organization/${form.value.owner}/datasets?current_user=${userStore.username}&per=50&page=1`;
  // }
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
 * 方法
 * @param val
 */
const handleCheckAllLeft = (val) => {
  if (val) {
    // 只选中过滤后的表
    selectedLeftTables.value = [...filteredLeftTables.value];
    // 同步到中间区域
    syncLeftToMiddle();
  } else {
    selectedLeftTables.value = [];
    // 同步到中间区域
    syncLeftToMiddle();
  }
};

/**
 * 单选
 * @param val val
 * @param table boolean
 */
const handleLeftTableChange = (val, table) => {
  // if (
  //   val &&
  //   Array.isArray(tableStructure[table.target.value]) &&
  //   !tableStructure[table.target.value].length
  // ) {
  //   let params = {
  //     ...formInline,
  //     source_type: typeId.value,
  //   };
  //   getDatasourceTableColumns(table.target.value, {
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(params),
  //   });
  // }
  // 重新计算全选状态
  const filteredCount = filteredLeftTables.value.length;

  const selectedCount = selectedLeftTables.value.filter((t) =>
    filteredLeftTables.value.includes(t)
  ).length;
  checkAllLeft.value = selectedCount === filteredCount;
  syncLeftToMiddle();
};

// 点击中间表时确保初始化
const handleSelectMiddleTable = (table) => {
  currentTable.value = table;
  initTableSelection(table);
};

const submit = (type) => {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      ruleFormRef2.value.validate(async (valid, fields) => {
        if (valid) {
          subLoading.value = true;
          let params = {
            ...formInline,
            source_type: typeId.value,
          };

          if (typeId.value === 1 || typeId.value === 2 || typeId.value === 4) {
            // 数据源采集数据
            if (filterType.value === "") {
              // Mysql
              if (typeId.value === 1) {
                const source = {};
                getSelectedData().forEach((item) => {
                  source[item.table_name] = item.selected_fields;
                });
                params.extra_config.mysql = {
                  source: source,
                };
              }
              // Mongodb
              if (typeId.value === 2) {
                params.extra_config.hive = getSelectedData().map(
                  (item) => item.table_name
                );

                console.log(
                  params.extra_config.mongo,
                  "listlistlistlistlistlist"
                );
              }
              // hive
              if (typeId.value === 4) {
                const source = {};
                getSelectedData().forEach((item) => {
                  source[item.table_name] = item.selected_fields;
                });
                params.extra_config.hive = {
                  source: source,
                };
              }
            } else {
              // sql语句采集数据
              // Mysql
              if (typeId.value === 1) {
                params.extra_config.mysql = {
                  type: filterType.value,
                  sql: sqlValue.value,
                };
              }
              // Mongodb
              if (typeId.value === 2) {
                params.extra_config.Mongodb = {
                  type: filterType.value,
                  sql: sqlValue.value,
                };
              }
              // hive
              if (typeId.value === 4) {
                params.extra_config.hive = {
                  type: filterType.value,
                  sql: sqlValue.value,
                };
              }
            }

            if (Object.keys(csg_hub_dataset_info.value)?.length) {
              // params.extra_config.csg_hub_dataset_name =
              //   csg_hub_dataset_info.value.name;
              params.extra_config.csg_hub_dataset_id =
                csg_hub_dataset_info.value.path;
              params.extra_config.csg_hub_dataset_default_branch =
                csg_hub_dataset_info.value.default_branch || "main";
            }
          }

          // 点击的保存并执行
          if (type === 2) {
            // 立即执行
            if (is_run.value === true) {
              params.is_run = is_run.value;
            } else {
              // 选择时间执行
              if (!formInline.task_run_time)
                return ElMessage.error( `${t('dataPipelines.pleaseSelectAnExecutionTime')}`);
            }
          }

          console.log(
            params,
            "paramsparamsparamsparamsparamsparamsparamsparams"
          );
          const options = {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
          };
          const loading = ElLoading.service({
            lock: true,
            text: `${t("dataPipelines.submitting")}...`,
            background: "rgba(0, 0, 0, 0.7)",
          });
          const { data, error } = await useFetchApi(
            "/dataflow/datasource/datasource/create",
            options
          )
            .post()
            .json();
          subLoading.value = false;
          loading.close();
          if (data.value.code === 200) {
            // ElMessage.success(data.value.msg);
            ElMessage.success(t("dataPipelines.operationSuccessful"));
            router.back();
          } else {
            ElMessage.error(data.value.msg);
          }
        }
      });
    }
  });
};
const syncLeftToMiddle = () => {
  selectedMiddleTables.value = [...new Set(selectedLeftTables.value)];

  // 初始化所有新添加表的字段选择
  selectedMiddleTables.value.forEach((table) => {
    initTableSelection(table);
  });

  if (
    currentTable.value &&
    !selectedMiddleTables.value.includes(currentTable.value)
  ) {
    currentTable.value = null;
  }
};

/**
 * 选择数据源类型
 * @param type 类型 1:Mysql
 * @param id id
 */
const selectDataSource = (type, id) => {
  typeVal.value = type;
  typeId.value = id;
  filterType.value = "";
};
// 删除中间表时清理选择
const handleCloseMiddleTable = (table) => {
  selectedMiddleTables.value = selectedMiddleTables.value.filter(
    (t) => t !== table
  );
  delete selectedFieldsByTable.value[table];

  if (table === currentTable.value) {
    currentTable.value = null;
  }

  selectedLeftTables.value = selectedLeftTables.value.filter(
    (t) => t !== table
  );
};
// 获取选中数据的函数（确保正确）
const getSelectedData = () => {
  return selectedMiddleTables.value.map((table) => ({
    table_name: table,
    selected_fields: selectedFieldsByTable.value[table] || [],
  }));
};

/**
 * 跳转
 */
const navigateToPage = () => {
  router.push("/datapipelines/dataSourceManagement");
};

/**
 * 取消
 */
const geback = () => {
  router.go(-1);
};

const updateOwner = () => {
  // form.value.owner = route.query.datasetPath
  //   ? route.query.datasetPath.split("/")[0]
  //   : userStore.username;
  // console.log(userStore, "userStore.usernameuserStore.username");

  // if (form.value.owner) {
  getSelListData();
  // }
};

function overrideNameByKey(array) {
  return array.map((item) => {
    const newItem = {
      ...item,
      name: item.key,
    };
    if (Array.isArray(item.params)) {
      newItem.params = item.params.map((param) => {
        return {
          ...param,
          name: param.key,
        };
      });
    }

    return newItem;
  });
}

const getDataSourceTypeList = async () => {
  let url = "/dataflow/datasource/datasource/get_data_source_type_list";
  const { data } = await useFetchApi(url).get().json();
  if (data.value?.code === 200) {
    dataList.value = data.value.data;
  }
};
</script>

<style lang="less" scoped>
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
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}

:deep(.el-input-number__increase) {
  right: 2px;
  top: 2px;
  padding: 9px 0;
  border-radius: 0 8px 0 0 !important;
}
:deep(.el-input-number__decrease) {
  padding: 9px 0;
  bottom: 2px;
  right: 2px !important;
  border-radius: 0 0 8px 0 !important;
}

.execute-type {
  :deep(.el-radio) {
    width: 100% !important;
  }
}

:deep(.tableCont) {
  .el-button--text {
    border: none;
  }
  .el-table__cell {
    font-size: 14px;
    color: #344054;
    font-weight: 400;
    z-index: 0;
  }
}
:deep(.tableHeader) {
  font-size: 14px !important;
  font-weight: normal !important;
  color: #475467;
  padding: 12px 24px !important;
  border-bottom: 1px solid var(--colors-gray-light-mode-200, #eaecf0);
  background: var(--Gray-50, #f9fafb) !important;
}

.drag-handle {
  cursor: move;
  display: inline-block;
  width: 20px;
  text-align: center;
  color: #888;
  margin-right: 10px;
}
.typeItemCont > * {
  margin-bottom: 12px;
}

.typeItemCont > *:last-child {
  margin-bottom: 0;
}

// :deep(.el-card__body) {
//   border-left: 4px #4E80EE solid;
// }
.top-card {
  position: relative;
  cursor: pointer;

  .type-checkbox {
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 10;
    color: #3250bd;
  }

  .title {
    margin-bottom: 6px;
  }

  .desc {
    min-height: 36px;
    display: -webkit-box; /* 弹性盒子模型 */
    -webkit-box-orient: vertical; /* 垂直排列 */
    -webkit-line-clamp: 2; /* 限制显示两行 */
    overflow: hidden; /* 隐藏超出内容 */
  }
}

.card-border1 {
  border-left: 4px #4e80ee solid;
  background: rgba(78, 128, 238, 0.1);
}
.card-border2 {
  border-left: 4px #55b685 solid;
  background: rgba(85, 182, 133, 0.1);
}
.card-border3 {
  border-left: 4px #e9a23b solid;
  background: rgba(233, 162, 59, 0.1);
}
.card-border4 {
  border-left: 4px #dc4f49 solid;
  background: rgba(220, 79, 73, 0.1);
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 20px;
}

// ===========================================

:deep(.el-checkbox-group .el-checkbox) {
  padding: 8px;
  // border: 1px solid #ebeef5;
  // background-color: #f5f7fa;
  // border-radius: 4px;
  width: 50%;
  margin: 0;
}
.table-field-select {
  display: flex;
  padding: 10px;
  gap: 20px;
  height: 100%;
  border: 1px #ebebeb solid;
  border-radius: 6px;
}
.left-section,
.middle-section,
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  // height: 100%;
  overflow-y: auto;
  max-height: 500px;
}
.search-input {
  margin-bottom: 10px;
}

/* 左侧表名网格布局 */
.left-tables-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 每行两个，各占50% */
  gap: 8px; /* 间距 */
  overflow-y: auto;
  max-height: 500px;
}

/* 左侧复选框样式 */
.left-table-checkbox {
  padding: 8px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f5f7fa;
}

/* 中间已选表名标签样式 */
.middle-table-tag {
  width: 100%; /* 占满整行 */
  margin-bottom: 8px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  padding: 14px 12px;
}

.selected-tables {
  display: block; /* 改为块级布局 */
  margin-top: 10px;
  overflow-y: auto;
  max-height: 500px;
}

.field-title {
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}
.empty-field {
  color: #909399;
  text-align: center;
  padding: 20px;
  border: 1px dashed #e4e7ed;
  border-radius: 4px;
}

.field-mapping-container {
  padding: 10px 20px;
  background-color: #f7f9fa;
  border-radius: 6px;
}

.sql-select {
  background: #f7f9fa;
  border-radius: 6px;
  padding: 16px;
}
</style>
