<template>
  <div
    class="flex flex-wrap items-center gap-4 md:relative md:pl-5 md:pb-4 z-10"
  >
    <!-- add to collection btn -->
    <AddToCollections
      v-if="showAddToCollections"
      :repoId="repoDetailStore.repositoryId"
    />

    <!-- multi-source sync button -->
    <CsgButton
      v-if="showSyncButton"
      type="default"
      :name="syncInprogress ? $t('repo.source.syncing') : $t('repo.source.syncButton')"
      class="btn btn-secondary-gray btn-sm modelBtn"
      :disabled="syncInprogress"
      svgName="sync"
      @click="handleSyncRepo"
    />

    <!-- evaluation button -->
    <div v-if="!actionLimited"
      class="relative inline-flex">
      <CsgButton
        class="btn btn-secondary-gray btn-sm modelBtn pl-8"
        :name="enableEvaluation && !!httpCloneUrl ? $t('evaluation.new.title') : $t('evaluation.new.title')"
        :class="{ disabled: !enableEvaluation || !httpCloneUrl }"
        svgName="evaluation_new"
        v-if="repoType === 'model'"
        @click="enableEvaluation && !!httpCloneUrl ? toNewEvaluatePage() : ''"
      />
    </div>

    <!-- endpoint deploy button -->
    <DeployDropdown
      v-if="!actionLimited && repoType === 'model' && enableEndpoint && !!httpCloneUrl"
      :modelId="namespacePath"
    />
    <div
      v-else-if="
        !isLoggedIn && repoType === 'model' && enableEndpoint && !!httpCloneUrl
      "
    >
      <CsgButton
        type="default"
        :name="$t('all.deploy')"
        class="btn btn-secondary-gray btn-sm modelBtn"
        svgName="model_endpoint_create"
        @click="ToLoginPage"
      />
    </div>
    <div
      class="btn btn-secondary-gray btn-sm modelBtn disabled"
      v-else-if="repoType === 'model'"
    >
      <SvgIcon
        name="deploy"
        class="mr-0"
      />
      <div>{{ $t('all.deploy') }}</div>
    </div>

    <!-- finetune deploy button -->
    <CsgButton
      v-if="!actionLimited && repoType === 'model'"
      class="btn btn-secondary-gray btn-sm modelBtn"
      :class="{ disabled: !enableFinetune || !httpCloneUrl }"
      :name="enableFinetune && !!httpCloneUrl ? $t('finetune.title') : $t('finetune.title')"
      svgName="model_finetune_create"
      @click="enableFinetune && !!httpCloneUrl ? handleButtonClick() : ''"
    />

    <!-- repo download clone button -->
    <CsgButton
      v-if="!!httpCloneUrl && repo.syncStatus !== 'pending'"
      class="btn btn-primary btn-sm modelBtn"
      :name="$t(downloadButtonKey)"
      svgName="download"
      @click="cloneRepositoryVisible = true"
    />

    <!-- clone dialog -->
    <el-dialog
      v-model="cloneRepositoryVisible"
      title=""
      class="md:!w-[80%]"
    >
      <div class="rounded-t border-t border-x border-gray-200 mt-4">
        <div class="flex items-center px-3 py-2 bg-gray-100 text-gray-700">
          <SvgIcon
            name="clone"
            class="mr-1"
          />
          {{ $t(downloadModalKey) }}
        </div>
      </div>
      <el-tabs
        v-model="activeCloneType"
        class="border border-gray-200 mb-8 clone-tabs"
      >
        <el-tab-pane
          v-if="
            repoType == 'model' || repoType == 'dataset' || repoType == 'space'
          "
          :label="$t('all.commandLine')"
          name="commandLine"
        >
          <div
            class="flex flex-col gap-1 px-3 py-2 border-t border-gray-200 bg-white text-gray-700 break-all"
          >
            <div class="flex gap-[8px] text-sm leading-[20px] text-gray-500">
              <SvgIcon
                name="exclamation_point"
                width="13"
                height="13"
                class="cursor-pointer"
              />
              {{ $t('all.commandlineTips') }}
              <a
                href="https://github.com/OpenCSGs/csghub-sdk?tab=readme-ov-file#use-cases-of-command-line"
                target="_blank"
                class="underline"
              >
                {{ $t('all.documentation') }}
              </a>
            </div>
            <div class="text-gray-500 mt-[8px]">{{ $t('all.pythonTips') }}
              <a
                href="https://docs.python.org/zh-cn/3.13/using/index.html"
                target="_blank"
                class="underline"
              >
                {{ $t('all.installDocumentation') }}
              </a>
            </div>
            <div class="text-gray-500 mt-[8px]">{{ $t('all.csghubSdkTips') }}</div>
            <markdown-viewer :content="comandlineCodeMarkdown"></markdown-viewer>
            <div class="text-gray-500"># {{ $t(`all.${repoType}DownloadTips`) }}</div>
            <markdown-viewer :content="comandlineCode2Markdown"></markdown-viewer>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="HTTPS"
          name="https"
        >
          <div
            class="flex flex-col gap-1 px-3 py-2 border-t border-gray-200 bg-white text-gray-700 break-all"
          >
            <div class="flex gap-[8px] text-sm leading-[20px] text-gray-500">
              <SvgIcon
                name="exclamation_point"
                width="13"
                height="13"
                class="cursor-pointer"
              />
              Use
              <a
                href="/settings/access-token"
                target="_blank"
                class="underline"
                >access token</a
              >
              as git password/credential
            </div>
            <div
              class="mb-[4px]"
              v-if="userStore.username"
            >
              <el-checkbox
                v-model="useToken"
                :label="$t('application_spaces.gradioGuide.useToken')"
                size="large"
              />
            </div>
            <div class="text-gray-500"># {{ $t('all.lfsTips') }}</div>
            <markdown-viewer
              v-if="useToken"
              :content="httpsCloneCodeWithTokenMarkdown"
            ></markdown-viewer>
            <markdown-viewer
              v-else
              :content="httpsCloneCodeMarkdown"
            ></markdown-viewer>
            <div class="text-gray-500"># {{ $t('all.lfsTips2') }}</div>
            <markdown-viewer
              :content="getMarkdownCode('GIT_LFS_SKIP_SMUDGE=1', 'bash')"
            ></markdown-viewer>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="SSH"
          name="ssh"
        >
          <div
            class="flex flex-col gap-1 px-3 py-2 border-t border-gray-200 bg-white text-gray-700 break-all"
          >
            <div
              class="flex gap-[8px] text-sm leading-[20px] text-gray-500 mb-[8px]"
            >
              <SvgIcon
                name="exclamation_point"
                width="13"
                height="13"
                class="cursor-pointer"
              />
              <a
                href="/settings/ssh-keys"
                target="_blank"
                class="underline"
                >Add your SSH public key</a
              >
              to clone private repos
            </div>
            <div class="text-gray-500"># {{ $t('all.lfsTips') }}</div>
            <markdown-viewer :content="sshCloneCodeMarkdown"></markdown-viewer>
            <div class="text-gray-500"># {{ $t('all.lfsTips2') }}</div>
            <markdown-viewer
              :setDefaultText="true"
              :content="getMarkdownCode('GIT_LFS_SKIP_SMUDGE=1', 'bash')"
            ></markdown-viewer>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="repoType == 'model' || repoType == 'dataset'"
          label="SDK"
          name="sdk"
        >
          <div
            class="flex flex-col gap-1 px-3 py-2 border-t border-gray-200 bg-white text-gray-700 break-all"
          >
            <div class="flex gap-[8px] text-sm leading-[20px] text-gray-500">
              <SvgIcon
                name="exclamation_point"
                width="13"
                height="13"
                class="cursor-pointer"
              />
              Use
              <a
                href="https://github.com/OpenCSGs/csghub-sdk"
                target="_blank"
                class="underline"
              >
                SDK
              </a>
              to download
            </div>
            <div class="text-gray-500 mt-[8px]"># {{ $t('all.sdkTips') }}</div>
            <markdown-viewer :content="cmdCloneCodeMarkdown"></markdown-viewer>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, onMounted, watch } from 'vue'
  import MarkdownViewer from '../shared/viewers/MarkdownViewer.vue'
  import DeployDropdown from './DeployDropdown.vue'
  import SvgIcon from './SvgIcon.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import AddToCollections from '../collections/AddToCollections.vue'
  import useUserStore from '../../stores/UserStore.js'
  import { ToLoginPage } from '@/packs/utils'
  import { storeToRefs } from 'pinia'
  import useRepoDetailStore from '@/stores/RepoDetailStore'

  const userStore = useUserStore()
  const repoDetailStore = useRepoDetailStore()

  const props = defineProps({
    repoType: String,
    namespacePath: String,
    repo: Object,
    enableEndpoint: Boolean,
    enableFinetune: Boolean,
    enableEvaluation: Boolean,
    showAddToCollections: Boolean,
  })

  const { actionLimited, isLoggedIn } = storeToRefs(userStore)
  const httpCloneUrl = computed(() => {
    return repoDetailStore.repository.http_clone_url || ""
  })
  const serverDomain = computed(() => {
    if (!repoDetailStore.repository.http_clone_url) return 'https://hub.opencsg.com'
    const url = repoDetailStore.repository.http_clone_url
    return new URL(url).origin
  })
  const sshCloneUrl = computed(() => {
    return repoDetailStore.repository.ssh_clone_url
  })
  const httpCloneProtocol = computed(() => {
    const url = repoDetailStore.repository.http_clone_url
    return url ? new URL(url).protocol : 'https'
  })

  const httpsCloneCode = computed(() => {
    return `
git lfs install
git clone ${httpCloneUrl.value}
`
  })

  const sshCloneCode = computed(() => {
    return `
git lfs install
git clone ${sshCloneUrl.value}
`
  })

  const httpsCloneCodeWithToken = computed(() => {
    return `
git lfs install
git clone ${httpCloneProtocol.value}//${userStore.username}:${
        accessToken.value
      }@${httpCloneUrl.value.replace(`${httpCloneProtocol.value}//`, '')}
`
  })

  const activeCloneType = computed(() => {
    return ['model', 'dataset', 'space'].includes(props.repoType) ? 'commandLine' : 'https';
  })
  const cloneRepositoryVisible = ref(false)
  const useToken = ref(false)
  const accessToken = ref('')

  const showSyncButton = computed(() =>
    (userStore.roles.includes('admin') || userStore.roles.includes('super_user')) &&
    props.repo.source === 'opencsg' &&
    ['pending', 'inprogress', 'failed'].includes(props.repo.syncStatus)
  )

  // 同步按钮禁用
  const syncInprogress = computed(() => {
    return (
      props.repo.source === 'opencsg' && props.repo.syncStatus === 'inprogress'
    )
  })

  const getMarkdownCode = (code, lang, multiline = false) => {
    return `\`\`\`${lang}${multiline ? '' : '\n'}${code}${
      multiline ? '' : '\n'
    }\`\`\``
  }

  watch(accessToken, async (newAccessToken) => {
    // no space
    httpsCloneCodeWithToken.value = `
git lfs install
git clone ${httpCloneProtocol.value}//${
      userStore.username
    }:${newAccessToken}@${httpCloneUrl.value.replace(
      `${httpCloneProtocol.value}//`,
      ''
    )}
`
  })

  const httpsCloneCodeMarkdown = computed(() => {
    return getMarkdownCode(httpsCloneCode.value, 'bash', true)
  })

  const httpsCloneCodeWithTokenMarkdown = computed(() => {
    return getMarkdownCode(httpsCloneCodeWithToken.value, 'bash', true)
  })

  const sshCloneCodeMarkdown = computed(() => {
    return getMarkdownCode(sshCloneCode.value, 'bash', true)
  })

  const getCmdCloneCode = () => {
    return ref(`
from pycsghub.snapshot_download import snapshot_download
token = '' # token from opencsg.com
endpoint = "${serverDomain.value}"
repo_type = "${props.repoType}"
repo_id = '${props.namespacePath}'
cache_dir = '' # cache dir of download data
result = snapshot_download(repo_id, cache_dir=cache_dir, endpoint=endpoint, token=token, repo_type=repo_type)
`)
  }

  const comandlineCode = computed(() => {
    return `
pip install csghub-sdk
`
  })

  const getComandLineCloneCode = () => {
    if (props.repoType === 'model') {
      return ref(`
csghub-cli download ${props.namespacePath}
`)
    } else if (props.repoType === 'dataset') {
      return ref(`
csghub-cli download ${props.namespacePath} -t dataset
`)
    } else if (props.repoType === 'space') {
      return ref(`
csghub-cli download ${props.namespacePath} -t space
`)
    }
  }

  const comandlineCodeMarkdown = computed(() => {
    return getMarkdownCode(comandlineCode.value, 'bash', true)
  })

  const comandlineCode2Markdown = computed(() => {
    const comandlineCodeDownload = getComandLineCloneCode()
    return getMarkdownCode(comandlineCodeDownload.value, 'bash', true)
  })

  const cmdCloneCodeMarkdown = computed(() => {
    const cmdCloneCode = getCmdCloneCode()
    return getMarkdownCode(cmdCloneCode.value, 'bash', true)
  })

  const downloadButtonKey = computed(() => {
    switch (props.repoType) {
      case 'dataset':
        return 'datasets.downloadDataset'
      case 'model':
        return 'models.download'
      case 'code':
        return 'codes.downloadCode'
      case 'space':
        return 'application_spaces.download'
      default:
        return ''
    }
  })

  const downloadModalKey = computed(() => {
    switch (props.repoType) {
      case 'dataset':
        return 'datasets.downloadDataset'
      case 'model':
        return 'models.downloadModel'
      case 'code':
        return 'codes.downloadCode'
      case 'space':
        return 'application_spaces.downloadSpace'
      default:
        return ''
    }
  })

  const downloadModalUrl = computed(() => {
    switch (props.repoType) {
      case 'dataset':
        return 'https://opencsg.com/docs/Dataset/download_datasets'
      case 'model':
        return 'https://opencsg.com/docs/Model/download_models'
      case 'code':
        return 'https://opencsg.com/docs/Code/download_codes'
      case 'space':
        return 'https://opencsg.com/docs/Space/download_space_repo'
    }
  })

  function toFinetunePage() {
    window.location.href = `/finetune/new?model_id=${props.namespacePath}&repoType=${props.repoType}`
  }

  const fetchUserToken = async () => {
    if (!userStore.username) return

    const { data } = await useFetchApi(
      `/user/${userStore.username}/tokens?app=git`
    ).json()
    if (data.value) {
      const body = data.value
      if (body.data) {
        accessToken.value = body.data[0].token
      }
    }
  }

  watch(cloneRepositoryVisible, () => {
    if (cloneRepositoryVisible.value && !accessToken.value) {
      fetchUserToken()
    }
  })

  const handleSyncRepo = async () => {
    const syncUrl = `/${props.repoType}s/${props.namespacePath}/mirror_from_saas`
    const { error } = await useFetchApi(syncUrl, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .post()
      .json()

    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      ElMessage({ message: 'Sync repo success', type: 'success' })
      setTimeout(() => {
        location.reload()
      }, 2000)
    }
  }

  const handleButtonClick = () => {
    if (isLoggedIn.value) {
      toFinetunePage()
    } else {
      ToLoginPage()
    }
  }

  const toNewEvaluatePage = () => {
    if (isLoggedIn.value) {
      window.location.href = `/evaluations/new?model_id=${props.namespacePath}`
    } else {
      ToLoginPage()
    }
  }

  onMounted(() => {
    if (userStore.initialized) {
      fetchUserToken()
    }
  })
</script>

<style lang="less" scoped>
  .disabled {
    cursor: not-allowed;
    border: solid #eaecf0;
    color: #98a2b3;
    &:hover {
      border: solid #eaecf0 !important;
      color: #98a2b3 !important;
      background: #fff !important;
    }
  }
</style>
