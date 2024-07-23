<template>
  <div class="border-r border-[#EAECF0]">
    <div class="w-[294px] rounded-[8px] mx-[24px] py-[24px]">
      <div class="flex p-[16px] pt-[16px]">
        <el-avatar
          :size="60"
          :src="logo"
        >
        </el-avatar>
        <div class="ml-[10px]">
          <div
            :title="nickName"
            class="max-w-[190px] text-ellipsis overflow-hidden whitespace-nowrap text-[24px] leading-[32px] font-semibold"
          >
            {{ nickName || name }}
          </div>
          <div
            class="max-w-[190px] text-ellipsis overflow-hidden whitespace-nowrap text-[16px] text-[#909399] leading-[24px]"
            :title="homepage"
          >
            {{ homepage }}
          </div>
        </div>
      </div>
      <div class="p-[16px] text-[20px] leading-[30px] text-[#344054]">
        {{ $t('organization.orgSetting') }}
      </div>
      <div class="flex flex-col">
        <a
          :href="`/organizations/${this.name}/edit`"
          class="py-[8px] px-[12px] hover:bg-[#FAFAFA] text-[16px] text-[#667085] leading-[24px] cursor-pointer"
          :class="menuClass(`/organizations/${this.name}/edit`)"
        >
          {{ $t('organization.orgInfo') }}
        </a>
      </div>
      <!-- 组织成员 -->
      <div class="flex flex-col">
        <a
          :href="`/organizations/${this.name}/members`"
          class="py-[8px] px-[12px] hover:bg-[#FAFAFA] text-[16px] text-[#667085] leading-[24px] cursor-pointer"
          :class="menuClass(`/organizations/${this.name}/members`)"
        >
          {{ $t('organization.orgMembers') }}
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      name: String,
      nickName: String,
      homepage: String,
      logo: String
    },
    data() {
      return {}
    },
    mounted() {},
    methods: {
      menuClass(menuPath) {
        if (menuPath === window.location.pathname) {
          return 'text-[#303133] font-semibold bg-[#FAFAFA] rounded-[6px]'
        } else {
          return ''
        }
      }
    }
  }
</script>
