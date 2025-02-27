<template>
  <div
    class="flex gap-[24px] page-responsive-width m-auto min-h-[calc(100vh-153px)] md:min-h-0 md:px-5">
    <div
      v-if="repoType !== 'space'"
      class="w-[30%] min-w-[360px] border-r border-gray-200 pr-6 md:hidden">
      <TagSidebar
        :selectedTag="selectedTag"
        :selectedTagType="selectedTagType"
        @resetTags="resetTags"
        :repoType="repoType" />
    </div>
    <div class="pt-[32px] w-full">
      <div
        :class="`flex ${repoType === 'model' ? 'flex-col' : 'xl:flex-col'} gap-3 justify-between ${
          repoType === 'space' ? 'xl:pl-[20px] md:pl-0' : ''
        }`">
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
            <span class="text-gray-400 text-md italic">
              {{ totalRepos }}
            </span>
          </span>
        </h3>
        <div class="flex flex-wrap gap-2">
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
          <ElInput
            v-model="nameFilterInput"
            class="!w-[320px] xl:!w-full"
            :placeholder="$t(`${repoType}s.placeholder`)"
            :prefix-icon="Search"
            @change="filterChange" />
        </div>
      </div>
      <div
        v-if="repoType === 'space'"
        class="grid grid-cols-3 xl:grid-cols-2 md:grid-cols-1 gap-4 mb-4 mt-[16px] xl:pl-[20px] md:pl-0">
        <application-space-item
          v-for="repo in reposData"
          :repo="repo"
          :repo-type="repoType" />
      </div>
      <div v-else-if="repoType === 'model' && loading === false && totalRepos === 0">
        <EmptyModels />
      </div>
      <div
        v-else
        class="grid grid-cols-2 xl:grid-cols-1 xl:w-full justify-between gap-x-[16px] gap-y-[16px] mb-4 mt-[16px]">
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
  import { onMounted, ref, computed, inject } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { ElInput, ElMessage } from 'element-plus'
  import RepoItem from '../shared/RepoItem.vue'
  import ApplicationSpaceItem from '../application_spaces/ApplicationSpaceItem.vue'
  import TagSidebar from '../tags/TagSidebar.vue'
  import CsgPagination from './CsgPagination.vue'
  import { useI18n } from 'vue-i18n'
  import useFetchApi from '../../packs/useFetchApi'
  import EmptyModels from '../models/EmptyModels.vue'

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

  const activeTags = ref({})
  const loading = ref(true)

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
      return 9
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

  const reloadRepos = (childCurrent) => {
    if (childCurrent) {
      currentPage.value = childCurrent
    }
    let url = `/${props.repoType}s`
    url = url + `?page=${childCurrent ? childCurrent : currentPage.value}`
    url = url + `&per=${perPage.value}`
    url = url + `&search=${nameFilterInput.value}`
    url = url + `&sort=${sortSelection.value}`

    if (filterSelection.value === 'inference') {
      url = url + `&tag_category=runtime_framework&tag_name=vllm`
    }

    if (filterSelection.value === 'finetune') {
      url = url + `&tag_category=runtime_framework&tag_name=llama-factory`
    }

    if (filterSelection.value === 'evaluation') {
      url = url + `&tag_category=runtime_framework&tag_name=opencompass`
    }

    for (let [category, tags] of Object.entries(activeTags.value)) {
      tags.forEach((tag) => {
        url = url + `&tag_category=${category}&tag_name=${tag.toLowerCase()}`
      })
    }

    // url = url + `&task_tag=${taskTag.value}`
    // url = url + `&framework_tag=${frameworkTag.value}`
    // url = url + `&language_tag=${languageTag.value}`
    // url = url + `&license_tag=${licenseTag.value}`
    url = url + `&source=${sourceSelection.value === 'all' ? '' : sourceSelection.value}`
    loadRepos(url)
  }

  async function loadRepos(url) {
    try {
      const { error, data } = await useFetchApi(url).json()
      if (data.value) {
        reposData.value = data.value.data
        totalRepos.value = data.value.total
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
    if (props.repoType === 'space') {
      reloadRepos()
    }
  })
</script>
