<template>
  <div
    class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]"
  >
    <!-- 暂停 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t("endpoints.settings.stopEndpoint") }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <div class="flex flex-col gap-[6px]">
          <el-button @click="stopEndpoint" class="w-[100px]" :disabled="!initialized || isStopped">
            {{ $t("endpoints.settings.stop") }}
          </el-button>
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 重启 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t("endpoints.settings.restartEndpoint") }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-button @click="restartEndpoint" class="w-[100px]" :disabled="notInitialized">
          {{ $t("endpoints.settings.restart") }}
        </el-button>
      </div>
    </div>

    <el-divider />

    <!-- 删除 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t("endpoints.settings.deleteEndpoint") }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t("endpoints.settings.delTips") }}
          <span class="text-black font-medium">{{ $t("all.canNot") }}</span>
          {{ $t("endpoints.settings.delTips2") }}
          <span class="text-black font-medium break-words">{{ endpointName }}</span>
          {{ $t("endpoints.settings.delTips3") }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t("all.enterPls") }}
          <span class="text-black font-medium break-words">
            {{ `${endpointName}/${endpointId}` }}
          </span>
          {{ $t("all.sureDel") }}
        </div>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p class="text-[#344054] text-[14px]">{{ $t("endpoints.settings.namespaceName") }}</p>
        <el-input v-model="delDesc" clearable size="large" class="!w-[512px] sm:!w-full" />
        <div class="flex">
          <div
            id="confirmDelete"
            @click="clickDelete"
            class="text-[#98A2B3] py-[8px] px-[12px] text-[14px] leading-[20px] rounded-[8px]"
            :class="
              delDesc === `${endpointName}/${endpointId}`
                ? 'bg-[#D92D20] text-[#FFFFFF] cursor-pointer active:shadow-box active:space-y-0 active:space-x-0 active:ring-4 active:ring-red-400 active:ring-opacity-25 active:bg-[#D92D20] hover:text-white'
                : 'bg-[#F2F4F7]'
            "
            @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave"
          >
            {{ $t("endpoints.settings.confirmDel") }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, inject } from "vue"
  import { ElMessage } from "element-plus"
  import refreshJWT from "../../packs/refreshJWT.js"
  import jwtFetch from "../../packs/jwtFetch"
  import csrfFetch from "../../packs/csrfFetch"
  import { useI18n } from "vue-i18n"

  const props = defineProps({
    endpointId: Number,
    endpointName: String,
    appStatus: String,
    modelId: String,
    userName: String
  })

  const { t } = useI18n()
  const csghubServer = inject("csghubServer")
  const delDesc = ref("")

  const initialized = computed(() => {
    return [
      "Building",
      "Deploying",
      "Startup",
      "Running",
      "Stopped",
      "Sleeping",
      "BuildingFailed",
      "DeployFailed",
      "RuntimeError"
    ].includes(props.appStatus)
  })

  const notInitialized = computed(() => {
    return ["NoAppFile"].includes(props.appStatus)
  })

  const isStopped = computed(() => {
    return ["Stopped"].includes(props.appStatus)
  })

  const stopEndpoint = async () => {
    stopUrl = `${csghubServer}/api/v1/models/${props.modelId}/run/${props.endpointId}/stop`
    const response = await jwtFetch(stopUrl, { method: "PUT" })

    if (response.ok) {
      ElMessage({ message: t("endpoints.settings.toggleStatusSuccess"), type: "success" })
    } else {
      if (response.status === 401) {
        refreshJWT()
      } else {
        response.json().then((data) => {
          ElMessage({
            message: data.msg,
            type: "warning"
          })
        })
      }
    }
  }

  const deleteEndpoint = async () => {
    const endpointDeleteEndpoint = `/internal_api/endpoints/${props.userName}/${props.endpointName}/${props.endpointId}`
    const option = { method: "DELETE" }
    const response = await csrfFetch(endpointDeleteEndpoint, option)

    if (!response.ok) {
      return response.json().then((data) => {
        throw new Error(data.message)
      })
    } else {
      ElMessage({ message: t("all.delSuccess"), type: "success" })
      setTimeout(() => {
        window.location.href = `/profile/${props.userName}`
      }, 500)
      return response.json()
    }
  }

  const restartEndpoint = async () => {
    startUrl = `${csghubServer}/api/v1/models/${props.modelId}/run/${props.endpointId}/start`
    const response = await jwtFetch(startUrl, { method: "PUT" })

    if (response.ok) {
      ElMessage({ message: t("endpoints.settings.toggleStatusSuccess"), type: "success" })
    } else {
      if (response.status === 401) {
        refreshJWT()
      } else {
        response.json().then((data) => {
          ElMessage({
            message: data.msg,
            type: "warning"
          })
        })
      }
    }
  }

  const handleMouseOver = () => {
    if (delDesc.value !== "") {
      document.getElementById("confirmDelete").classList.replace("bg-[#D92D20]", "bg-[#B42318]")
    }
  }

  const handleMouseLeave = () => {
    document.getElementById("confirmDelete").classList.replace("bg-[#B42318]", "bg-[#D92D20]")
  }

  const clickDelete = () => {
    if (delDesc.value === `${props.endpointName}/${props.endpointId}`) {
      deleteEndpoint().catch((err) => {
        ElMessage({
          message: err.message,
          type: "warning"
        })
      })
    }
  }
</script>
