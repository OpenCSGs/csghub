<template>
  <div
    class="flex justify-center md:flex-col px-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="name"
    >
    </Menu>

    <!-- API Key list -->
    <div class="grow flex flex-col gap-[24px] px-6 py-10 border-l min-h-[calc(100vh-153px)]">
      <div class="max-w-[512px]">
        <div class="mb-[16px]">
          <h3 class="mb-[4px] text-gray-700 text-[20px] font-semibold">
            {{ $t('accessToken.starshipTitle') }}
          </h3>
          <p class="text-[#606266] text-[14px]">
            {{ $t('accessToken.starshipDesc') }}
          </p>
        </div>
        <StarshipAccessTokenCard
          v-for="token in userTokens"
          :key="token.token_name"
          :tokenName="token.token_name"
          :tokenValue="token.token"
        />
      </div>

      <button
        @click="centerDialogVisible = true"
        class="rounded-[4px] border bg-[#FFF] py-[5px] px-[16px] text-[#606266] text-[14px] font-[500] w-[160px]"
      >
        {{ $t('accessToken.starshipAddToken') }}
      </button>
    </div>

    <!-- new key dialog -->
    <el-dialog
      v-model="centerDialogVisible"
      :title="$t('accessToken.starshipAddToken')"
      width="35%"
      class="dialogWidth"
      style="border-radius: 0.5rem"
      left
    >
      <el-form
        ref="accessTokenFormRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
      >
        <el-form-item
          :label="$t('accessToken.starshipAccessTokenName')"
          prop="accessTokenName"
        >
          <el-input
            v-model="formData.accessTokenName"
            maxlength="20"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">{{ $t('all.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="submitAccessToken"
          >
            {{ $t('all.add') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import Menu from './Menu.vue'
  import { useI18n } from 'vue-i18n'
  import StarshipAccessTokenCard from './StarshipAccessTokenCard.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'

  const props = defineProps({
    name: String
  })

  const { t } = useI18n()

  const accessTokenFormRef = ref(null)
  const centerDialogVisible = ref(false)
  const userTokens = ref([])

  const formData = ref({})
  const formRules = {
    accessTokenName: [
      { required: true, message: t('accessToken.starshipNameMissing') }
    ]
  }

  onMounted(() => {
    fetchUserStarshipTokens()
  })

  const fetchUserStarshipTokens = async () => {
    const userStarshipTokensEndpoint = `/user/${props.name}/tokens?app=starship`
    const { data, error } = await useFetchApi(userStarshipTokensEndpoint).json()
    if (data.value) {
      const result = data.value
      userTokens.value = result.data
      centerDialogVisible.value = false
    } else {
      ElMessage({ message: error.value.msg, type: 'warning' })
    }
  }

  const submitAccessToken = async() => {
    if (!accessTokenFormRef) return
    accessTokenFormRef.value.validate(async(valid) => {
      if (valid) {
        const userTokenCreateEndpoint = `/token/starship/${formData.value.accessTokenName}`
        const options = {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        }
        const { error } = await useFetchApi(userTokenCreateEndpoint, options).post().json()
        if (!error.value) {
          fetchUserStarshipTokens()
        } else {
          ElMessage({ message: error.value.msg, type: 'warning' })
        }
      } else {
        console.log('error submit!')
      }
    })
  }
</script>
