<template>
  <div class="flex gap-[8px] items-center mb-5 text-2xl text-[#606266] font-light md:px-5 flex-wrap">
    <el-avatar :size="24" :src="avatar" class="flex-shrink-0"></el-avatar>
    <a class="hover:text-[#223B99]" :href="ownerUrl">
      {{ path.split('/')[0] }}
    </a>
    <div>/</div>
    <a class="text-[#303133] max-w-full break-words hover:text-[#223B99]" href="#">
      {{ nickname }}
    </a>
    <div class="cursor-pointer" @click="copyName"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.7779 5.3335V5.3335C11.9162 5.3335 12.4854 5.3335 12.9395 5.50441C13.6582 5.77492 14.2254 6.34212 14.4959 7.06083C14.6668 7.51495 14.6668 8.08409 14.6668 9.22239V10.4002C14.6668 11.8936 14.6668 12.6404 14.3762 13.2108C14.1205 13.7126 13.7126 14.1205 13.2108 14.3762C12.6404 14.6668 11.8936 14.6668 10.4002 14.6668H9.22239C8.08409 14.6668 7.51495 14.6668 7.06083 14.4959C6.34212 14.2254 5.77492 13.6582 5.50441 12.9395C5.3335 12.4854 5.3335 11.9162 5.3335 10.7779V10.7779M5.60016 10.6668H6.40016C7.89364 10.6668 8.64037 10.6668 9.2108 10.3762C9.71257 10.1205 10.1205 9.71257 10.3762 9.2108C10.6668 8.64037 10.6668 7.89364 10.6668 6.40016V5.60016C10.6668 4.10669 10.6668 3.35995 10.3762 2.78952C10.1205 2.28776 9.71257 1.87981 9.2108 1.62415C8.64037 1.3335 7.89364 1.3335 6.40016 1.3335H5.60016C4.10669 1.3335 3.35995 1.3335 2.78952 1.62415C2.28776 1.87981 1.87981 2.28776 1.62415 2.78952C1.3335 3.35995 1.3335 4.10669 1.3335 5.60016V6.40016C1.3335 7.89364 1.3335 8.64037 1.62415 9.2108C1.87981 9.71257 2.28776 10.1205 2.78952 10.3762C3.35995 10.6668 4.10669 10.6668 5.60016 10.6668Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
    <div class="border border-[#DCDFE6] px-3 py-[2px] text-center text-xs text-[#606266] font-medium rounded">{{private?'私有':'公开'}}</div>
  </div>
  <div class="flex gap-[8px] items-center mb-5 text-lg text-[#606266] font-light md:px-5 flex-wrap">
    <a class="hover:text-[#223B99]" :href="ownerUrl">
      {{ path.split('/')[0] }}
    </a>
    <div>/</div>
    <a class="text-[#303133] max-w-full break-words hover:text-[#223B99]" href="#">
      {{ path.split('/')[1] }}
    </a>
  </div>
  <div class="text-lg text-[#344054] font-normal mb-5">
    {{ desc }}
  </div>
  <HeaderTags
    :task-tags="tags.task_tags"
    :framework-tags="tags.framework_tags"
    :license-tags="tags.license_tags"
    :other-tags="tags.other_tags"
    prefix="models/"
  />
</template>

<script setup>
  import HeaderTags from '../shared/HeaderTags.vue'
  import { copyToClipboard } from '../../packs/clipboard'

  const props = defineProps({
    private: String,
    avatar: String,
    name: String,
    nickname: String,
    path: String,
    desc: String,
    license: String,
    tags: Object,
    ownerUrl: String
  });

  const copyName = () => {
    copyToClipboard(props.path)
  }
</script>
