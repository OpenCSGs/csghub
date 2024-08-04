<template>
  <div class="min-h-[300px] py-8 md:px-5">
    <div class="flex items-center justify-between">
      <div class="flex items-center flex-wrap gap-4">
        <BranchDropdown @changeBranch="changeBranch"
                        :current-branch="currentBranch"
                        :branches="branches" />
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <a :href="`/${repoType}s/${namespacePath}/files/${currentBranch}`">
              {{ namespacePath.split('/')[1] }}
            </a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="flex items-center gap-2 my-4">
      <SvgIcon name="commits" />
      {{ t('all.commits') }}
      <div class="flex-1 border-b border-[#DCDFE6]"></div>
    </div>
    <div class="rounded border border-[#EBEEF5] px-4">
      <div v-for="commit in commits"
           :key="commit.id"
           class="py-4 border-b border-[#DCDFE6] last-of-type:border-none text-[#344054]">
        <div class="mb-2 flex items-center">
          <a :href="`/${repoType}s/${namespacePath}/commit/${commit.id}`" class="truncate" :title="commit.message">
            {{ commit.message }}
          </a>
          <el-button-group class="ml-2 min-w-[107px]">
            <el-button plain type="default" size="small" class="!cursor-default hover:!text-[#344054] hover:!border-[#dcdfe6]">
              {{ commit.id.slice(0, 7) }}
            </el-button>
            <el-button type="default" size="small" @click="copyCommitId(commit.id)">
              <SvgIcon name="copy" class="w-3 h-3" />
            </el-button>
          </el-button-group>
        </div>
        <div class="flex items-center text-sm">
          <div class="flex items-center mr-2">
            <el-avatar :icon="UserFilled" :size="24" class="mr-2" />
            <span>{{ commit.committer_name }}</span>
          </div>
          <div class="text-[#606266] text-sm">
            {{ format(beiJingTimeParser(commit.committer_date), locale == 'en' ? 'en_US' : 'zh_CN') }}
          </div>
        </div>
      </div>
    </div>
    <CsgPagination :perPage="perPage"
                   :currentPage="currentPage"
                   @currentChange="loadMoreCommits"
                   :total="totalCommits" />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { format } from 'timeago.js'
  import { UserFilled } from '@element-plus/icons-vue'
  import jwtFetch from '../../packs/jwtFetch'
  import { copyToClipboard } from '../../packs/clipboard'
  import CsgPagination from './CsgPagination.vue'
  import BranchDropdown from './BranchDropdown.vue'
  import { ElMessage } from 'element-plus'

  const { t } = useI18n()
  const commits = ref([])
  const currentPage = ref(1)
  const perPage = ref(10)
  const totalCommits = ref(0)

  const props = defineProps({
    branches: Object,
    currentBranch: String,
    namespacePath: String,
    repoType: String
  })

  const beiJingTimeParser = (utcTimeStr) => {
    utcTime = new Date(utcTimeStr)
    return utcTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  }

  const copyCommitId = (commitId) => {
    copyToClipboard(commitId)
  }

  const changeBranch = (branch) => {
    const params = new URLSearchParams()
    params.append('ref', branch)
    params.append('page', 1)
    fetchCommits(params)
  }

  const fetchCommits = async (params = new URLSearchParams()) => {
    params.append('per', perPage.value)
    const url = `${CSGHUB_SERVER}/api/v1/${props.repoType}s/${props.namespacePath}/commits?${params.toString()}`
    const res = await jwtFetch(url)
    if (!res.ok) {
      ElMessage({message: t('all.fetchError'), type: "warning"})
    } else {
      res.json().then(({ data }) => {
        commits.value = data.commits
        totalCommits.value = data.total
      })
    }
  }

  const loadMoreCommits = (page) => {
    currentPage.value = page
    const params = new URLSearchParams()
    params.append('ref', props.currentBranch)
    params.append('page', currentPage.value)
    fetchCommits(params)
  }

  onMounted(() => {
    fetchCommits()
  })
</script>
