<template>
  <div
    class="flex gap-6 page-responsive-width m-auto min-h-[calc(100vh-153px)] md:min-h-0 md:px-5"
  >
    <div class="w-full pt-6 pb-10">
      <section class="w-full flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div
            class="text-gray-900 text-lg font-medium flex items-center gap-2"
          >
            <SvgIcon name="space_mcp" />
            {{ $t('mcps.mcpTool') }}
          </div>
          <div
            class="text-gray-700 text-xs rounded-2xl border border-gray-200 px-2 py-0.5"
          >
            {{ tools.total }} {{ $t('mcps.tools.tool') }}
          </div>
        </div>
        <div>
          <el-input
            v-model="search"
            :placeholder="$t('mcps.tools.searchTools')"
            size="large"
            :prefix-icon="Search"
            @change="searchTools"
          />
        </div>
      </section>

      <section>
        <div class="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-4">
          <McpToolItem
            v-for="tool in tools.data || []"
            :key="tool.id"
            :tool="tool"
          />
        </div>

        <CsgPagination
          :perPage="perPage"
          :currentPage="currentPage"
          @currentChange="reloadTools"
          :total="tools.total"
        />
      </section>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import McpToolItem from './McpToolItem.vue'
  import useFetchApi from '@/packs/useFetchApi'
  import CsgPagination from '@/components/shared/CsgPagination.vue'

  const tools = ref({})
  const search = ref('')
  const perPage = ref(12)
  const currentPage = ref(1)

  const searchTools = () => {
    currentPage.value = 1
    fetchTools()
  }

  const reloadTools = (page) => {
    currentPage.value = page
    fetchTools()
  }

  const fetchTools = async () => {
    const url = `/mcps/tools?search=${search.value}&page=${currentPage.value}&per=${perPage.value}`
    const { data } = await useFetchApi(url).json()
    tools.value = data.value.data
  }

  onMounted(() => {
    fetchTools()
  })
</script>
