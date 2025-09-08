<template>
  <!-- annual and monthly billing  -->
  <h3 class="text-lg flex justify-between gap-2 mt-8">
      <span class="whitespace-nowrap">{{ $t('resourceConsole.yearMonthResources') }}</span>
    <CsgButton
      class="btn btn-primary btn-sm"
      @click="handleBuyClick"
      :name="$t('resourceConsole.buy')"
      :svgName="'plus'"
    />
  </h3>
  <div class="mt-6 mb-4">
    <ResourceTable :resource="computingPowers"/>
    <div class="mt-3 flex justify-center">
      <CsgPagination
        :perPage="defaultTotal"
        :currentPage="computingPowersCurrentPage"
        @currentChange="fetchComputingData"
        :total="totalComputing" />
    </div>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted, computed } from 'vue'
  import ResourceTable from "./ResourceTable.vue"
  import useUserStore from '../../stores/UserStore.js'
  import useFetchApi from "../../packs/useFetchApi"
  import CsgButton from "../shared/CsgButton.vue"
  import { ElMessage } from "element-plus"

  const defaultTotal = 6
  const totalComputing =ref(0)
  const computingPowersCurrentPage = ref(1)
  const computingPowers = ref([])

  const userStore = useUserStore()
  
  const handleBuyClick = () => {
    window.location.href = '/computing'
  }

  const fetchComputingData = async (childCurrent) => {
    if(childCurrent){
      computingPowersCurrentPage.value = childCurrent
    }
    const params = new URLSearchParams()
    params.append("per", defaultTotal)
    params.append("page", computingPowersCurrentPage.value)

    try {
      const { data, error } = await useFetchApi(`/user/${userStore.username}/order/resources?${params}`).json()
      if (error.value) {
        ElMessage({
          message: error.value.msg,
          type: "warning"
        })
      } else {
        computingPowers.value = data.value.data
        totalComputing.value = data.value.total
      }
    } catch (error) {
      console.log(error)
    }
  }

  watch(
    () => userStore.initialized,
    () => {
      fetchComputingData()
    }
  )

  onMounted(() => {
    if (userStore.initialized) {
      fetchComputingData()
    }
  })
</script>