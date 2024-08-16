<template>
  <div class="min-h-[300px] py-8 md:px-5">
    <div class="rounded-lg border border-[#e5e7eb] min-h-[100px] mb-4">
      <div
        class="flex justify-between gap-[4px] border-b border-[#e5e7eb] items-center px-[12px] py-[9px] bg-[#F5F7FA] rounded-t-lg"
      >
        <div class="flex items-center">
          <div class="flex items-center mr-2">
            <el-avatar :icon="UserFilled" :size="24" class="mr-2" />
            <span>{{ commit.committer_name }}</span>
          </div>
          <div class="text-[#606266] text-sm">
            {{
              format(beiJingTimeParser(commit.committer_date), locale == "en" ? "en_US" : "zh_CN")
            }}
          </div>
        </div>
        <div class="flex items-center text-sm text-[#344054]" v-if="commit.id">
          <el-button-group class="ml-2 min-w-[107px]">
            <el-button type="default" size="small">
              {{ commit.id.slice(0, 7) }}
            </el-button>
            <el-button type="default" size="small" @click="copyCommitId(commit.id)">
              <SvgIcon name="copy" class="w-3 h-3" />
            </el-button>
          </el-button-group>
        </div>
      </div>
      <div class="p-4 flex justify-between">
        <MarkdownViewer v-if="commit.message" :content="commit.message" />
      </div>
    </div>
    <div v-html="diffContent"></div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { useI18n } from "vue-i18n";
  import { format } from "timeago.js";
  import { UserFilled } from "@element-plus/icons-vue";
  import useFetchApi from "../../packs/useFetchApi";
  import { copyToClipboard } from "../../packs/clipboard";
  import { ElMessage } from "element-plus";
  import { parse, html } from "diff2html";
  import MarkdownViewer from "./viewers/MarkdownViewer.vue";
  import "../../styles/codediff.css";

  const { t } = useI18n();
  const commit = ref({});
  const diffContent = ref("");

  const props = defineProps({
    namespacePath: String,
    repoType: String,
    commitId: String
  });

  const beiJingTimeParser = (utcTimeStr) => {
    utcTime = new Date(utcTimeStr);
    return utcTime.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" });
  };

  const copyCommitId = (commitId) => {
    copyToClipboard(commitId);
  };

  const fetchCommit = async () => {
    const url = `/${props.repoType}s/${props.namespacePath}/commit/${props.commitId}`;
    const { data, error } = await useFetchApi(url).json()
    if (error.value) {
      ElMessage({ message: error.value, type: "warning" });
    } else {
      const body = data.value
      commit.value = body.data;
      diffContent.value = getDiffContent();
    }
  };

  const getDiffContent = () => {
    if (!commit.value) return;
    return html(parse(b64ToUtf8(commit.value.diff)), {
      drawFileList: true,
      fileListToggle: false,
      fileListStartVisible: false,
      fileContentToggle: false,
      matching: "lines",
      outputFormat: "side-by-side",
      synchronisedScroll: true,
      highlight: true,
      renderNothingWhenEmpty: false
    });
  };

  const b64ToUtf8 = (str) => {
    const binaryString = atob(str);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const decoder = new TextDecoder("utf-8");
    return decoder.decode(bytes);
  };

  onMounted(() => {
    fetchCommit();
  });
</script>
