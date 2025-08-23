<template>
  <div
    class="flex gap-6 page-responsive-width m-auto min-h-[calc(100vh-153px)] md:min-h-0 md:px-5">
    <div
      v-if="repoType !== 'space'"
      class="w-[30%] min-w-[360px] border-r border-gray-200 pr-6 md:hidden">
      <TagSidebar
        :selectedTag="selectedTag"
        :selectedTagType="selectedTagType"
        @resetTags="resetTags"
        :repoType="repoType" />
    </div>
    <div class="pt-8 w-full">
      <div class="flex flex-wrap justify-between items-center gap-2">
        <div class="flex items-center gap-4 flex-nowrap w-auto">
          <h3 class="text-lg font-normal text-gray-900 flex items-center gap-2">
            <!-- <SvgIcon
              v-if="repoType === 'model'"
              name="models"
              width="18"
              height="18" />
            <SvgIcon
              v-if="repoType === 'dataset'"
              name="datasets"
              width="18"
              height="18" />
            <SvgIcon
              v-if="repoType === 'code'"
              name="codes"
              width="18"
              height="18" />
            <SvgIcon
              v-if="repoType === 'space'"
              name="spaces"
              width="18"
              height="18" /> -->
            <span class="capitalize">
              {{ $t(`${repoType}s.title`) }}
              <span class="text-gray-500 text-md font-light">
                {{ totalRepos }}
              </span>
            </span>
          </h3>
          <ElInput
            v-model="nameFilterInput"
            class="!w-auto min-w-[180px]"
            :placeholder="$t(`${repoType}s.placeholder`)"
            :prefix-icon="Search"
            @change="filterChange"
            size="large" />
        </div>
        <div class="md:w-auto flex flex-wrap gap-2">
          <el-select
            v-if="onPremise === 'true'"
            v-model="sourceSelection"
            @change="filterChange"
            style="width: 150px"
            size="large">
            <el-option
              v-for="item in sourceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
          <el-select
            v-model="sortSelection"
            @change="filterChange"
            style="width: 150px"
            size="large">
            <el-option
              v-for="item in sortOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>

          <el-select
            v-if="repoType === 'space'"
            :placeholder="$t('spaces.sdkPlaceholder')"
            v-model="searchSdk"
            @change="filterChange"
            style="width: 150px"
            size="large">
            <el-option
              v-for="item in sdkList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>

          <el-select
            v-if="repoType === 'model'"
            v-model="filterSelection"
            @change="filterChange"
            style="width: 150px"
            size="large">
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
          <CsgButton
            v-if="repoType === 'space'"
            :name="$t('space.guide')"
            class="btn btn-primary btn-md"
            @click="handleSpaceGuideClick"
          />
          <CsgButton
            v-else-if="repoType === 'mcp'"
            :name="$t('mcps.guide')"
            class="btn btn-primary btn-md"
            @click="handleMcpGuideClick"
          />
        </div>
      </div>
      <div
        v-if="repoType === 'space'"
        class="grid grid-cols-4 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 gap-4 mb-4 mt-4 xl:pl-5 md:pl-0">
        <application-space-item
          v-for="repo in reposData"
          :repo="repo"
          :repo-type="repoType" />
      </div>
      <div
        v-else-if="repoType === 'mcp'"
        class="grid grid-cols-2 xl:grid-cols-1 xl:w-full justify-between gap-x-4 gap-y-4 mb-4 mt-4"
      >
        <McpItem v-for="repo in reposData" :mcp="repo" />
      </div>
      <div v-else-if="repoType === 'model' && loading === false && totalRepos === 0">
        <EmptyModels />
      </div>
      <div
        v-else
        class="grid grid-cols-2 xl:grid-cols-1 xl:w-full justify-between gap-x-4 gap-y-4 mb-4 mt-4">
        <repo-item
          v-for="repo in reposData"
          :repo="repo"
          :repo-type="repoType" />
      </div>
      <CsgPagination
        :perPage="perPage"
        :currentPage="currentPage"
        @currentChange="reloadRepos"
        :total="totalRepos" />
    </div>
  </div>
</template>
<script setup>
  import { onMounted, ref, computed, inject, onUnmounted, nextTick } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { ElInput, ElMessage, ElSelect } from 'element-plus'
  import RepoItem from '../shared/RepoItem.vue'
  import ApplicationSpaceItem from '../application_spaces/ApplicationSpaceItem.vue'
  import TagSidebar from '../tags/TagSidebar.vue'
  import CsgPagination from './CsgPagination.vue'
  import { useI18n } from 'vue-i18n'
  import useFetchApi from '../../packs/useFetchApi'
  import EmptyModels from '../models/EmptyModels.vue'
  import McpItem from '../mcp/McpItem.vue'

  const props = defineProps({
    repoType: String
  })

  const getQueryParams = () => {
    const { searchParams } = new URL(window.location.href)
    return {
      tag: searchParams.get('tag') ?? '',
      tagType: searchParams.get('tag_type') ?? ''
    }
  }

  const { tag, tagType } = getQueryParams()
  const selectedTag = ref(tag.toLowerCase())
  const selectedTagType = ref(tagType.toLowerCase())

  const onPremise = inject('onPremise', 'true')
  const { t } = useI18n()
  const nameFilterInput = ref('')
  const sortSelection = ref('trending')
  const filterSelection = ref('all')
  const sourceSelection = ref('all')
  const currentPage = ref(1)
  const totalRepos = ref(0)
  const searchSdk = ref('')

  const activeTags = ref({})
  const loading = ref(true)
  const windowWidth = ref(window.innerWidth)

  // 监听窗口大小变化
  const updateWindowWidth = () => {
    windowWidth.value = window.innerWidth
  }

  const reposData = ref(Array)
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
      value: 'most_download',
      label: t('all.mostDownload')
    },
    {
      value: 'most_favorite',
      label: t('all.mostFavorite')
    }
  ]
  const sdkList = [{
    value: '',
    label: t('all.all')
  },
  {
    value: 'gradio',
    label: 'Gradio'
  },
  {
    value: 'streamlit',
    label: 'Streamlit'
  },
  {
    value: 'nginx',
    label: 'Nginx'
  },
  {
    value: 'docker',
    label: 'Docker'
  },
  {
    value: 'mcp_server',
    label: 'MCP Server'
  }]

  const filterOptions = [
    {
      value: 'all',
      label: t('models.index.allFilter')
    },
    {
      value: 'inference',
      label: t('models.index.inferenceFilter')
    },
    {
      value: 'finetune',
      label: t('models.index.finetuneFilter')
    },
    {
      value: 'evaluation',
      label: t('models.index.evaluationFilter')
    },
    {
      value: 'serverless',
      label: t('models.index.serverlessFilter')
    }
  ]

  const sourceOptions = [
    {
      value: 'all',
      label: t('repo.source.all')
    },
    {
      value: 'opencsg',
      label: t('repo.source.opencsg')
    },
    {
      value: 'local',
      label: t('repo.source.local')
    }
  ]

  const perPage = computed(() => {
    if (props.repoType === 'space') {
      if (windowWidth.value >= 1536) return 20
      if (windowWidth.value >= 1280) return 12
      if (windowWidth.value >= 768) return 10
      return 6
    } else {
      return 16
    }
  })

  const resetTags = (tags) => {
    activeTags.value = tags
    reloadRepos(1)
  }

  const filterChange = () => {
    reloadRepos(1)
  }

  const handleSpaceGuideClick = () => {
    window.open('https://opencsg.com/docs/space/space_intro', '_blank')
  }

  const handleMcpGuideClick = () => {
    window.open('https://opencsg.com/docs/mcp/mcp_intro', '_blank')
  } 
  
  const reloadRepos = (childCurrent) => {
    if (childCurrent) {
      currentPage.value = childCurrent
    }
    let url = `/${props.repoType}s`
    url = url + `?page=${childCurrent ? childCurrent : currentPage.value}`
    url = url + `&per=${perPage.value}`
    url = url + `&search=${nameFilterInput.value}`
    url = url + `&sort=${sortSelection.value}`
    if(props.repoType === 'space'){
      url+= `&sdk=${searchSdk.value}`;
    }

    if (filterSelection.value === 'inference') {
      url = url + `&tag_category=runtime_framework&tag_group=inference`
    }

    if (filterSelection.value === 'finetune') {
      url = url + `&tag_category=runtime_framework&tag_group=finetune`
    }

    if (filterSelection.value === 'evaluation') {
      url = url + `&tag_category=runtime_framework&tag_group=evaluation`
    }

    if (filterSelection.value === 'serverless') {
      url = url + `&list_serverless=true`
    }

    for (let [category, tags] of Object.entries(activeTags.value)) {
      tags.forEach((tag) => {
        url = url + `&tag_category=${category}&tag_name=${tag.toLowerCase()}`
      })
    }

    url = url + `&source=${sourceSelection.value === 'all' ? '' : sourceSelection.value}`
    loadRepos(url)
  }

  async function loadRepos(url) {
    try {
      const { error, data } = await useFetchApi(url).json()
      if (data.value) {
        if (props.repoType === 'mcp') {
          reposData.value = data.value.data?.data
          totalRepos.value = data.value.data?.total
        } else {
          reposData.value = data.value.data
          if (data.value.total) {
            totalRepos.value = data.value.total
          } else {
            totalRepos.value = 0
          }
        }
      } else {
        ElMessage.warning(error.value.msg || t('all.fetchError'))
      }
    } catch(error) {
      ElMessage.warning(error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    window.addEventListener('resize', updateWindowWidth)
    if (props.repoType === 'space') {
      reloadRepos()
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWindowWidth)
  })
</script>
