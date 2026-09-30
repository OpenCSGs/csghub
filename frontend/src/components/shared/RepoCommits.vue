<template>
  <div class="min-h-[300px] py-8 md:px-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center flex-wrap gap-4">
        <BranchDropdown @changeBranch="changeBranch"
                        :current-branch="currentBranch" />
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <a @click.prevent="goToFiles">
              {{ namespacePath.split('/')[1] }}
            </a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <!-- Commits Header & Search Bar -->
    <div class="flex items-center justify-between gap-4 my-4 flex-wrap">
      <div class="flex items-center gap-2">
        <SvgIcon name="commits" />
        <span class="font-medium text-gray-900">{{ t('all.commits') }}</span>
        <span
          v-if="totalCommits"
          class="ml-1 text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium"
          data-testid="total-commits-badge"
        >
          {{ totalCommits }}
        </span>
      </div>
      <div class="w-full sm:w-auto max-w-sm">
        <el-input
          v-model="searchQuery"
          clearable
          :prefix-icon="Search"
          :placeholder="t('all.filterCommits')"
          data-testid="commit-search-input"
          class="w-full"
        />
      </div>
    </div>

    <!-- Active Query Indicator -->
    <div
      v-if="searchQuery.trim()"
      class="flex items-center justify-between text-xs text-gray-500 mb-3 px-1"
      data-testid="matching-indicator"
    >
      <span>
        {{ filteredCommits.length }} {{ t('all.matchingCommits') }} "{{ searchQuery }}"
      </span>
      <button
        type="button"
        @click="searchQuery = ''"
        class="text-brand-600 hover:text-brand-700 hover:underline cursor-pointer"
        data-testid="clear-search-btn"
      >
        {{ t('all.clearSearch') }}
      </button>
    </div>

    <!-- Commits List Container -->
    <div class="rounded border border-gray-200 px-4">
      <div v-for="commit in filteredCommits"
           :key="commit.id"
           data-testid="commit-item"
           class="py-4 border-b border-gray-200 last-of-type:border-none text-gray-700">
        <div class="mb-2 flex items-center justify-between">
          <a @click.prevent="goToCommitDetail(commit.id)" class="truncate cursor-pointer hover:underline font-medium text-gray-900" :title="commit.message">
            {{ commit.message }}
          </a>
          <el-button-group class="ml-2 min-w-[107px] flex-shrink-0">
            <el-tooltip :content="commit.id" placement="top">
              <el-button plain type="default" size="small" class="!cursor-default hover:!text-gray-700 hover:!border-gray-200 font-mono">
                {{ commit.id.slice(0, 7) }}
              </el-button>
            </el-tooltip>
            <el-tooltip :content="t('all.copyCommitId')" placement="top">
              <el-button type="default" size="small" @click="copyCommitId(commit.id)" data-testid="copy-commit-btn">
                <SvgIcon name="copy" class="w-3 h-3" />
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
        <div class="flex items-center text-sm text-gray-500">
          <div class="flex items-center mr-3">
            <el-avatar :icon="UserFilled" :size="20" class="mr-1.5" />
            <span class="text-gray-700 font-medium">{{ commit.author_name }}</span>
          </div>
          <div>
            {{ format(beiJingTimeParser(commit.committer_date), locale == 'en' ? 'en_US' : 'zh_CN') }}
          </div>
        </div>
      </div>

      <!-- Empty State when filtering yields 0 commits -->
      <div
        v-if="!loading && filteredCommits.length === 0"
        class="py-12 text-center text-gray-500"
        data-testid="no-matching-commits"
      >
        <SvgIcon name="commits" class="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p class="text-sm">
          {{ searchQuery.trim() ? `${t('all.noMatchingCommits')} "${searchQuery}"` : t('all.noData') }}
        </p>
        <el-button
          v-if="searchQuery.trim()"
          size="small"
          class="mt-3"
          @click="searchQuery = ''"
          data-testid="empty-state-clear-btn"
        >
          {{ t('all.clearSearch') }}
        </el-button>
      </div>
    </div>

    <CsgPagination
      v-if="!searchQuery.trim() && totalCommits > 0"
      :perPage="perPage"
      :currentPage="currentPage"
      @currentChange="loadMoreCommits"
      :total="totalCommits"
    />
    
    <el-skeleton v-if="loading" class="mt-4" :rows="5" animated />
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { format } from 'timeago.js'
  import { UserFilled, Search } from '@element-plus/icons-vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { copyToClipboard } from '../../packs/clipboard'
  import CsgPagination from './CsgPagination.vue'
  import BranchDropdown from './BranchDropdown.vue'
  import { ElMessage } from 'element-plus'
  import { beiJingTimeParser } from '../../packs/utils'
  import { useRepoTabStore } from '../../stores/RepoTabStore'

  const { t, locale } = useI18n()
  const router = useRouter()
  const route = useRoute()
  const commits = ref([])
  const searchQuery = ref('')
  const currentPage = ref(1)
  const perPage = ref(10)
  const totalCommits = ref(0)
  const { repoTab, setRepoTab } = useRepoTabStore()
  const loading = ref(true)

  const props = defineProps({
    currentBranch: String,
    namespacePath: String,
    repoType: String
  })

  const currentBranch = ref(props.currentBranch)
  let prefixPath = typeof document !== 'undefined' ? document.location.pathname.split('/')[1] : ''

  if (prefixPath === 'mcp') {
    prefixPath = 'mcp/servers'
  }

  const filteredCommits = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) {
      return commits.value || []
    }
    return (commits.value || []).filter((commit) => {
      const message = (commit.message || '').toLowerCase()
      const author = (commit.author_name || '').toLowerCase()
      const sha = (commit.id || '').toLowerCase()
      return message.includes(query) || author.includes(query) || sha.includes(query)
    })
  })

  const copyCommitId = (commitId) => {
    copyToClipboard(commitId)
  }

  const goToFiles = () => {
    const query = {
      tab: 'files',
      actionName: 'files'
    }
    
    if (currentBranch.value) {
      query.branch = currentBranch.value
    }
    
    setRepoTab({
      actionName: 'files',
      lastPath: ''
    })
    
    if (router) {
      router.push({
        path: router.currentRoute?.value?.path || '',
        query
      })
    }
  }

  const goToCommitDetail = (commitId) => {
    const query = {
      tab: 'files',
      actionName: 'commit',
      path: commitId
    }
    
    if (currentBranch.value) {
      query.branch = currentBranch.value
    }
    
    setRepoTab({
      actionName: 'commit',
      lastPath: commitId
    })
    
    if (router) {
      router.push({
        path: router.currentRoute?.value?.path || '',
        query
      })
    }
  }

  const changeBranch = (branch) => {
    currentBranch.value = branch
    
    const query = {
      tab: 'files',
      actionName: 'commits',
      branch: branch
    }
    
    setRepoTab({
      currentBranch: branch
    })
    
    if (router) {
      router.push({
        path: router.currentRoute?.value?.path || '',
        query
      })
    }
    
    const params = new URLSearchParams()
    params.append('ref', branch)
    params.append('page', 1)
    fetchCommits(params)
  }

  const fetchCommits = async (params = new URLSearchParams()) => {
    params.append('per', perPage.value)
    const url = `/${props.repoType}s/${props.namespacePath}/commits?${params.toString()}`
    loading.value = true
    const { data, error } = await useFetchApi(url).json()
    loading.value = false
    if (error.value) {
      ElMessage({message: error.value, type: "warning"})
    } else {
      const body = data.value
      commits.value = body?.data?.commits || []
      totalCommits.value = body?.data?.total || 0
    }
  }

  const loadMoreCommits = (page) => {
    currentPage.value = page
    const params = new URLSearchParams()
    params.append('ref', currentBranch.value)
    params.append('page', currentPage.value)
    fetchCommits(params)
  }

  onMounted(() => {
    fetchCommits()
  })

  defineExpose({
    commits,
    filteredCommits,
    searchQuery,
    totalCommits,
    loading,
    copyCommitId,
    currentPage,
    perPage,
    goToFiles,
    goToCommitDetail,
    changeBranch,
    fetchCommits,
    loadMoreCommits
  })
</script>
