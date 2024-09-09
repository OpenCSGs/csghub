import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { useCookies } from "vue3-cookies"
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'element-plus/dist/index.css'
import './assets/stylesheets/element-plus/_variables.css'
import './assets/stylesheets/markdown.css'
import './style.css'

import HelloWorld from './components/HelloWorld.vue'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from './locales/en.js'
import zh from './locales/zh.js'

import Navbar from "./components/navbar/TheNavbar.vue"
import CommentList from "./components/comment/CommentList.vue"
import EndpointDetail from "./components/endpoints/EndpointDetail.vue"
import RepoDetail from "./components/shared/RepoDetail.vue"
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
import SvgIcon from "./components/shared/SvgIcon.vue"
import NewCollection from "./components/collections/NewCollection.vue"
import NewEndpoint from "./components/endpoints/NewEndpoint.vue"
import NewFinetune from "./components/finetune/NewFinetune.vue"
import finetuneDetail from "./components/finetune/FinetuneDetail.vue"
import ApplicationSpaceDetail from "./components/application_spaces/ApplicationSpaceDetail.vue"
import CollectionIndex from "./components/collections/CollectionIndex.vue"
import CollectionsDetail from "./components/collections/CollectionsDetail.vue"
import NotFound from "./components/error/NotFound.vue"
import Unauthorized from "./components/error/Unauthorized.vue"
import LoginFailed from "./components/error/LoginFailed.vue"
import FlashMessage from "./components/shared/FlashMessage.vue"

const pinia = createPinia()

const app = createApp({
  components: {
    HelloWorld,
    Navbar,
    CommentList,
    RepoDetail,
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
    NewCollection,
    NewEndpoint,
    NewFinetune,
    finetuneDetail,
    StarshipAccessTokenSettings,
    SyncAccessTokenSettings,
    ApplicationSpaceDetail,
    EndpointDetail,
    CollectionIndex,
    CollectionsDetail,
    NotFound,
    Unauthorized,
    LoginFailed,
    FlashMessage
  },
  provide:{
    defaultTags: DEFAULT_TAGS,
    csghubServer: CSGHUB_SERVER,
    onPremise: ON_PREMISE || false,
    nameRule: /^(?=.{2,64}$)(?!.*[-_.]{2})[a-zA-Z][a-zA-Z0-9_.-]*[a-zA-Z0-9]+$/
  }
}).use(ElementPlus, {
  locale: zhCn,
})

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

app.component('SvgIcon', SvgIcon)
app.component('FlashMessage', FlashMessage)
app.use(ElementPlus)
app.use(i18n)
app.use(pinia)
app.mount('#app')
