<template>
  <div class="border-r border-gray-200">
    <div class="w-[294px] rounded-md mx-[24px] py-[24px]">
      <div class="flex p-[16px] pt-[16px]">
        <el-avatar
          :size="60"
          :src="logo"
        >
        </el-avatar>
        <div class="ml-[10px]">
          <div
            :title="nickName"
            class="max-w-[190px] text-ellipsis overflow-hidden whitespace-nowrap text-2xl leading-[32px] font-semibold"
          >
            <a :href="`/organizations/${name}`">
              {{ nickName || name }}
            </a>
          </div>
          <div
            class="max-w-[190px] text-ellipsis overflow-hidden whitespace-nowrap text-md text-gray-500 leading-[24px]"
            :title="homepage"
          >
            {{ homepage }}
          </div>
        </div>
      </div>
      <div class="p-[16px] text-xl leading-[30px] text-gray-700">
        {{ $t('organization.orgSetting') }}
      </div>
      <div class="flex flex-col">
        <a
          :href="`/organizations/${this.name}/edit`"
          class="py-[8px] px-[12px] hover:bg-gray-50 text-md text-gray-500 leading-[24px] cursor-pointer"
          :class="menuClass(`/organizations/${this.name}/edit`)"
        >
          {{ $t('organization.orgInfo') }}
        </a>
      </div>
      <!-- 组织成员 -->
      <div class="flex flex-col">
        <a
          :href="`/organizations/${this.name}/members`"
          class="py-[8px] px-[12px] hover:bg-gray-50 text-md text-gray-500 leading-[24px] cursor-pointer"
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
          return 'text-gray-700 font-semibold bg-gray-50 rounded-sm'
        } else {
          return ''
        }
      }
    }
  }
</script>
