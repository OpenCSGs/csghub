<template>
  <a href="/codes"
     class="flex items-center hover:text-[#4E5BA6]"
     :class="this.active ? 'text-[#4E5BA6]' : ''"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="currentColor"
         :class="this.active ? 'text-[#4E5BA6]' : 'text-white'">
      <path d="M7.5 6L4.5 9L7.5 12M10.5 6L13.5 9L10.5 12M9 16.5V16.5C11.3297 16.5 12.4946 16.5 13.4134 16.1194C14.6386 15.6119 15.6119 14.6386 16.1194 13.4134C16.5 12.4946 16.5 11.3297 16.5 9V9C16.5 6.67029 16.5 5.50544 16.1194 4.58658C15.6119 3.36144 14.6386 2.38807 13.4134 1.8806C12.4946 1.5 11.3297 1.5 9 1.5V1.5C6.67029 1.5 5.50544 1.5 4.58658 1.8806C3.36144 2.38807 2.38807 3.36144 1.8806 4.58658C1.5 5.50544 1.5 6.67029 1.5 9V9C1.5 11.3297 1.5 12.4946 1.8806 13.4134C2.38807 14.6386 3.36144 15.6119 4.58658 16.1194C5.50544 16.5 6.67029 16.5 9 16.5Z" stroke="#2F384C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span class="ml-[8px]"> {{ $t('navbar.codes') }} </span>
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
    if (window.location.pathname.match(/\/codes/)) {
      this.active = true
    }
  }
}
</script>