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
        default-active="1"
        class="el-menu-vertical"
        :collapse="isCollapse"
        :collapse-transition="false"
        @select="handleSelect"
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
            <el-icon class="w-5 h-5"><Odometer /></el-icon>
            <span class="sle ml-2">{{
              t("dataPipelines.systemDashboard")
            }}</span>
          </div>
        </el-menu-item>

        <!-- 2. 数据源管理 -->
        <el-menu-item
          index="2"
          @click="handleClickMenu('/datapipelines/dataSourceManagement')"
        >
          <SvgIcon
            v-if="currentRoute === '2'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <el-icon class="w-5 h-5"><Coin /></el-icon>
            <span class="sle ml-2">{{
              t("dataPipelines.dataSourceManagement")
            }}</span>
          </div>
        </el-menu-item>

        <!-- 3. 数据格式转换 -->
        <el-menu-item
          index="3"
          @click="handleClickMenu('/datapipelines/formatConversion')"
        >
          <SvgIcon
            v-if="currentRoute === '3'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <el-icon class="w-5 h-5"><Switch /></el-icon>
            <span class="sle ml-2">{{
              t("dataPipelines.dataFormatConversion")
            }}</span>
          </div>
        </el-menu-item>

        <!-- 4. 数据过滤 -->
        <el-menu-item
          index="4"
          @click="handleClickMenuWithTemplate('/datapipelines/addDataProcessing', '数据过滤')"
        >
          <SvgIcon
            v-if="currentRoute === '4'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <el-icon class="w-5 h-5"><Filter /></el-icon>
            <span class="sle ml-2">{{ t("dataPipelines.dataFilter") }}</span>
          </div>
        </el-menu-item>

        <!-- 5. 数据筛选 -->
        <el-menu-item
          index="5"
          @click="handleClickMenuWithTemplate('/datapipelines/addDataProcessing', '数据筛选')"
        >
          <SvgIcon
            v-if="currentRoute === '5'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <el-icon class="w-5 h-5"><Finished /></el-icon>
            <span class="sle ml-2">{{ t("dataPipelines.dataSelection") }}</span>
          </div>
        </el-menu-item>

        <!-- 6. 数据脱敏 -->
        <el-menu-item
          index="6"
          @click="handleClickMenuWithTemplate('/datapipelines/addDataProcessing', '数据脱敏')"
        >
          <SvgIcon
            v-if="currentRoute === '6'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <el-icon class="w-5 h-5"><Hide /></el-icon>
            <span class="sle ml-2">{{ t("dataPipelines.dataDesensitization") }}</span>
          </div>
        </el-menu-item>

        <!-- 7. 语义去重 -->
        <el-menu-item
          index="7"
          @click="handleClickMenuWithTemplate('/datapipelines/addDataProcessing', '语义去重')"
        >
          <SvgIcon
            v-if="currentRoute === '7'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <el-icon class="w-5 h-5"><DocumentCopy /></el-icon>
            <span class="sle ml-2">{{ t("dataPipelines.semanticDeduplication") }}</span>
          </div>
        </el-menu-item>

        <!-- 8. 质量评测 -->
        <el-menu-item
          index="8"
          @click="handleClickMenuWithQuery('/datapipelines/newTask', { type: 'tool', selToolName: 'fineweb_edu_chinese_common_internal' })"
        >
          <SvgIcon
            v-if="currentRoute === '8'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <el-icon class="w-5 h-5"><Medal /></el-icon>
            <span class="sle ml-2">{{ t("dataPipelines.qualityEvaluation") }}</span>
          </div>
        </el-menu-item>

        <!-- 9. 数据标注 -->
        <el-menu-item index="9" @click="jump">
          <SvgIcon
            v-if="currentRoute === '9'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <el-icon class="w-5 h-5"><EditPen /></el-icon>
            <span class="sle ml-2">{{ t("dataPipelines.labelStudio") }}</span>
          </div>
        </el-menu-item>

        <!-- 10. 安全扫描 -->
        <el-menu-item index="10" @click="jumpToSecurityScan">
          <SvgIcon
            v-if="currentRoute === '10'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <el-icon class="w-5 h-5"><Lock /></el-icon>
            <span class="sle ml-2">{{ t("dataPipelines.securityScan") }}</span>
          </div>
        </el-menu-item>

        <!-- 11. 任务管理 -->
        <el-sub-menu index="11">
          <template #title>
            <div class="innerBox w-full px-3 py-2">
              <el-icon class="w-5 h-5"><Setting /></el-icon>
              <span class="sle ml-2">{{
                t("dataPipelines.taskManagement")
              }}</span>
            </div>
          </template>
          <el-menu-item-group>
            <!-- 11-1. 任务列表 -->
            <el-menu-item
              index="11-1"
              @click="handleClickMenu('/datapipelines')"
            >
              <SvgIcon
                v-if="currentRoute === '11-1'"
                name="dataflow_menuline"
                class="menuline w-1 h-5 mr-1 absolute left-0"
              />
              {{ t("dataPipelines.taskList") }}
            </el-menu-item>
            <!-- 11-2. 内置任务模板 -->
            <el-menu-item
              index="11-2"
              @click="handleClickMenu('/datapipelines/builtInTemplate')"
            >
              <SvgIcon
                v-if="currentRoute === '11-2'"
                name="dataflow_menuline"
                class="menuline w-1 h-5 mr-1 absolute left-0"
              />
              {{ t("dataPipelines.builtInTaskTemplate") }}
            </el-menu-item>
            <!-- 11-3. 自定义任务模板 -->
            <el-menu-item
              index="11-3"
              @click="handleClickMenu('/datapipelines/customTemplate')"
            >
              <SvgIcon
                v-if="currentRoute === '11-3'"
                name="dataflow_menuline"
                class="menuline w-1 h-5 mr-1 absolute left-0"
              />
              {{ t("dataPipelines.customTaskTemplate") }}
            </el-menu-item>
            <!-- 11-4. 算子池 -->
            <el-menu-item
              v-if="isadmin"
              index="11-4"
              @click="handleClickMenu('/datapipelines/operatorManagement')"
            >
              <SvgIcon
                v-if="currentRoute === '11-4'"
                name="dataflow_menuline"
                class="menuline w-1 h-5 mr-1 absolute left-0"
              />
              {{ t("dataPipelines.operatorPool") }}
            </el-menu-item>
            <!-- 11-5. 工具池 -->
            <el-menu-item
              index="11-5"
              @click="handleClickMenu('/datapipelines/tools')"
            >
              <SvgIcon
                v-if="currentRoute === '11-5'"
                name="dataflow_menuline"
                class="menuline w-1 h-5 mr-1 absolute left-0"
              />
              {{ t("dataPipelines.toolsTit") }}
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
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
import { 
  Filter, 
  Finished, 
  Hide, 
  DocumentCopy, 
  Medal, 
  Lock, 
  Odometer, 
  Coin, 
  Switch, 
  EditPen, 
  Setting 
} from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import useFetchApi from "@/packs/useFetchApi";
import { useCookies } from "vue3-cookies";
import useUserStore from "@/stores/UserStore";
const userStore = useUserStore();

const { cookies } = useCookies();

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const routes = router.getRoutes();
const currentRoute = ref("1");
const isadmin = ref(false);
const menuRoutes = {
  "/datapipelines/celeryNodeService": "1",
  "/datapipelines/dataSourceManagement": "2",
  "/datapipelines/formatConversion": "3",
  "/datapipelines/addDataProcessing": "4", // 默认映射到数据过滤
  "/datapipelines": "11-1",
  "/datapipelines/newTask": "11-1",
  "/datapipelines/dataflowInfo": "11-1",
  "/datapipelines/builtInTemplate": "11-2",
  "/datapipelines/customTemplate": "11-3",
  "/datapipelines/operatorManagement": "11-4",
  "/datapipelines/tools": "11-5",
};

// 模板名称到菜单索引的映射
const templateMenuMap = {
  "数据过滤": "4",
  "数据筛选": "5",
  "数据脱敏": "6",
  "语义去重": "7",
};

// 工具名称到菜单索引的映射（用于质量评测等工具页面）
const toolMenuMap = {
  "fineweb_edu_chinese_common_internal": "8", // 质量评测
};

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
    console.log("============", currentRoute.value, newPath, templateName, selToolName);
    
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
  { deep: true }
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
  const currentPath = router.currentRoute.value.path;
  const templateName = router.currentRoute.value.query?.templateName;
  const selToolName = router.currentRoute.value.query?.selToolName;
  
  // 如果有 selToolName 参数（工具类页面），根据工具名称确定菜单索引
  if (selToolName && toolMenuMap[selToolName]) {
    currentRoute.value = toolMenuMap[selToolName];
  }
  // 如果有 templateName 参数，根据模板名称确定菜单索引
  else if (templateName && templateMenuMap[templateName]) {
    currentRoute.value = templateMenuMap[templateName];
  } else {
    currentRoute.value = menuRoutes[currentPath] || "1";
  }
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
  const { data } = await useFetchApi(`/dataflow/security/jump-to-scan`, {
    headers: {
      "Content-Type": "application/json",
      "user_name": `${userStore.username}`,
    },
    body: JSON.stringify({}),
  })
    .post()
    .json();
  loading.close();
  if (data.value?.code === 200) {
    const origin = window.location.origin;
    window.open(`${data.value.data}&origin=${origin}&language=${locale.value}`, "_blank");
  } else {
    ElMessage.error(data.value.msg);
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

<style scoped lang="less">
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
}
.innerBox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
:deep(.el-menu-item) {
  padding: 0 20px;
  span {
    line-height: 24px;
    font-weight: 500;
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
    padding-left: 60px !important;
  }
}
:deep(.el-sub-menu.is-active) {
  .menuline {
    display: block;
  }
}
:deep(.el-menu-item.is-active) {
  .menuline {
    display: block;
  }
  color: var(--Theme-600) !important;
  .innerBox {
    border-radius: var(--radius-8, 8px);
    background: var(--Theme-200);
    color: var(--Theme-600) !important;
  }
  .el-icon {
    color: var(--Theme-600) !important;
  }
  span {
    color: var(--Theme-600) !important;
  }
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
  padding: 0 10px 0 17px;
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
    color: var(--Theme-600) !important;
    .el-icon {
      color: var(--Theme-600) !important;
    }
    span {
      color: var(--Theme-600) !important;
    }
  }
}
:deep(.el-sub-menu__title) {
  &:hover {
    background: transparent;
    color: var(--Theme-600) !important;
    .el-icon {
      color: var(--Theme-600) !important;
    }
    span {
      color: var(--Theme-600) !important;
    }
  }
}
:deep(.el-menu--collapse .el-sub-menu.is-active .el-sub-menu__title) {
  color: var(--Theme-600) !important;
  .el-icon {
    color: var(--Theme-600) !important;
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
