<template>
  <div class="flex items-center flex-col gap-6 text-center p-20">
    <img src="/images/empty-models.png" width="613" height="auto" />
    <h1 class="text-[#303030] text-3xl font-medium leading-[38px]">{{ $t('models.emptyModels.title') }}</h1>
    <p class="text-gray-600 text-xl font-light leading-[38px]">{{ $t('models.emptyModels.desc') }}</p>
    <div class="flex gap-3">
      <a href="/models/new">
        <CsgButton :name="$t('models.emptyModels.uploadBtn')" class="btn btn-secondary-gray btn-xl" />
      </a>
      <a href="/admin_panel/sync">
        <CsgButton :name="$t('models.emptyModels.multisyncBtn')" class="btn btn-primary btn-xl" />
      </a>
    </div>
  </div>
</template>

<script setup>
  import CsgButton from '../shared/CsgButton.vue';
</script>