<template>
  <div class="flex items-center absolute top-0 right-0 md:relative md:pl-5 md:pb-4 z-10">
    <div class="rounded border border-[#DCDFE6] flex items-center justify-center px-4 py-[5px] h-8 cursor-pointer hover:bg-[#F9FAFB]" @click="cloneRepositoryVisible = true">
      <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect opacity="0.12" x="1.3335" y="1.3335" width="13.3333" height="13.3333" rx="3.33333" fill="#2F384C"/>
        <path
            d="M6.66683 5.3335L4.00016 8.00016L6.66683 10.6668M9.3335 5.3335L12.0002 8.00016L9.3335 10.6668M6.66682 14.6668H9.3335C11.2003 14.6668 12.1338 14.6668 12.8468 14.3035C13.474 13.9839 13.9839 13.474 14.3035 12.8468C14.6668 12.1338 14.6668 11.2003 14.6668 9.3335V6.66683C14.6668 4.79999 14.6668 3.86657 14.3035 3.15353C13.9839 2.52632 13.474 2.01639 12.8468 1.69681C12.1338 1.3335 11.2003 1.3335 9.3335 1.3335H6.66683C4.79999 1.3335 3.86657 1.3335 3.15353 1.69681C2.52632 2.01639 2.01639 2.52632 1.69681 3.15353C1.3335 3.86657 1.3335 4.79999 1.3335 6.66682V9.3335C1.3335 11.2003 1.3335 12.1338 1.69681 12.8468C2.01639 13.474 2.52632 13.9839 3.15353 14.3035C3.86657 14.6668 4.79999 14.6668 6.66682 14.6668Z"
            stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="ml-2 text-[#606266] text-sm font-medium">{{ $t(downloadButtonKey)}}</div>
    </div>
    <el-dialog v-model="cloneRepositoryVisible" title="" class="md:!w-[80%]">
      <div class="rounded-t border-t border-x border-[#EBEEF5] mt-4">
        <div class="flex items-center px-3 py-2 bg-[#F5F7FA] text-[#303133]">
          <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect opacity="0.12" x="1.3335" y="1.3335" width="13.3333" height="13.3333" rx="3.33333" fill="#2F384C"/>
            <path d="M6.66683 5.3335L4.00016 8.00016L6.66683 10.6668M9.3335 5.3335L12.0002 8.00016L9.3335 10.6668M6.66682 14.6668H9.3335C11.2003 14.6668 12.1338 14.6668 12.8468 14.3035C13.474 13.9839 13.9839 13.474 14.3035 12.8468C14.6668 12.1338 14.6668 11.2003 14.6668 9.3335V6.66683C14.6668 4.79999 14.6668 3.86657 14.3035 3.15353C13.9839 2.52632 13.474 2.01639 12.8468 1.69681C12.1338 1.3335 11.2003 1.3335 9.3335 1.3335H6.66683C4.79999 1.3335 3.86657 1.3335 3.15353 1.69681C2.52632 2.01639 2.01639 2.52632 1.69681 3.15353C1.3335 3.86657 1.3335 4.79999 1.3335 6.66682V9.3335C1.3335 11.2003 1.3335 12.1338 1.69681 12.8468C2.01639 13.474 2.52632 13.9839 3.15353 14.3035C3.86657 14.6668 4.79999 14.6668 6.66682 14.6668Z" stroke="#2F384C" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {{ $t(downloadModalKey) }}
        </div>
      </div>
      <el-tabs v-model="activeCloneType" class="border border-[#EBEEF5] mb-8 clone-tabs">
        <el-tab-pane label="HTTPS" name="https">
          <div class="flex flex-col gap-1 px-3 py-2 border-t border-[#EBEEF5] bg-[#ffffff] text-[#303133] break-all">
            <div class="text-[#909399]"># {{ $t('all.lfsTips')}}</div>
            <markdown-viewer :content="httpsCloneCodeMarkdown"></markdown-viewer>
            <div class="text-[#909399]"># {{ $t('all.lfsTips2')}}</div>
            <markdown-viewer :content="getMarkdownCode('GIT_LFS_SKIP_SMUDGE=1', 'bash')"></markdown-viewer>
          </div>
        </el-tab-pane>
        <el-tab-pane label="SSH" name="ssh">
          <div class="flex flex-col gap-1 px-3 py-2 border-t border-[#EBEEF5] bg-[#ffffff] text-[#303133] break-all">
            <div class="text-[#909399]"># {{ $t('all.lfsTips')}}</div>
            <markdown-viewer :content="sshCloneCodeMarkdown"></markdown-viewer>
            <div class="text-[#909399]"># {{ $t('all.lfsTips2')}}</div>
            <markdown-viewer :content="getMarkdownCode('GIT_LFS_SKIP_SMUDGE=1', 'bash')"></markdown-viewer>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import MarkdownViewer from '../shared/viewers/MarkdownViewer.vue'

const props = defineProps({
  httpCloneUrl: String,
  sshCloneUrl: String,
  repoType: String
})

const activeCloneType = ref('https')
const cloneRepositoryVisible = ref(false)

const getMarkdownCode = (code, lang, multiline = false) => {
  return `\`\`\`${lang}${multiline ? '' : '\n'}${code}${multiline ? '' : '\n'}\`\`\``
}

const httpsCloneCode = `
  git lfs install
  git clone ${props.httpCloneUrl}
`

const httpsCloneCodeMarkdown = computed(() => {
  return getMarkdownCode(httpsCloneCode, 'bash', true)
})

const sshCloneCode = `
  git lfs install
  git clone ${props.sshCloneUrl}
`

const sshCloneCodeMarkdown = computed(() => {
  return getMarkdownCode(sshCloneCode, 'bash', true)
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
</script>
