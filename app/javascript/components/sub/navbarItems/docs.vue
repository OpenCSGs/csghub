<template>
  <a :href="url"
     class="flex items-center hover:text-[#00b8e6]"
     :class="this.active ? 'text-[#00b8e6]' : ''"
     target="_blank"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="currentColor"
      :class="this.active ? 'text-[#00b8e6]' : 'text-white'"
    >
      <path d="M12 16.125V15.2C12 14.0799 12 13.5198 12.218 13.092C12.4097 12.7157 12.7157 12.4097 13.092 12.218C13.5198 12 14.0799 12 15.2 12H16.125M5.25 5.25H11.25M5.25 8.25H9.75M5.25 11.25H6.75M11.3787 16.5H9C7.60603 16.5 6.90905 16.5 6.32946 16.3847C3.94931 15.9113 2.08873 14.0507 1.61529 11.6705C1.5 11.0909 1.5 10.394 1.5 9V9C1.5 7.60603 1.5 6.90905 1.61529 6.32946C2.08873 3.94931 3.94931 2.08873 6.32946 1.61529C6.90905 1.5 7.60603 1.5 9 1.5V1.5C10.394 1.5 11.0909 1.5 11.6705 1.61529C14.0507 2.08873 15.9113 3.94931 16.3847 6.32946C16.5 6.90905 16.5 7.60603 16.5 9V11.3787C16.5 12.7369 15.9604 14.0396 15 15V15C14.0396 15.9604 12.7369 16.5 11.3787 16.5Z" stroke="#2F384C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="ml-[8px]"> 文档 </span>
  </a>
</template>
<script>
export default {
  props: {
    url: String
  },

  data() {
    return {
      active: false
    }
  },
  beforeMount() {
    if (window.location.pathname.match(/\/docs/)) {
      this.active = true
    }
  }
}
</script>