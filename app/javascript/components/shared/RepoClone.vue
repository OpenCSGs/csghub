<template>
  <div class="flex items-center absolute top-0 right-0 md:relative md:pl-5 md:pb-4 z-10">
    <DeployDropdown v-if="repoType === 'model' && admin" :modelId="namespacePath" />
    <div
      class="flex px-[12px] py-[5px] justify-center items-center gap-1 rounded-lg bg-[#3250BD] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer"
      @click="cloneRepositoryVisible = true"
    >
      <SvgIcon name="download" class="mr-1" />
      <div class="text-[#fff] text-sm">{{ $t(downloadButtonKey) }}</div>
    </div>
    <el-dialog v-model="cloneRepositoryVisible" title="" class="md:!w-[80%]">
      <div class="rounded-t border-t border-x border-[#EBEEF5] mt-4">
        <div class="flex items-center px-3 py-2 bg-[#F5F7FA] text-[#303133]">
          <SvgIcon name="clone" class="mr-1" />
          {{ $t(downloadModalKey) }}
        </div>
      </div>
      <el-tabs v-model="activeCloneType" class="border border-[#EBEEF5] mb-8 clone-tabs">
        <el-tab-pane label="HTTPS" name="https">
          <div
            class="flex flex-col gap-1 px-3 py-2 border-t border-[#EBEEF5] bg-[#ffffff] text-[#303133] break-all"
          >
            <div class="my-[4px]" v-if="userName && userToken">
              <el-checkbox
                v-model="useToken"
                :label="$t('application_spaces.gradioGuide.useToken')"
                size="large"
              />
            </div>
            <div class="text-[#909399]"># {{ $t("all.lfsTips") }}</div>
            <markdown-viewer
              v-if="useToken"
              :content="httpsCloneCodeWithTokenMarkdown"
            ></markdown-viewer>
            <markdown-viewer v-else :content="httpsCloneCodeMarkdown"></markdown-viewer>
            <div class="text-[#909399]"># {{ $t("all.lfsTips2") }}</div>
            <markdown-viewer
              :content="getMarkdownCode('  GIT_LFS_SKIP_SMUDGE=1', 'bash')"
            ></markdown-viewer>
          </div>
        </el-tab-pane>
        <el-tab-pane label="SSH" name="ssh">
          <div
            class="flex flex-col gap-1 px-3 py-2 border-t border-[#EBEEF5] bg-[#ffffff] text-[#303133] break-all"
          >
            <div class="text-[#909399]"># {{ $t("all.lfsTips") }}</div>
            <markdown-viewer :content="sshCloneCodeMarkdown"></markdown-viewer>
            <div class="text-[#909399]"># {{ $t("all.lfsTips2") }}</div>
            <markdown-viewer
              :content="getMarkdownCode('  GIT_LFS_SKIP_SMUDGE=1', 'bash')"
            ></markdown-viewer>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
  import { computed, ref } from "vue";
  import MarkdownViewer from "../shared/viewers/MarkdownViewer.vue";
  import DeployDropdown from "./DeployDropdown.vue";
  import SvgIcon from "./SvgIcon.vue";

  const props = defineProps({
    httpCloneUrl: String,
    sshCloneUrl: String,
    repoType: String,
    userName: String,
    userToken: String,
    namespacePath: String,
    admin: Boolean,
  });

  const activeCloneType = ref("https");
  const cloneRepositoryVisible = ref(false);
  const useToken = ref(false);

  const getMarkdownCode = (code, lang, multiline = false) => {
    return `\`\`\`${lang}${multiline ? "" : "\n"}${code}${multiline ? "" : "\n"}\`\`\``;
  };

  const httpsCloneCode = `
  git lfs install
  git clone ${props.httpCloneUrl}
`;

  const httpsCloneCodeWithToken = `
  git lfs install
  git clone https://${props.userName}:${props.userToken}@${props.httpCloneUrl.replace(
    "https://",
    ""
  )}
`;

  const httpsCloneCodeMarkdown = computed(() => {
    return getMarkdownCode(httpsCloneCode, "bash", true);
  });

  const httpsCloneCodeWithTokenMarkdown = computed(() => {
    return getMarkdownCode(httpsCloneCodeWithToken, "bash", true);
  });

  const sshCloneCode = `
  git lfs install
  git clone ${props.sshCloneUrl}
`;

  const sshCloneCodeMarkdown = computed(() => {
    return getMarkdownCode(sshCloneCode, "bash", true);
  });

  const downloadButtonKey = computed(() => {
    switch (props.repoType) {
      case "dataset":
        return "datasets.downloadDataset";
      case "model":
        return "models.download";
      case "code":
        return "codes.downloadCode";
      case "space":
        return "application_spaces.download";
      default:
        return "";
    }
  });

  const downloadModalKey = computed(() => {
    switch (props.repoType) {
      case "dataset":
        return "datasets.downloadDataset";
      case "model":
        return "models.downloadModel";
      case "code":
        return "codes.downloadCode";
      case "space":
        return "application_spaces.downloadSpace";
      default:
        return "";
    }
  });
</script>
