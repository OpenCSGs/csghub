<template>
  <a href="/datasets"
     class="flex items-center hover:text-[#0066ff]"
     :class="this.active ? 'text-[#0066ff]' : ''"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="currentColor"
         :class="this.active ? 'text-[#0066ff]' : 'text-white'"
    >
      <path d="M15.75 9C15.75 10.2426 12.7279 11.25 9 11.25C5.27208 11.25 2.25 10.2426 2.25 9M15.75 3.75C15.75 4.99264 12.7279 6 9 6C5.27208 6 2.25 4.99264 2.25 3.75M15.75 3.75C15.75 2.50736 12.7279 1.5 9 1.5C5.27208 1.5 2.25 2.50736 2.25 3.75M15.75 3.75V14.25C15.75 15.4926 12.7279 16.5 9 16.5C5.27208 16.5 2.25 15.4926 2.25 14.25V3.75" stroke="#2F384C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="ml-[8px]"> {{ $t('navbar.datasets') }} </span>
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
    if (window.location.pathname.match(/\/datasets/)) {
      this.active = true
    }
  }
}
</script>