<template>
  <div class="sm:px-[20px]">
    <div class="flex gap-[8px] mt-[32px] p-[16px] border border-gray-300 rounded-xl shadow-xs">
      <SvgIcon name="spaces"/>
      <div>
        <h3 class="text-gray-600 text-sm font-[500]">
          {{ $t('application_spaces.streamlitGuide.notice') }}
        </h3>
        <p class="text-gray-600 text-sm">
          {{ $t('application_spaces.gradioGuide.noticeDesc') }}
        </p>
      </div>
    </div>
    <h3 class="my-[24px] text-gray-600 font-[500]">
      1. {{ $t('application_spaces.gradioGuide.cloneTitle') }}
    </h3>
    <div>
      <p class="">
        <span class="px-[12px] py-[8px] cursor-pointer"
              :class="isHttpsTab ? 'active-tab' : ''"
              data-value="https"
              ref="httpsTab"
              @click="toggleActiveTab"
        >
              HTTPS
        </span>
        <span class="px-[12px] py-[8px] cursor-pointer"
              data-value="ssh"
              :class="isHttpsTab ? '' : 'active-tab'"
              ref="sshTab"
              @click="toggleActiveTab"
        >
              SSH
        </span>
      </p>
      <div v-if="isHttpsTab">
        <div class="my-[16px] flex items-center gap-[8px]">
          <el-checkbox v-model="useToken" :label="$t('application_spaces.gradioGuide.useToken')" size="large" />
        </div>
        <MarkdownViewer v-if="useToken" :content="httpsCloneCodeWithTokenMarkdown"></MarkdownViewer>
        <MarkdownViewer v-else :content="httpsCloneCodeMarkdown"></MarkdownViewer>
      </div>
      <div v-else class="my-[16px]">
        <MarkdownViewer :content="sshCloneCodeMarkdown"></MarkdownViewer>
      </div>
    </div>
    <h3 class="my-[24px] text-gray-600 font-[500]">
      2. {{ $t('application_spaces.streamlitGuide.createTitle') }}
    </h3>
    <MarkdownViewer :content="appPyCodeMarkdown"></MarkdownViewer>
    <h3 class="my-[24px] text-gray-600 font-[500]">
      3. {{ $t('application_spaces.gradioGuide.submitTitle') }}
    </h3>
    <MarkdownViewer :content="pushCodeMarkdown"></MarkdownViewer>
    <p class="text-gray-500 text-md font-[400] my-[24px]">
      {{ $t('application_spaces.gradioGuide.successNotes') }}
    </p>
    <div class="text-md text-gray-500 border border-gray-300 rounded-md shadow-xs py-[12px] px-[14px] mb-[32px]">
      <div>
        <h3 class="text-gray-900"> {{ $t('application_spaces.gradioGuide.dependencyNotesTitle') }} </h3>
        <p>{{ $t('application_spaces.gradioGuide.dependencyNotes1') }}</p>
        <p>{{ $t('application_spaces.gradioGuide.dependencyNotes2') }}</p>
        <p>{{ $t('application_spaces.streamlitGuide.dependencyNotes3') }}</p>
      </div>
      <br />
      <div>
        <h3 class="text-gray-900"> {{ $t('application_spaces.gradioGuide.docNotesTitle') }} </h3>
        <a href="https://opencsg.com/docs/Space/space_intro" target="_blank">
          {{ $t('application_spaces.streamlitGuide.docNotes1') }}
        </a>
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
    const httpsCloneCode = `  git clone ${props.httpCloneUrl}`
    return getMarkdownCode(httpsCloneCode, 'bash')
  })

  const httpsCloneCodeWithTokenMarkdown = computed(() => {
    const httpsCloneCodeWithToken = `git clone https://${props.userName}:${props.userToken}@${props.httpCloneUrl.replace('https://', '')}`
    return getMarkdownCode(httpsCloneCodeWithToken, 'bash')
  })

  const sshCloneCodeMarkdown = computed(() => {
    const sshCloneCode = `  git clone ${props.sshCloneUrl}`
    return getMarkdownCode(sshCloneCode, 'bash')
  })

  const appPyCode = `import streamlit as st
  
x = st.slider('Select a value')
st.write(x, 'squared is', x * x)`

  const appPyCodeMarkdown = computed(() => {
    return getMarkdownCode(appPyCode, 'python', true)
  })

  const pushCode = `git add app.py
  git commit -m "Add application file"
  git push`

  const pushCodeMarkdown = computed(() => {
    return getMarkdownCode(pushCode, 'bash', true) + 
    '{data-clipboard-text="git add app.py && git commit -m \'Add application file\' && git push"}' 
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