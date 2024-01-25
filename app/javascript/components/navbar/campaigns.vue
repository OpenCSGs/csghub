<template>
  <a href="/campaigns"
     class="flex items-center hover:text-[#DC143C]"
     :class="this.active ? 'text-[#DC143C]' : ''"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="currentColor"
      :class="this.active ? 'text-[#DC143C]' : 'text-white'"
    >
      <path d="M3 10.5C3 13.9091 5.625 16.5 9 16.5C12.375 16.5 15 13.9091 15 10.5C15 4.36364 9 1.5 9 1.5C9 4.5 9.75 9 7.5 9C6 9 5.625 7.5 5.625 4.875C5.625 4.875 3 7.09091 3 10.5Z" stroke="#2F384C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="ml-[8px]"> 社区活动 </span>
  </a>
</template>
<script>
export default {
  data() {
    return {
      active: false
    }
  },
  beforeMount() {
    if (window.location.pathname.match(/\/campaigns/)) {
      this.active = true
    }
  }
}
</script>