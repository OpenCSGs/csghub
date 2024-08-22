<template>
  <div class="grid grid-cols-2 xl:grid-cols-1 gap-9">
    <div
      v-for="collection in collections"
      class="rounded-[12px]"
      :key="collection.id"
      :style="generateGradientStyle(collection.theme)"
    >
      <div
        class="active:outline active:outline-4 active:outline-[#EAECF0] hover:shadow-md px-4 pt-4 pb-2 w-full rounded-[12px] border border-[#EAECF0] cursor-pointer"
        @click="goCollectionDetails(collection.id)"
      >
        <div class="flex justify-between">
          <div class="text-[14px] leading-[20px] text-[#344054] text-ellipsis overflow-hidden whitespace-nowrap">
            {{ collection.name }}
          </div>
          <SvgIcon name="chevron_right" />
        </div>
        <div
          :title="collection.description"
          class="overflow-hidden text-ellipsis line-clamp-2 text-[14px] leading-[20px] font-light text-[#475467] mb-2"
        >
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
  </div>
</template>
<script setup>
  import { ref } from 'vue'
  import CollectionCard from './CollectionCard.vue'

  const props = defineProps({
    collections: Object
  })

  // Method to generate gradient styles
  const generateGradientStyle = (color1) => {
    const gradient = `linear-gradient(180deg, ${color1} 0%, #FFF 20%)`
    return {
      background: gradient
    }
  }

  const goCollectionDetails = (collection_id) => {
    location.href = `/collections/${collection_id}`
  }
</script>
