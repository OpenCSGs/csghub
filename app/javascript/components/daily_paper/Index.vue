<template>
  <div class="bg-white">
    <div class="max-w-[1280px] m-auto">
      <div class="py-[96px] text-center">
        <div class="text-[#223B99] text-[16px] font-[500] leading-[24px]">
          {{ $t('dailyPaper.paper') }}
        </div>
        <div class="mt-[12px] text-[48px] font-[500] leading-[60px] tracking-[-0.96px]">
          {{ $t('dailyPaper.eachpaper') }}
        </div>
        <div class="mt-[24px] text-[20px] font-[300] leading-[30px]">
          {{ $t('dailyPaper.arxiv') }}
        </div>
        <div class="mt-[24px]" v-if="canCreateDailyPaper">
          <a href="/daily_papers/new" class="inline-block text-center px-[18px] py-[12px] text-[16px] text-white bg-[#3250BD] rounded-[8px] border-[1px] border-[#3250BD]">
            {{ $t('dailyPaper.newpaper') }}
          </a>
        </div>
        <div class="mt-[64px] gap-[64px] flex-col md:px-[16px]">
          <div class="flex justify-center mb-[64px]">
            <div class="w-[280px] md:w-full">
              <el-input
                style="width: 100%;"
                size="large"
                v-model="searchForm.keywords"
                :placeholder="$t('dailyPaper.placeholder')"
                clearable
                suffix-icon="el-icon-search"
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <el-icon @click="handleSearch" class="el-input__icon"><search /></el-icon>
                </template>
              </el-input>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex gap-x-[32px] gap-y-[48px] flex-wrap justify-between border-b border-[#EAECF0] pb-[64px]">
              <div class="w-[405px] md:w-full" :key="item.daily_paper.uuid" v-for="item in JSON.parse(dailyPapers)">
                <div class="flex w-full flex-col cursor-pointer" @click="visitDetail(item.daily_paper.uuid)">
                  <img :src="item.daily_paper.cover_url" alt="" class="h-[240px] object-contain">
                  <div class="flex justify-between gap-[16px] mt-[20px] items-start">
                    <div class="text-[24px] font-[500] leading-[32px] text-left line-clamp line-clamp-2 text-[#101828]">
                      {{ item.daily_paper.title }}
                    </div>
                    <div class="w-[24px]">
                      <el-icon :size="24"><TopRight /></el-icon>
                    </div>
                  </div>
                  <div class="mt-[8px] text-[16px] font-[300] leading-[24px] text-left line-clamp line-clamp-2 md:line-clamp-3 text-[#475467]">
                    {{ item.daily_paper.recommendation }}
                  </div>
                  <a :href="item.recommender_url">
                    <div class="flex mt-[24px] gap-[12px] items-center">
                      <img :src="item.daily_paper.recommender_avatar_url" alt="" class="h-[40px] w-[40px] rounded-full">
                      <div class="flex flex-col justify-between items-start">
                        <div class="text-[14px] font-[500] leading-[20px] text-[#101828]">
                          {{ item.daily_paper.recommender_name }}
                        </div>
                        <div class="text-[14px] font-[300] leading-[24px] text-[#475467]">
                          {{ dayjs(item.daily_paper.published_at).format("YYYY-MM-DD") }}
                        </div>
                      </div>
                    </div>
                </a>
                </div>
              </div>
            </div>
            <div class="mt-[20px] flex justify-center">
              <el-pagination
                background
                hide-on-single-page
                v-model:current-page="searchForm.page"
                :default-current-page="1"
                :page-size="9"
                layout="prev, pager, next"
                :total="Number(totalCount)"
                @current-page="handleSearch"
                @update:current-page="handleSearch"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import dayjs from "dayjs";
  import { ref,onMounted } from 'vue'
  import jwtFetch from "../../packs/jwtFetch"
  const props = defineProps({
    canCreateDailyPaper: Boolean,
    dailyPapers: String,
    keywords: String,
    page: String,
    totalCount: String,
  })
  const searchForm = ref({
    keywords: props.keywords,
    page: Number(props.page) || 1,
  })
  const handleSearch = () => {
    loadPage()
    window.location.href=`/daily_papers?keywords=${searchForm.value.keywords}&page=${searchForm.value.page}`
  }
  const visitDetail = (uuid) => {
    window.location.href=`/daily_papers/${uuid}`
  };
  async function loadPage(){
  const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify([{
    "c_id": "",
    "c_ip": "",
    "ext": "",
    "id": "page_paper",
    "m": "PageClick",
    "v": "1"
  }])
      }
      const res = await jwtFetch(`${CSGHUB_SERVER}api/v1/events`, options)
      if (!res.ok) {
        console.log('jwt报错：',res)
      } else {
        res.json().then((body) => {
          console.log('jwt成功：',res)
        })
      }
  }
  onMounted(() => {
    // loadPage()
  })
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 24px;
  }
  .el-form-item__label {
    margin-bottom: 6px;
  }
  :deep(.el-input__wrapper) {
    border-radius: 8px;
  }
  :deep(.el-textarea__inner) {
    border-radius: 8px;
  }
  :deep(.el-upload--picture-card) {
    border: 0px;
  }
  :deep(.hide .el-upload.el-upload--picture-card){
    display: none;
  }
</style>