<template>
  <div
    class="error_page_bg h-[calc(100vh-80px)] min-h-[500px] flex items-center justify-center m-auto">
    <div class="flex flex-col items-center">
      <div
        class="flex flex-col gap-[24px] items-center text-center mt-[24px] px-[16px] text-gray-700">
        <div
          class="rounded-lg border border-gray-200 bg-white shadow-xs p-[14px]">
          <svg-icon name="alert"></svg-icon>
        </div>
        <p class="font-semibold text-6xl leading-[72px] sm:text-4xl sm:leading-[36px]">
          {{ $t('errors_page.serverError.title', { errorCode }) }}
        </p>
        <p class="text-xl font-[300]">
          {{ errorMessage }}
        </p>

        <!-- action button -->
        <div class="flex gap-[12px] mt-[24px]">
          <a href="/">
            <button
              class="text-lg flex px-[22px] py-[16px] items-center justify-center gap-[8px] rounded-sm border border-gray-400 bg-white shadow-sm">
              {{ $t('errors_page.login_failed.back_to_homepage') }}
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)
  const errorCode = params.get('error_code')
  const errorMessage = params.get('error_message')
</script>
