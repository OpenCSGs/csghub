import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const persistKey = 'repo-detail-store'

const useRepoDetailStore = defineStore('repoDetail', () => {
  // states
  const timestamp = ref(Date.now())
  const isInitialized = ref(false)
  const repoType = ref('')
  const privateVisibility = ref(null)
  const baseModel = ref('')
  const canManage = ref(false)
  const canWrite = ref(false)
  const createdAt = ref('')
  const csgPath = ref('')
  const defaultBranch = ref('')
  const description = ref('')
  const downloads = ref(0)
  const enableEvaluation = ref(false)
  const enableFinetune = ref(false)
  const enableInference = ref(false)
  const hfPath = ref('')
  const id = ref(0)
  const license = ref('')
  const likes = ref(0)
  const mirrorLastUpdatedAt = ref('')
  const msPath = ref('')
  const name = ref('')
  const namespace = ref({})
  const nickname = ref('')
  const path = ref('')
  const readme = ref('')
  const repository = ref({})
  const repositoryId = ref(0)
  const scores = ref(0)
  const sensitiveCheckStatus = ref('')
  const source = ref('')
  const status = ref('')
  const syncStatus = ref('')
  const tags = ref([])
  const updatedAt = ref('')
  const user = ref({})
  const userLikes = ref(false)
  const widgetType = ref('')
  // space specific states
  const coverImageUrl = ref('')
  const endpoint = ref('')
  const hardware = ref('')
  const sdk = ref('')
  const sku = ref('')
  const svcName = ref('')
  // collection specific states
  const avatar = ref('')
  const theme = ref('')
  const repositories = ref([])
  // finetune specific states
  const clusterId = ref('')
  const deployId = ref(0)
  const deployName = ref('')
  const imageId = ref('')
  const maxReplica = ref(1)
  const minReplica = ref(1)
  const modelId = ref('')
  const proxyEndpoint = ref('')
  const runtimeFramework = ref('')
  const secureLevel = ref(0)
  // endpoint specific states
  const gitBranch = ref('')
  const task = ref('')
  const actualReplica = ref(0)
  const instances = ref([])
  const activeInstance = ref('')
  const failedReason = ref('')
  const variables = ref('')
  const engineArgs = ref('')
  const username = ref('')
  const metadata = ref({})


  // getters
  const isPrivate = computed(() => !!privateVisibility.value)

  // actions
  const updateVisibility = (input) => {
    privateVisibility.value = input
  }

  const updateLikes = (input) => {
    likes.value = input
  }

  const updateUserLikes = (input) => {
    userLikes.value = input
  }

  async function initialize(initialData, repositoryType) {
    repoType.value = repositoryType
    isInitialized.value = true
    privateVisibility.value = initialData.private
    baseModel.value = initialData.base_model
    canManage.value = initialData.can_manage
    canWrite.value = initialData.can_write
    createdAt.value = initialData.created_at
    csgPath.value = initialData.csg_path
    defaultBranch.value = initialData.default_branch
    description.value = initialData.description
    downloads.value = initialData.downloads
    enableEvaluation.value = initialData.enable_evaluation
    enableFinetune.value = initialData.enable_finetune
    enableInference.value = initialData.enable_inference
    hfPath.value = initialData.hf_path
    id.value = initialData.id
    license.value = initialData.license
    likes.value = initialData.likes || initialData.like_count || 0
    mirrorLastUpdatedAt.value = initialData.mirror_last_updated_at
    msPath.value = initialData.ms_path
    name.value = initialData.name
    namespace.value = initialData.namespace
    nickname.value = initialData.nickname
    path.value = initialData.path
    readme.value = initialData.readme
    repository.value = initialData.repository
    repositoryId.value = initialData.repository_id
    scores.value = initialData.scores
    sensitiveCheckStatus.value = initialData.sensitive_check_status
    source.value = initialData.source
    status.value = initialData.status
    syncStatus.value = initialData.sync_status
    tags.value = initialData.tags
    updatedAt.value = initialData.updated_at
    user.value = initialData.user
    userLikes.value = initialData.user_likes
    widgetType.value = initialData.widget_type
    coverImageUrl.value = initialData.cover_image_url
    endpoint.value = initialData.endpoint
    hardware.value = initialData.hardware
    sdk.value = initialData.sdk
    sku.value = initialData.sku
    svcName.value = initialData.svc_name
    avatar.value = initialData.avatar
    theme.value = initialData.theme
    repositories.value = initialData.repositories
    clusterId.value = initialData.cluster_id
    deployId.value = initialData.deploy_id
    deployName.value = initialData.deploy_name
    imageId.value = initialData.image_id
    maxReplica.value = initialData.max_replica
    minReplica.value = initialData.min_replica
    modelId.value = initialData.model_id
    proxyEndpoint.value = initialData.proxy_endpoint
    runtimeFramework.value = initialData.runtime_framework
    secureLevel.value = initialData.secure_level
    gitBranch.value = initialData.git_branch
    task.value = initialData.task
    actualReplica.value = initialData.actual_replica
    instances.value = initialData.instances
    variables.value = initialData.variables
    engineArgs.value = initialData.engine_args
    username.value = initialData.username
    metadata.value = initialData.metadata
  }

  const clearStore = () => {
    localStorage.removeItem(persistKey)
  }

  return {
    timestamp,
    privateVisibility,
    isPrivate,
    updateVisibility,
    updateLikes,
    updateUserLikes,
    initialize,
    isInitialized,
    baseModel,
    canManage,
    canWrite,
    createdAt,
    csgPath,
    defaultBranch,
    description,
    downloads,
    enableEvaluation,
    enableFinetune,
    enableInference,
    hfPath,
    id,
    license,
    likes,
    mirrorLastUpdatedAt,
    msPath,
    name,
    namespace,
    nickname,
    path,
    readme,
    repository,
    repositoryId,
    scores,
    sensitiveCheckStatus,
    source,
    status,
    syncStatus,
    tags,
    updatedAt,
    user,
    userLikes,
    widgetType,
    coverImageUrl,
    repoType,
    endpoint,
    hardware,
    sdk,
    sku,
    svcName,
    avatar,
    theme,
    repositories,
    clusterId,
    deployId,
    deployName,
    imageId,
    maxReplica,
    minReplica,
    modelId,
    proxyEndpoint,
    runtimeFramework,
    secureLevel,
    gitBranch,
    task,
    actualReplica,
    instances,
    activeInstance,
    failedReason,
    variables,
    engineArgs,
    username,
    metadata,
    clearStore
  }
}, {
  persist: {
    key: persistKey
  }
})

export default useRepoDetailStore
