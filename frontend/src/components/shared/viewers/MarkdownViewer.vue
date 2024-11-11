<template>
  <div class="markdown-body overflow-auto" v-html="mdParser.render(markdownContent)"></div>
</template>

<script setup>
  import { computed, onMounted } from 'vue';
  import MarkdownIt from 'markdown-it';
  import markdownItAnchor from 'markdown-it-anchor'
  import parseMD from 'parse-md'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/atom-one-light.css'
  import '@github/clipboard-copy-element'
  import tippy from 'tippy.js'
  import 'tippy.js/dist/tippy.css'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n();
  const props = defineProps({
    content: String,
    setDefaultText: Boolean
  })

  const defaultText = t('all.defaultText')

  const markdownContent = computed(() => {
    try {
      const { _metadata, content } = parseMD(props.content)
      return props.setDefaultText ? (content.trim() || defaultText) : content
    } catch (error) {
      console.error(error)
      return props.content
    }
  })

  const anchorOptions = {
    tabIndex: false,
  }

  const copyIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.7779 5.3335V5.3335C11.9162 5.3335 12.4854 5.3335 12.9395 5.50441C13.6582 5.77492 14.2254 6.34212 14.4959 7.06083C14.6668 7.51495 14.6668 8.08409 14.6668 9.22239V10.4002C14.6668 11.8936 14.6668 12.6404 14.3762 13.2108C14.1205 13.7126 13.7126 14.1205 13.2108 14.3762C12.6404 14.6668 11.8936 14.6668 10.4002 14.6668H9.22239C8.08409 14.6668 7.51495 14.6668 7.06083 14.4959C6.34212 14.2254 5.77492 13.6582 5.50441 12.9395C5.3335 12.4854 5.3335 11.9162 5.3335 10.7779V10.7779M5.60016 10.6668H6.40016C7.89364 10.6668 8.64037 10.6668 9.2108 10.3762C9.71257 10.1205 10.1205 9.71257 10.3762 9.2108C10.6668 8.64037 10.6668 7.89364 10.6668 6.40016V5.60016C10.6668 4.10669 10.6668 3.35995 10.3762 2.78952C10.1205 2.28776 9.71257 1.87981 9.2108 1.62415C8.64037 1.3335 7.89364 1.3335 6.40016 1.3335H5.60016C4.10669 1.3335 3.35995 1.3335 2.78952 1.62415C2.28776 1.87981 1.87981 2.28776 1.62415 2.78952C1.3335 3.35995 1.3335 4.10669 1.3335 5.60016V6.40016C1.3335 7.89364 1.3335 8.64037 1.62415 9.2108C1.87981 9.71257 2.28776 10.1205 2.78952 10.3762C3.35995 10.6668 4.10669 10.6668 5.60016 10.6668Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/></svg>'

  const mdParser = new MarkdownIt({
    html: true,
    highlight: function (str, lang) {
      const escapeHtml = mdParser.utils.escapeHtml

      const copyButtonFragment = `
        <clipboard-copy value="${escapeHtml(str)}"
                        class="copy-button p-1 h-fit hidden group-hover:block hover:bg-gray-100 rounded-sm cursor-pointer"
        >${copyIcon}</clipboard-copy>`

      if (lang && hljs.getLanguage(lang)) {
        try {
          const highlightedCode = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          return `<pre class="group flex space-between w-full !overflow-hidden"><code class="hl-code !leading-6 !overflow-auto w-[calc(100%-24px)]">${highlightedCode}</code>${copyButtonFragment}</pre>`
        } catch (error) {
          console.error(error)
        }
      }

      return `<pre class="group flex space-between w-full !overflow-hidden"><code class="hl-code !leading-6 !overflow-auto w-[calc(100%-24px)]">${escapeHtml(str)}</code> ${copyButtonFragment} </pre>`
    }
  }).use(markdownItAnchor, anchorOptions)

  const initializeCopyButtons = () => {
    document.querySelectorAll('.copy-button').forEach((button) => {
      tippy(button, {
        content: 'Copied!',
        placement: 'left',
        trigger: 'click',
        hideOnClick: false,
        onShow(instance) {
          instance.setProps({ trigger: 'manual' })
          setTimeout(() => {
            instance.hide()
            instance.setProps({ trigger: 'click' })
          }, 2000)
        }
      })
    })
  }

  onMounted(() => {
    initializeCopyButtons()
  })
</script>

<style scoped>
  .markdown-body :deep(img) {
    max-width: 100% !important;
  }

  .markdown-body :deep(li) {
    list-style: disc;
  }
</style>
