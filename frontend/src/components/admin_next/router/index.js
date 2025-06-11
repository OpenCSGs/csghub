import AdminDashboard from "../dashboard/AdminDashboard.vue";
import AdminUserList from "../users/AdminUserList.vue";
import AdminUserDetail from "../users/AdminUserDetail.vue";
import AdminSystemConfig from "../system_configs/AdminSystemConfig.vue";
import AdminSyncSetting from "../sync/AdminSyncSetting.vue";
import AdminTagsList from "../tags/AdminTagsList.vue";
import AdminTagsDetail from "../tags/AdminTagsDetail.vue";
import AdminTagsForm from "../tags/AdminTagsForm.vue";
import AdminBroadcastList from '../broadcast/AdminBroadcastList.vue'
import AdminBroadcastEdit from '../broadcast/AdminBroadcastEdit.vue'
import AdminBroadcastNew from '../broadcast/AdminBroadcastNew.vue'
import AdminTagCategoriesList from "../tag_categories/AdminTagCategoriesList.vue";
import AdminTagCategoriesForm from "../tag_categories/AdminTagCategoriesForm.vue";
import AdminModelDetail from "../models/AdminModelDetail.vue";
import AdminModelList from "../models/AdminModelList.vue";
import AdminModelEdit from "../models/AdminModelEdit.vue";

import AdminServerlessList from '../serverless/AdminServerlessList.vue'
import AdminServerlessForm from '../serverless/AdminServerlessForm.vue'
import AdminServerlessDetail from '../serverless/AdminServerlessDetail.vue'
import { Setting, User, Connection } from "@element-plus/icons-vue";
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()
const defaultLanguage = ['zh', 'zh-cn', 'zh-CN', 'zh-tw'].includes(navigator.language) ? 'zh' : 'en';

import { admin as admin_en } from "../../../locales/en_js/admin.js"
import { admin as admin_zh } from "../../../locales/zh_js/admin.js"
import { admin as admin_zh_hant } from "../../../locales/zh_hant_js/admin.js"

const locale = cookies.get('locale') || defaultLanguage
let adminLocale = ''
if (locale === 'zh') {
  adminLocale = admin_zh
} else if (locale === 'zhHant') {
  adminLocale = admin_zh_hant
} else {
  adminLocale = admin_en
}

// parent menu name
export const PARENT_NAME = {
  BASE_CONFIG: adminLocale.baseConfigTitle,
  system: adminLocale.menuSystem,
  account: adminLocale.menuAccount,
  hub: adminLocale.menuHub
};

// use for parent menu render
export const PARENT_NAME_LIST = [
  PARENT_NAME.BASE_CONFIG,
  PARENT_NAME.system,
  PARENT_NAME.account,
  PARENT_NAME.hub
]

export const BASE_URL = '/admin_panel';

export const MENU_SETTING = [
  {
    path: BASE_URL,
    component: AdminDashboard,
    name: adminLocale.dashboard.title,
    // this property use for find the parent name
    parentName: PARENT_NAME.BASE_CONFIG,
    icon: "admin-menu-dashboard",
    type: "menu",
  },
  {
    path: `${BASE_URL}/system_config`,
    component: AdminSystemConfig,
    name: adminLocale.systemConfig.title,
    parentName: PARENT_NAME.system,
    icon: "admin-menu-settings",
    type: "menu",
  },
  {
    path: `${BASE_URL}/users`,
    component: AdminUserList,
    name: adminLocale.users.title,
    parentName: PARENT_NAME.account,
    icon: "admin-menu-users",
    type: "menu",
  },
  {
    path: `${BASE_URL}/users/:id`,
    component: AdminUserDetail,
    name: "用户详情",
    parentName: PARENT_NAME.account,
    icon: User,
  },
  {
    path: `${BASE_URL}/sync`,
    component: AdminSyncSetting,
    name: adminLocale.syncSetting.title,
    parentName: PARENT_NAME.hub,
    icon: "admin-menu-cloud",
    type: "menu",
  },
  {
    path: `${BASE_URL}/models`,
    component: AdminModelList,
    name: adminLocale.models.title,
    parentName: PARENT_NAME.hub,
    icon: 'admin-menu-model',
    type: 'menu'
  },
  {
    path: `${BASE_URL}/models/:namespace/:name`,
    component: AdminModelDetail,
    name: adminLocale.models.modelDetails,
    parentName: PARENT_NAME.hub
  },
  {
    path: `${BASE_URL}/models/:namespace/:name/edit`,
    component: AdminModelEdit,
    name: adminLocale.models.modelEdit,
    parentName: PARENT_NAME.hub
  },
  {
    path: `${BASE_URL}/serverless`,
    component: AdminServerlessList,
    name: adminLocale.serverless.title,
    parentName: PARENT_NAME.hub,
    icon: 'admin-menu-serverless',
    type: 'menu'
  },
  {
    path: `${BASE_URL}/serverless/:namespace/:name/new`,
    component: AdminServerlessForm,
    name: adminLocale.serverless.newTitle,
    parentName: PARENT_NAME.hub
  },
  {
    path: `${BASE_URL}/serverless/:namespace/:name/:id/edit`,
    component: AdminServerlessForm,
    name: adminLocale.serverless.editTitle,
    parentName: PARENT_NAME.hub
  },
  {
    path: `${BASE_URL}/serverless/:namespace/:name/:id`,
    component: AdminServerlessDetail,
    name: adminLocale.serverless.detailTitle,
    parentName: PARENT_NAME.hub
  },
  {
    path: `${BASE_URL}/tags`,
    component: AdminTagsList,
    name: adminLocale.tags.title,
    parentName: PARENT_NAME.hub,
    icon: 'admin-menu-tag',
    type: 'menu'
  },
  {
    path: `${BASE_URL}/tags/new`,
    component: AdminTagsForm,
    name: adminLocale.tags.newTag,
    parentName: PARENT_NAME.hub
  },
  {
    path: `${BASE_URL}/tags/:id/edit`,
    component: AdminTagsForm,
    name: adminLocale.tags.editTag,
    parentName: PARENT_NAME.hub
  },
  {
    path: `${BASE_URL}/tags/:id`,
    component: AdminTagsDetail,
    name: adminLocale.tags.tagDetailTitle,
    parentName: PARENT_NAME.hub
  },
  {
    path: `${BASE_URL}/tag_categories`,
    component: AdminTagCategoriesList,
    name: adminLocale.tagCategories.title,
    parentName: PARENT_NAME.hub,
    icon: 'admin-menu-tag',
    type: 'menu'
  },
  {
    path: `${BASE_URL}/tag_categories/new`,
    component: AdminTagCategoriesForm,
    name: adminLocale.tagCategories.create,
    parentName: PARENT_NAME.hub
  },
  {
    path: `${BASE_URL}/tag_categories/:id/edit`,
    component: AdminTagCategoriesForm,
    name: adminLocale.tagCategories.edit,
    parentName: PARENT_NAME.hub
  },
  {
    path: `${BASE_URL}/broadcasts`,
    component: AdminBroadcastList,
    name: adminLocale.broadcasts.title,
    parentName: PARENT_NAME.system,
    icon: 'admin-menu-broadcast',
    type: 'menu'
  },
  {
    path: `${BASE_URL}/broadcasts/new`,
    component: AdminBroadcastNew,
    parentName: PARENT_NAME.system,
  },
  {
    path: `${BASE_URL}/broadcasts/:id/edit`,
    component: AdminBroadcastEdit,
    parentName: PARENT_NAME.system,
  },
];

export const menuRenderList = PARENT_NAME_LIST.reduce((acc, item) => {
  acc.push({
    name: item,
    type: "group",
    children: MENU_SETTING.filter(
      (menu) => menu.type === "menu" && menu.parentName === item
    ),
  });
  return acc;
}, []);

export const ROUTERS = [
  {
    path: BASE_URL,
    children: MENU_SETTING,
  },
];
