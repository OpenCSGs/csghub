<template>
  <div class="w-full sm:mt-[36px] py-9 text-[#101828]">
    <div class="text-[30px] leading-[38px mb-6">
      {{ $t("resourceConsole.title") }}
    </div>
    <!-- finetunes -->
    <h3 class="text-[18px] flex justify-between gap-[8px]">
      <span>{{ $t("finetune.title") }}</span>
      <a href="/finetune/new" class="cursor-pointer mx-[6px] flex gap-1 items-center py-2 px-3 text-[14px] leading-[20px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]">
        <SvgIcon name="plus" />
        {{ $t('resourceConsole.new') }}
      </a>
    </h3>
    <div class="mt-[18px]">
      <div v-if="hasFinetune" class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-8 mt-[16px]">
        <FinetuneItem v-for="finetune in finetunes.data" :repo="finetune" repo-type="finetune" />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-8 mt-[16px]">
        {{ $t("all.noData") }}
      </div>
      <view-more v-if="finetunes.more" target="finetunes" @view-more-targets="viewMoreTargets"></view-more>
      <el-skeleton class="pr-6" v-if="finetunesLoading" :rows="2" animated />
    </div>
    <!-- endpoints -->
    <h3 class="text-[18px] flex justify-between gap-[8px]">
      <span>{{ $t("endpoints.title") }}</span>
      <a  href="/endpoints/new" class="cursor-pointer mx-[6px] flex gap-1 items-center py-2 px-3 text-[14px] leading-[20px] text-[#FFF] bg-[#3250BD] border border-[#3250BD] rounded-[8px]">
        <SvgIcon name="plus" />
        {{ $t('resourceConsole.new') }}
      </a>
    </h3>
    <div class="mt-[18px] w-full">
      <div v-if="hasEndpoints" class="grid grid-cols-2 lg:grid-cols-1 gap-4 mb-8 mt-[16px]">
        <EndpointItem v-for="endpoint in endpoints.data" :endpoint="endpoint" :namespace="name" />
      </div>
      <div v-else class="flex flex-wrap gap-4 mb-8 mt-[16px]">
        {{ $t("all.noData") }}
      </div>
      <view-more
        v-if="endpoints.more"
        target="endpoints"
        @view-more-targets="viewMoreTargets"
      ></view-more>
      <el-skeleton class="pr-6" v-if="endpointsLoading" :rows="2" animated />
    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch, inject } from "vue"
  import useUserStore from '../../stores/UserStore.js'
  import FinetuneItem from "../shared/FinetuneItem.vue"
  import ViewMore from "../shared/ViewMore.vue"
  import EndpointItem from "../endpoints/EndpointItem.vue"
  import useFetchApi from "../../packs/useFetchApi"
  import { ElMessage } from "element-plus"
  const userStore = useUserStore()
  const props = defineProps({
    name: String
  })

  const defaultTotal = 6
  const endpoints = ref([])
  const finetunes = ref([])

  const endpointsLoading = ref(false)
  const finetunesLoading = ref(false)


  const hasEndpoints = computed(() => endpoints.value?.total > 0)
  const hasFinetune = computed(() => finetunes.value?.total > 0)

  const csghubServer = inject("csghubServer")

  const getRepoData = async () =>{
    const promises = [];
    const endpointsUrl = reposUrl("endpoints")
    promises.push(fetchData(endpointsUrl, endpoints, defaultTotal, 'endpoints'));
    const finetunesUrl = reposUrl("finetunes")
    promises.push(fetchData(finetunesUrl, finetunes, defaultTotal));  
    await Promise.all(promises);
  }
  
  const reposUrl = (type) => {
    if (type === "endpoints") {
      return `${csghubServer}/api/v1/user/${userStore.username}/run/model`
    } else if (type === "finetunes") {
      return `${csghubServer}/api/v1/user/${userStore.username}/finetune/instances`
    } else {
      return `${csghubServer}/api/v1/user/${userStore.username}/${type}`
    }
  }

  const viewMoreTargets = (target) => {
    if (target === "endpoints") {
      endpointsLoading.value = true
      fetchMoreEndpoints()
    } else if (target === "finetunes") {
      finetunesLoading.value = true
      fetchMoreFinetunes()
    }
  }

  const fetchMoreEndpoints = async () => {
    const url = reposUrl("endpoints")
    await fetchData(url, endpoints, endpoints.value.total, 'endpoints')
  }

  const fetchMoreFinetunes = async () => {
    const url = reposUrl("finetunes")
    await fetchData(url, finetunes, finetunes.value.total, 'finetunes')
  }

  const fetchData = async (url, targetRef, total, type) => {
    const params = new URLSearchParams()
    params.append("per", total)
    params.append("page", 1)
    if(type=='endpoints'){
      params.append("deploy_type", 1)
    }

    try {
      const { data, error } = await useFetchApi(`${url}?${params}`).json()
      if (error.value) {
        ElMessage({
          message: error.value.msg,
          type: "warning"
        })
      } else {
        targetRef.value = data.value
        if(targetRef.value?.total > 6 && total === 6){
          targetRef.value.more = true
        }else if(total > 6){
          targetRef.value.more = false
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      if (targetRef === finetunes) {
        finetunesLoading.value = false
      } else if (targetRef === endpoints) {
        endpointsLoading.value = false
      }
    }
  }

  watch(() => userStore.username, () => {
    getRepoData()
  })
</script>
