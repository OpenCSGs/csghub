import { defineStore } from 'pinia'

const getPersistKey = (evaluationId) => 
  evaluationId ? `evaluation-detail-store-${evaluationId}` : null

const useEvaluationDetailStore = defineStore('EvaluationDetail', () => {
  const getActiveTabName = (evaluationId) => {
    const key = getPersistKey(evaluationId)
    if (key) {
      const persistedName = localStorage.getItem(key)
      if (persistedName) {
        return persistedName
      }
    }
    return ''
  }

  const setActiveTabName = (name, evaluationId) => {
    if (evaluationId) {
      localStorage.setItem(getPersistKey(evaluationId), name)
    }
  }

  const clearStore = (evaluationId) => {
    const key = getPersistKey(evaluationId)
    if (key) {
      localStorage.removeItem(key)
    }
  }

  return {
    getActiveTabName,
    setActiveTabName,
    clearStore
  }
}, {
  persist: {
    key: (context) => getPersistKey(context.store.$state.evaluationId)
  }
})

export default useEvaluationDetailStore
