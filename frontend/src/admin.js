import { createApp, h } from "vue";
import { createI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { ROUTERS } from "./components/admin_next/router";

import "element-plus/dist/index.css";
import "./assets/stylesheets/element-plus/_variables.css";
import "./assets/stylesheets/markdown.css";
import "./style.css";
import { createWebHistory, createRouter, RouterView } from "vue-router";

import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "./locales/en.js";
import zh from "./locales/zh.js";

import Navbar from "./components/navbar/Navbar.vue";
import CommentList from "./components/comment/CommentList.vue";
import EndpointDetail from "./components/endpoints/EndpointDetail.vue";
import RepoDetail from "./components/shared/RepoDetail.vue";
import Profile from "./components/user_settings/Profile.vue";
import ProfileEdit from "./components/user_settings/ProfileEdit.vue";
import ProfileSettings from "./components/user_settings/ProfileSettings.vue";
import NewOrganization from "./components/organizations/NewOrganization.vue";
import AccessTokenSettings from "./components/user_settings/AccessTokenSettings.vue";
import StarshipAccessTokenSettings from "./components/user_settings/StarshipAccessTokenSettings.vue";
import SyncAccessTokenSettings from "./components/user_settings/SyncAccessTokenSettings.vue";
import SshKeySettings from "./components/user_settings/SshKeySettings.vue";
import NewModel from "./components/models/NewModel.vue";
import TagSidebar from "./components/tags/TagSidebar.vue";
import NewDataset from "./components/datasets/NewDataset.vue";
import OrganizationSettings from "./components/organizations/OrganizationSettings.vue";
import OrganizationDetail from "./components/organizations/OrganizationDetail.vue";
import OnPremiseFooter from "./components/OnPremiseFooter.vue";
import NewApplicationSpace from "./components/application_spaces/NewApplicationSpace.vue";
import ProfileRepoList from "./components/shared/ProfileRepoList.vue";
import RepoCards from "./components/shared/RepoCards.vue";
import NewCode from "./components/codes/NewCode.vue";
import SvgIcon from "./components/shared/SvgIcon.vue";
import NewCollection from "./components/collections/NewCollection.vue";
import NewEndpoint from "./components/endpoints/NewEndpoint.vue";
import NewFinetune from "./components/finetune/NewFinetune.vue";
import finetuneDetail from "./components/finetune/FinetuneDetail.vue";
import ApplicationSpaceDetail from "./components/application_spaces/ApplicationSpaceDetail.vue";
import CollectionIndex from "./components/collections/CollectionIndex.vue";
import CollectionsDetail from "./components/collections/CollectionsDetail.vue";
import NotFound from "./components/error/NotFound.vue";
import Unauthorized from "./components/error/Unauthorized.vue";
import LoginFailed from "./components/error/LoginFailed.vue";
import FlashMessage from "./components/shared/FlashMessage.vue";
import ResourceConsoleIndex from "./components/resource_console/ResourceConsoleIndex.vue";

// Admin pages
import AdminNavbar from "./components/new_admin/AdminNavbar.vue";
import AdminMenu from "./components/new_admin/AdminMenu.vue";
import AdminDashboard from "./components/new_admin/AdminDashboard.vue";
import AdminEmailSending from "./components/new_admin/AdminEmailSending.vue";
import AdminUserList from "./components/new_admin/users/AdminUserList.vue";
import AdminUserDetail from "./components/new_admin/users/AdminUserDetail.vue";
import AdminSyncSetting from "./components/new_admin/sync/AdminSyncSetting.vue";
import AdminSystemConfig from "./components/new_admin/system_configs/AdminSystemConfig.vue";

import AdminLayout from "./components/admin_next/admin_component/layout.vue";

const i18n = createI18n({
  locale: "en",
  messages: {
    en,
    zh,
  },
});

const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(),
  routes: ROUTERS,
});

const app = createApp(AdminLayout);

app.component("SvgIcon", SvgIcon);
app.component("FlashMessage", FlashMessage);

app.provide("defaultTags", DEFAULT_TAGS);
app.provide("csghubServer", CSGHUB_SERVER);
app.provide("onPremise", ON_PREMISE || false);
app.provide(
  "nameRule",
  /^(?=.{2,64}$)(?!.*[-_.]{2})[a-zA-Z][a-zA-Z0-9_.-]*[a-zA-Z0-9]+$/
);

app.use(ElementPlus, {
  locale: zhCn,
});
app.use(i18n);
app.use(pinia);
app.use(router);

app.mount("#admin");
