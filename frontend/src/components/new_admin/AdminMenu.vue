<template>
  <div
    class="flex flex-col gap-[8px] w-[260px] p-[20px] border rounded-[10px] bg-[#F4F4F6]"
  >
    <RouterLink
      to="/admin_panel/"
      class="underline"
    >
      {{ $t('admin.dashboard.title') }}
    </RouterLink>

    <RouterLink
      to="/admin_panel/system_config"
      class="underline"
    >
      System Config
    </RouterLink>

    <RouterLink
      to="/admin_panel/users"
      class="underline"
    >
      Users
    </RouterLink>

    <RouterLink
      v-if="onPremise === 'true'"
      to="/admin_panel/sync"
      class="underline"
    >
      Sync Setting
    </RouterLink>

    <RouterLink
      v-if="onPremise === 'false'"
      to="/admin_panel/email_sending"
      class="underline"
    >
      Email Sending
    </RouterLink>
  </div>
</template>

<script setup>
  import { ref, inject } from 'vue';

  const onPremise = inject('onPremise', ref('true'))
</script>
