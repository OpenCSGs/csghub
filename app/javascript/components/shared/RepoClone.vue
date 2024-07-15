<template>
  <div
    class="flex items-center absolute top-0 right-0 md:relative md:pl-5 md:pb-4 z-10"
  >
    <DeployDropdown
      v-if="repoType === 'model' && admin && enableEndpoint"
      :modelId="namespacePath"
    />
    <div
      class="flex px-[12px] py-[5px] mr-4 justify-center items-center gap-1 rounded-lg bg-[#FFF] border border-[#D0D5DD] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer"
      v-if="repoType === 'model' && admin && enableFinetune"
      @click="toFinetunePage"
    >
      <SvgIcon
        name="model_finetune_create"
        class="mr-1"
      />
      <div class="text-sm">{{ $t('finetune.title') }}</div>
    </div>
    <div
      class="flex px-[12px] py-[5px] justify-center items-center gap-1 rounded-lg bg-[#3250BD] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer"
      @click="cloneRepositoryVisible = true"
    >
      <SvgIcon
        name="download"
        class="mr-1"
      />
      <div class="text-[#fff] text-sm">{{ $t(downloadButtonKey) }}</div>
    </div>
    <el-dialog
      v-model="cloneRepositoryVisible"
      title=""
      class="md:!w-[80%]"
    >
      <div class="rounded-t border-t border-x border-[#EBEEF5] mt-4">
        <div class="flex items-center px-3 py-2 bg-[#F5F7FA] text-[#303133]">
          <SvgIcon
            name="clone"
            class="mr-1"
          />
          {{ $t(downloadModalKey) }}
        </div>
      </div>
      <el-tabs
        v-model="activeCloneType"
        class="border border-[#EBEEF5] mb-8 clone-tabs"
      >
        <el-tab-pane
          label="HTTPS"
          name="https"
        >
          <div
            class="flex flex-col gap-1 px-3 py-2 border-t border-[#EBEEF5] bg-[#ffffff] text-[#303133] break-all"
          >
            <div class="flex gap-[8px] text-[14px] leading-[20px] text-[#667085]">
              <SvgIcon name="exclamation_point" width="13" height="13" class="cursor-pointer" />
              Use <p class="underline">access token</p> as git password/credential
            </div>
            <div
              class="mb-[4px]"
              v-if="currentUser"
            >
              <el-checkbox
                v-model="useToken"
                :label="$t('application_spaces.gradioGuide.useToken')"
                size="large"
              />
            </div>
            <div class="text-[#909399]"># {{ $t('all.lfsTips') }}</div>
            <markdown-viewer
              v-if="useToken"
              :content="httpsCloneCodeWithTokenMarkdown"
            ></markdown-viewer>
            <markdown-viewer
              v-else
              :content="httpsCloneCodeMarkdown"
            ></markdown-viewer>
            <div class="text-[#909399]"># {{ $t('all.lfsTips2') }}</div>
            <markdown-viewer
              :content="getMarkdownCode('  GIT_LFS_SKIP_SMUDGE=1', 'bash')"
            ></markdown-viewer>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="SSH"
          name="ssh"
        >
          <div
            class="flex flex-col gap-1 px-3 py-2 border-t border-[#EBEEF5] bg-[#ffffff] text-[#303133] break-all"
          >
            <div class="flex gap-[8px] text-[14px] leading-[20px] text-[#667085] mb-[8px]">
              <SvgIcon name="exclamation_point" width="13" height="13" class="cursor-pointer" />
              <p class="underline">Add your SSH public key</p> to clone private repos
            </div>
            <div class="text-[#909399]"># {{ $t('all.lfsTips') }}</div>
            <markdown-viewer :content="sshCloneCodeMarkdown"></markdown-viewer>
            <div class="text-[#909399]"># {{ $t('all.lfsTips2') }}</div>
            <markdown-viewer
              :content="getMarkdownCode('  GIT_LFS_SKIP_SMUDGE=1', 'bash')"
            ></markdown-viewer>
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('all.cmdTittle')"
          name="cmd"
        >
          <div
            class="flex flex-col gap-1 px-3 py-2 border-t border-[#EBEEF5] bg-[#ffffff] text-[#303133] break-all"
          >
            <div class="text-[#909399]"># {{ $t(downloadButtonKey) }}</div>
            <markdown-viewer
              :content="cmdCloneCodeMarkdown"
            ></markdown-viewer>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref, inject, onMounted, watch } from 'vue'
  import MarkdownViewer from '../shared/viewers/MarkdownViewer.vue'
  import DeployDropdown from './DeployDropdown.vue'
  import SvgIcon from './SvgIcon.vue'
  import { useCookies } from 'vue3-cookies'
  import jwtFetch from '../../packs/jwtFetch'

  const { cookies } = useCookies()

  const props = defineProps({
    httpCloneUrl: String,
    sshCloneUrl: String,
    repoType: String,
    userName: String,
    userToken: String,
    namespacePath: String,
    admin: Boolean,
    enableEndpoint: Boolean,
    enableFinetune: Boolean
  })

  const csghubServer = inject('csghubServer')
  const activeCloneType = ref('https')
  const cloneRepositoryVisible = ref(false)
  const useToken = ref(false)
  const currentUser = ref(cookies.get('current_user'))
  const accessToken = ref('')

  const getMarkdownCode = (code, lang, multiline = false) => {
    return `\`\`\`${lang}${multiline ? '' : '\n'}${code}${
      multiline ? '' : '\n'
    }\`\`\``
  }

  const httpsCloneCode = `
  git lfs install
  git clone ${props.httpCloneUrl}
`

  const httpsCloneCodeWithToken = ref(`
  git lfs install
  git clone https://${currentUser.value}:${
    accessToken.value
  }@${props.httpCloneUrl.replace('https://', '')}
  `)

  watch(accessToken, async (newAccessToken) => {
    httpsCloneCodeWithToken.value = `
  git lfs install
  git clone https://${
    currentUser.value
  }:${newAccessToken}@${props.httpCloneUrl.replace('https://', '')}
`
  })

  const httpsCloneCodeMarkdown = computed(() => {
    return getMarkdownCode(httpsCloneCode, 'bash', true)
  })

  const httpsCloneCodeWithTokenMarkdown = computed(() => {
    return getMarkdownCode(httpsCloneCodeWithToken.value, 'bash', true)
  })

  const sshCloneCode = `
  git lfs install
  git clone ${props.sshCloneUrl}
`

  const sshCloneCodeMarkdown = computed(() => {
    return getMarkdownCode(sshCloneCode, 'bash', true)
  })

  const cmdCloneCode = ref(`
  from opencsg import snapshot_download
  ${props.repoType}_dir = snapshot_download('${props.namespacePath}')
  `)

  const cmdCloneCodeMarkdown = computed(() => {
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

  function toFinetunePage() {
    window.location.href = `/finetune/new?model_id=${props.namespacePath}&repoType=${props.repoType}`
  }

  const fetchUserToken = async () => {
    const res = await jwtFetch(
      `${csghubServer}/api/v1/user/${currentUser}/tokens?app=git`
    )
    if (!res.ok) {
      res.json().then((error) => {
        ElMessage({ message: error.msg, type: 'warning' })
      })
    } else {
      res.json().then((body) => {
        if (body.data) {
          accessToken.value = body.data[0].token
        }
      })
    }
  }

  onMounted(() => {
    fetchUserToken()
  })
</script>
