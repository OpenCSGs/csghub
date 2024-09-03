<template>
  <div class="flex gap-[24px] max-w-[1280px] m-auto min-h-[calc(100vh-153px)] md:min-h-0">
    <div
      v-if="repoType !== 'space'"
      class="w-[30%] min-w-[360px] border-r border-[#EAECF0] pr-6 xl:pl-[20px] mlg:hidden"
    >
      <TagSidebar
        :taskTags="taskTags"
        :frameworkTags="frameworkTags"
        :languageTags="languageTags"
        :licenseTags="licenseTags"
        :selectedTag="props.selectedTag"
        :selectedTagType="props.selectedTagType"
        @resetTags="resetTags"
        :type="repoType"
      />
    </div>
    <div class="pt-[32px] w-full xl:pr-[20px] mlg:px-[20px]">
      <div
        :class="`flex xl:flex-col justify-between ${repoType === 'space' ? 'xl:pl-[20px] mlg:pl-0' : ''}`"
      >
        <h3 class="text-lg font-normal text-[#101828] flex items-center gap-2">
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
          <span class="capitalize">
            {{ $t(`${repoType}s`) }}
            <span class="text-gray-400 text-[16px] italic">
              {{ totalRepos }}
            </span>
          </span>
        </h3>
        <div class="xl:mt-[16px]">
          <el-select
            v-if="onPremise === 'true'"
            v-model="sourceSelection"
            @change="filterChange"
            style="width: 150px"
            class="mr-4 sm:!w-[122px] sm:mr-1"
            size="large"
          >
            <el-option
              v-for="item in sourceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <ElInput
            v-model="nameFilterInput"
            class="!w-[320px] mr-[20px] xl:!w-[260px] sm:!w-[calc(100%-240px)] sm:mr-1"
            size="large"
            :placeholder="$t(`${repoType}s.placeholder`)"
            :prefix-icon="Search"
            @change="filterChange"
          />
          <el-select
            v-model="sortSelection"
            @change="filterChange"
            style="width: 150px"
            class="xl:mr-[20px] sm:!w-[110px] sm:mr-0"
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
        class="grid grid-cols-3 xl:grid-cols-2 md:grid-cols-1 gap-4 mb-4 mt-[16px] xl:pl-[20px] mlg:pl-0"
      >
        <application-space-item
          v-for="repo in reposData"
          :repo="repo"
          :repo-type="repoType"
        />
      </div>
      <div
        v-else
        class="grid grid-cols-2 xl:grid-cols-1 xl:w-full justify-between gap-x-[16px] gap-y-[16px] mb-4 mt-[16px]"
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
  <UpdateUsername />
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
  import UpdateUsername from '../popup/UpdateUsername.vue'

  const props = defineProps({
    selectedTag: String,
    selectedTagType: String,
    repoType: String
  })

  const tagFields = {
    model: [
      'computer_vision',
      'natural_language_processing',
      'audio_processing',
      'multimodal'
    ],
    dataset: [
      'text_processing',
      'graphics',
      'audio',
      'video',
      'multimodal'
    ],
    code: []
  }

  const onPremise = inject('onPremise', 'true')
  const { t } = useI18n()
  const taskTags = ref({})
  const frameworkTags = ref([])
  const languageTags = ref([])
  const licenseTags = ref([])
  const nameFilterInput = ref('')
  const sortSelection = ref('trending')
  const sourceSelection = ref('all')
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

  const resetTags = (task, framework, language, license) => {
    taskTag.value = task
    frameworkTag.value = framework
    languageTag.value = language
    licenseTag.value = license
    reloadRepos(1)
  }

  const filterChange = () => {
    reloadRepos(1)
  }

  const reloadRepos = (childCurrent) => {
    if(childCurrent){
      currentPage.value = childCurrent
    }
    let url = `/${props.repoType}s`
    url = url + `?page=${childCurrent ? childCurrent : currentPage.value}`
    url = url + `&per=${perPage.value}`
    url = url + `&search=${nameFilterInput.value}`
    url = url + `&sort=${sortSelection.value}`
    url = url + `&task_tag=${taskTag.value}`
    url = url + `&framework_tag=${frameworkTag.value}`
    url = url + `&language_tag=${languageTag.value}`
    url = url + `&license_tag=${licenseTag.value}`
    url = url + `&source=${sourceSelection.value === 'all' ? '' : sourceSelection.value}`
    loadRepos(url)
  }

  async function loadRepos(url) {
    const { error, data } = await useFetchApi(url).json()
    if (!data.value) {
      ElMessage({
        message: error.value.msg || t('all.fetchError'),
        type: 'warning'
      })
    } else {
      reposData.value = data.value.data
      totalRepos.value = data.value.total
    }
  }

  async function fetchTags() {
    const { error, data } = await useFetchApi(`/tags`).json()
    if (!data.value) {
      ElMessage({
        message: error.value.msg || t('all.fetchError'),
        type: 'warning'
      })
    } else {
      console.log(data.value.data)

      let tempTaskTags = {}
      const allTaskTags = data.value.data.filter(tag => tag.category === 'task' && tag.scope === props.repoType)
      tagFields[props.repoType].forEach((field) => {
        const fieldTags = allTaskTags.filter(tag => tag.group === field)
        tempTaskTags[field] = fieldTags
      })

      taskTags.value = tempTaskTags
      frameworkTags.value = data.value.data.filter(tag => tag.category === 'framework')
      languageTags.value = data.value.data.filter(tag => tag.category === 'language')
      licenseTags.value = data.value.data.filter(tag => tag.category === 'license')
    }
  }

  onMounted(() => {
    if (props.repoType === 'space') {
      reloadRepos()
    }
    fetchTags()
  })
</script>
