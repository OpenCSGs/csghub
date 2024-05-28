<template>
  <div class="grid grid-cols-2 md:grid-cols-1 gap-[10px] mt-[20px] md:px-[20px]">
    <div class="flex flex-col gap-[8px] focus:outline focus:outline-4 focus:outline-[#EAECF0] p-4 mlg:w-full border border-gray-200 rounded-xl">
      <p class="text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap">
        专属实例 URL
      </p>
      <p class="w-[390px] lg:w-[370px] mlg:w-full h-[35px] leading-[18px] text-[#909399] text-xs overflow-hidden text-ellipsis line-clamp-2 text-left">
        {{ appEndpoint }}
      </p>
    </div>
    <div class="flex flex-col gap-[8px] focus:outline focus:outline-4 focus:outline-[#EAECF0] p-4 mlg:w-full border border-gray-200 rounded-xl">
      <p class="text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap">
        模型 ID
      </p>
      <p class="w-[390px] lg:w-[370px] mlg:w-full h-[35px] leading-[18px] text-[#909399] text-xs overflow-hidden text-ellipsis line-clamp-2 text-left">
        {{ modelId }}
      </p>
    </div>
    <div class="flex flex-col gap-[8px] focus:outline focus:outline-4 focus:outline-[#EAECF0] p-4 mlg:w-full border border-gray-200 rounded-xl">
      <p class="text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap">
        参数项
      </p>
      <p class="flex items-center gap-[8px] w-[390px] lg:w-[370px] mlg:w-full h-[35px] leading-[18px] text-[#909399] text-xs overflow-hidden text-ellipsis line-clamp-2 text-left">
        <div class="border border-[#DCDFE6] px-3 py-[2px] text-center text-xs text-[#606266] font-medium rounded">
          {{ private ? $t("all.private") :  $t("all.public") }}
        </div>
        <span>当前弹性实例：{{ endpointReplica }}</span>
      </p>
    </div>
    <div class="flex flex-col gap-[8px] focus:outline focus:outline-4 focus:outline-[#EAECF0] p-4 mlg:w-full border border-gray-200 rounded-xl">
      <p class="text-sm text-[#303133] font-medium text-ellipsis overflow-hidden whitespace-nowrap">
        资源
      </p>
      <p class="w-[390px] lg:w-[370px] mlg:w-full h-[35px] leading-[18px] text-[#909399] text-xs overflow-hidden text-ellipsis line-clamp-2 text-left">
        {{ hardware }}
      </p>
    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    appEndpoint: String,
    hardware: String,
    modelId: String,
    private: String,
    endpointReplica: {
      type: Number,
      default: 0
    }
  })
</script>