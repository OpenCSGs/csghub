import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('app', {
  state: () => {
    return {
      isCollapse:false
    };
  },
  getters: {
    // getCollapse: (state) => state.isCollapse,
  },
  actions: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    setCollapse(value) {
      this.isCollapse = value;
    }
  },
  persist: true,
});