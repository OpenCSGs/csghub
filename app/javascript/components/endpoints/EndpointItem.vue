<template>
  <a
    :href="`/endpoints/${endpoint.model_id}/${endpoint.deploy_id}`"
    class="focus:outline focus:outline-4 focus:outline-[#EAECF0] hover:shadow-md border border-gray-200 rounded-xl p-4 w-full"
  >
    <div class="flex justify-between items-center mb-2">
      <div class="w-full flex items-center justify-between">
        <h3 class="flex-1 text-[#303133] font-semibold leading-6 truncate mr-[8px]">
          {{ endpoint.deploy_name }}
        </h3>
        <div class="flex gap-2">
          <span
            class="px-[8px] py-[3px] flex items-center justify-center border rounded-md text-[#344054] text-[12px]"
            >{{ endpoint.private ? $t("all.private") : $t("all.public") }}
          </span>
          <AppStatus :appStatus="endpoint.status" :spaceResource="endpoint.hardware" />
        </div>
      </div>
    </div>
    <div class="text-sm leading-snug text-[#606266] mb-3">
      <div>{{ $t("models.title") }}: {{ endpoint.model_id }}</div>
      <div>{{ $t("endpoints.resourceType") }}: {{ endpoint.hardware?.gpu ? "GPU" : "CPU" }}</div>
    </div>
    <div class="text-sm leading-snug text-[#606266] flex justify-between">
      <div>{{ $t("all.lastTime") }}: {{ endpoint.updated_at.substring(0, 10) }}</div>
      <div>{{ $t("endpoints.replica") }}: {{ endpoint.max_replica }}</div>
    </div>
  </a>
</template>

<script setup>
  import AppStatus from "../application_spaces/AppStatus.vue";

  const props = defineProps({
    endpoint: Object,
    namespace: String
  })
</script>
