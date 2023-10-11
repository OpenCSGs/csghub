<template>
  <a :href="starChainUrl" target="_blank" class="flex items-center hover:text-[#1a8b7b]">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M6 3.75H9M3.75 9V12M14.25 6V9M9 14.25H12M14.25 16.5V16.5C15.4926 16.5 16.5 15.4926 16.5 14.25V14.25C16.5 13.0074 15.4926 12 14.25 12V12C13.0074 12 12 13.0074 12 14.25V14.25C12 15.4926 13.0074 16.5 14.25 16.5ZM3.75 16.5V16.5C4.99264 16.5 6 15.4926 6 14.25V14.25C6 13.0074 4.99264 12 3.75 12V12C2.50736 12 1.5 13.0074 1.5 14.25V14.25C1.5 15.4926 2.50736 16.5 3.75 16.5ZM14.25 6V6C15.4926 6 16.5 4.99264 16.5 3.75V3.75C16.5 2.50736 15.4926 1.5 14.25 1.5V1.5C13.0074 1.5 12 2.50736 12 3.75V3.75C12 4.99264 13.0074 6 14.25 6ZM3.75 6V6C4.99264 6 6 4.99264 6 3.75V3.75C6 2.50736 4.99264 1.5 3.75 1.5V1.5C2.50736 1.5 1.5 2.50736 1.5 3.75V3.75C1.5 4.99264 2.50736 6 3.75 6Z" stroke="#2F384C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <span class="ml-[8px]"> StarChain </span>
  </a>
</template>
<script>
export default {
  props: {
    starChainUrl: String
  }
}
</script>