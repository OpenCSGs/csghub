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
import en from '../../config/locales/en.js'
import zh from '../../config/locales/zh.js'

import Navbar from "./components/navbar/NewNavbar.vue"
import SpaceIntro from "./components/spaces/SpaceIntro.vue"
import SpaceCard from "./components/spaces/SpaceCard.vue"
import SpaceCards from "./components/spaces/SpaceCards.vue"
import LogoutFooter from "./components/footer/TheFooter.vue"
import LoginFooter from "./components/footer/TheNewFooter.vue"
import CommentList from "./components/comment/CommentList.vue"
import ExpertCard from "./components/ExpertCard.vue"
import PartnerCard from "./components/PartnerCard.vue"
import DatasetCard from "./components/DatasetCard.vue"
import ModelDetail from "./components/models/ModelDetail.vue"
import DatasetDetail from "./components/datasets/DatasetDetail.vue"
import ModelCard from "./components/ModelCard.vue"
import ExpertForm from "./components/form/ExpertForm.vue"
import PartnerForm from "./components/form/PartnerForm.vue"
import CampaignCard from "./components/campaigns/CampaignCard.vue"
import CampaignCards from "./components/campaigns/CampaignCards.vue"
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
import SolutionPage from "./components/solution/SolutionPage.vue"
import ProductPage from "./components/product/ProductPage.vue"
import About from "./components/about/About.vue"
import OnPremiseFooter from "./components/footer/OnPremiseFooter.vue"
import ComputingPage from "./components/computing/ComputingPage.vue"
import LandingPage from "./components/landing_page/LandingPage.vue"
import PrivacyPage from "./components/policy/PrivacyPage.vue"
import DailyPaperNew from "./components/daily_paper/New.vue"
import DailyPaperIndex from "./components/daily_paper/Index.vue"
import DailyPaperShow from "./components/daily_paper/Show.vue"
import ProfileRepoList from "./components/shared/ProfileRepoList.vue"
import RepoCards from "./components/shared/RepoCards.vue"
import RepoItem from "./components/shared/RepoItem.vue"

const app = createApp({
  components: {
    Navbar,
    SpaceIntro,
    SpaceCard,
    SpaceCards,
    CommentList,
    DatasetCard,
    DatasetDetail,
    ExpertCard,
    ExpertForm,
    ModelCard,
    ModelDetail,
    PartnerCard,
    PartnerForm,
    LogoutFooter,
    LoginFooter,
    CampaignCard,
    CampaignCards,
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
    SolutionPage,
    ProductPage,
    About,
    OnPremiseFooter,
    ComputingPage,
    LandingPage,
    PrivacyPage,
    OrganizationSettings,
    DailyPaperNew,
    DailyPaperIndex,
    DailyPaperShow,
    ProfileRepoList,
    RepoCards,
    RepoItem
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
})

// register Element UI Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(i18n)
app.mount("#app")
