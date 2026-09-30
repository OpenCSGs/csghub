<template>
  <LoadingSpinner 
    :loading="isDataLoading" 
    :text="$t('repo.loading')" 
  />

  <div v-show="!isDataLoading" class="min-h-[300px] py-8 md:px-5">
    <div class="rounded-lg border border-gray-200 min-h-[100px] mb-4">
      <div
        class="flex justify-between gap-[4px] border-b border-gray-200 items-center px-[12px] py-[9px] bg-gray-100 rounded-t-lg"
      >
        <div class="flex items-center">
          <div class="flex items-center mr-2">
            <el-avatar :icon="UserFilled" :size="24" class="mr-2" />
            <span>{{ commit.committer_name }}</span>
          </div>
          <div class="text-gray-500 text-sm">
            {{
              format(beiJingTimeParser(commit.committer_date), locale == "en" ? "en_US" : "zh_CN")
            }}
          </div>
        </div>
        <div class="flex items-center text-sm text-gray-700" v-if="commit.id">
          <el-button-group class="ml-2 min-w-[107px]">
            <el-tooltip :content="commit.id" placement="top">
              <el-button type="default" size="small" class="font-mono">
                {{ commit.id.slice(0, 7) }}
              </el-button>
            </el-tooltip>
            <el-button type="default" size="small" @click="copyCommitId(commit.id)" data-testid="copy-commit-btn">
              <SvgIcon name="copy" class="w-3 h-3" />
            </el-button>
          </el-button-group>
        </div>
      </div>
      <div class="p-4 flex justify-between">
        <MarkdownViewer v-if="commit.message" :content="commit.message" />
      </div>
    </div>

    <!-- Diff Stats & Controls Toolbar -->
    <div
      v-if="!isDataLoading && totalChangedFiles > 0"
      class="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg mb-4 flex-wrap gap-3"
      data-testid="diff-toolbar"
    >
      <div class="flex items-center gap-3 text-sm flex-wrap">
        <span class="font-medium text-gray-700" data-testid="diff-file-count">
          {{ totalChangedFiles }} {{ totalChangedFiles === 1 ? t('all.fileChanged') : t('all.filesChanged') }}
        </span>
        <div class="flex items-center gap-1.5 font-mono text-xs font-semibold">
          <span class="inline-flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200" data-testid="diff-additions">
            +{{ totalAdditions }}
          </span>
          <span class="inline-flex items-center text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200" data-testid="diff-deletions">
            -{{ totalDeletions }}
          </span>
        </div>

        <!-- Jump to File Dropdown -->
        <el-dropdown v-if="parsedFiles.length > 1" trigger="click" @command="jumpToFile">
          <button
            type="button"
            class="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded px-2.5 py-1 transition-colors cursor-pointer"
            data-testid="jump-to-file-btn"
          >
            <span>{{ t('all.jumpToFile') }}</span>
            <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <template #dropdown>
            <el-dropdown-menu class="max-h-60 overflow-y-auto">
              <el-dropdown-item
                v-for="file in parsedFiles"
                :key="file.newName || file.oldName"
                :command="file.newName || file.oldName"
                class="flex items-center justify-between gap-4 font-mono text-xs"
              >
                <span class="truncate max-w-xs">{{ file.newName || file.oldName }}</span>
                <span class="flex items-center gap-1 text-2xs">
                  <span v-if="file.addedLines" class="text-green-600 font-semibold">+{{ file.addedLines }}</span>
                  <span v-if="file.deletedLines" class="text-red-600 font-semibold">-{{ file.deletedLines }}</span>
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- Diff View Mode Segmented Control: Unified / Split -->
      <div class="inline-flex p-0.5 bg-gray-200 rounded-md text-xs border border-gray-300">
        <button
          type="button"
          data-testid="diff-unified-btn"
          @click="setDiffMode('line-by-line')"
          :class="[
            'px-2.5 py-1 rounded font-medium transition-all cursor-pointer',
            diffMode === 'line-by-line'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          {{ t('all.unified') }}
        </button>
        <button
          type="button"
          data-testid="diff-split-btn"
          @click="setDiffMode('side-by-side')"
          :class="[
            'px-2.5 py-1 rounded font-medium transition-all cursor-pointer',
            diffMode === 'side-by-side'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          {{ t('all.split') }}
        </button>
      </div>
    </div>

    <!-- Empty Diff State -->
    <div
      v-if="!isDataLoading && totalChangedFiles === 0"
      class="py-16 text-center text-gray-500 border border-gray-200 rounded-lg bg-gray-50"
      data-testid="no-changes-detected"
    >
      <p class="text-sm font-medium">{{ t('all.noChangesDetected') }}</p>
    </div>

    <!-- Diff HTML Render Container -->
    <div v-html="diffContent"></div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from "vue";
  import { useI18n } from "vue-i18n";
  import { format } from "timeago.js";
  import { UserFilled } from "@element-plus/icons-vue";
  import useFetchApi from "../../packs/useFetchApi";
  import { copyToClipboard } from "../../packs/clipboard";
  import { ElMessage } from "element-plus";
  import { parse, html } from "diff2html";
  import MarkdownViewer from "./viewers/MarkdownViewer.vue";
  import LoadingSpinner from "./LoadingSpinner.vue";
  import { beiJingTimeParser, ToNotFoundPage } from '../../packs/utils'
  import "../../styles/codediff.css";

  const { t, locale } = useI18n();
  const commit = ref({});
  const diffContent = ref("");
  const diffMode = ref("side-by-side");
  const parsedFiles = ref([]);
  
  const isDataLoading = ref(false)
  
  const props = defineProps({
    namespacePath: String,
    repoType: String,
    commitId: String
  });

  const totalChangedFiles = computed(() => parsedFiles.value.length);
  const totalAdditions = computed(() => {
    return parsedFiles.value.reduce((acc, f) => acc + (f.addedLines || 0), 0);
  });
  const totalDeletions = computed(() => {
    return parsedFiles.value.reduce((acc, f) => acc + (f.deletedLines || 0), 0);
  });

  const setDiffMode = (mode) => {
    diffMode.value = mode;
    diffContent.value = getDiffContent();
  };

  const copyCommitId = (commitId) => {
    copyToClipboard(commitId);
  };

  const jumpToFile = (fileName) => {
    if (typeof document === 'undefined') return;
    const fileHeaders = document.querySelectorAll('.d2h-file-name');
    for (const el of fileHeaders) {
      if (el.textContent.includes(fileName)) {
        el.closest('.d2h-file-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
    }
  };

  const parseDiff = () => {
    if (!commit.value?.diff) {
      parsedFiles.value = [];
      return [];
    }
    try {
      const rawDiff = b64ToUtf8(commit.value.diff);
      const parsed = parse(rawDiff);
      parsedFiles.value = parsed || [];
      return parsedFiles.value;
    } catch (e) {
      console.error('Failed to parse diff:', e);
      parsedFiles.value = [];
      return [];
    }
  };

  const fetchCommit = async () => {
    if (isDataLoading.value) {
      return false
    }
    
    isDataLoading.value = true

    const url = `/${props.repoType}s/${props.namespacePath}/commit/${props.commitId}`;
    
    try {
      const { data, error, response } = await useFetchApi(url).json()
      
      // 检查404状态
      if (response.value.status === 404) {
        ToNotFoundPage()
        return
      }
      
      if (error.value) {
        ElMessage({ message: error.value, type: "warning" });
      } else {
        const body = data.value
        commit.value = body.data || {};
        parseDiff();
        diffContent.value = getDiffContent();
      }
    } catch (err) {
      ElMessage({ 
        message: t('shared.fetchCommitError') || 'Failed to fetch commit', 
        type: "error" 
      });
    } finally {
      isDataLoading.value = false
    }
  };

  const getDiffContent = () => {
    if (!commit.value?.diff) return "";
    try {
      const parsed = parsedFiles.value.length ? parsedFiles.value : parseDiff();
      if (!parsed.length) return "";
      return html(parsed, {
        drawFileList: true,
        fileListToggle: false,
        fileListStartVisible: false,
        fileContentToggle: false,
        matching: "lines",
        outputFormat: diffMode.value,
        synchronisedScroll: true,
        highlight: true,
        renderNothingWhenEmpty: false
      });
    } catch (e) {
      console.error('Failed to render diff content:', e);
      return "";
    }
  };

  const b64ToUtf8 = (str) => {
    if (!str) return "";
    try {
      const binaryString = atob(str);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const decoder = new TextDecoder("utf-8");
      return decoder.decode(bytes);
    } catch {
      return str;
    }
  };

  onMounted(() => {
    fetchCommit();
  });

  defineExpose({
    commit,
    diffContent,
    diffMode,
    parsedFiles,
    totalChangedFiles,
    totalAdditions,
    totalDeletions,
    setDiffMode,
    copyCommitId,
    fetchCommit,
    jumpToFile
  });
</script>
