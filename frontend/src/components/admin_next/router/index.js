import AdminDashboard from "../../../components/new_admin/AdminDashboard.vue";
import AdminEmailSending from "../../../components/new_admin/AdminEmailSending.vue";
import AdminUserList from "../../../components/new_admin/users/AdminUserList.vue";
import AdminUserDetail from "../../../components/new_admin/users/AdminUserDetail.vue";
import AdminSystemConfig from "../sync/AdminSyncSetting.vue";
import { Setting, User, Connection } from "@element-plus/icons-vue";
export const PARENT_NAME = {
  BASE_CONFIG: "基础配置",
};

// use for parent menu render
export const PARENT_NAME_LIST = [PARENT_NAME.BASE_CONFIG];

const BASE_URL = "/admin_next";

export const MENU_SETTING = [
  {
    path: BASE_URL,
    component: AdminDashboard,
    name: "Dashboard",
    // this property use for find the parent name
    parentName: PARENT_NAME.BASE_CONFIG,
    icon: "admin-menu-setting",
    type: "item",
  },
  {
    path: `${BASE_URL}/system_config`,
    component: AdminSystemConfig,
    name: "系统配置",
    parentName: PARENT_NAME.BASE_CONFIG,
    icon: "admin-menu-settings",
    type: "item",
  },
  {
    path: `${BASE_URL}/users`,
    component: AdminUserList,
    name: "用户管理",
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
    component: AdminSystemConfig,
    name: "多源同步",
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
    path: "/admin_next",
    children: MENU_SETTING,
  },
];
