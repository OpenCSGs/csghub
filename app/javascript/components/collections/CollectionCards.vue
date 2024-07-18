<template>
  <div class="grid grid-cols-2 xl:grid-cols-1 gap-9">
    <div
      v-for="collection in collections"
      :key="collection.id"
      class="p-4 rounded-[12px] border border-[#EAECF0]"
      :style="generateGradientStyle(collection.theme)"
    >
      <div
        class="flex justify-between cursor-pointer"
        @click="goCollectionDetails(collection.id)"
      >
        <div class="text-[14px] leading-[20px] text-[#344054]">{{ collection.name }}</div>
        <SvgIcon name="chevron_right" />
      </div>
      <div class="text-[14px] leading-[20px] font-light text-[#475467] mb-2">
        {{ collection.description }}
      </div>
      <div class="flex flex-col">
        <CollectionCard
          v-for="repo in collection.repositories"
          :reposData="repo"
        ></CollectionCard>
        <div
          v-if="!collection.repositories"
          class="p-4 mlg:w-full border border-gray-200 rounded-xl flex justify-center items-center"
        >
          {{ $t('all.noData') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue'
  import CollectionCard from './CollectionCard.vue'

  const props = defineProps({
    collections: Object
  })

  // 定义一个方法来生成渐变样式
  const generateGradientStyle = (color1) => {
    const gradient = `linear-gradient(180deg, ${color1} 0%, #FFF 20%)`
    return {
      background: gradient
    }
  }

  const goCollectionDetails = (collection_id) => {
    // console.log('跳详情页');
    // location.href = `/collections/${collection_id}`
  }
</script>
