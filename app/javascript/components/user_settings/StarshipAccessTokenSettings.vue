<template>
  <div
    class="flex justify-center md:flex-col px-[24px] py-[36px] my-[24px] rounded-[8px] md:px-[50px] sm:px-[20px] max-w-[1280px] m-auto bg-white"
  >
    <Menu
      class="max-w-[411px] md:mb-[24px]"
      :name="name"
      :email="email"
      :displayName="displayName"
      :avatar="avatar"
    >
    </Menu>

    <!-- API Key list -->
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

      <button
        @click="centerDialogVisible = true"
        class="rounded-[4px] border bg-[#FFF] py-[5px] px-[16px] text-[#606266] text-[14px] font-[500] mt-[32px]"
      >
        {{ $t('accessToken.starshipAddToken') }}
      </button>
    </div>

    <!-- new key dialog -->
    <el-dialog
      v-model="centerDialogVisible"
      :title="$t('accessToken.starshipAddToken')"
      width="30%"
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
            placeholder="input the name"
            maxlength="20"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">Cancel</el-button>
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
  import { ref } from 'vue'
  import Menu from './Menu.vue'
  import { useI18n } from 'vue-i18n'
  import StarshipAccessTokenCard from './StarshipAccessTokenCard.vue'

  const props = defineProps({
    name: String,
    displayName: String,
    avatar: String,
    accessToken: String,
    email: String
  })

  const { t } = useI18n()

  const centerDialogVisible = ref(false)

  const formData = ref({})
  const formRules = {
    accessTokenName: [{ required: true, message: t('accessToken.starshipNameMissing') }]
  }
</script>
