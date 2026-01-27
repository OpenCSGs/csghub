<template>
  <el-aside
    style="width: auto !important"
    class="border-r border-gray-200 bg-gray-50 sm:hidden relative"
  >
    <div
      class="aside-box pt-6"
      :style="{ width: isCollapse ? '80px' : '240px' }"
    >
      <el-menu
        :default-active="currentRoute"
        class="el-menu-vertical"
        :collapse="isCollapse"
        :collapse-transition="false"
        @select="handleSelect"
        style="--el-menu-active-bg-color: var(--Gold-100); --el-menu-active-color: var(--Gold-600);"
      >
        <!-- 1. 系统仪表盘 -->
        <el-menu-item
          index="1"
          @click="handleClickMenu('/datapipelines/celeryNodeService')"
        >
          <SvgIcon
            v-if="currentRoute === '1'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_system_dashboard" class="w-4 h-4" />
            <span class="sle ml-2">{{
              t("dataPipelines.systemDashboard")
            }}</span>
          </div>
        </el-menu-item>

        <!-- 2. 任务列表 -->
        <el-menu-item
          index="2"
          @click="handleClickMenu('/datapipelines')"
        >
          <SvgIcon
            v-if="currentRoute === '2'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_task_management" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.taskList") }}</span>
          </div>
        </el-menu-item>

        <!-- 3. 数据源管理 -->
        <el-menu-item
          index="3"
          @click="handleClickMenu('/datapipelines/dataSourceManagement')"
        >
          <SvgIcon
            v-if="currentRoute === '3'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_data_source" class="w-4 h-4" />
            <span class="sle ml-2">{{
              t("dataPipelines.dataSourceManagement")
            }}</span>
          </div>
        </el-menu-item>

        <!-- 4. 数据格式转换 -->
        <el-menu-item
          index="4"
          @click="handleClickMenu('/datapipelines/formatConversion')"
        >
          <SvgIcon
            v-if="currentRoute === '4'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_data_format_conversion" class="w-4 h-4" />
            <span class="sle ml-2">{{
              t("dataPipelines.dataFormatConversion")
            }}</span>
          </div>
        </el-menu-item>

        <!-- 5. MD转JSON -->
        <el-menu-item
          index="5"
          @click="handleClickMenuWithQuery('/datapipelines/newTask', { type: 'tool', selToolName: 'md_to_jsonl_preprocess_internal' })"
        >
          <SvgIcon
            v-if="currentRoute === '5'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_drag" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.mdToJson") }}</span>
          </div>
        </el-menu-item>

        <!-- 6. 数据过滤 -->
        <el-menu-item
          index="6"
          @click="handleClickMenuWithTemplate('/datapipelines/addDataProcessing', '数据过滤')"
        >
          <SvgIcon
            v-if="currentRoute === '6'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_data_filtering" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.dataFilter") }}</span>
          </div>
        </el-menu-item>

        <!-- 7. 数据筛选 -->
        <el-menu-item
          index="7"
          @click="handleClickMenuWithTemplate('/datapipelines/addDataProcessing', '数据筛选')"
        >
          <SvgIcon
            v-if="currentRoute === '7'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_data_filter" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.dataSelection") }}</span>
          </div>
        </el-menu-item>

        <!-- 8. 数据脱敏 -->
        <el-menu-item
          index="8"
          @click="handleClickMenuWithTemplate('/datapipelines/addDataProcessing', '数据脱敏')"
        >
          <SvgIcon
            v-if="currentRoute === '8'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_data_desensitization" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.dataDesensitization") }}</span>
          </div>
        </el-menu-item>

        <!-- 9. 语义去重 -->
        <el-menu-item
          index="9"
          @click="handleClickMenuWithTemplate('/datapipelines/addDataProcessing', '语义去重')"
        >
          <SvgIcon
            v-if="currentRoute === '9'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_semantic_deduplication" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.semanticDeduplication") }}</span>
          </div>
        </el-menu-item>

        <!-- 10. 质量评测 -->
        <el-menu-item
          index="10"
          @click="handleClickMenuWithQuery('/datapipelines/newTask', { type: 'tool', selToolName: 'fineweb_edu_chinese_common_internal' })"
        >
          <SvgIcon
            v-if="currentRoute === '10'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_quality_evaluation" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.qualityEvaluation") }}</span>
          </div>
        </el-menu-item>

        <!-- 11. 数据标注 -->
        <el-menu-item index="11" @click="jump">
          <SvgIcon
            v-if="currentRoute === '11'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_data_labeling" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.labelStudio") }}</span>
          </div>
        </el-menu-item>

        <!-- 12. 安全扫描 -->
        <el-menu-item index="12" @click="jumpToSecurityScan">
          <SvgIcon
            v-if="currentRoute === '12'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_security_scanning" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.securityScan") }}</span>
          </div>
        </el-menu-item>

        <!-- 13. 内置任务模板 -->
        <el-menu-item
          index="13"
          @click="handleClickMenu('/datapipelines/builtInTemplate')"
        >
          <SvgIcon
            v-if="currentRoute === '13'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="algorithm-template" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.builtInTaskTemplate") }}</span>
          </div>
        </el-menu-item>

        <!-- 14. 自定义任务模板 -->
        <el-menu-item
          index="14"
          @click="handleClickMenu('/datapipelines/customTemplate')"
        >
          <SvgIcon
            v-if="currentRoute === '14'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_menuIcon_tlp" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.customTaskTemplate") }}</span>
          </div>
        </el-menu-item>

        <!-- 15. 算子池 -->
        <el-menu-item
          v-if="isadmin"
          index="15"
          @click="handleClickMenu('/datapipelines/operatorManagement')"
        >
          <SvgIcon
            v-if="currentRoute === '15'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_data_desensitization" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.operatorPool") }}</span>
          </div>
        </el-menu-item>

        <!-- 16. 工具池 -->
        <el-menu-item
          index="16"
          @click="handleClickMenu('/datapipelines/tools')"
        >
          <SvgIcon
            v-if="currentRoute === '16'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_menuIcon_tools" class="w-4 h-4" />
            <span class="sle ml-2">{{ t("dataPipelines.toolsTit") }}</span>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
    <SvgIcon
      :name="isCollapse ? 'dataflow_alignR' : 'dataflow_alignL'"
      class="w-5 h-5 absolute bottom-7.5 right-7.5 cursor-pointer"
      :class="{ alignRBtn: isCollapse }"
      @click="changeCollapse"
    />
  </el-aside>
</template>

<script setup>
import { onMounted, onBeforeUnmount, computed, watch, ref } from "vue";
import { useGlobalStore } from "../../stores/useGlobalStore";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElLoading } from "element-plus";
import { useI18n } from "vue-i18n";
import useFetchApi from "@/packs/useFetchApi";
import { useCookies } from "vue3-cookies";
import useUserStore from "@/stores/UserStore";
import SvgIcon from "@/components/shared/SvgIcon.vue";
const userStore = useUserStore();

const { cookies } = useCookies();

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const routes = router.getRoutes();
const isadmin = ref(false);
const menuRoutes = {
  "/datapipelines/celeryNodeService": "1",
  "/datapipelines": "2",
  "/datapipelines/newTask": "2",
  "/datapipelines/dataflowInfo": "2",
  "/datapipelines/dataSourceManagement": "3",
  "/datapipelines/formatConversion": "4",
  "/datapipelines/addDataProcessing": "6", // 默认映射到数据过滤
  "/datapipelines/builtInTemplate": "13",
  "/datapipelines/customTemplate": "14",
  "/datapipelines/operatorManagement": "15",
  "/datapipelines/tools": "16",
};

// 模板名称到菜单索引的映射
const templateMenuMap = {
  "数据过滤": "6",
  "数据筛选": "7",
  "数据脱敏": "8",
  "语义去重": "9",
};

// 工具名称到菜单索引的映射（用于质量评测等工具页面）
const toolMenuMap = {
  "md_to_jsonl_preprocess_internal": "5", // MD转JSON
  "fineweb_edu_chinese_common_internal": "10", // 质量评测
};

// 初始化当前路由的函数
const initCurrentRoute = () => {
  const currentPath = router.currentRoute.value.path;
  const templateName = router.currentRoute.value.query?.templateName;
  const selToolName = router.currentRoute.value.query?.selToolName;
  
  // 如果有 selToolName 参数（工具类页面），根据工具名称确定菜单索引
  if (selToolName && toolMenuMap[selToolName]) {
    return toolMenuMap[selToolName];
  }
  // 如果有 templateName 参数，根据模板名称确定菜单索引
  else if (templateName && templateMenuMap[templateName]) {
    return templateMenuMap[templateName];
  } else {
    return menuRoutes[currentPath] || "1";
  }
};

const currentRoute = ref(initCurrentRoute());

const handleClickMenu = (path) => {
  router.push(path);
};

const handleClickMenuWithTemplate = (path, templateName) => {
  router.push({
    path: path,
    query: { templateName: templateName }
  });
};

const handleClickMenuWithQuery = (path, query) => {
  router.push({
    path: path,
    query: query
  });
};
watch(
  () => router.currentRoute.value,
  (newRoute) => {
    const newPath = newRoute.path;
    const templateName = newRoute.query?.templateName;
    const selToolName = newRoute.query?.selToolName;
    
    // 如果有 selToolName 参数（工具类页面），根据工具名称确定菜单索引
    if (selToolName && toolMenuMap[selToolName]) {
      currentRoute.value = toolMenuMap[selToolName];
    }
    // 如果有 templateName 参数，根据模板名称确定菜单索引
    else if (templateName && templateMenuMap[templateName]) {
      currentRoute.value = templateMenuMap[templateName];
    } else {
      currentRoute.value = menuRoutes[newPath] || "1";
    }
  },
  { immediate: true, deep: true }
);
const globalStore = useGlobalStore();
const isCollapse = computed(() => globalStore.isCollapse);
const changeCollapse = () => {
  globalStore.toggleCollapse();
};
function handleResize() {
  globalStore.setCollapse(window.innerWidth < 1280);
}
onMounted(() => {
  handleResize();
  getAdminStatus();
  window.addEventListener("resize", handleResize);
  // 初始化当前路由（watch 会在 immediate: true 时执行，但这里确保初始化）
  currentRoute.value = initCurrentRoute();
});

const getAdminStatus = async () => {
  const { data } = await useFetchApi(`/dataflow/operator/isAdmin/torf`, {})
    .get()
    .json();
  isadmin.value = data.value.data.isadmin;
};

const jump = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: `${t("dataPipelines.inProgress")}...`,
    background: "rgba(0, 0, 0, 0.7)",
  });
  const { data } = await useFetchApi(`/dataflow/studio/jump-to-studio`, {
    headers: {
      "Content-Type": "application/json",
      "user_name": `${userStore.username}`,
      // 'cookie': `user_token=${cookies.get("user_token")};`,
    },
    body: JSON.stringify({}),
  })
    .post()
    .json();
  loading.close();
  console.log(data, "datadatadata");
  if (data.value?.code === 200) {
    const origin = window.location.origin;
    window.open(`${data.value.data}&origin=${origin}&language=${locale.value}`, "_blank");
  } else {
    ElMessage.error(data.value.msg);
  }

  // previous_path=${cookies.get(
  //       "previous_path"
  //     )};
};

const jumpToSecurityScan = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: `${t("dataPipelines.inProgress")}...`,
    background: "rgba(0, 0, 0, 0.7)",
  });
  
  try {
    // 获取用户 token
    const { data, error } = await useFetchApi(
      `/user/${userStore.username}/tokens?app=git`
    ).json();
    
    loading.close();
    
    if (error.value) {
      ElMessage.error(error.value.msg || t("dataPipelines.error"));
      return;
    }
    
    const tokens = data.value?.data || [];
    const token = tokens[0]?.token || '';
    
    if (!token) {
      ElMessage.warning(t("dataPipelines.tokenNotFound") || "Token not found");
      return;
    }
    
    // 跳转到新窗口
    const targetUrl = `http://10.1.83.3/data-security/task?token=${token}`;
    window.open(targetUrl, "_blank");
  } catch (err) {
    loading.close();
    ElMessage.error(err.message || t("dataPipelines.error"));
  }
};

const handleSelect = (key, keyPath) => {
  console.log(key, keyPath);
  currentRoute.value = key;
};

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
defineExpose();
</script>

<style lang="less">
/* 定义 CSS 变量（非 scoped，确保全局可用） */
:root {
  --Gold-100: #FAF3D4;
  --Gold-600: #C7921C;
}
</style>

<style scoped lang="less">
.el-menu-vertical {
  --el-menu-active-bg-color: var(--Gold-100) !important;
  --el-menu-active-color: var(--Gold-600) !important;
  --el-menu-hover-bg-color: transparent !important;
  --el-menu-item-active-color: var(--Gold-600) !important;
  --el-menu-item-active-fill: var(--Gold-100) !important;
}
.sle {
  font-weight: 500 !important;
}
.alignRBtn {
  right: 50%;
  transform: translateX(50%);
}
.logo {
  padding: 16.5px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #eaecf0;
  &.closeLogo {
    justify-content: center;
    padding: 15.5px 20px;
  }
  .logo-img {
    width: 32px;
  }
  .logofull-img {
    width: 114px;
  }
  .logo-text {
    color: var(--el-Text-color-primary, #1c8b7f);
    font-size: 16px;
    font-weight: 700;
  }
}
.el-menu-vertical {
  border: none !important;
  --el-menu-active-bg-color: var(--Gold-100) !important;
  --el-menu-active-color: var(--Gold-600) !important;
}
.innerBox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
/* 确保子菜单标题的 innerBox 左侧对齐 */
:deep(.el-sub-menu__title) .innerBox {
  padding-left: 12px !important;
  padding-right: 12px !important;
}
:deep(.el-menu-item) {
  padding: 0 20px !important;
  margin-left: 12px;
  margin-right: 12px;
  height: auto !important;
  min-height: auto !important;
  span {
    line-height: 24px;
    font-weight: 500;
  }
  &.is-active {
    background-color: var(--Gold-100) !important;
    background: var(--Gold-100) !important;
    color: var(--Gold-600) !important;
    span,
    .sle,
    .innerBox,
    .innerBox * {
      color: var(--Gold-600) !important;
    }
    svg,
    .el-icon {
      color: var(--Gold-600) !important;
      fill: var(--Gold-600) !important;
    }
  }
}
.menuline {
  display: none;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
:deep(.el-menu-item-group) {
  .el-menu-item {
    padding: 8px 20px 8px 60px !important;
    margin-left: 12px !important;
    margin-right: 12px !important;
    height: auto !important;
    min-height: auto !important;
    line-height: 24px !important;
    &:not(.is-active) {
      color: var(--Gray-600) !important;
      background-color: transparent !important;
      span {
        color: var(--Gray-600) !important;
      }
    }
    &.is-active {
      border-radius: 8px !important;
      background-color: var(--Gold-100) !important;
      background: var(--Gold-100) !important;
      color: var(--Gold-600) !important;
      span {
        color: var(--Gold-600) !important;
      }
    }
  }
}
:deep(.el-sub-menu.is-active) {
  .menuline {
    display: block;
    left: -12px !important;
  }
  .el-sub-menu__title {
    margin-left: 12px !important;
    margin-right: 12px !important;
    border-radius: 8px !important;
    background-color: var(--Gold-100) !important;
    background: var(--Gold-100) !important;
    color: var(--Gold-600) !important;
  }
  .el-sub-menu__title .innerBox {
    background: transparent !important;
    background-color: transparent !important;
    color: var(--Gold-600) !important;
    img {
      filter: brightness(0) saturate(100%) invert(67%) sepia(89%) saturate(1352%) hue-rotate(10deg) brightness(98%) contrast(85%) !important;
    }
  }
  .el-sub-menu__title span {
    color: var(--Gold-600) !important;
  }
  .el-sub-menu__title svg,
  .el-sub-menu__title .el-icon {
    color: var(--Gold-600) !important;
    fill: var(--Gold-600) !important;
  }
  /* 子菜单项不应该全部变金色，只有选中的才变 */
  .el-menu-item-group .el-menu-item:not(.is-active) {
    color: var(--Gray-600) !important;
    background-color: transparent !important;
    span {
      color: var(--Gray-600) !important;
    }
  }
}
:deep(.el-menu-item.is-active),
:deep(.el-menu-item.is-active:hover),
.el-menu-vertical :deep(.el-menu-item.is-active),
.el-menu-vertical :deep(.el-menu-item.is-active:hover) {
  position: relative;
  margin-left: 12px !important;
  margin-right: 12px !important;
  border-radius: 8px !important;
  /* 确保 menuline 在最左侧对齐 */
  color: var(--Gold-600) !important;
  background-color: var(--Gold-100) !important;
  background: var(--Gold-100) !important;
  &::before {
    background-color: var(--Gold-100) !important;
  }
  .menuline {
    display: block;
    left: -12px !important;
  }
  .innerBox {
    border-radius: 8px;
    background: transparent !important;
    background-color: transparent !important;
    color: var(--Gold-600) !important;
    img {
      filter: brightness(0) saturate(100%) invert(67%) sepia(89%) saturate(1352%) hue-rotate(10deg) brightness(98%) contrast(85%);
    }
  }
  .el-icon,
  i,
  svg {
    color: var(--Gold-600) !important;
    fill: var(--Gold-600) !important;
  }
  span,
  .sle {
    color: var(--Gold-600) !important;
  }
  *:not(.menuline):not(img) {
    color: var(--Gold-600) !important;
  }
  span,
  .sle {
    color: var(--Gold-600) !important;
  }
  *:not(.menuline):not(img) {
    color: var(--Gold-600) !important;
  }
}

/* 更具体的选择器确保激活状态颜色生效 */
.el-menu-vertical :deep(.el-menu-item.is-active),
.el-menu-vertical :deep(.el-menu-item.is-active *) {
  color: var(--Gold-600) !important;
}

.el-menu-vertical :deep(.el-menu-item.is-active) span,
.el-menu-vertical :deep(.el-menu-item.is-active) .sle,
.el-menu-vertical :deep(.el-menu-item.is-active) .innerBox,
.el-menu-vertical :deep(.el-menu-item.is-active) .innerBox * {
  color: var(--Gold-600) !important;
}

/* 更具体的选择器确保激活状态颜色生效 */
.el-menu-vertical :deep(.el-menu-item.is-active),
.el-menu-vertical :deep(.el-menu-item.is-active *) {
  color: var(--Gold-600) !important;
}

.el-menu-vertical :deep(.el-menu-item.is-active) span,
.el-menu-vertical :deep(.el-menu-item.is-active) .sle,
.el-menu-vertical :deep(.el-menu-item.is-active) .innerBox,
.el-menu-vertical :deep(.el-menu-item.is-active) .innerBox * {
  color: var(--Gold-600) !important;
}
:deep(.el-menu--collapse) {
  width: 100% !important;
  .el-sub-menu__title {
    position: static;
  }
  .innerBox,
  .el-sub-menu__title {
    width: auto;
    padding: 10px !important;
    justify-content: center;
  }
  span {
    display: none !important;
  }
  .el-sub-menu {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
:deep(.el-sub-menu__title) {
  padding: 0 20px !important;
  margin-left: 12px;
  margin-right: 12px;
  height: auto !important;
  min-height: auto !important;
  line-height: normal !important;
  .subItemIco {
    margin-left: 12px;
  }
}
:deep(.el-tooltip__trigger) {
  padding-left: 22px;
  .subItemIco {
    margin-left: 0;
  }
}
:deep(.el-menu-item) {
  &:hover {
    background: transparent;
    color: var(--Gold-600) !important;
    .innerBox {
      img {
        filter: brightness(0) saturate(100%) invert(67%) sepia(89%) saturate(1352%) hue-rotate(10deg) brightness(98%) contrast(85%);
      }
    }
    .el-icon {
      color: var(--Gold-600) !important;
    }
    span {
      color: var(--Gold-600) !important;
    }
  }
}
:deep(.el-sub-menu__title) {
  &:hover {
    background: transparent;
    color: var(--Gold-600) !important;
    .el-icon {
      color: var(--Gold-600) !important;
    }
    span {
      color: var(--Gold-600) !important;
    }
  }
}
:deep(.el-menu--collapse .el-sub-menu.is-active .el-sub-menu__title) {
  color: var(--Gold-600) !important;
  .el-icon {
    color: var(--Gold-600) !important;
  }
}
:deep(.el-menu) {
  background: transparent !important;
}
:deep(.el-scrollbar__view) {
  height: 90vh !important;
  overflow: hidden !important;
}
:deep(.aside-box) {
  height: calc(100% - 24px);
  overflow: hidden !important;
}
:deep(.el-menu-item-group__title) {
  display: none;
}
:deep(.is-active) {
  font-weight: 520 !important;
}

:deep(.el-sub-menu__title) {
  background-color: #f9fafb !important;
}
</style>
