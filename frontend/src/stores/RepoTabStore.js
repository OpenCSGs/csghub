import { defineStore } from 'pinia'
import { reactive } from 'vue'

const persistKey = 'repo-tab'

export const useRepoTabStore = defineStore('repoTab', () => {
  const repoTab = reactive({
    repoType: '',
    namespace: '',
    repoName: '',
    currentPath: '',
    actionName: '', // files, blob, new_file, edit_file, commits, commit, upload_file
    currentBranch: '',
    tab: 'summary', // summary, files, analysis, logs, schema, community, billing, settings
    lastPath: '',
    communityActionName: 'list', // list, new, detail
    discussionId: '',
  })

  function setRepoTab(obj) {
    Object.assign(repoTab, obj)
  }

  const clearStore = () => {
    localStorage.removeItem(persistKey)
  }

  return { repoTab, setRepoTab, clearStore }
})