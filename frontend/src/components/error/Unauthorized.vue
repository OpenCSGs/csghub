<template>
  <div class="">
    <img src="/images/Background-pattern-decorative.svg" alt="Background Pattern Decorative" class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[-1] w-full max-w-[768px] sm:max-w-[480px]" />

    <div class="h-[calc(100vh-80px)] min-h-[500px] flex items-center justify-center m-auto">
      <div class="flex flex-col items-center relative justify-center text-center p-10">
        <div class="Badge h-14 px-3.5 py-3.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-gray-200 justify-start items-center gap-1.5 inline-flex">
          <div class="flex items-center justify-center w-7 h-7">
            <img src="/images/icons/lock-01.svg" alt="Lock" />
          </div>
        </div>

        <h1 id="error-Header" class="text-6xl font-medium mb-6 text-gray-900">
          {{ $t('errors_page.unauthorized.title') }}
        </h1>

        <p id="error-Description" class="text-xl font-light mb-12 text-gray-600">
          {{ $t('errors_page.unauthorized.desc') }}
        </p>

        <div id="error-button" class="flex gap-5">
          <a href="javascript:history.back();"
             class="btn btn-secondary bg-white px-6 py-4 font-medium text-gray-700 border border-gray-300 hover:bg-gray-50">
            {{ $t('errors_page.not_found.back') }}
          </a>

          <a href="/"
             class="btn btn-primary bg-brand-600 px-6 py-4 font-medium text-white hover:bg-brand-700">
            {{ $t('errors_page.not_found.home') }}
          </a>
        </div>

      </div>
    </div>
  </div>
</template>
