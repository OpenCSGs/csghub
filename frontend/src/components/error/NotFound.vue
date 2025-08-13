<template>
  <div class="h-[calc(100vh-80px)] min-h-[500px] flex items-center justify-center m-auto">
    <div class="relative flex flex-col items-center justify-center text-center p-10">
      <div class="flex flex-col gap-2 items-center text-center mt-[24px] px-4">
        <h1 id="error-code" class="absolute bottom-5 left-1/2 -translate-x-1/2 -z-10 text-[400px] text-gray-100 m-0 leading-none font-semibold">404</h1>
        <h1 id="error-header" class="text-6xl font-medium mt-[-60px] mb-6 text-gray-900">
          {{$t('errors_page.not_found.title')}}
        </h1>
        <p id="error-description" class="text-xl font-light mb-12 text-gray-600">
          {{$t('errors_page.not_found.desc')}}
        </p>
        <div id="error-button" class="flex gap-5">
          <a href="javascript:history.back();" 
             class="btn btn-secondary bg-white hover:bg-gray-50 px-6 py-4 font-medium text-gray-700 border border-gray-300"> 
            {{ $t('errors_page.not_found.back')}}
          </a>
          <a href="/" 
             class="btn btn-primary bg-brand-600 hover:bg-brand-700 px-6 py-4 font-medium text-white">
            {{ $t('errors_page.not_found.home') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>
