import "trix"
import "@rails/actiontext"

// Vue config
import { createApp } from "vue/dist/vue.esm-bundler.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import { useCookies } from "vue3-cookies"
import { createI18n } from 'vue-i18n'
import en from '../../config/locales/en/en.js'
import zh from '../../config/locales/zh/zh.js'


import Navbar from "./components/navbar/TheNavbar.vue"
import CommentList from "./components/comment/CommentList.vue"
import ModelDetail from "./components/models/ModelDetail.vue"
import DatasetDetail from "./components/datasets/DatasetDetail.vue"
import Profile from "./components/user_settings/Profile.vue"
import ProfileEdit from "./components/user_settings/ProfileEdit.vue"
import ProfileSettings from "./components/user_settings/ProfileSettings.vue"
import NewOrganization from "./components/organizations/NewOrganization.vue"
import GitTokenSettings from "./components/user_settings/GitTokenSettings.vue"
import SshKeySettings from "./components/user_settings/SshKeySettings.vue"
import NewModel from "./components/models/NewModel.vue"
import TagSidebar from "./components/tags/TagSidebar.vue"
import NewDataset from "./components/datasets/NewDataset.vue"
import OrganizationSettings from "./components/organizations/OrganizationSettings.vue"
import OrganizationDetail from "./components/organizations/OrganizationDetail.vue"
import OnPremiseFooter from "./components/OnPremiseFooter.vue"
import ProfileRepoList from "./components/shared/ProfileRepoList.vue"
import RepoCards from "./components/shared/RepoCards.vue"

const app = createApp({
  components: {
    Navbar,
    CommentList,
    DatasetDetail,
    ModelDetail,
    Profile,
    ProfileEdit,
    ProfileSettings,
    GitTokenSettings,
    SshKeySettings,
    NewOrganization,
    NewModel,
    TagSidebar,
    NewDataset,
    OrganizationDetail,
    OnPremiseFooter,
    ProfileRepoList,
    OrganizationSettings,
    RepoCards
  },
  provide:{
    defaultTags: DefaultTags
  }
}).use(ElementPlus, {
  locale: zhCn,
});

const { cookies } = useCookies()

const i18n = createI18n({
  legacy: false,
  locale: cookies.get('locale') || 'zh',
  messages: {
    en,
    zh
  }
});


// register Element UI Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(i18n)
app.mount("#app")
