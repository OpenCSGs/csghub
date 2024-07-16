<template>
  <div
    class="flex flex-col gap-[24px] w-full max-w-[1280px] m-auto min-h-[calc(100vh-153px)] md:min-h-0 md:px-4"
  >
    <!-- header -->
    <div class="flex w-full justify-between mb-[12px]">
      <div class="flex flex-col">
        <div class="flex gap-2 text-[20px] leading-[30px]">
          <SvgIcon
            name="collection_icon"
            width="18"
            height="18"
          />
          <span> {{ $t('collections.collection') }} </span>
        </div>
        <div class="text-[16px] leading-[24px] text-[#667085]">{{ $t('collections.title') }}</div>
      </div>
      <!-- <div>搜索条搜索条搜索条</div> -->
    </div>
    <div
      class="flex gap-1 max-w-[max-content] px-2 rounded-[6px] border border-[#D5D9EB] text-[14px] leading-[20px] bg-[#D5D9EB] text-[#363F72]"
    >
      <SvgIcon name="star" />
      {{ $t('collections.hot') }}
    </div>
    <!-- collections -->
    <CollectionCards :collections="collectionData"></CollectionCards>

    <CsgPagination
      :perPage="perPage"
      :currentPage="currentPage"
      @currentChange="fetchCollections"
      :total="totalCollections"
    />
  </div>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue'
  import CsgPagination from '../shared/CsgPagination.vue'
  import CollectionCards from './CollectionCards.vue'
  import jwtFetch from '../../packs/jwtFetch'
  import { ElMessage } from 'element-plus'

  const perPage = ref(10)
  const currentPage = ref(1)
  const totalCollections = ref(0)
  const collectionData = ref([
    {
      description: 'codeLlama finetune by OpenCSG',
      id: 0,
      name: 'opencsg-codeLlama',
      nickname: 'string',
      private: true,
      repositories: [
        {
          created_at: 'created_at',
          description: 'description',
          download_count: 0,
          id: 0,
          likes: 0,
          name: 'name',
          nickname: 'nickname',
          path: 'xxxxx/asdvg',
          private: true,
          repository_type: 'space',
          tags: [
            {
              commit: {
                id: 'string'
              },
              message: 'string',
              name: 'string'
            }
          ],
          updated_at: 'updated_at',
          user_id: 0
        },
        {
          created_at: 'created_at',
          description: 'description',
          download_count: 0,
          id: 1,
          likes: 0,
          name: 'name',
          nickname: 'nickname',
          path: 'xxxxx/asdvg',
          private: true,
          repository_type: 'model',
          tags: [
            {
              commit: {
                id: 'string'
              },
              message: 'string',
              name: 'string'
            }
          ],
          updated_at: 'updated_at',
          user_id: 0
        }
      ],
      theme: '#ECFDF3',
      username: 'string'
    },
    {
      description: 'codeLlama finetune by OpenCSG2',
      id: 1,
      name: 'opencsg-codeLlama2',
      nickname: 'string',
      private: true,
      repositories: [
        {
          created_at: 'created_at',
          description: 'description',
          download_count: 0,
          id: 0,
          likes: 0,
          name: 'name',
          nickname: 'nickname',
          path: 'xxxxx/asdvg',
          private: true,
          repository_type: 'model',
          tags: [
            {
              commit: {
                id: 'string'
              },
              message: 'string',
              name: 'string'
            }
          ],
          updated_at: 'updated_at',
          user_id: 0
        }
      ],
      theme: '#EAECF0',
      username: 'string'
    }
  ])

  const csghubServer = inject('csghubServer')

  const fetchCollections = async (childCurrent) => {
    if (childCurrent) {
      currentPage.value = childCurrent
    }
    const params = new URLSearchParams()
    params.append('per', perPage.value)
    params.append('page', currentPage.value)
    const url = `${csghubServer}/api/v1/collections?${params.toString()}`
    const res = await jwtFetch(url)
    if (!res.ok) {
      const { msg } = await res.json()
      ElMessage({ message: msg, type: 'warning' })
    } else {
      const { data } = await res.json()
      billings.value = data.data
      totalBillings.value = data.total
      totalPrice.value = data.total_value
    }
  }
  onMounted(() => {
    // 等api ready 后解除注释
    // fetchCollections()
  })
</script>
