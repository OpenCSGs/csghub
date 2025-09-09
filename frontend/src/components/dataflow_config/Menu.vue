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
        <el-sub-menu index="1">
          <template #title>
            <div class="innerBox w-full px-3 py-2">
              <SvgIcon name="data-acquisition" class="w-5 h-5" />
              <span class="sle ml-2">{{
                t("dataPipelines.dataAcquisition")
              }}</span>
            </div>
          </template>
          <el-menu-item-group>
            <!-- <el-menu-item
              index="1-1"
              @click="handleClickMenu('/datapipelines/dataCollectionTask')"
            >
              <SvgIcon
                v-if="currentRoute === '1-1'"
                name="dataflow_menuline"
                class="menuline w-1 h-5 mr-1 absolute left-0"
              />
              {{ t("dataPipelines.dataCollectionTask") }}
            </el-menu-item> -->
            <el-menu-item
              index="1-1"
              @click="handleClickMenu('/datapipelines/dataSourceManagement')"
            >
              <SvgIcon
                v-if="currentRoute === '1-1'"
                name="dataflow_menuline"
                class="menuline w-1 h-5 mr-1 absolute left-0"
              />
              {{ t("dataPipelines.dataSourceManagement") }}
            </el-menu-item>
            <el-menu-item
              index="1-2"
              @click="handleClickMenu('/datapipelines/formatConversion')"
            >
              <SvgIcon
                v-if="currentRoute === '1-2'"
                name="dataflow_menuline"
                class="menuline w-1 h-5 mr-1 absolute left-0"
              />
              {{ t("dataPipelines.formatConversion") }}
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <el-menu-item index="2" @click="handleClickMenu('/datapipelines')">
          <SvgIcon
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_menuIcon_tlp" class="w-5 h-5" />
            <span class="sle ml-2">{{
              t("dataPipelines.dataProcessing")
            }}</span>
          </div>
        </el-menu-item>
        <!-- <el-menu-item
          index="3"
          @click="handleClickMenu('/datapipelines/algTemplate')"
        >
          <SvgIcon
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon
              name="dataflow_menuIcon"
              class="w-5 h-5"
            />
            <span class="sle ml-2">{{
              t('dataPipelines.algorithmTemplate')
            }}</span>
          </div>
        </el-menu-item> -->
        <el-sub-menu index="3">
          <template #title>
            <div class="innerBox w-full px-3 py-2">
              <SvgIcon name="algorithm-template" class="w-5 h-5" />
              <span class="sle ml-2">{{
                t("dataPipelines.algorithmTemplate")
              }}</span>
            </div>
          </template>
          <el-menu-item-group>
            <el-menu-item
              index="3-1"
              @click="handleClickMenu('/datapipelines/builtInTemplate')"
            >
              <SvgIcon
                v-if="currentRoute === '3-1'"
                name="dataflow_menuline"
                class="menuline w-1 h-5 mr-1 absolute left-0"
              />
              {{ t("dataPipelines.builtInTemplate") }}
            </el-menu-item>
            <el-menu-item
              index="3-2"
              @click="handleClickMenu('/datapipelines/customTemplate')"
            >
              <SvgIcon
                v-if="currentRoute === '3-2'"
                name="dataflow_menuline"
                class="menuline w-1 h-5 mr-1 absolute left-0"
              />
              {{ t("dataPipelines.customTemplate") }}
            </el-menu-item>
            <el-menu-item
              v-if="isadmin"
              index="3-3"
              @click="handleClickMenu('/datapipelines/operatorManagement')"
            >
              <SvgIcon
                v-if="currentRoute === '3-3'"
                name="dataflow_menuline"
                class="menuline w-1 h-5 mr-1 absolute left-0"
              />
              {{ t("dataPipelines.operatorManagement") }}
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item
          index="4"
          @click="handleClickMenu('/datapipelines/celeryNodeService')"
        >
          <SvgIcon
            v-if="currentRoute === '4'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dashboard" class="w-5 h-5" />
            <span class="sle ml-2">{{
              t("dataPipelines.systemDashboard")
            }}</span>
          </div>
        </el-menu-item>
        <el-menu-item
          index="5"
          @click="handleClickMenu('/datapipelines/tools')"
        >
          <SvgIcon
            v-if="currentRoute === '5'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="dataflow_menuIcon_tools" class="w-5 h-5" />
            <span class="sle ml-2">{{ t("dataPipelines.toolsTit") }}</span>
          </div>
        </el-menu-item>
        <el-menu-item index="6" @click="jump">
          <SvgIcon
            v-if="currentRoute === '6'"
            name="dataflow_menuline"
            class="menuline w-1 h-5 mr-1 absolute left-0"
          />
          <div class="innerBox w-full px-3 py-2">
            <SvgIcon name="label_studio" class="w-5 h-5" />
            <span class="sle ml-2">{{ t("dataPipelines.labelStudio") }}</span>
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
import useUserStore from '@/stores/UserStore'
const userStore = useUserStore()

const { cookies } = useCookies();

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const routes = router.getRoutes();
const currentRoute = ref("1-1");
const isadmin = ref(false);
const menuRoutes = {
  // "/datapipelines/dataCollectionTask": "1-1",
  "/datapipelines/dataSourceManagement": "1-1",
  "/datapipelines/formatConversion": "1-2",
  "/datapipelines": "2",
  "/datapipelines/newTask": "2",
  "/datapipelines/dataflowInfo": "2",
  "/datapipelines/builtInTemplate": "3-1",
  "/datapipelines/customTemplate": "3-2",
  "/datapipelines/operatorManagement": "3-3",
  // '/datapipelines/algTemplate': '3',
  // '/datapipelines/newTemplate': '3',
  // "/datapipelines/systemDashboard": "4",
  "/datapipelines/celeryNodeService": "4",
  "/datapipelines/tools": "5",
};
const handleClickMenu = (path) => {
  router.push(path);
};
watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    console.log("============", currentRoute.value, newPath);
    currentRoute.value = menuRoutes[newPath] || "1-1";
  }
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
  currentRoute.value = menuRoutes[currentPath] || "1-1";
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
    window.open(
      `${data.value.data}`,
      "_blank"
    );
  }else {
    ElMessage.error(data.value.msg);
  }

  // previous_path=${cookies.get(
  //       "previous_path"
  //     )};
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
  color: #3250bd;
  .innerBox {
    border-radius: var(--radius-8, 8px);
    background: var(--Brand-25, #f0f3ff);
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
    color: #3250bd;
  }
}
:deep(.el-sub-menu__title) {
  &:hover {
    background: transparent;
    color: #3250bd;
  }
}
:deep(.el-menu--collapse .el-sub-menu.is-active .el-sub-menu__title) {
  color: #3250bd;
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
</style>
