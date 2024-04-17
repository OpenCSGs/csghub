<template>
  <div class="xl:px-[16px] sm:w-[100%] sm:mt-[36px]">
    <a :href="`/profile/${name}`"
      class="flex items-center w-[150px] mr-[10px] px-[12px] py-[5px] border border-[#DCDFE6] rounded-[4px] text-[14px] leading-[22px] font-medium hover:bg-[#EAECF0] hover:text-[#808080]">
      <svg class="mr-[4px]" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.08366 4.99984H0.916992M0.916992 4.99984L5.00033 9.08317M0.916992 4.99984L5.00033 0.916504"
          stroke="#344054" stroke-width="1.17" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      {{ $t('profile.return') }}
    </a>
    <div class="mt-[32px] font-medium text-xl">{{ $t('profile.myCollect') }}</div>


    <div class="mt-[32px] relative">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('all.files')" name="all">
          <AllRepoLikes v-if="activeName == 'all'" :modelList="modelList" :datasetList="datasetList"
            :spaceList="spaceList" :codeList="codeList" :name="name">
          </AllRepoLikes>
        </el-tab-pane>
        <el-tab-pane :label="$t('organization.model')" name="model">
          <RepoTypeLikes v-if="activeName == 'model'" repoType="model" :repoList="modelList">
          </RepoTypeLikes>
        </el-tab-pane>
        <el-tab-pane :label="$t('organization.dataset')" name="dataset" class="min-h-[300px]">
          <RepoTypeLikes v-if="activeName == 'dataset'" repoType="dataset" :repoList="datasetList">
          </RepoTypeLikes>
        </el-tab-pane>
        <el-tab-pane :label="$t('organization.code')" name="code" class="min-h-[300px]">
          <RepoTypeLikes v-if="activeName == 'code'" repoType="code" :repoList="codeList">
          </RepoTypeLikes>
        </el-tab-pane>
        <el-tab-pane :label="$t('organization.space')" name="space" class="min-h-[300px]">
          <RepoTypeLikes v-if="activeName == 'space'" repoType="space" :repoList="spaceList">
          </RepoTypeLikes>
        </el-tab-pane>
      </el-tabs>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AllRepoLikes from './AllRepoLikes.vue'
import RepoTypeLikes from './RepoTypeLikes.vue'


const props = defineProps({
  modelList: Object,
  datasetList: Object,
  spaceList: Object,
  codeList: Object,
  name: String
})

const activeName = ref("all")

const { t } = useI18n();

const prefixPath = document.location.pathname.split('/')[1] === 'organizations' ? 'organizations' : 'users'


// onMounted(() => {
//   console.log("test");
//   console.log(props.modelList)
// })
</script>
