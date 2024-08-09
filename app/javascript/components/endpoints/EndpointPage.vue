<template>
  <div class="grid grid-cols-2 md:grid-cols-1 gap-[10px] mt-[20px] md:px-[20px]">
    <div class="flex flex-col gap-[8px] focus:outline focus:outline-4 focus:outline-[#EAECF0] p-4 mlg:w-full border border-gray-200 rounded-xl">
      <p class="text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap">
        {{ $t('endpoints.detail.endpointUrl') }}
      </p>
      <p class="w-[390px] lg:w-[370px] mlg:w-full h-[35px] leading-[18px] text-[#909399] text-xs overflow-hidden text-ellipsis line-clamp-2 text-left">
        {{ appEndpoint }}
      </p>
    </div>
    <div class="flex flex-col gap-[8px] focus:outline focus:outline-4 focus:outline-[#EAECF0] p-4 mlg:w-full border border-gray-200 rounded-xl">
      <p class="text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap">
        {{ $t('endpoints.detail.modelId') }}
      </p>
      <p class="w-[390px] lg:w-[370px] mlg:w-full h-[35px] leading-[18px] text-[#909399] text-xs overflow-hidden text-ellipsis line-clamp-2 text-left">
        {{ modelId }}
      </p>
    </div>
    <div class="flex flex-col gap-[8px] focus:outline focus:outline-4 focus:outline-[#EAECF0] p-4 mlg:w-full border border-gray-200 rounded-xl">
      <p class="text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap">
        {{ $t('endpoints.detail.parameters') }}
      </p>
      <p class="flex items-center gap-[8px] w-[390px] lg:w-[370px] mlg:w-full h-[35px] leading-[18px] text-[#909399] text-xs overflow-hidden text-ellipsis line-clamp-2 text-left">
        <div class="border border-[#DCDFE6] px-3 py-[2px] text-center text-xs text-[#606266] font-medium rounded">
          {{ private ? $t("all.private") :  $t("all.public") }}
        </div>
        <div class="flex gap-[4px]">
          <span>{{ $t('endpoints.detail.currentEndpointReplica')}}</span>
          <span>:</span>
          <span>{{ endpointReplica }}</span>
        </div>
      </p>
    </div>
    <div class="flex flex-col gap-[8px] focus:outline focus:outline-4 focus:outline-[#EAECF0] p-4 mlg:w-full border border-gray-200 rounded-xl">
      <p class="text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap">
        <span>{{ $t('endpoints.detail.cloudResource')}}</span>
      </p>
      <p class="w-[390px] lg:w-[370px] mlg:w-full h-[35px] leading-[18px] text-[#909399] text-xs overflow-hidden text-ellipsis line-clamp-2 text-left">
        {{ hardware }}
      </p>
    </div>

    <div v-if="replicaList?.length" class="flex flex-col gap-[8px] focus:outline focus:outline-4 focus:outline-[#EAECF0] p-4 mlg:w-full border border-gray-200 rounded-xl">
      <p class="text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap">
        {{ $t('endpoints.detail.endpointStatus') }}
      </p>
      <p class="w-[420px] lg:w-[370px] mlg:w-full leading-[18px] text-[#909399] text-xs text-left">
        <p v-for="(replica, index) in replicaList" :key="index">
          <span class="text-[#303133] font-medium mr-2">{{ replica.name }}:</span>
          <span class="text-[#909399] font-medium">{{ replica.status }}</span>
        </p>
      </p>
    </div>
  </div>

  <EndpointPlayground
    v-if="appStatus === 'Running' && !!appEndpoint"
    :appEndpoint="appEndpoint"
    :model-id="modelId"
    :private="private"
  />
</template>

<script setup>
  import EndpointPlayground from './EndpointPlayground.vue'

  const props = defineProps({
    appEndpoint: String,
    appStatus: String,
    hardware: String,
    modelId: String,
    private: String,
    replicaList: Array,
    endpointReplica: {
      type: Number,
      default: 0
    }
  })
</script>