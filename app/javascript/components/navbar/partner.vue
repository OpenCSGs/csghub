<template>
  <a href="/partners"
     class="flex items-center hover:text-[#ff9900]"
     :class="this.active ? 'text-[#ff9900]' : ''"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="currentColor"
         :class="this.active ? 'text-[#ff9900]' : 'text-white'"
    >
      <path d="M11.25 7.5C12.9069 7.5 14.25 6.15685 14.25 4.5C14.25 2.84315 12.9069 1.5 11.25 1.5M12.75 16.5H14.85C16.1755 16.5 17.25 15.4255 17.25 14.1V14.1C17.25 12.1118 15.6382 10.5 13.65 10.5H12.75M9 4.5C9 6.15685 7.65685 7.5 6 7.5C4.34315 7.5 3 6.15685 3 4.5C3 2.84315 4.34315 1.5 6 1.5C7.65685 1.5 9 2.84315 9 4.5ZM3.15 16.5H8.85C10.1755 16.5 11.25 15.4255 11.25 14.1V14.1C11.25 12.1118 9.63823 10.5 7.65 10.5H4.35C2.36177 10.5 0.75 12.1118 0.75 14.1V14.1C0.75 15.4255 1.82452 16.5 3.15 16.5Z" stroke="#2F384C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="ml-[8px]">合作伙伴</span>
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
    if (window.location.pathname.match(/\/partners/)) {
      this.active = true
    }
  }
}
</script>