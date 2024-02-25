import "trix"
import "@rails/actiontext"

// Vue config
import { createApp } from "vue/dist/vue.esm-bundler.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

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
import ModelItem from "./components/models/ModelItem.vue"
import ModelCards from "./components/models/ModelCards.vue"
import DatasetCards from "./components/datasets/DatasetCards.vue"
import DatasetItem from "./components/datasets/DatasetItem.vue"
import OrganizationSettings from "./components/organizations/OrganizationSettings.vue"
import OrganizationDetail from "./components/organizations/OrganizationDetail.vue"
import OnPremiseFooter from "./components/OnPremiseFooter.vue"
import NewSpace from "./components/spaces/NewSpace.vue"
import ProfileRepoList from "./components/shared/ProfileRepoList.vue"

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
    ModelItem,
    DatasetItem,
    ModelCards,
    DatasetCards,
    OrganizationDetail,
    OnPremiseFooter,
    OrganizationSettings,
    NewSpace,
    ProfileRepoList,
  },
  provide:{
    defaultTags: DefaultTags
  }
}).use(ElementPlus);

// register Element UI Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount("#app")
