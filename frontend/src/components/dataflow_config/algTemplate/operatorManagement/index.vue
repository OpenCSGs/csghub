<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-5">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-600 text-sm font-medium">
        {{ t("dataPipelines.operatorPool") }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">
      {{ t("dataPipelines.operatorPool") }}
    </p>

    <div class="mainOption mt-8">
      <p class="text-gray-700 text-sm mb-1.5">
        {{ t("dataPipelines.searchOperator") }}
      </p>
      <div class="flex items-center justify-between gap-3 xs:block">
        <el-input
          style="width: 100%"
          v-model="form.searchStr"
          @keyup.enter="searchListFun"
          @clear="searchListFun"
          :placeholder="`${t('dataPipelines.search')}${t(
            'dataPipelines.operatorName'
          )}`"
          clearable
          ><template #prefix>
            <el-icon class="el-input__icon w-5 h-5"><search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <div class="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-[12px]">
      <div
        v-for="item in cardList"
        :key="item.id"
        class="border rounded-lg flex flex-col justify-between"
        style="position: relative;"
      >
        <div class="operator-is-public">
          <el-tooltip
            :content="item.is_public ? t('dataPipelines.public') : t('dataPipelines.private')"
            placement="top"
          >
            <el-icon>
              <Unlock v-if="item.is_public" />
              <Lock v-else />
            </el-icon>
          </el-tooltip>
        </div>
        <div class="p-4 flex items-center flex-1">
          <img
            class="w-[50px] h-[50px] items-center mr-[10px] rounded-[12px] cursor-pointer hover:opacity-80 transition-opacity"
            :src="`data:image/png;base64,${item.pic_base64}`"
            @click="openUploadDialog(item)"
          />
          <div class="flex-1 h-full">
            <h4 class="mb-1" :title="item.operator_name">
              {{ item.display_name || item.operator_name }}
            </h4>
            <p
              class="text-sm text-gray-400 mb-2 multi-line-text"
              :title="item.display_description || item.description"
            >
              {{ item.display_description || item.description }}
            </p>
          </div>
        </div>

        <div
          class="flex justify-center text-xs items-center border-t-[1px] text-center py-2"
        >
          <div
            class="text-brand-600 hover:underline cursor-pointer flex-1 border-r-[1px]"
            @click="settings(item.id, item.is_public)"
          >
            {{ t("dataPipelines.settings") }}
          </div>
          <div
            class="text-brand-600 hover:underline cursor-pointer flex-1 border-r-[1px]"
            @click="authorize(item.id)"
          >
            {{ t("dataPipelines.authorize") }}
          </div>
          <div
            class="text-brand-600 hover:underline cursor-pointer flex-1"
            @click="openDocumentDialog(item)"
          >
            {{ t("dataPipelines.document") }}
          </div>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <el-dialog
      :title="t('dataPipelines.settings')"
      v-model="settingsDialogVisible"
      width="400px"
      class="operator-auth-dialog"
      align-center
      :before-close="settingsDialogClose"
    >
      <el-radio-group v-model="is_public" class="execute-type">
        <el-radio :value="true" size="large">
          {{ t("dataPipelines.public") }}
        </el-radio>
        <el-radio :value="false" size="large">
          {{ t("dataPipelines.private") }}
        </el-radio>
      </el-radio-group>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="settingsDialogClose">
            {{ t("dataPipelines.cancel") }}
          </el-button>
          <el-button type="primary" @click="seetingsSubmit">
            {{ t("dataPipelines.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 授权弹窗 -->
    <el-dialog
      :title="t('dataPipelines.operatorAuthorization')"
      v-model="dialogVisible"
      width="1000px"
      class="operator-auth-dialog"
      align-center
    >
      <div class="flex">
        <div class="w-1/2 p-4 mr-2 border rounded-md h-[500px] overflow-y-auto">
          <el-input
            v-model="searchKeyword"
            :placeholder="
              activeName === 'user'
                ? t('dataPipelines.SearchUserName')
                : t('dataPipelines.SearchOrganizationName')
            "
            :prefix-icon="Search"
            clearable
            class="mb-4"
            @keyup.enter="loadUsers"
            @blur="loadUsers"
            @clear="loadUsers"
          />
          <el-tabs v-model="activeName" tab-position="left" class="demo-tabs">
            <el-tab-pane :label="t('dataPipelines.person')" name="user">
              <el-checkbox
                v-model="userSelectAll"
                @change="handleUserSelectAll"
              >
                {{ t("dataPipelines.selectAll") }}
              </el-checkbox>
              <div style="height: 375px; overflow-y: auto">
                <el-checkbox-group
                  v-model="selectedUsers"
                  class="grid grid-cols-2 gap-2"
                >
                  <div
                    v-for="user in filteredUsers"
                    :key="user.uuid"
                    class="flex items-center p-1"
                  >
                    <el-checkbox :label="user" :value="user">
                      {{ user.username }}
                    </el-checkbox>
                  </div>
                </el-checkbox-group>

                <div class="flex justify-center mt-4">
                  <el-pagination
                    small
                    layout="prev, pager, next"
                    :page-size="userPagination.per"
                    :current-page="userPagination.page"
                    :total="userPagination.total"
                    @current-change="
                      (page) => {
                        userPagination.page = page;
                        loadUsers();
                      }
                    "
                  />
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane :label="t('dataPipelines.organization')" name="org">
              <el-checkbox v-model="orgSelectAll" @change="handleOrgSelectAll">
                {{ t("dataPipelines.selectAll") }}
              </el-checkbox>
              <div class="">
                <el-checkbox-group
                  v-model="selectedOrgs"
                  class="grid grid-cols-2 gap-2"
                >
                  <div
                    v-for="org in filteredOrgs"
                    :key="org.path"
                    class="flex items-center p-1"
                  >
                    <el-checkbox :label="org" :value="org">
                      {{ org.path }}{{ org.name ? `（${org.name}）` : '' }}
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="w-1/2 p-4 border rounded-md h-[500px] overflow-y-auto">
          <p class="text-lg mb-2">{{ t("dataPipelines.selected") }}：</p>

          <!-- 已选个人 -->
          <div v-if="selectedUsers.length > 0">
            <p class="text-sm text-gray-500 mb-2">
              {{ t("dataPipelines.person") }}
            </p>
            <div class="select-user grid grid-cols-2 gap-2 mb-4">
              <el-tag
                v-for="user in selectedUsers"
                :key="user.uuid"
                closable
                @close="removeUser(user)"
                class="mb-2"
              >
                {{ user.username }}
              </el-tag>
            </div>
          </div>

          <!-- 已选组织 -->
          <div v-if="selectedOrgs.length > 0">
            <p class="text-sm text-gray-500 mb-2">
              {{ t("dataPipelines.organization") }}
            </p>
            <div class="select-user grid grid-cols-2 gap-2">
              <el-tag
                v-for="org in selectedOrgs"
                :key="org.path"
                closable
                @close="removeOrg(org)"
                class="mb-2"
              >
                {{ org.path }}{{ org.name ? `（${org.name}）` : '' }}
              </el-tag>
            </div>
          </div>

          <el-empty
            :description="t('dataPipelines.noData')"
            :image-size="80"
            class="mt-[100px]"
            v-if="selectedUsers.length === 0 && selectedOrgs.length === 0"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">
            {{ t("dataPipelines.cancel") }}
          </el-button>
          <el-button type="primary" @click="handleConfirm">
            {{ t("dataPipelines.confirm") }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 文档上传弹窗 -->
    <el-dialog
      :title="t('dataPipelines.uploadDocument')"
      v-model="documentDialogVisible"
      width="800px"
      :before-close="handleDocumentDialogClose"
      class="document-upload-dialog"
      align-center
    >
      <div class="document-upload-content">
        <!-- 上方：上传操作区 -->
        <div class="document-upload-panel">
          <div class="document-upload-container">
            <el-upload
              class="document-uploader"
              :http-request="handleDocumentUploadRequest"
              :on-success="handleDocumentUploadSuccess"
              :on-error="handleDocumentUploadError"
              :before-upload="beforeDocumentUpload"
              :show-file-list="false"
              drag
            >
              <template v-if="documentUploadState === 'ready'">
                <el-icon class="upload-icon"><UploadFilled /></el-icon>
                <div class="upload-text">
                  <p class="main-text">{{ t("dataPipelines.uploadStatusTips1") }}</p>
                  <p class="sub-text">{{ t("dataPipelines.documentUploadTips3") }}</p>
                </div>
              </template>

              <template v-if="documentUploadState === 'uploading'">
                <div class="uploading-progress">
                  <el-icon class="upload-icon"><UploadFilled /></el-icon>
                  <p class="progress-text">{{ t("dataPipelines.uploading") }}</p>
                </div>
              </template>

              <template v-if="documentUploadState === 'success'">
                <div class="upload-success-state">
                  <el-icon class="success-icon"><CircleCheckFilled /></el-icon>
                  <p class="success-text">{{ t("dataPipelines.uploadSuccess") }}</p>
                  <p class="success-subtext">{{ t("dataPipelines.uploadSuccessTips1") }}</p>
                </div>
              </template>

              <template v-if="documentUploadState === 'error'">
                <div class="upload-error-state">
                  <el-icon class="error-icon"><CircleCloseFilled /></el-icon>
                  <p class="error-text">{{ t("dataPipelines.uploadFailed") }}</p>
                  <p class="error-subtext">
                    {{ documentUploadErrorMsg || t("dataPipelines.please") + t("dataPipelines.retry") }}
                  </p>
                </div>
              </template>
            </el-upload>
          </div>
        </div>

        <!-- 下方：文档预览区 -->
        <div class="document-preview-panel">
          <div class="document-preview-header">
            <h3 class="panel-title">{{ t("dataPipelines.documentPreview") }}</h3>
            <el-icon 
              v-if="documentContent || currentDocumentUrl"
              class="delete-icon" 
              @click="handleDeleteDocument"
            >
              <Delete />
            </el-icon>
          </div>
          <div class="document-preview-container">
            <div v-if="documentContent" class="document-content-wrapper">
              <div class="markdown-content" v-html="renderedMarkdown"></div>
            </div>
            <div v-else-if="currentDocumentUrl" class="document-wrapper">
              <iframe
                :src="currentDocumentUrl"
                class="document-preview"
                frameborder="0"
              ></iframe>
            </div>
            <div v-else class="document-empty-state">
              <p>{{ t("dataPipelines.noData") }}</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 左右布局的图标上传弹窗 -->
    <el-dialog
      :title="t('dataPipelines.editIcon')"
      v-model="uploadDialogVisible"
      width="900px"
      :before-close="handleUploadDialogClose"
      class="image-upload-dialog"
      align-center
    >
      <div class="upload-content">
        <!-- 左侧：图标预览区 -->
        <div class="preview-panel">
          <h3 class="panel-title">{{ t("dataPipelines.iconPreview") }}</h3>
          <div class="preview-container">
            <!-- 显示当前最新图标（原图标或已上传的新图标） -->
            <div v-if="currentPreviewImage" class="image-wrapper">
              <img
                :src="currentPreviewImage"
                class="preview-image"
                :alt="t('dataPipelines.iconPreview')"
              />

              <!-- 显示图标状态标签 -->
              <!-- <div class="image-status">
                <el-tag
                  v-if="isNewImageUploaded"
                  type="success"
                  class="status-tag"
                >
                  new
                </el-tag>
                <el-tag v-else type="info" class="status-tag"> old </el-tag>
              </div> -->
            </div>

            <!-- 无图标时显示 -->
            <div v-else class="no-image-state">
              <el-icon class="no-image-icon"><Picture /></el-icon>
              <p class="no-image-text">{{ t("dataPipelines.please") + t("dataPipelines.uploadIcon") }}</p>
            </div>
          </div>

          <!-- 操作说明 -->
          <div class="preview-footer">
            <p class="help-text">
              <el-icon class="info-icon"><InfoFilled /></el-icon>
              {{ t("dataPipelines.uploadTips1") }}
            </p>
            <p class="change-note" v-if="isNewImageUploaded">
              <el-icon class="warning-icon"><WarningFilled /></el-icon>
              {{ t("dataPipelines.uploadTips2") }}
            </p>
          </div>
        </div>

        <!-- 右侧：上传操作区 -->
        <div class="upload-panel">
          <h3 class="panel-title">{{ t("dataPipelines.uploadIcon") }}</h3>
          <div class="upload-container">
            <el-upload
              class="image-uploader"
              :http-request="handleImageUploadRequest"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
              :show-file-list="false"
              drag
            >
              <!-- 上传状态显示 -->
              <template v-if="uploadState === 'ready'">
                <el-icon class="upload-icon"><UploadFilled /></el-icon>
                <div class="upload-text">
                  <p class="main-text">{{ t("dataPipelines.uploadStatusTips1") }}</p>
                  <p class="sub-text">{{ t("dataPipelines.uploadStatusTips2") }}</p>
                </div>
              </template>

              <template v-if="uploadState === 'uploading'">
                <div class="uploading-progress">
                  <el-icon class="upload-icon"><UploadFilled /></el-icon>
                  <p class="progress-text">{{ t("dataPipelines.uploading") }}</p>
                </div>
              </template>

              <template v-if="uploadState === 'success'">
                <div class="upload-success-state">
                  <el-icon class="success-icon"></el-icon>
                  <p class="success-text">{{ t("dataPipelines.uploadSuccess") }}</p>
                  <p class="success-subtext">{{ t("dataPipelines.uploadSuccessTips1") }}</p>
                  <el-button
                    type="primary"
                    size="small"
                    @click="resetUploadState"
                  >
                    <el-icon><Refresh /></el-icon>
                    {{ t("dataPipelines.reUpload") }}
                  </el-button>
                </div>
              </template>

              <template v-if="uploadState === 'error'">
                <div class="upload-error-state">
                  <el-icon class="error-icon"></el-icon>
                  <p class="error-text">{{ t("dataPipelines.uploadFailed") }}</p>
                  <p class="error-subtext">
                    {{ uploadErrorMsg || t("dataPipelines.please") +  t("dataPipelines.retry") }}
                  </p>
                  <el-button
                    type="primary"
                    size="small"
                    class="retry-btn"
                    @click="resetUploadState"
                  >
                    {{ t("dataPipelines.retry") }}
                  </el-button>
                </div>
              </template>
            </el-upload>
          </div>

          <!-- 操作按钮 -->
          <div class="upload-actions">
            <el-button class="cancel-btn" @click="handleUploadDialogClose">
              {{ t("dataPipelines.cancel") }}
            </el-button>
            <el-button
              type="primary"
              class="confirm-btn"
              @click="submitImageChange"
              :disabled="!isNewImageUploaded"
            >
              {{ t("dataPipelines.confirm") }}
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, computed, reactive, watch } from "vue";
import { ElMessage, ElLoading, ElMessageBox } from "element-plus";
import useFetchApi from "@/packs/useFetchApi";
import { useI18n } from "vue-i18n";
import MarkdownIt from "markdown-it";
import {
  Search,
  UploadFilled,
  Picture,
  InfoFilled,
  WarningFilled,
  Document,
  CircleCheckFilled,
  CircleCloseFilled,
  Delete,
  Refresh,
} from "@element-plus/icons-vue";

// 引入国际化文件
import zhOps from "../../../../locales/zh_js/operator_zh.json";
import enOps from "../../../../locales/en_js/operator_en.json";
import zhHantOps from '../../../../locales/zh_hant_js/operator_zhHant.json'

const { t, locale } = useI18n();
const origin = window.location.origin + "/";

// 准备国际化数据源
const operatorI18n = {
  zh: zhOps,
  en: enOps,
  zhHant: zhHantOps
};

// 基础状态管理
const state = ref({
  skip: 0,
  limit: 100,
});
const form = ref({
  searchStr: "",
});
const templateList = ref([]);
const templateListAll = ref([]);
const cardList = ref([]);

// 授权相关
const operator_id = ref("");
const settingsDialogVisible = ref(false);
const is_public = ref(true);
const dialogVisible = ref(false);
const searchKeyword = ref("");
const selectedUsers = ref([]);
const selectedOrgs = ref([]);
const personalUsers = ref([]);
const orgData = ref([]);
const selectAll = ref(false);
const activeName = ref("user");
const userSelectAll = ref(false);
const orgSelectAll = ref(false);

// 图标上传核心状态
const uploadDialogVisible = ref(false);
const currentTemplate = ref(null);

// 上传状态管理
const uploadState = ref("ready");
const uploadErrorMsg = ref("");
const newImageUrl = ref(""); // 用于预览的 base64
const newImageUrlForSave = ref(""); // 用于保存的原始 URL
const isNewImageUploaded = ref(false);

// 文档上传核心状态
const documentDialogVisible = ref(false);
const currentDocumentTemplate = ref(null);

// 文档上传状态管理
const documentUploadState = ref("ready");
const documentUploadErrorMsg = ref("");
const newDocumentUrl = ref("");
const documentContent = ref("");
const isNewDocumentUploaded = ref(false);

// 计算属性 - 始终显示最新图标
const currentPreviewImage = computed(() => {
  if (newImageUrl.value) {
    // 如果 newImageUrl 已经是 base64 字符串，添加前缀
    if (typeof newImageUrl.value === 'string' && !newImageUrl.value.startsWith('data:') && !newImageUrl.value.startsWith('http')) {
      return `data:image/png;base64,${newImageUrl.value}`;
    }
    return newImageUrl.value;
  }
  // 如果原图标是 base64，也需要添加前缀
  if (currentTemplate.value?.icon) {
    const icon = currentTemplate.value.icon;
    if (typeof icon === 'string' && !icon.startsWith('data:') && !icon.startsWith('http')) {
      return `data:image/png;base64,${icon}`;
    }
    return icon;
  }
  return "";
});

// 计算属性 - 始终显示最新文档
const currentDocumentUrl = computed(() => {
  return newDocumentUrl.value || currentDocumentTemplate.value?.document_url || "";
});

// 初始化 Markdown 解析器
const md = new MarkdownIt({
  html: true,        // 启用 HTML 标签
  linkify: true,     // 自动识别链接
  typographer: true, // 启用一些语言中性的替换 + 引号美化
  breaks: true,      // 转换 '\n' 为 <br>
});

// 计算属性 - 渲染 Markdown
const renderedMarkdown = computed(() => {
  if (!documentContent.value) return "";
  // 使用 markdown-it 解析 Markdown
  return md.render(documentContent.value);
});

// 设置
const settings = (operatorId, isPublic) => {
  settingsDialogVisible.value = true;
  operator_id.value = operatorId;
  is_public.value = isPublic;
}

const settingsDialogClose = () => {
  settingsDialogVisible.value = false;
  is_public.value = false;
  operator_id.value = '';
}

const seetingsSubmit = async () => {
  try {
    const params = {
      is_public: is_public.value,
    };
    const { data } = await useFetchApi(
      `/dataflow/operator/${operator_id.value}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }
    )
      .put()
      .json();

    if (data.value?.code === 200) {
      ElMessage.success(t("dataPipelines.operationSuccessful"));
      getOperatorList();
      settingsDialogClose();
    } else {
      ElMessage.error(data.value.msg);
    }
  } catch (error) {
    // ElMessage.error(error.message);
  }
}

// 授权相关方法
const authorize = async (operatorId) => {
  dialogVisible.value = true;
  operator_id.value = operatorId;
  searchKeyword.value = "";
  userSelectAll.value = false;
  orgSelectAll.value = false;
  activeName.value = "user";

  userPagination.value = {
    page: 1,
    per: 14,
    total: 0,
  };

  try {
    const [userData, org, operatorData] = await Promise.all([
      getUser(),
      getOrg(),
      getOperator(operatorId),
    ]);
    
    personalUsers.value = userData.data;
    orgData.value = org.data || [];

    // 确保 operatorData 有默认值，避免 null 或 undefined
    const safeOperatorData = operatorData || { users: [], orgs: [] };

    // 初始化已选数据（添加空值判断）
    selectedUsers.value = personalUsers.value.filter((user) =>
      (safeOperatorData.users || []).some((selectedUser) => selectedUser.uuid === user.uuid)
    );

    selectedOrgs.value = orgData.value.filter((orgItem) =>
      (safeOperatorData.orgs || []).some((selectedOrg) => selectedOrg.path === orgItem.path)
    );

    // 更新全选状态
    updateSelectAllStatus();
  } catch (error) {
    ElMessage.error(error.message)
  }
};

const loadUsers = async () => {
  if (activeName.value === 'user') {
    const userData = await getUser();
    personalUsers.value = userData.data || [];
  } else {
    const orgDataRes = await getOrg();
    orgData.value = orgDataRes.data || [];
  }
  updateSelectAllStatus();
};

// 更新全选状态
const updateSelectAllStatus = () => {
  if (activeName.value === "user") {
    userSelectAll.value =
      filteredUsers.value.length > 0 &&
      filteredUsers.value.every((user) =>
        selectedUsers.value.some((u) => u.uuid === user.uuid)
      );
  } else {
    orgSelectAll.value =
      filteredOrgs.value.length > 0 &&
      filteredOrgs.value.every((org) =>
        selectedOrgs.value.some((o) => o.path === org.path)
      );
  }
};

// 全选/取消全选
const handleUserSelectAll = (val) => {
  const currentUserIds = filteredUsers.value.map((user) => user.uuid);
  if (val) {
    // 添加当前页所有用户（去重）
    const newUsers = filteredUsers.value.filter(
      (user) => !selectedUsers.value.some((u) => u.uuid === user.uuid)
    );
    selectedUsers.value = [...selectedUsers.value, ...newUsers];
  } else {
    // 只移除当前页用户
    selectedUsers.value = selectedUsers.value.filter(
      (user) => !currentUserIds.includes(user.uuid)
    );
  }
};

const handleOrgSelectAll = (val) => {
  const currentOrgPaths = filteredOrgs.value.map((org) => org.path);
  if (val) {
    // 添加当前页所有组织（去重）
    const newOrgs = filteredOrgs.value.filter(
      (org) => !selectedOrgs.value.some((o) => o.path === org.path)
    );
    selectedOrgs.value = [...selectedOrgs.value, ...newOrgs];
  } else {
    // 只移除当前页组织
    selectedOrgs.value = selectedOrgs.value.filter(
      (org) => !currentOrgPaths.includes(org.path)
    );
  }
};

const userPagination = ref({
  page: 1,
  per: 14,
  total: 0,
});

// 获取人员
const getUser = async () => {
  try {
    const { data } = await useFetchApi(
      `/users?per=${userPagination.value.per}&page=${
        userPagination.value.page
      }&search=${searchKeyword.value || ""}`
    )
      .get()
      .json();
    if (data.value) {
      userPagination.value.total = data.value.data.total || 0;
      return data.value.data;
    }
    return { data: [], total: 0 };
  } catch (error) {
    return { data: [], total: 0 };
  }
};

// 获取组织
const getOrg = async () => {
  const { data } = await useFetchApi("/organizations").get().json();
  return data.value.data;
};

const getOperator = async (operator_id) => {
  try {
    const url = `/dataflow/operator_permission/operator/${operator_id}`;
    const { data } = await useFetchApi(url).get().json();
    return data.value?.data || { users: [], orgs: [] };
  } catch (error) {
    console.error("Failed to get operator data:", error);
    return { users: [], orgs: [] };
  }
};

const filteredUsers = computed(() => {
  return personalUsers.value;
});

const filteredOrgs = computed(() => {
  // return orgData.value.filter((org) => org.name.includes(searchKeyword.value));
  if (!searchKeyword.value) return orgData.value;
  if(orgData.value.length === 0) return orgData.value;
  return orgData.value.filter(org => {
    const pathMatch = org.path && org.path.toLowerCase().includes(searchKeyword.value.toLowerCase());
    const nameMatch = org.name && org.name.toLowerCase().includes(searchKeyword.value.toLowerCase());
    return pathMatch || nameMatch;
  });
});

// 移除已选
const removeUser = (user) => {
  selectedUsers.value = selectedUsers.value.filter((u) => u.uuid !== user.uuid);
};

const removeOrg = (org) => {
  selectedOrgs.value = selectedOrgs.value.filter((o) => o.path !== org.path);
};

const handleConfirm = async () => {
  try {
    const loading = ElLoading.service({
      lock: true,
      text: `${t("dataPipelines.submitting")}...`,
      background: "rgba(255, 255, 255, 0.5)",
    });

    const params = {
      operator_id: operator_id.value,
      users: selectedUsers.value,
      orgs: selectedOrgs.value,
    };

    const { data } = await useFetchApi(`/dataflow/operator_permission`, {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })
      .post()
      .json();

    loading.close();
    if (data.value) {
      if (data.value.code === 200) {
        ElMessage.success(t("dataPipelines.operationSuccessful"));
        dialogVisible.value = false;
        selectedUsers.value = [];
        selectedOrgs.value = [];
      } else {
        ElMessage.error(data.value.msg);
      }
    } else {
      ElMessage.error(t("dataPipelines.operationFailed"));
    }
  } catch (error) {
    ElMessage.error(`${t("dataPipelines.operationFailed")}：` + error.message);
  }
};

// 文档上传相关方法
const openDocumentDialog = async (item) => {
  currentDocumentTemplate.value = item;
  resetDocumentUploadState(true);
  documentDialogVisible.value = true;
  
  // 查询算子文档
  await loadOperatorDocument(item.id);
};

// 查询算子文档
const loadOperatorDocument = async (operatorId) => {
  if (!operatorId) return;
  
  try {
    const { data } = await useFetchApi(
      `/dataflow/operator/${operatorId}/document`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .get()
      .json();

    if (data.value?.code === 200 && data.value?.data?.content) {
      // 如果有文档内容，直接展示
      documentContent.value = data.value.data.content;
    } else {
      // 如果没有文档，清空内容
      documentContent.value = "";
    }
  } catch (error) {
    console.error("Failed to load operator document:", error);
    documentContent.value = "";
  }
};

const loadDocumentContent = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      documentContent.value = await response.text();
    }
  } catch (error) {
    console.error("Failed to load document content:", error);
  }
};

const handleDocumentDialogClose = () => {
  documentDialogVisible.value = false;
  currentDocumentTemplate.value = null;
  resetDocumentUploadState(true);
};

const resetDocumentUploadState = (fullReset = false) => {
  documentUploadState.value = "ready";
  documentUploadErrorMsg.value = "";

  if (fullReset) {
    newDocumentUrl.value = "";
    documentContent.value = "";
    isNewDocumentUploaded.value = false;
  }
};

const beforeDocumentUpload = (file) => {
  documentUploadErrorMsg.value = "";

  // 只允许上传 .md 文件
  const isMarkdown = file.name.endsWith(".md");
  if (!isMarkdown) {
    documentUploadErrorMsg.value = t("dataPipelines.documentUploadError1");
    return false;
  }

  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    documentUploadErrorMsg.value = t("dataPipelines.documentUploadError2");
    return false;
  }

  documentUploadState.value = "uploading";
  return true;
};

// 文档上传请求
const handleDocumentUploadRequest = async (options) => {
  const { file } = options;
  
  if (!currentDocumentTemplate.value?.id) {
    documentUploadErrorMsg.value = t("dataPipelines.operationFailed");
    documentUploadState.value = "error";
    return;
  }

  try {
    // 创建 FormData
    const formData = new FormData();
    formData.append('file', file);

    const { data, error } = await useFetchApi(
      `/dataflow/operator/${currentDocumentTemplate.value.id}/document`,
      {
        body: formData
      }
    )
      .post()
      .json();

    // 处理错误
    if (error.value) {
      const errorMsg = error.value?.msg || error.value?.message || t("dataPipelines.operationFailed");
      throw { msg: errorMsg };
    }

    // 处理响应
    if (data.value) {
      return data.value;
    } else {
      throw { msg: t("dataPipelines.operationFailed") };
    }
  } catch (err) {
    // 统一错误格式
    if (err && typeof err === 'object' && err.msg) {
      throw err;
    } else if (err && typeof err === 'object' && err.message) {
      throw { msg: err.message };
    } else {
      throw { msg: t("dataPipelines.networkError") };
    }
  }
};

const handleDocumentUploadSuccess = async (response) => {
  if (response.code === 200 && response.data) {
    // 新接口返回的是 content 字段，直接使用
    if (response.data.content) {
      documentContent.value = response.data.content;
    }
    // 如果有 url 字段（兼容旧接口），也支持
    if (response.data.url) {
      newDocumentUrl.value = response.data.url;
    } else {
      // 新接口没有 url，标记为已上传，后续提交时会使用 content
      newDocumentUrl.value = 'uploaded';
    }
    isNewDocumentUploaded.value = true;
    documentUploadState.value = "success";
    
    ElMessage.success(response.msg || t("dataPipelines.uploadSuccessTips2"));
    
    // 上传成功后刷新列表
    getOperatorList();
  } else {
    documentUploadErrorMsg.value = response.msg || t("dataPipelines.uploadFailedTips3");
    documentUploadState.value = "error";
  }
};

const handleDocumentUploadError = (error) => {
  let errorMsg = t("dataPipelines.networkError");
  if (error && error.msg) {
    errorMsg = error.msg;
  } else if (error && error.message) {
    errorMsg = error.message;
  }
  documentUploadErrorMsg.value = errorMsg;
  documentUploadState.value = "error";
};

// 删除文档
const handleDeleteDocument = async () => {
  if (!currentDocumentTemplate.value?.id) return;
  
  try {
    await ElMessageBox.confirm(
      t("dataPipelines.confirmDeleteDocument"),
      t("dataPipelines.tips"),
      {
        confirmButtonText: t("dataPipelines.confirm"),
        cancelButtonText: t("dataPipelines.cancel"),
        type: "warning",
      }
    );

    const loading = ElLoading.service({
      lock: true,
      text: t("dataPipelines.deleting"),
      background: "rgba(0, 0, 0, 0.7)",
    });

    const { data } = await useFetchApi(
      `/dataflow/operator/${currentDocumentTemplate.value.id}/document`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .delete()
      .json();

    loading.close();

    if (data.value?.code === 200) {
      ElMessage.success(t("dataPipelines.operationSuccessful"));
      // 清空文档内容
      documentContent.value = "";
      newDocumentUrl.value = "";
      isNewDocumentUploaded.value = false;
      // 刷新列表
      getOperatorList();
    } else {
      ElMessage.error(data.value?.msg || t("dataPipelines.operationFailed"));
    }
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error(error.message || t("dataPipelines.operationFailed"));
    }
  }
};

const submitDocumentChange = async () => {
  // 新接口上传时已经保存了文档，这里只需要关闭对话框并刷新列表
  if (!currentDocumentTemplate.value || !isNewDocumentUploaded.value) return;

  try {
    const loading = ElLoading.service({
      lock: true,
      text: t("dataPipelines.submitting"),
      background: "rgba(0, 0, 0, 0.7)",
    });

    // 新接口上传时已经保存了文档，直接刷新列表即可
    loading.close();
    ElMessage.success(t("dataPipelines.operationSuccessful"));
    getOperatorList();
    handleDocumentDialogClose();
  } catch (error) {
    ElMessage.error(error.message);
  }
};

// 图标上传相关方法
const openUploadDialog = async (item) => {
  currentTemplate.value = item;
  resetUploadState(true);
  uploadDialogVisible.value = true;
  
  // 如果图标是接口地址，需要调用接口获取 base64 用于预览
  if (item.icon && (item.icon.startsWith('http') || item.icon.startsWith('/') || item.icon.startsWith('api/v1'))) {
    try {
      let imageUrl = item.icon;
      
      // 删除 URL 最前面的 api/v1
      if (imageUrl.startsWith('api/v1/')) {
        imageUrl = imageUrl.substring('api/v1/'.length);
      } else if (imageUrl.startsWith('/api/v1/')) {
        imageUrl = imageUrl.substring('/api/v1/'.length);
      }
      
      // 调用接口获取 base64
      const { data: base64Data, error: base64Error } = await useFetchApi(imageUrl)
        .get()
        .json();
      
      if (!base64Error.value && base64Data.value?.code === 200 && base64Data.value?.data) {
        // 如果返回的是数组，取第一个元素
        const base64 = Array.isArray(base64Data.value.data) 
          ? base64Data.value.data[0] 
          : base64Data.value.data;
        
        // 存储 base64 用于预览
        newImageUrl.value = base64;
      }
    } catch (error) {
      console.error("Failed to load icon base64:", error);
    }
  } else if (item.icon) {
    // 如果已经是 base64，直接使用
    newImageUrl.value = item.icon;
  }
};

const handleUploadDialogClose = () => {
  uploadDialogVisible.value = false;
  currentTemplate.value = null;
  resetUploadState(true);
};

const resetUploadState = (fullReset = false) => {
  uploadState.value = "ready";
  uploadErrorMsg.value = "";

  if (fullReset) {
    newImageUrl.value = "";
    newImageUrlForSave.value = "";
    isNewImageUploaded.value = false;
  }
};

const beforeUpload = (file) => {
  uploadErrorMsg.value = "";

  const isImage = file.type === "image/jpeg" || file.type === "image/png";
  if (!isImage) {
    uploadErrorMsg.value = t("dataPipelines.uploadFailedTips1");
    return false;
  }

  const isLt2M = file.size / 1024 / 1024 < 10;
  if (!isLt2M) {
    uploadErrorMsg.value = t("dataPipelines.uploadFailedTips2");
    return false;
  }

  uploadState.value = "uploading";
  return true;
};

// 图标上传请求
const handleImageUploadRequest = async (options) => {
  const { file } = options;

  try {
    // 创建 FormData
    const formData = new FormData();
    formData.append('file', file);

    // 使用 useFetchApi 发送请求（会自动添加认证头）
    const { data, error } = await useFetchApi(
      `/dataflow/internal_api/internal_api/upload`,
      {
        body: formData
      }
    )
      .post()
      .json();

    // 处理错误
    if (error.value) {
      const errorMsg = error.value?.msg || error.value?.message || t("dataPipelines.operationFailed");
      throw { msg: errorMsg };
    }

    // 处理响应
    if (data.value) {
      return data.value;
    } else {
      throw { msg: t("dataPipelines.operationFailed") };
    }
  } catch (err) {
    // 统一错误格式
    if (err && typeof err === 'object' && err.msg) {
      throw err;
    } else if (err && typeof err === 'object' && err.message) {
      throw { msg: err.message };
    } else {
      throw { msg: t("dataPipelines.networkError") };
    }
  }
};

const handleUploadSuccess = async (response) => {
  if (response.code === 200 && response.data?.url) {
    // 保存原始的 URL（用于提交保存）
    newImageUrlForSave.value = response.data.url;
    
    // 返回的 url 是一个接口地址，需要继续调用获取 base64（用于预览）
    try {
      let imageUrl = response.data.url;

      // 删除 URL 最前面的 api/v1
      if (imageUrl.startsWith('api/v1/')) {
        imageUrl = imageUrl.substring('api/v1/'.length);
      } else if (imageUrl.startsWith('/api/v1/')) {
        imageUrl = imageUrl.substring('/api/v1/'.length);
      }

      // 直接调用接口获取 base64
      const { data: base64Data, error: base64Error } = await useFetchApi(imageUrl)
        .get()
        .json();

      if (base64Error.value) {
        throw base64Error.value;
      }

      // 处理 base64 数据
      if (base64Data.value?.code === 200 && base64Data.value?.data) {
        // 如果返回的是数组，取第一个元素
        const base64 = Array.isArray(base64Data.value.data) 
          ? base64Data.value.data[0] 
          : base64Data.value.data;
        
        // 存储 base64 地址（用于预览）
        newImageUrl.value = base64;
        isNewImageUploaded.value = true;
        uploadState.value = "success";
        ElMessage.success(t("dataPipelines.uploadSuccessTips2"));
      } else {
        throw new Error(t("dataPipelines.operationFailed"));
      }
    } catch (error) {
      console.error("Failed to fetch base64:", error);
      uploadErrorMsg.value = error?.msg || error?.message || t("dataPipelines.operationFailed");
      uploadState.value = "error";
    }
  } else {
    uploadErrorMsg.value = response.msg || t("dataPipelines.uploadFailedTips3");
    uploadState.value = "error";
  }
};

const handleUploadError = (error) => {
  let errorMsg = t("dataPipelines.networkError");
  if (error && error.msg) {
    errorMsg = error.msg;
  } else if (error && error.message) {
    errorMsg = error.message;
  }
  uploadErrorMsg.value = errorMsg;
  uploadState.value = "error";
};

const submitImageChange = async () => {
  if (!currentTemplate.value || !newImageUrlForSave.value) return;

  try {
    const loading = ElLoading.service({
      lock: true,
      text: t("dataPipelines.submitting"),
      background: "rgba(0, 0, 0, 0.7)",
    });

    const updateData = {
      icon: newImageUrlForSave.value,
    };

    const { data } = await useFetchApi(
      `/dataflow/operator/${currentTemplate.value.id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    )
      .put()
      .json();

    loading.close();

    if (data.value?.code === 200) {
      ElMessage.success(t("dataPipelines.operationSuccessful"));
      getOperatorList();
      handleUploadDialogClose();
    } else {
      ElMessage.error(data.value.msg);
    }
  } catch (error) {
    // ElMessage.error(error.message);
  }
};

// 合并国际化数据
const applyI18n = (operator, lang) => {
  const i18nData = operatorI18n[lang]?.[operator.operator_name];
  if (i18nData) {
    // 添加国际化字段（保留原始字段）
    operator.display_name = i18nData.name || operator.operator_name;
    operator.display_description = i18nData.description || operator.description;

    // 处理配置项国际化
    if (i18nData.params && Array.isArray(i18nData.params)) {
      operator.configs.forEach((config, index) => {
        const i18nParam = i18nData.params[index];
        if (i18nParam) {
          config.display_name = i18nParam.name || config.config_name;
        }
      });
    }
  } else {
    // 如果没有找到对应的国际化，使用原始数据
    operator.display_name = operator.operator_name;
    operator.display_description = operator.description;
    operator.configs.forEach((config) => {
      config.display_name = config.config_name;
    });
  }
  return operator;
};

// 模板和列表加载
const originalCardList = ref([]);
const getOperatorList = async () => {
  try {
    const { data } = await useFetchApi(
      `/dataflow/operator?skip=${state.value.skip}&limit=${state.value.limit}`
    )
      .get()
      .json();

    if (data.value.code === 200) {
      // 应用国际化
      originalCardList.value = data.value.data.map((operator) =>
        applyI18n(operator, locale.value)
      );
      cardList.value = [...originalCardList.value];
    }
  } catch (error) {
    ElMessage.error(error.message);
  }
};

const searchListFun = () => {
  const searchTerm = form.value.searchStr.toLowerCase();
  if (!searchTerm) {
    cardList.value = [...originalCardList.value];
    return;
  }
  cardList.value = originalCardList.value.filter(
    (item) =>
      (item.display_name || item.operator_name)
        .toLowerCase()
        .includes(searchTerm) ||
      (item.display_description || item.description)
        .toLowerCase()
        .includes(searchTerm)
  );
};

const router = useRouter();

onMounted(() => {
  getOperatorList();
});

// 监听语言变化
watch(locale, () => {
  getOperatorList();
});
</script>

<style lang="less" scoped>
// 上传弹窗样式
.image-upload-dialog {
  :deep(.el-dialog__header) {
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }

  :deep(.el-dialog__body) {
    padding: 20px 24px;
    margin: 0;
  }

  :deep(.el-dialog__footer) {
    display: none; // 隐藏默认底部，我们在右侧面板自定义了按钮
  }
}

// 左右布局容器
.upload-content {
  display: flex;
  gap: 24px;
  height: 480px;
}

// 左侧预览面板
.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

// 右侧上传面板
.upload-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

// 面板标题
.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  padding-left: 4px;
}

// 文档预览标题容器
.document-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  
  .delete-icon {
    font-size: 18px;
    color: #909399;
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover {
      color: #f56c6c;
    }
  }
}

// 预览区域
.preview-container {
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #e5e7eb;
  position: relative;
  overflow: hidden;
  min-height: 320px;
}

// 图标容器
.image-wrapper {
  width: 400px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

// 预览图标
.preview-image {
  max-width: 400px;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}

// 图标状态标签
.image-status {
  position: absolute;
  top: 16px;
  right: 16px;
}

.status-tag {
  opacity: 0.9;
}

// 无图标状态
.no-image-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.no-image-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.no-image-text {
  font-size: 16px;
}

// 预览面板底部
.preview-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.help-text {
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-icon {
  font-size: 14px;
  margin-right: 6px;
}

.change-note {
  font-size: 13px;
  color: #d97706;
  display: flex;
  align-items: center;
}

.warning-icon {
  font-size: 14px;
  margin-right: 6px;
}

// 上传容器
.upload-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
}

// 上传组件样式
.image-uploader {
  width: 100%;
  :deep(.el-upload--drag) {
    width: 100%;
    height: 100%;
    min-height: 280px;
    border-radius: 8px;
    border: 2px dashed #d1d5db;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }
  }
}

// 上传图标
.upload-icon {
  font-size: 56px;
  color: #3b82f6;
  margin-bottom: 10px;
}

// 上传文字
.upload-text {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .main-text {
    font-size: 16px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
  }

  .sub-text {
    font-size: 14px;
    color: #6b7280;
  }
}

// 上传进度
.uploading-progress {
  text-align: center;
  width: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .progress-bar {
    margin-bottom: 16px;
  }

  .progress-text {
    font-size: 14px;
    color: #374151;
  }
}

// 上传成功状态
.upload-success-state {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  .success-icon {
    font-size: 56px;
    color: #10b981;
  }

  .success-text {
    font-size: 16px;
    font-weight: 500;
    color: #10b981;
    margin-bottom: 8px;
  }

  .success-subtext {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 10px;
  }


  .reload-icon {
    margin-right: 4px;
    font-size: 14px;
  }
}

// 上传错误状态
.upload-error-state {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  .error-icon {
    font-size: 56px;
    color: #ef4444;
    margin-bottom: 16px;
  }

  .error-text {
    font-size: 16px;
    font-weight: 500;
    color: #ef4444;
    margin-bottom: 8px;
  }

  .error-subtext {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 20px;
  }

  .retry-btn {
    margin-top: 8px;
  }
}

// 上传操作按钮
.upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.cancel-btn {
  border-color: #d1d5db;
  color: #6b7280;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
}

.confirm-btn {
  background-color: #3b82f6;
  border-color: #3b82f6;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #93c5fd;
    border-color: #93c5fd;
    cursor: not-allowed;
  }
}

// 其他原有样式
:deep(.el-form--inline) {
  .el-form-item {
    margin-right: 12px;
  }
}
.dataItemCont {
  cursor: pointer;
  border-radius: var(--spacing-lg, 12px);
  border: 1px solid var(--colors-gray-light-mode-200, #eaecf0);
  background: var(--Base-White, #fff);
  .hoverBtmCont {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease, transform 0.3s ease;
    pointer-events: none;
  }
  .btmCont {
    opacity: 1;
    transition: opacity 0.3s ease;
  }
  &:hover {
    box-shadow: 0px 4px 8px -2px rgba(16, 24, 40, 0.1),
      0px 2px 4px -2px rgba(16, 24, 40, 0.06);
    .hoverBtmCont {
      max-height: 200px;
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }
    .btmCont {
      opacity: 0;
    }
  }
}
:global(.el-popper.tool-tip-custom) {
  max-width: 300px !important;
  white-space: pre-line !important;
  word-break: break-word;
  line-height: 1.5;
  padding: 8px 12px;
}

.multi-line-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-tabs__item) {
  font-size: 14px !important;
  padding: 0 20px 0 0;
}

.select-user {
  :deep(.el-tag) {
    display: flex;
    justify-content: space-between;
  }
}
.execute-type {
  :deep(.el-radio) {
    width: 100% !important;
  }
}
.operator-is-public {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  color: #999999;
  font-size: 14px;
}

// 文档上传弹窗样式
.document-upload-dialog {
  :deep(.el-dialog__header) {
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }

  :deep(.el-dialog__body) {
    padding: 20px 24px;
    margin: 0;
  }

  :deep(.el-dialog__footer) {
    display: none;
  }
}

// 文档上传上下布局容器
.document-upload-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: 600px;
}

// 文档上传面板（上方）
.document-upload-panel {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

// 文档预览面板（下方）
.document-preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

// 文档预览区域
.document-preview-container {
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #e5e7eb;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

// 文档容器
.document-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

// 文档预览 iframe
.document-preview {
  width: 100%;
  height: 100%;
  min-height: 400px;
  border-radius: 6px;
  background-color: #fff;
}

// Markdown 内容容器
.document-content-wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background-color: #fff;
}

// 文档空状态
.document-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 200px;
  
  p {
    color: #909399;
    font-size: 14px;
    margin: 0;
  }
}

.markdown-content {
  max-width: 100%;
  line-height: 1.6;
  color: #333;
  word-wrap: break-word;
  
  // 标题样式
  h1, h2, h3, h4, h5, h6 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-weight: 600;
    line-height: 1.25;
  }
  
  h1 {
    font-size: 24px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 10px;
  }
  
  h2 {
    font-size: 20px;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 8px;
  }
  
  h3 {
    font-size: 18px;
  }
  
  h4 {
    font-size: 16px;
  }
  
  // 段落样式
  p {
    margin-bottom: 16px;
  }
  
  // 列表样式
  ul, ol {
    margin-bottom: 16px;
    padding-left: 30px;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  // 代码块样式
  pre {
    background-color: #f6f8fa;
    border-radius: 6px;
    padding: 16px;
    overflow-x: auto;
    margin-bottom: 16px;
    border: 1px solid #e1e4e8;
  }
  
  code {
    background-color: #f6f8fa;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 85%;
  }
  
  pre code {
    background-color: transparent;
    padding: 0;
    font-size: 14px;
  }
  
  // 表格样式
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 16px;
    border: 1px solid #e1e4e8;
  }
  
  th, td {
    border: 1px solid #e1e4e8;
    padding: 8px 12px;
    text-align: left;
  }
  
  th {
    background-color: #f6f8fa;
    font-weight: 600;
  }
  
  // 引用样式
  blockquote {
    border-left: 4px solid #dfe2e5;
    padding-left: 16px;
    margin: 16px 0;
    color: #6a737d;
  }
  
  // 链接样式
  a {
    color: #0366d6;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  // 分割线样式
  hr {
    border: none;
    border-top: 1px solid #e1e4e8;
    margin: 24px 0;
  }
  
  // 强调样式
  strong {
    font-weight: 600;
  }
  
  em {
    font-style: italic;
  }
  
  h2 {
    font-size: 20px;
  }
  
  h3 {
    font-size: 18px;
  }
  
  p {
    margin-bottom: 12px;
  }
  
  strong {
    font-weight: 600;
  }
  
  em {
    font-style: italic;
  }
}

// 无文档状态
.no-document-state {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.no-document-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.no-document-text {
  font-size: 16px;
}

// 文档预览面板底部
.document-preview-footer {
  margin-top: 12px;
}

// 文档上传容器
.document-upload-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
}

// 文档上传组件样式
.document-uploader {
  width: 100%;
  :deep(.el-upload--drag) {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    border: 2px dashed #d1d5db;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    padding: 20px;

    &:hover {
      border-color: #3b82f6;
      background-color: #eff6ff;
    }
  }
}

// 提示信息和操作按钮容器
.document-preview-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  
  .help-text {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    color: #909399;
    font-size: 14px;
  }
}

// 文档上传操作按钮
.document-upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
