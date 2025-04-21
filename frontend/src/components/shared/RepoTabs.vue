<template>
  <div class="relative">
    <div class="absolute -top-1.5 right-0 xl:relative md:right-0 flex gap-4">
      <RepoClone
        v-if="repoType !== 'endpoint'"
        :showAddToCollections="showAddToCollections"
        :repoType="repoType"
        :httpCloneUrl="repoDetail.repository?.http_clone_url || ''"
        :sshCloneUrl="repoDetail.repository?.ssh_clone_url || ''"
        :userName="userName"
        :namespacePath="path"
        :repo="repoDetail"
        :enableEndpoint="repoDetail.enableInference"
        :enableFinetune="repoDetail.enableFinetune"
        :enableEvaluation="repoDetail.enableEvaluation"
      />
    </div>
    <tab-container
      :default-tab="defaultTab"
      :settingsVisibility="settingsVisibility"
      :syncStatus="repoDetail.syncStatus"
      :repoType="repoType"
      :sdk="sdk"
      :repo="repoDetail"

      @tabChange="tabChange"
    >
      <!-- summary -->
      <template #summary>
        <InitializeGuide
          v-if="repoType === 'space' && appStatus === 'NoAppFile'"
          :http-clone-url="repoDetail.repository?.http_clone_url || ''"
          :ssh-clone-url="repoDetail.repository?.ssh_clone_url || ''"
          :sdk="sdk"
          :user-name="userName"
        />
        <ApplicationPage
          v-else-if="repoType === 'space' && repoDetail.sdk !== 'mcp_server' && appStatus === 'Running'"
          :appEndpoint="appEndpoint"
        />
        <McpSpacePage
          v-else-if="repoType === 'space' && repoDetail.sdk === 'mcp_server' && appStatus === 'Running'"
          :appEndpoint="appEndpoint"
        />
        <StoppedPage
          v-else-if="repoType === 'space' && (appStatus === 'Stopped' || appStatus === 'Sleeping')"
          :appStatus="appStatus"
          :canWrite="canWrite"
          :path="path"
        />
        <BuildAndErrorPage
          v-else-if="repoType === 'space'"
          :appStatus="appStatus"
          :canWrite="canWrite"
          @showSpaceLogs="showSpaceLogs"
        />
        <EndpointPage
          v-else-if="repoType === 'endpoint'"
          :appEndpoint="appEndpoint"
          :appStatus="appStatus"
          :modelId="modelId"
          :private="private"
          :endpointReplica="endpointReplica"
          :clusterId="repoDetail.clusterId"
          :sku="sku"
          :task="repoDetail.task"
          :replicaList="replicaList"
        />
        <repo-summary
          v-else
          :repo-type="repoType"
          :namespace-path="path"
          :download-count="repoDetail.downloads"
          :currentBranch="repoDetail.defaultBranch || 'main'"
          :widget-type="repoDetail.widgetType"
          :metadata="repoDetail.metadata"
          :framework="framework"
        />
      </template>

      <!-- files -->
      <template
        #files
        v-if="actionName === 'blob'"
      >
        <blob
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="path"
          :can-write="canWrite"
        />
      </template>
      <template
        #files
        v-if="actionName === 'new_file'"
      >
        <new-file
          :current-branch="currentBranch"
          :repo-name="repoDetail.name"
          :namespace-path="path"
          originalCodeContent=""
        />
      </template>
      <template
        #files
        v-if="actionName === 'edit_file'"
      >
        <edit-file
          :current-branch="currentBranch"
          :current-path="currentPath"
          :repo-name="repoDetail.name"
          :namespace-path="path"
        />
      </template>
      <template
        #files
        v-if="actionName === 'upload_file'"
      >
        <upload-file
          :current-branch="currentBranch"
          :repo-name="repoDetail.name"
          :namespace-path="path"
        />
      </template>
      <template
        #files
        v-if="actionName === 'commits'"
      >
        <RepoCommits
          :branches="branches"
          :currentBranch="currentBranch"
          :namespacePath="path"
          :repoType="repoType"
        />
      </template>
      <template
        #files
        v-if="actionName === 'commit'"
      >
        <RepoCommit
          :namespacePath="path"
          :repoType="repoType"
          :commitId="commitId"
        />
      </template>
      <template
        #files
        v-if="actionName === 'files'"
      >
        <repo-files
          :branches="branches"
          :current-branch="currentBranch"
          :current-path="currentPath"
          :namespace-path="path"
          :can-write="canWrite"
          :repo-type="repoType"
        />
      </template>

      <!-- logs -->
      <template
        #logs
        v-if="repoType === 'endpoint' && actionName === 'logs'"
      >
        <EndpointLogs
          :instances="repoDetail.instances"
          :modelId="repoDetail.modelId"
          :deployId="repoDetail.deployId"
        />
      </template>

      <!-- schema -->
      <template #schema>
        <McpSchema
          :repo="repoDetail"
        ></McpSchema>
      </template>

      <!-- community -->
      <template #community>
        <community-page
          :repoType="repoType"
          :repoPath="repoDetail.path"
        ></community-page>
      </template>

      <!-- billing -->
      <template
        v-if="settingsVisibility"
        #billing
      >
        <BillingDetail
          :type="repoType"
          :instanceName="repoDetail.svcName"
        ></BillingDetail>
      </template>

      <!-- settings -->
      <template
        v-if="settingsVisibility"
        #settings
      >
        <ModelSettings
          v-if="repoType === 'model'"
          :path="path"
          :model-nickname="repoDetail.nickname"
          :model-desc="repoDetail.description"
          :default_branch="repoDetail.defaultBranch"
          :tag-list="tagList"
          :tags="tags"
        />
        <DatasetSettings
          v-if="repoType === 'dataset'"
          :path="path"
          :dataset-nickname="repoDetail.nickname"
          :dataset-desc="repoDetail.description"
          :default_branch="repoDetail.defaultBranch"
          :tag-list="tagList"
          :tags="tags"
        />
        <application-space-settings
          v-if="repoType === 'space'"
          :path="path"
          :application-space-nickname="repoDetail.nickname"
          :application-space-desc="repoDetail.description"
          :default_branch="repoDetail.defaultBranch"
          :appStatus="appStatus"
          :cloudResource="repoDetail.sku || repoDetail.hardware"
          :coverImage="repoDetail.coverImageUrl"
          @showSpaceLogs="showSpaceLogs"
          :sdk="sdk"
          :variables="repoDetail.variables ? JSON.parse(repoDetail.variables) : {}"
        />
        <code-settings
          v-if="repoType === 'code'"
          :path="path"
          :code-nickname="repoDetail.nickname"
          :code-desc="repoDetail.description"
          :default_branch="repoDetail.defaultBranch"
        />
        <EndpointSettings
          v-if="repoType === 'endpoint'"
          :endpointName="endpointName"
          :endpointId="endpointId"
          :appStatus="appStatus"
          :modelId="modelId"
          :cloudResourceSku="repoDetail.sku"
          :framework="repoDetail.runtimeFramework"
          :maxReplica="repoDetail.maxReplica"
          :minReplica="repoDetail.minReplica"
          :clusterId="repoDetail.clusterId"
          :variables="safeJsonParse(repoDetail.engineArgs) ? JSON.parse(repoDetail.engineArgs) : {}"
        />
        <McpSettings
          v-if="repoType === 'mcp'"
          :path="path"
          :mcpNickname="repoDetail.nickname"
          :mcpDesc="repoDetail.description"
          :defaultBranch="repoDetail.defaultBranch"
          :tagList="tagList"
          :tags="tags"
        />
      </template>
    </tab-container>
  </div>
</template>

<script setup>
  import RepoClone from '../shared/RepoClone.vue'
  import TabContainer from '../shared/TabContainer.vue'
  import RepoSummary from '../shared/RepoSummary.vue'
  import RepoFiles from '../shared/RepoFiles.vue'
  import RepoCommits from '../shared/RepoCommits.vue'
  import RepoCommit from '../shared/RepoCommit.vue'
  import CommunityPage from '../community/CommunityPage.vue'
  import ModelSettings from '../models/ModelSettings.vue'
  import DatasetSettings from '../datasets/DatasetSettings.vue'
  import ApplicationSpaceSettings from '../application_spaces/ApplicationSpaceSettings.vue'
  import CodeSettings from '../codes/CodeSettings.vue'
  import EndpointSettings from '../endpoints/EndpointSettings.vue'
  import McpSettings from '../mcp/McpSettings.vue'
  import UploadFile from '../shared/UploadFile.vue'
  import NewFile from '../shared/NewFile.vue'
  import Blob from '../shared/Blob.vue'
  import EditFile from '../shared/EditFile.vue'
  import InitializeGuide from '../application_spaces/InitializeGuide.vue'
  import ApplicationPage from '../application_spaces/ApplicationPage.vue'
  import StoppedPage from '../application_spaces/StoppedPage.vue'
  import BuildAndErrorPage from '../application_spaces/BuildAndErrorPage.vue'
  import EndpointPage from '../endpoints/EndpointPage.vue'
  import EndpointLogs from '../endpoints/EndpointLogs.vue'
  import BillingDetail from './BillingDetail.vue'
  import McpSpacePage from '../application_spaces/McpSpacePage.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ref, computed, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { safeJsonParse } from '../../packs/utils'
  import McpSchema from '../mcp/McpSchema.vue'

  const { t } = useI18n()

  const props = defineProps({
    repoDetail: Object,
    currentBranch: String,
    currentPath: String,
    defaultTab: String,
    tags: Object,
    actionName: String,
    settingsVisibility: Boolean,
    canWrite: Boolean,
    repoType: String,
    appStatus: String,
    appEndpoint: String,
    sdk: String,
    userName: String,
    commitId: String,
    sku: String,
    modelId: String,
    private: Boolean,
    endpointReplica: Number,
    endpointName: String,
    endpointId: String,
    deployId: String,
    replicaList: Array,
    path: String,
  })

  const framework = computed(() => {
    const tags = props.repoDetail.tags || []
    const frameworkTag = tags.find((tag) => tag.category === 'framework')
    if (frameworkTag) {
      if (frameworkTag.name === 'gguf') {
        return 'GGUF'
      } else if (frameworkTag.name === 'safetensors') {
        return 'Safetensors'
      }
    }

    const metadata = props.repoDetail.metadata
    if (metadata) {
      if (metadata.quantizations) {
        return 'GGUF'
      } else {
        return 'Safetensors'
      }
    }

    return ''
  })

  const tagList = ref([])
  const emit = defineEmits(['toggleSpaceLogsDrawer'])

  onMounted(() => {
    fetchTags()
  })

  const showAddToCollections = computed(() => {
    return props.repoType === 'mcp' || props.repoType === 'model' || props.repoType === 'dataset' || props.repoType === 'code' || props.repoType === 'space'
  })

  const repoTypeClass = computed(() => {
    if (props.repoType === 'space') {
      return 'ApplicationSpace'
    } else {
      return `${props.repoType.charAt(0).toUpperCase()}${props.repoType.slice(1).toLowerCase()}`
    }
  })

  const showSpaceLogs = () => {
    emit('toggleSpaceLogsDrawer')
  }

  const summaryUrl = () => {
    if (props.repoType === 'endpoint') {
      return `/${props.repoType}s/${props.path}/${props.repoDetail.deployId}`
    } else if (props.repoType === 'mcp') {
      return `/${props.repoType}/servers/${props.path}`
    } else {
      return `/${props.repoType}s/${props.path}`
    }
  }

  const tabChange = (tab) => {
    switch (tab) {
      case 'summary':
        location.href = summaryUrl()
        break
      case 'files':
        if (props.repoType === 'mcp') {
          location.href = `/${props.repoType}/servers/${props.path}/files/${props.repoDetail.defaultBranch || 'main'}`
        } else {
          location.href = `/${props.repoType}s/${props.path}/files/${props.repoDetail.defaultBranch || 'main'}`
        }
        break
      case 'community':
        if (props.repoType === 'mcp') {
          location.href = `/${props.repoType}/servers/${props.path}/community`
        } else {
          location.href = `/${props.repoType}s/${props.path}/community`
        }
        break
      case 'settings':
        if (props.repoType === 'endpoint') {
          location.href = `/${props.repoType}s/${props.path}/${props.repoDetail.deployId}/settings`
        } else if (props.repoType === 'mcp') {
          location.href = `/${props.repoType}/servers/${props.path}/settings`
        } else {
          location.href = `/${props.repoType}s/${props.path}/settings`
        }
        break
      case 'logs':
        location.href = `/${props.repoType}s/${props.path}/${props.repoDetail.deployId}/logs`
        break
      case 'billing':
        if (props.repoType === 'endpoint') {
          location.href = `/${props.repoType}s/${props.path}/${props.repoDetail.deployId}/billing`
        } else {
          location.href = `/${props.repoType}s/${props.path}/billing`
        }
        break
      case 'schema':
        if (props.repoType === 'mcp') {
          location.href = `/${props.repoType}/servers/${props.path}/schema`
        }
        break
      default:
        break
    }
  }

  async function fetchTags() {
    const { error, data } = await useFetchApi(`/tags`).json()
    if (!data.value) {
      ElMessage({
        message: error.value.msg || t('all.fetchError'),
        type: 'warning'
      })
    } else {
      const tagArray = Array.isArray(data.value.data) ? data.value.data : []
      tagList.value = tagArray.filter(tag => tag.category === 'task' && tag.scope === props.repoType)
    }
  }
</script>

<style>
  .clone-tabs .el-tabs__header {
    padding-left: 12px;
  }
</style>