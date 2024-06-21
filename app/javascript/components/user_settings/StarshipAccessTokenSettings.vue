<template>
  <div
    class="flex justify-center md:flex-col px-[24px] py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="profileName"
      :email="email"
      :displayName="profileDisplayName"
      :avatar="profileAvatar"
    >
    </Menu>
    <div class="grow py-[24px]">
      <div class="max-w-[512px]">
        <div class="mb-[16px]">
          <h3 class="mb-[4px] text-[#303133] text-[20px] font-semibold">
            {{ $t('accessToken.starshipTitle') }}
          </h3>
          <p class="text-[#606266] text-[14px]">
            {{ $t('accessToken.starshipDesc') }}
          </p>
        </div>
        <StarshipAccessTokenCard
          tokenName="a"
          tokenValue="b"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import Menu from './Menu.vue'
  import { ElMessage } from 'element-plus'
  import csrfFetch from '../../packs/csrfFetch'
  import StarshipAccessTokenCard from './StarshipAccessTokenCard.vue'

  export default {
    props: {
      name: String,
      displayName: String,
      avatar: String,
      accessToken: String,
      email: String
    },
    components: {
      Menu,
      StarshipAccessTokenCard
    },
    data() {
      return {
        theAccessToken: this.accessToken,
        profileName: this.name,
        profileDisplayName: this.displayName,
        profileAvatar: this.avatar,
        accessTokenName: ''
      }
    },
    mounted() {
      // 如果 accessToken 为空，那么刷新获取 token
      if (!this.theAccessToken.trim()) {
        this.refreshAccessToken()
      }
    },
    methods: {
    }
  }
</script>
