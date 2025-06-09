import { defineStore } from 'pinia'
import { reactive } from 'vue'

const persistKey = 'repo-tab'

export const useRepoTabStore = defineStore('repoTab', () => {
  const repoTab = reactive({
    repoType: '',
    namespace: '',
    repoName: '',
    currentPath: '',
    actionName: '',
    currentBranch: '',
    tab: 'summary',
    lastPath: ''
  })

  function setRepoTab(obj) {
    Object.assign(repoTab, obj)
  }

  const clearStore = () => {
    localStorage.removeItem(persistKey)
  }

  return { repoTab, setRepoTab, clearStore }
})