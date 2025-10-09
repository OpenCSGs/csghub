import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { useCookies } from "vue3-cookies"
import { createPinia } from 'pinia'
import { customPersistPlugin } from "./packs/persistPinia"
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import 'element-plus/dist/index.css'
import './assets/stylesheets/element-plus/_variables.css'
import "./assets/stylesheets/element-plus/index.css";
import "./assets/stylesheets/element-plus/dropdown.css";
import './assets/stylesheets/markdown.css'
import './style.css'
import { createWebHistory, createRouter } from "vue-router";

import HelloWorld from './components/HelloWorld.vue'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from './locales/en.js'
import zh from './locales/zh.js'
import zhHant from './locales/zhHant.js'

import Navbar from "./components/navbar/Navbar.vue"
import CommentList from "./components/comment/CommentList.vue"
import EndpointDetail from "./components/endpoints/EndpointDetail.vue"
import NotebookDetail from "./components/notebooks/NotebookDetail.vue"
import RepoDetail from "./components/shared/RepoDetail.vue"
import Profile from "./components/user_settings/Profile.vue"
import ProfileEdit from "./components/user_settings/ProfileEdit.vue"
import ProfileSettings from "./components/user_settings/ProfileSettings.vue"
import NewOrganization from "./components/organizations/NewOrganization.vue"
import AccessTokenSettings from "./components/user_settings/AccessTokenSettings.vue"
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
import CsgButton from "./components/shared/CsgButton.vue"
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
import ServerError from "./components/error/ServerError.vue"
import FlashMessage from "./components/shared/FlashMessage.vue"
import ResourceConsoleIndex from "./components/resource_console/ResourceConsoleIndex.vue"
import PromptsHub from "./components/prompts/PromptsHub.vue"
import NewEvaluation from "./components/evaluations/NewEvaluation.vue"
import EvaluationDetail from "./components/evaluations/EvaluationDetail.vue"
import NewMcpServer from "./components/mcp/NewMcpServer.vue"
import McpTools from "./components/mcp/McpTools.vue"
import DeployMcpServer from "./components/mcp/DeployMcpServer.vue"

// Admin pages
import AdminNavbar from "./components/new_admin/AdminNavbar.vue"
import AdminMenu from "./components/new_admin/AdminMenu.vue"
import AdminDashboard from "./components/new_admin/AdminDashboard.vue"
import AdminEmailSending from "./components/new_admin/AdminEmailSending.vue"
import AdminUserList from "./components/new_admin/users/AdminUserList.vue"
import AdminUserDetail from "./components/new_admin/users/AdminUserDetail.vue"
import AdminSyncSetting from "./components/new_admin/sync/AdminSyncSetting.vue"
import AdminSystemConfig from "./components/new_admin/system_configs/AdminSystemConfig.vue"

import DataflowIndex from "./components/dataflow_config/dataflow/index.vue"
import DataProcessing from "./components/dataflow_config/dataflow/addDataProcessing.vue"
import DataProcessingStep1 from "./components/dataflow_config/dataflow/dataProcessingStep1.vue"
import DataProcessingStep2 from "./components/dataflow_config/dataflow/dataProcessingStep2.vue"
import DataflowInfo from "./components/dataflow_config/dataflow/info.vue"
import DataflowMenu from "./components/dataflow_config/Menu.vue"
import DataflowAlgTemplate from "./components/dataflow_config/algTemplate/index.vue"
import DataflowNewTask from "./components/dataflow_config/newTask/index.vue"
import DataflowNewTemplate from "./components/dataflow_config/algTemplate/newTemplate.vue"
import DataflowTools from "./components/dataflow_config/tools/index.vue"
import NewNotebook from "./components/notebooks/NewNotebook.vue"

// 数据采集
import DataCollectionTask from "./components/dataflow_config/dataAcquisition/dataCollectionTask/index.vue"
import ViewLog from "./components/dataflow_config/dataAcquisition/dataCollectionTask/viewLog.vue"
import DataSourceManagement from "./components/dataflow_config/dataAcquisition/dataSourceManagement/index.vue"
import NewDataSource from "./components/dataflow_config/dataAcquisition/dataSourceManagement/newDataSource.vue"
import FormatConversion from "./components/dataflow_config/dataAcquisition/formatConversion/index.vue"
import NewFormatConversion from "./components/dataflow_config/dataAcquisition/formatConversion/newFormatConversion.vue"

// 算法模板
import BuiltInTemplate from "./components/dataflow_config/algTemplate/builtInTemplate/index.vue"
import CustomTemplate from "./components/dataflow_config/algTemplate/customTemplate/index.vue"
import OperatorManagement from "./components/dataflow_config/algTemplate/operatorManagement/index.vue"
import CreateTemplate from "./components/dataflow_config/dataflow/createTemplate.vue"

// 系统仪表盘
import SystemDashboard from "./components/dataflow_config/systemDashboard/index.vue"
import CeleryNodeService from "./components/dataflow_config/systemDashboard/celeryNodeService.vue"


const pinia = createPinia()
pinia.use(customPersistPlugin)

const app = createApp({
  components: {
    // admin pages begin
    AdminNavbar,
    AdminMenu,
    // admin pages end
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
    ApplicationSpaceDetail,
    EndpointDetail,
    NotebookDetail,
    CollectionIndex,
    CollectionsDetail,
    NotFound,
    Unauthorized,
    LoginFailed,
    ServerError,
    FlashMessage,
    ResourceConsoleIndex,
    PromptsHub,
    NewEvaluation,
    EvaluationDetail,
    NewMcpServer,
    NewNotebook,
    McpTools,
    DeployMcpServer,
    DataflowIndex,
    DataflowMenu,
    DataflowTools,
    DataCollectionTask,
    DataSourceManagement,
    NewDataSource,
    BuiltInTemplate,
    CustomTemplate,
    OperatorManagement,
    SystemDashboard,
    CeleryNodeService,
    DataProcessing,
    DataProcessingStep1,
    DataProcessingStep2,
    CreateTemplate,
    FormatConversion,
    NewFormatConversion,
    ViewLog
  },
  provide:{
    csghubServer: CSGHUB_SERVER,
    onPremise: ON_PREMISE || false,
    nameRule: /^(?=.{2,64}$)(?!.*[-_.]{2})[a-zA-Z][a-zA-Z0-9_.-]*[a-zA-Z0-9]+$/
  }
}).use(ElementPlus, {
  locale: zhCn,
})

const { cookies } = useCookies()
const defaultLanguage = ['zh', 'zh-cn', 'zh-CN', 'zh-tw'].includes(navigator.language) ? 'zh' : 'en';

const i18n = createI18n({
  legacy: false,
  locale: cookies.get('locale') || defaultLanguage,
  messages: {
    en,
    zh,
    zhHant,
  },
});

// register Element UI Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const routes = [
  { path: '/admin_panel/', component: AdminDashboard },
  { path: '/admin_panel/email_sending', component: AdminEmailSending },
  { path: '/admin_panel/users', component: AdminUserList },
  { path: '/admin_panel/users/:id', component: AdminUserDetail },
  { path: '/admin_panel/sync', component: AdminSyncSetting },
  { path: '/admin_panel/system_config', component: AdminSystemConfig },
  { path: '/datapipelines', component: DataflowIndex },
  { path: '/datapipelines/dataflowInfo', component: DataflowInfo },
  { path: '/datapipelines/algTemplate', component: DataflowAlgTemplate },
  { path: '/datapipelines/newTask', component: DataflowNewTask },
  { path: '/datapipelines/newTemplate', component: DataflowNewTemplate },
  { path: '/datapipelines/tools', component: DataflowTools },
  { path: '/datapipelines/dataCollectionTask', component: DataCollectionTask },
  { path: '/datapipelines/viewLog', component: ViewLog },
  { path: '/datapipelines/dataSourceManagement', component: DataSourceManagement },
  { path: '/datapipelines/newDataSource', component: NewDataSource },
  { path: '/datapipelines/builtInTemplate', component: BuiltInTemplate },
  { path: '/datapipelines/customTemplate', component: CustomTemplate },
  { path: '/datapipelines/operatorManagement', component: OperatorManagement },
  { path: '/datapipelines/systemDashboard', component: SystemDashboard },
  { path: '/datapipelines/celeryNodeService', component: CeleryNodeService },
  { path: '/datapipelines/addDataProcessing', component: DataProcessing },
  { path: '/datapipelines/dataProcessingStep1', component: DataProcessingStep1 },
  { path: '/datapipelines/dataProcessingStep2', component: DataProcessingStep2 },
  { path: '/datapipelines/createTemplate', component: CreateTemplate },
  { path: '/datapipelines/formatConversion', component: FormatConversion },
  { path: '/datapipelines/newFormatConversion', component: NewFormatConversion },
  // 为每种资源类型创建专门的路由
  { 
    path: '/datasets/:namespace/:name', 
    component: RepoDetail,
    props: (route) => ({ 
      repoType: 'dataset',
      namespace: route.params.namespace,
      repoName: route.params.name
    })
  },
  { 
    path: '/models/:namespace/:name', 
    component: RepoDetail,
    props: (route) => ({ 
      repoType: 'model',
      namespace: route.params.namespace,
      repoName: route.params.name
    })
  },
  { 
    path: '/codes/:namespace/:name', 
    component: RepoDetail,
    props: (route) => ({ 
      repoType: 'code',
      namespace: route.params.namespace,
      repoName: route.params.name
    })
  },
  { 
    path: '/spaces/:namespace/:name', 
    component: RepoDetail,
    props: (route) => ({ 
      repoType: 'space',
      namespace: route.params.namespace,
      repoName: route.params.name
    })
  },
  { 
    path: '/endpoints/:namespace/:name', 
    component: RepoDetail,
    props: (route) => ({ 
      repoType: 'endpoint',
      namespace: route.params.namespace,
      repoName: route.params.name
    })
  },
  { 
    path: '/finetunes/:namespace/:name', 
    component: RepoDetail,
    props: (route) => ({ 
      repoType: 'finetune',
      namespace: route.params.namespace,
      repoName: route.params.name
    })
  },
  { 
    path: '/collections/:namespace/:name', 
    component: RepoDetail,
    props: (route) => ({ 
      repoType: 'collection',
      namespace: route.params.namespace,
      repoName: route.params.name
    })
  },
  {
    path: '/mcp/servers/:namespace/:name',
    component: RepoDetail,
    props: (route) => ({
      repoType: 'mcp',
      namespace: route.params.namespace,
      repoName: route.params.name
    })
  },
  {
    path: '/profile/:username',
    component: Profile,
    props: (route) => ({
      username: route.params.username
    })
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.component('SvgIcon', SvgIcon)
app.component('CsgButton', CsgButton)
app.component('FlashMessage', FlashMessage)
app.use(ElementPlus)
app.use(i18n)
app.use(pinia)
app.use(router)
app.mount('#app')
