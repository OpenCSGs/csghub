<template>
  <div class="max-w-[400px] pr-10 lg:px-0 sm:px-0 sm:w-full py-9">
    <!-- avatar -->
    <div>
      <el-avatar :size="160" :src="isCurrentUser ? userStore.avatar : avatar"></el-avatar>
    </div>
    <!-- nickname -->
    <div class="text-2xl text-gray-700 leading-8 font-medium">
      {{ isCurrentUser ? userStore.nickname : nickname }}
    </div>
    <!-- name -->
    <div class="text-md text-gray-500 max-w-[max-content] leading-6 mb-4">
      @{{ isCurrentUser ? userStore.username : username }}
    </div>
    <!-- profile settings -->
    <div v-if="isCurrentUser" class="flex xl:flex-col md:flex-row gap-3">
      <a href="/settings/profile" class="btn btn-secondary-gray btn-md">
        {{ $t('profile.accountSetting')}}
      </a>
    </div>

    <!-- organization -->
    <div class="my-4 mt-10">
      <div class="text-xl text-gray-700 leading-8 font-medium mb-2">
        {{ $t('profile.organization')}}
      </div>
      <div v-if="hasOrg" class="flex gap-2 flex-wrap mt-4">
        <p v-for="org in (isCurrentUser ? userStore.orgs : userOrgs)" :key="org.path">
          <el-tooltip
            :content="org.name || org.path"
            placement="top"
            effect="dark"
            :show-after="200"
            popper-class="org-tooltip"
          >
            <a :href="`/organizations/${org.path}`" class="hover:opacity-80 transition-opacity">
              <img :src="org.logo ? org.logo : '/images/default_org.png'" class="rounded-[50%] h-10 w-10" />
            </a>
          </el-tooltip>
        </p>
      </div>
      <div v-else class="text-gray-500">
        {{ $t('all.noData')}}
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import useUserStore from '../../stores/UserStore.js'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
  import { useRoute } from 'vue-router'

  const userStore = useUserStore()
  const route = useRoute()

  const props = defineProps({
    name: String
  })

  const userId = new URL(window.location.href).pathname.split('/').pop()
  const avatar = ref('')
  const username = ref('')
  const nickname = ref('')
  const userOrgs = ref([])

  const isCurrentUser = computed(() => {
    return userId === userStore.uuid || userId === userStore.username
  })

  const hasOrg = computed(() => isCurrentUser.value ? !!userStore.orgs && userStore.orgs.length > 0 : !!userOrgs.value && userOrgs.value.length > 0)

  const fetchUserInfo = async () => {
    const { data, error } = await useFetchApi(`/user/${props.name}`).json()
    if (data.value) {
      const body = data.value
      avatar.value = body.data.avatar
      username.value = body.data.username
      nickname.value = body.data.nickname
      userOrgs.value = body.data.orgs
    } else {
      ElMessage.warning(error.value.msg)
    }
  }

  const refreshProfile = () => {
    if (isCurrentUser.value) {
      userStore.fetchUserInfo()
    } else {
      fetchUserInfo()
    }
  }

  onMounted(() => {
    refreshProfile()
  })

  // 监听路由变化，回退时刷新
  watch(
    () => route.fullPath,
    () => {
      refreshProfile()
    }
  )
</script>

<style scoped>
.org-tooltip {
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 4px;
}
</style>