<template>
  <div class="flex gap-[24px] max-w-[1280px] m-auto min-h-[calc(100vh-153px)] md:min-h-0">
    <div
      v-if="repoType !== 'space'"
      class="w-[30%] min-w-[360px] border-r border-[#DCDFE6] pr-6 xl:pl-[20px] mlg:hidden"
    >
      <TagSidebar
        :taskTags="props.taskTags"
        :frameworkTags="props.frameworkTags"
        :languageTags="props.languageTags"
        :licenseTags="props.licenseTags"
        :selectedTag="props.selectedTag"
        :selectedTagType="props.selectedTagType"
        @resetTags="resetTags"
        :type="repoType"
      />
    </div>
    <div class="pr-[20px] pt-[32px] mlg:px-[20px] w-full">
      <div
        :class="`flex xl:flex-col justify-between ${repoType === 'space' ? 'xl:pl-4 md:pl-0' : ''}`"
      >
        <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
          <SvgIcon
            v-if="repoType === 'model'"
            name="models"
            width="18"
            height="18"
          />
          <SvgIcon
            v-if="repoType === 'dataset'"
            name="datasets"
            width="18"
            height="18"
          />
          <SvgIcon
            v-if="repoType === 'code'"
            name="codes"
            width="18"
            height="18"
          />
          <SvgIcon
            v-if="repoType === 'space'"
            name="spaces"
            width="18"
            height="18"
          />
          <span>
            {{ $t(`${repoType}s.title`) }}
            <span class="text-gray-400 text-[16px] italic">
              {{ totalRepos }}
            </span>
          </span>
        </h3>
        <div class="xl:mt-[16px]">
          <ElInput
            v-model="nameFilterInput"
            class="!w-[320px] mr-[16px] xl:!w-[260px] sm:!w-[calc(100%-136px)]"
            size="large"
            :placeholder="$t(`${repoType}s.placeholder`)"
            :prefix-icon="Search"
            @change="filterChange"
          />
          <el-select
            v-model="sortSelection"
            @change="filterChange"
            style="width: 200px"
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
        v-if="repoType === 'space'"
        class="w-full xl:flex-col xl:pl-4 md:pl-0 flex flex-wrap gap-4 mb-4 mt-[16px]"
      >
        <application-space-item
          v-for="repo in reposData"
          :repo="repo"
          :repo-type="repoType"
          width="409"
        />
      </div>
      <div
        v-else
        class="w-[896px] xl:flex-col xl:w-full flex flex-wrap justify-between gap-y-4 mb-4 mt-[16px]"
      >
        <repo-item
          v-for="repo in reposData"
          :repo="repo"
          :repo-type="repoType"
        />
      </div>
      <CsgPagination
        :perPage="perPage"
        :currentPage="currentPage"
        @currentChange="reloadRepos"
        :total="totalRepos"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { ElInput, ElMessage } from 'element-plus'
  import RepoItem from '../shared/RepoItem.vue'
  import ApplicationSpaceItem from '../application_spaces/ApplicationSpaceItem.vue'
  import TagSidebar from '../tags/TagSidebar.vue'
  import CsgPagination from './CsgPagination.vue'
  import { useI18n } from 'vue-i18n'
  import trackPageEvent from '../../packs/trackPageEvent'
  import { inject } from 'vue'
  import jwtFetch from '../../packs/jwtFetch'

  const props = defineProps({
    taskTags: String,
    frameworkTags: String,
    languageTags: String,
    licenseTags: String,
    selectedTag: String,
    selectedTagType: String,
    repoType: String
  })

  const csghubServer = inject('csghubServer')
  const { t } = useI18n()
  const nameFilterInput = ref('')
  const sortSelection = ref('trending')
  const currentPage = ref(1)
  const totalRepos = ref(0)
  const taskTag = ref('')
  const frameworkTag = ref('')
  const languageTag = ref('')
  const licenseTag = ref('')
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

  const perPage = computed(() => {
    if (props.repoType === 'space') {
      return 9
    } else {
      return 16
    }
  })

  const resetTags = (task, framework, language, license) => {
    taskTag.value = task
    frameworkTag.value = framework
    languageTag.value = language
    licenseTag.value = license
    reloadRepos()
  }

  const filterChange = () => {
    reloadRepos()
  }

  const reloadRepos = (childCurrent) => {
    let url = `${csghubServer}/api/v1/${props.repoType}s`
    url = url + `?page=${childCurrent ? childCurrent : currentPage.value}`
    url = url + `&per=${perPage.value}`
    url = url + `&search=${nameFilterInput.value}`
    url = url + `&sort=${sortSelection.value}`
    url = url + `&task_tag=${taskTag.value}`
    url = url + `&framework_tag=${frameworkTag.value}`
    url = url + `&language_tag=${languageTag.value}`
    url = url + `&license_tag=${licenseTag.value}`
    loadRepos(url)
    if (childCurrent) {
      addEvent(`page_${props.repoType}`, 'PageClick')
    } else if (
      nameFilterInput.value ||
      taskTag.value ||
      frameworkTag.value ||
      languageTag.value ||
      licenseTag.value
    ) {
      addEvent(`filter_${props.repoType}`, 'Filter')
    }
  }

  function addEvent(id, m) {
    if (['model', 'dataset', 'code', 'space'].includes(props.repoType)) {
      trackPageEvent({ id: id, m: m })
    }
  }

  async function loadRepos(url) {
    const response = await jwtFetch(url)
    if (!response.ok) {
      ElMessage({
        message: '加载模型数据报错',
        type: 'warning'
      })
    } else {
      response.json().then((res_json) => {
        reposData.value = res_json.data
        totalRepos.value = res_json.total
      })
    }
  }

  onMounted(() => {
    reloadRepos()
  })
</script>
