import AdminDashboard from "../dashboard/AdminDashboard.vue";
import AdminUserList from "../users/AdminUserList.vue";
import AdminUserDetail from "../users/AdminUserDetail.vue";
import AdminSystemConfig from "../system_configs/AdminSystemConfig.vue";
import AdminSyncSetting from "../sync/AdminSyncSetting.vue";
import { Setting, User, Connection } from "@element-plus/icons-vue";
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()
import { admin as admin_en } from "../../../locales/en_js/admin.js"
import { admin as admin_zh } from "../../../locales/zh_js/admin.js"

const adminLocale = cookies.get('locale') === 'en' ? admin_en : admin_zh


// parent menu name
export const PARENT_NAME = {
  BASE_CONFIG: adminLocale.baseConfigTitle,
};

// use for parent menu render
export const PARENT_NAME_LIST = [PARENT_NAME.BASE_CONFIG];

const BASE_URL = ADMIN_BASE_PATH;

export const MENU_SETTING = [
  {
    path: BASE_URL,
    component: AdminDashboard,
    name: adminLocale.dashboard.title,
    // this property use for find the parent name
    parentName: PARENT_NAME.BASE_CONFIG,
    icon: "admin-menu-dashboard",
    type: "item",
  },
  {
    path: `${BASE_URL}/system_config`,
    component: AdminSystemConfig,
    name: adminLocale.systemConfig.title,
    parentName: PARENT_NAME.BASE_CONFIG,
    icon: "admin-menu-settings",
    type: "item",
  },
  {
    path: `${BASE_URL}/users`,
    component: AdminUserList,
    name: adminLocale.users.title,
    parentName: PARENT_NAME.BASE_CONFIG,
    icon: "admin-menu-users",
    type: "item",
  },
  {
    path: `${BASE_URL}/users/:id`,
    component: AdminUserDetail,
    name: "用户详情",
    parentName: PARENT_NAME.BASE_CONFIG,
    icon: User,
  },
  {
    path: `${BASE_URL}/sync`,
    component: AdminSyncSetting,
    name: adminLocale.syncSetting.title,
    parentName: PARENT_NAME.BASE_CONFIG,
    icon: "admin-menu-cloud",
    type: "item",
  },
];

export const menuRenderList = PARENT_NAME_LIST.reduce((acc, item) => {
  acc.push({
    name: item,
    type: "group",
    children: MENU_SETTING.filter(
      (menu) => menu.type === "item" && menu.parentName === item
    ),
  });
  return acc;
}, []);

export const ROUTERS = [
  {
    path: ADMIN_BASE_PATH,
    children: MENU_SETTING,
  },
];
