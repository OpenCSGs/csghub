<template>
  <div
    class="flex flex-col gap-[8px] w-[260px] p-[20px] border rounded-[10px] bg-[#F4F4F6]"
  >
    <RouterLink
      to="/new_admin/"
      class="underline"
    >
      {{ $t('admin.dashboard.title') }}
    </RouterLink>

    <RouterLink
      v-if="!onPremise"
      to="/new_admin/email_sending"
      class="underline"
    >
      Email Sending
    </RouterLink>
  </div>
</template>

<script setup>
  import { ref, inject } from 'vue';

  const onPremise = inject('onPremise', ref(true))
</script>
