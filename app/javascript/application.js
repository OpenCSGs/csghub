import "trix"
import "@rails/actiontext"
import refreshJWT from "./packs/refreshJWT.js"

refreshJWT()

// Vue config
import { createApp } from "vue/dist/vue.esm-bundler.js"
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '../assets/stylesheets/element-plus/_variables.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { createWebHistory, createRouter } from 'vue-router'

import { useCookies } from "vue3-cookies"
import { createI18n } from 'vue-i18n'
import en from '../../config/locales/en.js'
import zh from '../../config/locales/zh.js'

import Navbar from "./components/navbar/TheNavbar.vue"
import CommentList from "./components/comment/CommentList.vue"
import ModelDetail from "./components/models/ModelDetail.vue"
import DatasetDetail from "./components/datasets/DatasetDetail.vue"
import EndpointDetail from "./components/endpoints/EndpointDetail.vue"
import ApplicationSpaceDetail from "./components/application_spaces/ApplicationSpaceDetail.vue"
import Profile from "./components/user_settings/Profile.vue"
import ProfileEdit from "./components/user_settings/ProfileEdit.vue"
import ProfileSettings from "./components/user_settings/ProfileSettings.vue"
import NewOrganization from "./components/organizations/NewOrganization.vue"
import AccessTokenSettings from "./components/user_settings/AccessTokenSettings.vue"
import StarshipAccessTokenSettings from "./components/user_settings/StarshipAccessTokenSettings.vue"
import SyncAccessTokenSettings from "./components/user_settings/SyncAccessTokenSettings.vue"
import SshKeySettings from "./components/user_settings/SshKeySettings.vue"
import NewModel from "./components/models/NewModel.vue"
import TagSidebar from "./components/tags/TagSidebar.vue"
import NewDataset from "./components/datasets/NewDataset.vue"
import OrganizationSettings from "./components/organizations/OrganizationSettings.vue"
import OrganizationDetail from "./components/organizations/OrganizationDetail.vue"
import OnPremiseFooter from "./components/OnPremiseFooter.vue"
import NewApplicationSpace from "./components/application_spaces/NewApplicationSpace.vue"
import ProfileRepoList from "./components/shared/ProfileRepoList.vue"
import RepoCards from "./components/shared/RepoCards.vue"
import NewCode from "./components/codes/NewCode.vue"
import CodeDetail from "./components/codes/CodeDetail.vue"
import SvgIcon from "./components/shared/SvgIcon.vue"
import NewCollection from "./components/collections/NewCollection.vue"
import NewEndpoint from "./components/endpoints/NewEndpoint.vue"
import NewFinetune from "./components/finetune/NewFinetune.vue"
import finetuneDetail from "./components/finetune/FinetuneDetail.vue"


// Admin pages
import AdminNavbar from "./components/new_admin/AdminNavbar.vue"
import AdminMenu from "./components/new_admin/AdminMenu.vue"
import AdminDashboard from "./components/new_admin/AdminDashboard.vue"
import AdminEmailSending from "./components/new_admin/AdminEmailSending.vue"
import AdminUserList from "./components/new_admin/users/AdminUserList.vue"
import AdminUserDetail from "./components/new_admin/users/AdminUserDetail.vue"
import AdminSyncSetting from "./components/new_admin/sync/AdminSyncSetting.vue"
import AdminCodeList from "./components/new_admin/codes/AdminCodeList.vue"
import AdminCodeDetail from "./components/new_admin/codes/AdminCodeDetail.vue"
import AdminModelList from "./components/new_admin/models/AdminModelList.vue"
import AdminModelDetail from "./components/new_admin/models/AdminModelDetail.vue"
import AdminDatasetList from "./components/new_admin/dataset/AdminDatasetList.vue"
import AdminDatasetDetail from "./components/new_admin/dataset/AdminDatasetDetail.vue"
import AdminSystemConfig from "./components/new_admin/system_configs/AdminSystemConfig.vue"

const pinia = createPinia()

const app = createApp({
  components: {
    Navbar,
    CommentList,
    DatasetDetail,
    ModelDetail,
    ApplicationSpaceDetail,
    Profile,
    ProfileEdit,
    ProfileSettings,
    AccessTokenSettings,
    SshKeySettings,
    NewOrganization,
    NewModel,
    TagSidebar,
    NewDataset,
    OrganizationDetail,
    OnPremiseFooter,
    NewApplicationSpace,
    ProfileRepoList,
    OrganizationSettings,
    RepoCards,
    NewCode,
    CodeDetail,
    NewCollection,
    NewEndpoint,
    AdminNavbar,
    AdminMenu,
    NewFinetune,
    finetuneDetail,
    StarshipAccessTokenSettings,
    SyncAccessTokenSettings,
    EndpointDetail
  },
  provide:{
    defaultTags: DEFAULT_TAGS,
    csghubServer: CSGHUB_SERVER,
    onPremise: ON_PREMISE,
    nameRule: /^(?=.{2,64}$)(?!.*[-_.]{2})[a-zA-Z][a-zA-Z0-9_.-]*[a-zA-Z0-9]+$/
  }
}).use(ElementPlus, {
  locale: zhCn,
});

const { cookies } = useCookies()
const defaultLanguage = ['zh', 'zh-cn', 'zh-tw'].includes(navigator.language) ? 'zh' : 'en';

const i18n = createI18n({
  legacy: false,
  locale: cookies.get('locale') || defaultLanguage,
  messages: {
    en,
    zh
  }
});

// register Element UI Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const routes = [
  { path: '/new_admin/', component: AdminDashboard },
  { path: '/new_admin/email_sending', component: AdminEmailSending },
  { path: '/new_admin/users', component: AdminUserList },
  { path: '/new_admin/users/:id', component: AdminUserDetail },
  { path: '/new_admin/sync', component: AdminSyncSetting },
  { path: '/new_admin/codes', component: AdminCodeList },
  { path: '/new_admin/codes/:namespace/:name', component: AdminCodeDetail },
  { path: '/new_admin/models', component: AdminModelList },
  { path: '/new_admin/models/:namespace/:name', component: AdminModelDetail },
  { path: '/new_admin/datasets', component: AdminDatasetList },
  { path: '/new_admin/datasets/:namespace/:name', component: AdminDatasetDetail },
  { path: '/new_admin/system_config', component: AdminSystemConfig },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.component('SvgIcon', SvgIcon)
app.use(i18n)
app.use(pinia)
app.use(router)
app.mount("#app")
