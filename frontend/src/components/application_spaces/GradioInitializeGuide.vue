<template>
  <div class="sm:px-[20px]">
    <div class="flex gap-[8px] mt-[32px] p-[16px] border border-gray-300 rounded-xl shadow-xs">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g clip-path="url(#clip0_8790_36855)">
          <path d="M6.24984 9.99984L8.74984 12.4998L13.7498 7.49984M18.3332 9.99984C18.3332 14.6022 14.6022 18.3332 9.99984 18.3332C5.39746 18.3332 1.6665 14.6022 1.6665 9.99984C1.6665 5.39746 5.39746 1.6665 9.99984 1.6665C14.6022 1.6665 18.3332 5.39746 18.3332 9.99984Z" stroke="#079455" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_8790_36855">
            <rect width="20" height="20" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      <div>
        <h3 class="text-gray-600 text-sm font-[500]">{{ $t('application_spaces.gradioGuide.notice') }}</h3>
        <p class="text-gray-600 text-sm">{{ $t('application_spaces.gradioGuide.noticeDesc') }}</p>
      </div>
    </div>
    <h3 class="my-[24px] text-gray-600 font-[500]">1. {{ $t('application_spaces.gradioGuide.cloneTitle') }}</h3>
    <div>
      <p class="">
        <span class="px-[12px] py-[8px] cursor-pointer"
              :class="isHttpsTab ? 'active-tab' : ''"
              data-value="https"
              ref="httpsTab"
              @click="toggleActiveTab">
              HTTPS
        </span>
        <span class="px-[12px] py-[8px] cursor-pointer"
              data-value="ssh"
              :class="isHttpsTab ? '' : 'active-tab'"
              ref="sshTab"
              @click="toggleActiveTab">
              SSH
        </span>
      </p>
      <div v-if="isHttpsTab">
        <div class="my-[16px] flex items-center gap-[8px]">
          <el-checkbox v-model="useToken" :label="$t('application_spaces.gradioGuide.useToken')" size="large" />
        </div>
        <markdown-viewer v-if="useToken" :content="httpsCloneCodeWithTokenMarkdown"></markdown-viewer>
        <markdown-viewer v-else :content="httpsCloneCodeMarkdown"></markdown-viewer>
      </div>
      <div v-else
          class="my-[16px]">
        <markdown-viewer :content="sshCloneCodeMarkdown"></markdown-viewer>
      </div>
    </div>
    <h3 class="my-[24px] text-gray-600 font-[500]">2. {{ $t('application_spaces.gradioGuide.createTitle') }}</h3>
    <markdown-viewer :content="appPyCodeMarkdown"></markdown-viewer>
    <h3 class="my-[24px] text-gray-600 font-[500]">3. {{ $t('application_spaces.gradioGuide.submitTitle') }}</h3>
    <markdown-viewer :content="pushCodeMarkdown"></markdown-viewer>
    <p class="text-gray-500 text-md font-[400] my-[24px]">{{ $t('application_spaces.gradioGuide.successNotes') }}</p>
    <div class="text-md text-gray-500 border border-gray-300 rounded-md shadow-xs py-[12px] px-[14px] mb-[32px]">
      <div>
        <h3 class="text-gray-900"> {{ $t('application_spaces.gradioGuide.dependencyNotesTitle') }} </h3>
        <p>{{ $t('application_spaces.gradioGuide.dependencyNotes1') }}</p>
        <p>{{ $t('application_spaces.gradioGuide.dependencyNotes2') }}</p>
        <p>{{ $t('application_spaces.gradioGuide.dependencyNotes3') }}</p>
      </div>
      <br />
      <div>
        <h3 class="text-gray-900"> {{ $t('application_spaces.gradioGuide.docNotesTitle') }} </h3>
        <a href="https://opencsg.com/docs/Space/space_intro" target="_blank">{{ $t('application_spaces.gradioGuide.docNotes1') }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import MarkdownViewer from '../shared/viewers/MarkdownViewer.vue'

  const props = defineProps({
    httpCloneUrl: String,
    sshCloneUrl: String,
    userName: String,
    userToken: String
  })

  const isHttpsTab = ref(true)
  const httpsTab = ref()
  const sshTab = ref()
  const useToken = ref(false)

  const getMarkdownCode = (code, lang, multiline = false) => {
    return `\`\`\`${lang}${multiline ? '' : '\n'}${code}${multiline ? '' : '\n'}\`\`\``
  }

  const httpsCloneCodeMarkdown = computed(() => {
    const httpsCloneCode = `git clone ${props.httpCloneUrl}`
    return getMarkdownCode(httpsCloneCode, 'bash')
  })

  const httpsCloneCodeWithTokenMarkdown = computed(() => {
    const httpsCloneCodeWithToken = `git clone https://${props.userName}:${props.userToken}@${props.httpCloneUrl.replace('https://', '')}`
    return getMarkdownCode(httpsCloneCodeWithToken, 'bash')
  })

  const sshCloneCodeMarkdown = computed(() => {
    const sshCloneCode = `git clone ${props.sshCloneUrl}`
    return getMarkdownCode(sshCloneCode, 'bash')
  })

  const appPyCode = [
    'import gradio as gr',
    '',
    'def greet(name):',
    '    return "Hello " + name + "!!"',
    '',
    'iface = gr.Interface(fn=greet, inputs="text", outputs="text")',
    'iface.launch()'
  ].join('\n')

  const appPyCodeMarkdown = computed(() => {
    return [
      '',
      '```python',
      appPyCode,
      '```',
      ''
    ].join('\n')
  })

  const pushCode = [
    'git add app.py',
    'git commit -m "Add application file"',
    'git push'
  ].join('\n')

  const pushCodeMarkdown = computed(() => {
    return [
      '',
      '```bash',
      pushCode,
      '```',
      ''
    ].join('\n')
  })

  const toggleActiveTab = (event) => {
    const currentTarget = event.target
    if (currentTarget.dataset.value === 'https') {
      isHttpsTab.value = true
    } else {
      isHttpsTab.value = false
    }
  }
</script>

<style scoped>
  .active-tab {
    border-radius: var(--border-radius-sm);
    background: var(--Gray-50, #F9FAFB);
  }
</style>