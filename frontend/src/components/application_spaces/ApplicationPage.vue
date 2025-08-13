<template>
  <div class="py-[20px] overflow-scroll">
    <div
      class="gap-1.5 cursor-pointer flex items-center justify-end mb-[16px] px-[16px]">
      <div
        class="btn btn-secondary-gray btn-sm p-[10px]"
        style="padding-left: 8px; padding-right: 8px;"
        @click="dialogVisible = true">
        <SvgIcon
          name="expand"
          width="20"
          hight="20" />
      </div>
    </div>
    <iframe
      :src="endpointWithToken"
      allow="clipboard-write"
      id="application-space-iframe"
      frameborder="0"
      class="w-full h-[100vh]"></iframe>
    <el-dialog
      v-model="dialogVisible"
      :show-close="false"
      fullscreen
      append-to-body>
      <template #header="{ close }">
        <div class="flex items-center justify-end">
          <div
            class="btn btn-secondary-gray btn-sm p-[10px]"
            style="padding-left: 8px; padding-right: 8px;"
            @click="close">
            <SvgIcon
              name="minimize"
              width="20"
              hight="20" />
          </div>
        </div>
      </template>
      <iframe
        :src="endpointWithToken"
        allow="clipboard-write"
        id="application-space-iframe"
        frameborder="0"
        class="w-full h-[100vh]"></iframe>
    </el-dialog>
  </div>
</template>

<script setup>
  import { useCookies } from "vue3-cookies";
  import { onMounted, computed } from "vue";
  const { cookies } = useCookies();

  const props = defineProps({
    appEndpoint: String
  })

  const endpointWithToken = computed(() => {
    const userToken = cookies.get('user_token')
    return `${props.appEndpoint}?jwt=${userToken}`
  })
</script>