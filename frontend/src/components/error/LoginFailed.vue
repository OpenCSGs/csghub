<template>
  <div class="error_page_bg h-[calc(100vh-80px)] min-h-[500px] flex items-center justify-center m-auto">
    <div class="flex flex-col items-center">
      <div class="flex flex-col gap-[24px] items-center text-center mt-[24px] px-[16px] text-gray-700">
        <div class="rounded-lg border border-gray-200 bg-white shadow-xs p-[14px]">
          <svg-icon name="login_failed"></svg-icon>
        </div>
        <p class="font-semibold text-6xl leading-[72px]">{{ $t('errors_page.login_failed.title') }}</p>
        <p class="text-xl font-[300]">{{ $t('errors_page.login_failed.default_msg') }}</p>
        <div class="flex gap-[12px] mt-[24px]">
          <a href="/">
            <button class="text-lg flex px-[22px] py-[16px] items-center justify-center gap-[8px] rounded-sm border border-gray-400 bg-white shadow-sm">
              {{ $t('errors_page.login_failed.back_to_homepage') }}
            </button>
          </a>
          <a href="/login">
            <button class="text-lg text-white flex px-[22px] py-[16px] items-center justify-center gap-[8px] rounded-sm border border-gray-400 bg-brand-600 shadow-sm">
              {{ $t('errors_page.login_failed.relogin') }}
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>