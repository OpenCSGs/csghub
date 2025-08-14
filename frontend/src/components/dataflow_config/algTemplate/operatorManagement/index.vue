<template>
  <div class="text-left w-full h-full pl-8 py-8 overflow-auto bg-white">
    <div class="headerMenu flex items-center justify-start mb-5">
      <SvgIcon class="w-5 h-5" name="dataflow_homeIcon" />
      <SvgIcon class="w-5 h-5 mx-2" name="dataflow_homeIcon_divider" />
      <p class="text-brand-600 text-sm font-medium">
        {{ t("dataPipelines.algorithmTemplate") }}
      </p>
    </div>
    <p class="text-gray-900 text-3xl font-medium">
      {{ t("dataPipelines.algorithmTemplate") }}
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
      >
        <div class="p-4 flex items-center flex-1">
          <img
            class="w-[50px] h-[50px] items-center mr-[10px] rounded-[12px] cursor-pointer hover:opacity-80 transition-opacity"
            :src="origin + item.icon"
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
          <!-- <div
            class="text-brand-600 hover:underline cursor-pointer flex-1 border-r-[1px]"
          >
            {{ t("dataPipelines.details") }}
          </div> -->
          <div
            class="text-brand-600 hover:underline cursor-pointer"
            @click="authorize(item.id)"
          >
            {{ t("dataPipelines.authorize") }}
          </div>
        </div>
      </div>
    </div>

    <!-- 授权弹窗 -->
    <el-dialog
      :title="t('dataPipelines.operatorAuthorization')"
      v-model="dialogVisible"
      width="1000px"
      class="operator-auth-dialog"
    >
      <div class="flex">
        <div class="w-1/2 p-4 mr-2 border rounded-md h-[500px] overflow-y-auto">
          <el-input
            v-model="searchKeyword"
            :placeholder="activeName === 'user' ? t('dataPipelines.SearchUserName') : t('dataPipelines.SearchOrganizationName')"
            :prefix-icon="Search"
            clearable
            class="mb-4"
            @keyup.enter="loadUsers"
            @blur="loadUsers"
            @clear="loadUsers"
          />
          <el-tabs v-model="activeName" tab-position="left" class="demo-tabs">
            <el-tab-pane :label="t('dataPipelines.person')" name="user">
              <el-checkbox v-model="userSelectAll" @change="handleUserSelectAll">
                {{ t('dataPipelines.selectAll') }}
              </el-checkbox>
              <div style="height: 375px; overflow-y: auto;">
                <el-checkbox-group
                  v-model="selectedUsers"
                  class="grid grid-cols-2 gap-2"
                >
                  <div
                    v-for="user in filteredUsers"
                    :key="user.uuid"
                    class="flex items-center p-1"
                  >
                    <el-checkbox 
                      :label="user"
                      :value="user"
                    >
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
                    @current-change="(page) => {
                      userPagination.page = page;
                      loadUsers();
                    }"
                  />
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane :label="t('dataPipelines.organization')" name="org">
              <el-checkbox v-model="orgSelectAll" @change="handleOrgSelectAll">
                {{ t('dataPipelines.selectAll') }}
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
                    <el-checkbox 
                      :label="org"
                      :value="org"
                    >
                      {{ org.name }}
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="w-1/2 p-4 border rounded-md h-[500px] overflow-y-auto">
          <p class="text-lg mb-2">{{ t('dataPipelines.selected') }}：</p>
          
          <!-- 已选个人 -->
          <div v-if="selectedUsers.length > 0">
            <p class="text-sm text-gray-500 mb-2">
              {{ t('dataPipelines.person') }}
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
              {{ t('dataPipelines.organization') }}
            </p>
            <div class="select-user grid grid-cols-2 gap-2">
              <el-tag
                v-for="org in selectedOrgs"
                :key="org.path"
                closable
                @close="removeOrg(org)"
                class="mb-2"
              >
                {{ org.name }}
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

    <!-- 左右布局的图标上传弹窗 -->
    <el-dialog
      :title="t('dataPipelines.editIcon')"
      v-model="uploadDialogVisible"
      width="900px"
      :before-close="handleUploadDialogClose"
      class="image-upload-dialog"
    >
      <div class="upload-content">
        <!-- 左侧：图标预览区 -->
        <div class="preview-panel">
          <h3 class="panel-title">{{ t("dataPipelines.iconPreview") }}</h3>
          <div class="preview-container">
            <!-- 显示当前最新图标（原图标或已上传的新图标） -->
            <div v-if="currentPreviewImage" class="image-wrapper">
              <img
                :src="origin + currentPreviewImage"
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
              :action="uploadUrl"
              :headers="uploadHeaders"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
              :show-file-list="false"
              :on-progress="handleUploadProgress"
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
                  <el-progress
                    :percentage="uploadProgress"
                    stroke-width="8"
                    class="progress-bar"
                  />
                  <p class="progress-text">{{ t("dataPipelines.uploading") }}: {{ uploadProgress }}%</p>
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
                    class="reupload-btn"
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
import { ElMessage, ElLoading } from "element-plus";
import useFetchApi from "@/packs/useFetchApi";
import { useI18n } from "vue-i18n";
import {
  Search,
  UploadFilled,
  Picture,
  InfoFilled,
  WarningFilled,
} from "@element-plus/icons-vue";

// 引入国际化文件
import zhOps from "../../../../locales/zh_js/operator_zh.json";
import enOps from "../../../../locales/en_js/operator_en.json";

const { t, locale } = useI18n();

// 准备国际化数据源
const operatorI18n = {
  zh: zhOps,
  en: enOps,
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
const origin = window.location.origin + '/';

// 授权相关
const operator_id = ref("");
const dialogVisible = ref(false);
const searchKeyword = ref("");
const selectedUsers = ref([]);
const selectedOrgs = ref([]);
const personalUsers = ref([]);
const orgData = ref([]);
const selectAll = ref(false);
const activeName = ref('user');
const userSelectAll = ref(false);
const orgSelectAll = ref(false);

// 图标上传核心状态
const uploadDialogVisible = ref(false);
const currentTemplate = ref(null);
const uploadUrl = ref(
  `${CSGHUB_SERVER}/api/v1/dataflow/internal_api/internal_api/upload`
);
const uploadHeaders = reactive({
  // 如需认证请添加token
  // 'Authorization': `Bearer ${yourToken}`
});

// 上传状态管理
const uploadState = ref("ready");
const uploadProgress = ref(0);
const uploadErrorMsg = ref("");
const newImageUrl = ref("");
const isNewImageUploaded = ref(false);

// 计算属性 - 始终显示最新图标
const currentPreviewImage = computed(() => {
  return newImageUrl.value || currentTemplate.value?.icon || "";
});

// 授权相关方法
const authorize = async (operatorId) => {
  dialogVisible.value = true
  operator_id.value = operatorId
  searchKeyword.value = ""
  userSelectAll.value = false
  orgSelectAll.value = false
  activeName.value = 'user'

  userPagination.value = {
    page: 1,
    per: 14,
    total: 0
  };

  try {
    const [userData, org, operatorData] = await Promise.all([
      getUser(),
      getOrg(),
      getOperator(operatorId)
    ])
    
    personalUsers.value = userData.data
    orgData.value = org.data
    
    // 初始化已选数据时从所有用户中筛选
    selectedUsers.value = operatorData.users.map(user => {
      // 尝试从已加载的用户中找到完整信息
      const fullUser = allUsers.value.find(u => u.uuid === user.uuid);
      return fullUser || user;
    });
    
    selectedOrgs.value = orgData.value.filter(org => 
      operatorData.orgs.some(selectedOrg => selectedOrg.path === org.path)
    );

    // 更新全选状态
    updateSelectAllStatus()
  } catch (error) {
    ElMessage.error(error.message)
  }
};

const loadUsers = async () => {
  const userData = await getUser();
  personalUsers.value = userData.data || [];
  updateSelectAllStatus();
};

// 更新全选状态
const updateSelectAllStatus = () => {
  if (activeName.value === 'user') {
    userSelectAll.value = filteredUsers.value.length > 0 && 
      filteredUsers.value.every(user => 
        selectedUsers.value.some(u => u.uuid === user.uuid))
  } else {
    orgSelectAll.value = filteredOrgs.value.length > 0 && 
      filteredOrgs.value.every(org => 
        selectedOrgs.value.some(o => o.path === org.path))
  }
}

// 全选/取消全选
const handleUserSelectAll = async (val) => {
  if (val) {
    // 获取所有符合条件的用户并选中
    const allMatchingUsers = [];
    let currentPage = 1;
    const totalPages = Math.ceil(userPagination.value.total / userPagination.value.per);
    
    // 循环获取所有分页数据
    while (currentPage <= totalPages) {
      const { data } = await useFetchApi(`/users?per=${userPagination.value.per}&page=${currentPage}&search=${searchKeyword.value || ''}`)
        .get()
        .json();
      
      if (data.value?.data?.data) {
        allMatchingUsers.push(...data.value.data.data);
      }
      currentPage++;
    }
    
    // 去重添加到已选
    const newUsers = allMatchingUsers.filter(
      user => !selectedUsers.value.some(u => u.uuid === user.uuid)
    );
    selectedUsers.value = [...selectedUsers.value, ...newUsers];
    allUsers.value = Array.from(
      new Map(allMatchingUsers.map(user => [user.uuid, user])).values()
    );
  } else {
    // 取消选中当前页用户
    selectedUsers.value = selectedUsers.value.filter(
      user => !currentPageUsers.value.some(u => u.uuid === user.uuid)
    );
  }
};

const handleOrgSelectAll = (val) => {
  const currentOrgPaths = filteredOrgs.value.map(org => org.path)
  if (val) {
    // 添加当前页所有组织（去重）
    const newOrgs = filteredOrgs.value.filter(
      org => !selectedOrgs.value.some(o => o.path === org.path))
    selectedOrgs.value = [...selectedOrgs.value, ...newOrgs]
  } else {
    // 只移除当前页组织
    selectedOrgs.value = selectedOrgs.value.filter(
      org => !currentOrgPaths.includes(org.path))
  }
}

const userPagination = ref({
  page: 1,
  per: 14,
  total: 0
});

const allUsers = ref([]);
const currentPageUsers = ref([]);

// 获取人员
const getUser = async () => {
  try {
    const { data } = await useFetchApi(`/users?per=${userPagination.value.per}&page=${userPagination.value.page}&search=${searchKeyword.value || ''}`)
      .get()
      .json();
    if (data.value) {
      userPagination.value.total = data.value.data.total || 0;
      // 保存当前页数据
      currentPageUsers.value = data.value.data.data || [];
      // 合并所有已加载的用户数据（去重）
      allUsers.value = Array.from(
        new Map([
          ...allUsers.value.map(user => [user.uuid, user]),
          ...currentPageUsers.value.map(user => [user.uuid, user])
        ]).values()
      );
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
  const url = `/dataflow/operator_permission/operator/${operator_id}`;
  const { data } = await useFetchApi(url).get().json();
  return data.value.data;
};

const filteredUsers = computed(() => {
  return currentPageUsers.value
})

const filteredOrgs = computed(() => {
  return orgData.value.filter(org => 
    org.name.includes(searchKeyword.value))
})

// 移除已选
const removeUser = (user) => {
  selectedUsers.value = selectedUsers.value.filter(u => u.uuid !== user.uuid)
}

const removeOrg = (org) => {
  selectedOrgs.value = selectedOrgs.value.filter(o => o.path !== org.path)
}

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
    }

    const { data } = await useFetchApi(`/dataflow/operator_permission/`, {
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

// 图标上传相关方法
const openUploadDialog = (item) => {
  currentTemplate.value = item;
  resetUploadState(true);
  uploadDialogVisible.value = true;
};

const handleUploadDialogClose = () => {
  uploadDialogVisible.value = false;
  currentTemplate.value = null;
  resetUploadState(true);
};

const resetUploadState = (fullReset = false) => {
  uploadState.value = "ready";
  uploadProgress.value = 0;
  uploadErrorMsg.value = "";

  if (fullReset) {
    newImageUrl.value = "";
    isNewImageUploaded.value = false;
  }
};

const handleUploadProgress = (event) => {
  uploadProgress.value = Math.floor(event.percent * 100);
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

const handleUploadSuccess = (response) => {
  if (response.code === 200 && response.data?.url) {
    newImageUrl.value = response.data.url;
    isNewImageUploaded.value = true;
    uploadState.value = "success";
    ElMessage.success(t("dataPipelines.uploadSuccessTips2"));
  } else {
    uploadErrorMsg.value = response.msg || t("dataPipelines.uploadFailedTips3");
    uploadState.value = "error";
  }
};

const handleUploadError = (error) => {
  uploadErrorMsg.value = t("dataPipelines.networkError");
  uploadState.value = "error";
};

const submitImageChange = async () => {
  if (!currentTemplate.value || !newImageUrl.value) return;

  try {
    const loading = ElLoading.service({
      lock: true,
      text: t("dataPipelines.submitting"),
      background: "rgba(0, 0, 0, 0.7)",
    });

    const updateData = {
      icon: newImageUrl.value,
    };

    const { data } = await useFetchApi(
      `${CSGHUB_SERVER}/api/v1/dataflow/operator/${currentTemplate.value.id}`,
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
const originalCardList = ref([])
const getOperatorList = async () => {
  try {
    const { data } = await useFetchApi(
      `/dataflow/operator/?skip=${state.value.skip}&limit=${state.value.limit}`
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
  margin-bottom: 16px;
  padding-left: 4px;
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
  margin-bottom: 20px;
}

// 上传文字
.upload-text {
  text-align: center;

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
  padding: 20px;

  .success-icon {
    font-size: 56px;
    color: #10b981;
    margin-bottom: 16px;
  }

  .success-text {
    font-size: 16px;
    font-weight: 500;
    color: #10b981;
    margin-bottom: 8px;
  }

  .success-subtext {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 20px;
  }

  .reupload-btn {
    margin-top: 8px;
  }

  .reload-icon {
    margin-right: 4px;
    font-size: 14px;
  }
}

// 上传错误状态
.upload-error-state {
  text-align: center;
  padding: 20px;

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
</style>
