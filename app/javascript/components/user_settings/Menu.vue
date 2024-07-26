<template>
    <div class="pt-6">
      <div class="w-[294px] rounded-[8px] mx-[24px]">
        <div class="flex p-[16px]">
          <el-avatar :size="60" :src="avatar"> </el-avatar>
          <div class="ml-[10px]">
            <div class="text-[18px] leading-[28px] font-semibold">
              <a :href="'/profile/' + displayName">
                {{displayName}}
              </a>
            </div>
            <div class="text-[16px] text-[#909399] leading-[24px] font-light">@{{name}}</div>
          </div>
        </div>
        <div class="flex flex-col">
          <!-- profile -->
          <a href="/settings/profile"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/profile')"
          >
              {{ $t('profile.menu.profile')}}
          </a>

          <!-- <div class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] opacity-40"
               :class="menuClass('/settings/account')"
          >
            {{ $t('profile.menu.accountInformation')}}
          </div> -->

          <!-- <div class="p-[16px] hover:bg-[#EBEDF0] border-b border-[#DCDFE6] text-[18px] text-[#606266] leading-[26px] opacity-40"
               :class="menuClass('/settings/accessTokens')"
          >
            {{ $t('profile.menu.accessToken')}}
          </div> -->

          <!-- access token -->
          <a v-if="hasEmail"
             href="/settings/access-token"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/access-token')"
          >
            {{ $t('profile.menu.gitToken')}}
          </a>

          <!-- starship api key -->
          <a href="/settings/starship-access-token"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/starship-access-token')"
          >
            {{ $t('profile.menu.starshipAccessToken')}}
          </a>

          <!-- sync access token -->
          <a href="/settings/sync-access-token"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/sync-access-token')"
          >
            {{ $t('profile.menu.syncAccessToken')}}
          </a>

          <!-- ssh key -->
          <a v-if="hasEmail"
             href="/settings/ssh-keys"
             class="p-[16px] hover:bg-[#F9FAFB] border-[#DCDFE6] text-[16px] text-[#606266] leading-[24px] cursor-pointer"
             :class="menuClass('/settings/ssh-keys')"
          >
            {{ $t('profile.menu.sshKey')}}
          </a>

          <!-- <div class="p-[16px] hover:bg-[#EBEDF0] text-[18px] text-[#606266] leading-[26px] opacity-40"
               :class="menuClass('/settings/billing')"
          >
            {{ $t('profile.menu.billing')}}
          </div> -->
        </div>
      </div>
    </div>
</template>

<script setup>
  import { ref, watch, onMounted, inject, computed } from 'vue'
  import jwtFetch from '../../packs/jwtFetch'

  const csghubServer = inject('csghubServer')

  const props = defineProps({
    name: String
  })

  const displayName = ref(props.name)
  const avatar = ref('/images/default_avatar.png')
  const email = ref('')

  const hasEmail = computed(() => {
    return email.value.length !== 0
  })

  const menuClass = (menuPath) => {
    if (menuPath === window.location.pathname) {
      return 'text-[#303133] font-semibold'
    } else {
      return ''
    }
  }

  onMounted(() => {
    jwtFetch(`${csghubServer}/api/v1/user/${props.name}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((body) => {
        displayName.value = body.data.username || body.data.nickname
        avatar.value = body.data.avatar
        email.value = body.data.email
      })
  })
</script>
