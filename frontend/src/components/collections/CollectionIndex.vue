<template>
  <div
    class="flex flex-col relative gap-[24px] w-full max-w-[1280px] m-auto min-h-[calc(100vh-275px)] md:min-h-0 px-4"
  >
    <!-- header -->
    <div class="flex w-full justify-between mb-[12px] md:flex-col">
      <div class="flex flex-col">
        <div class="flex gap-2 text-[20px] leading-[30px]">
          <SvgIcon
            name="collections"
            width="18"
            height="18"
          />
          <span> {{ $t('collections.collection') }} </span>
        </div>
        <div class="text-[16px] leading-[24px] text-gray-500">{{ $t('collections.title') }}</div>
      </div>
      <div class="xl:mt-[16px]">
        <ElInput
          v-model="nameFilterInput"
          class="!w-[320px] mr-[20px] xl:!w-[260px] sm:!w-[calc(100%-136px)]"
          size="large"
          :placeholder="$t(`collections.placeholder`)"
          :prefix-icon="Search"
          @change="filterChange"
        />
        <el-select
          v-model="sortSelection"
          @change="filterChange"
          style="width: 150px"
          class="xl:!w-[150px] xl:mr-[20px] sm:!w-[120px] sm:mr-0"
          size="large"
        >
          <el-option
            v-for="item in sortOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div
      class="flex gap-1 max-w-[max-content] px-2 rounded-2xl border border-gray-300 text-[14px] leading-[20px] bg-gray-25 text-brand-900"
    >
      <SvgIcon width="12px" height="12px" name="star" />
      {{ $t('collections.hot') }}
    </div>
    <!-- collections -->
    <CollectionCards
      v-if="collectionData.length > 0"
      :collections="collectionData"
    ></CollectionCards>
    <!-- empty state -->
    <div
      v-else
      class="h-[480px] md:h-auto"
    >
      <div class="w-[480px] absolute left-1/2 -translate-x-1/2 md:hidden">
        <img
          class="w-full"
          src="/images/search_circle_bg.png"
        />
      </div>
      <div class="flex flex-col justify-center items-center relative pt-[220px] md:pt-5">
        <div class="border border-gray-200 rounded-lg p-3 max-w-[max-content] mb-4">
          <SvgIcon name="search" />
        </div>
        <div class="test-[16px] leading-[24px]">{{ $t('collections.noData') }}</div>
        <div
          class="max-w-[300px] text-gray-600 text-[14px] text-center leading-[20px] font-light mb-6"
        >
          {{ $t('collections.noDataDesc') }}
        </div>
        <div class="flex gap-3">
          <div
            class="flex px-4 py-[10px] border border-gray-300 justify-center items-center gap-1 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer"
            @click="resetInput"
          >
            {{ $t('collections.cleanSearch') }}
          </div>
          <a
            href="/collections/new"
            class="flex px-4 py-[10px] text-white border border-brand-600 justify-center items-center gap-[6px] rounded-lg bg-brand-600 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer"
          >
            <SvgIcon name="plus" />
            {{ $t('collections.newCollection.title') }}
          </a>
        </div>
      </div>
    </div>
    <CsgPagination
      :perPage="perPage"
      :currentPage="currentPage"
      @currentChange="fetchCollections"
      :total="totalCollections"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import CsgPagination from '../shared/CsgPagination.vue'
  import CollectionCards from './CollectionCards.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const perPage = ref(10)
  const currentPage = ref(1)
  const totalCollections = ref(0)
  const collectionData = ref([])
  const nameFilterInput = ref('')
  const sortSelection = ref('trending')
  const sortOptions = [
    {
      value: 'trending',
      label: t('all.trending')
    },
    {
      value: 'recently_update',
      label: t('all.recentlyUpdate')
    },
    {
      value: 'most_favorite',
      label: t('all.mostFavorite')
    }
  ]

  const filterChange = () => {
    currentPage.value = 1
    fetchCollections()
  }

  const resetInput = () => {
    nameFilterInput.value = ''
    sortSelection.value = 'trending'
    fetchCollections()
  }

  const fetchCollections = async (childCurrent) => {
    if (childCurrent) {
      currentPage.value = childCurrent
    }
    const params = new URLSearchParams()
    params.append('per', perPage.value)
    params.append('page', currentPage.value)
    params.append('search', nameFilterInput.value)
    params.append('sort', sortSelection.value)
    const url = `/collections?${params.toString()}`
    const { data, error } = await useFetchApi(url).json()
    if (error.value) {
      ElMessage({ message: error.value.msg, type: 'warning' })
    } else {
      const res = data.value
      collectionData.value = res.data || []
      totalCollections.value = res.total
    }
  }
  onMounted(() => {
    fetchCollections()
  })
</script>
