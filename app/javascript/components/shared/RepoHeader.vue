<template>
  <div
    class="flex flex-col gap-[8px] flex-wrap mb-5 text-lg text-[#606266] font-semibold md:px-5"
  >
    <!-- dataset repo -->
    <div
      v-if="repoType === 'dataset'"
      class="mb-[16px] w-full flex flex-wrap gap-[16px] items-center md:w-full md:mb-1"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          opacity="0.12"
          d="M8 14.6668C11.3137 14.6668 14 13.7714 14 12.6668V3.3335C14 3.3335 13.6667 5.3335 8 5.3335C2.33333 5.3335 2 3.3335 2 3.3335V12.6668C2 13.7714 4.68629 14.6668 8 14.6668Z"
          fill="#A8ABB2"
        />
        <path
          d="M14 8.00016C14 9.10473 11.3137 10.0002 8 10.0002C4.68629 10.0002 2 9.10473 2 8.00016M14 3.3335C14 4.43807 11.3137 5.3335 8 5.3335C4.68629 5.3335 2 4.43807 2 3.3335M14 3.3335C14 2.22893 11.3137 1.3335 8 1.3335C4.68629 1.3335 2 2.22893 2 3.3335M14 3.3335V12.6668C14 13.7714 11.3137 14.6668 8 14.6668C4.68629 14.6668 2 13.7714 2 12.6668V3.3335"
          stroke="#A8ABB2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span class="text-[#A8ABB2] text-[18px] font-semibold ml-1 mr-2"
        >Dataset:</span
      >
      <el-avatar
        :size="24"
        :src="avatar"
        class="flex-shrink-0"
      ></el-avatar>
      <span class="max-w-full break-words">{{
        nickname.trim() === '' ? name : nickname
      }}</span>
      <div
        class="border border-[#DCDFE6] px-3 py-[2px] text-center text-xs text-[#606266] font-medium rounded"
      >
        {{ repoDetailStore.isPrivate ? $t('all.private') : $t('all.public') }}
      </div>
      <div
        class="flex cursor-pointer gap-[4px] border border-[#DCDFE6] pl-3 pr-1 py-[2px] text-center text-xs text-[#606266] font-medium rounded hover:bg-gray-50 active:ring-4 active:ring-gray-400 active:ring-opacity-25 active:bg-white"
        :class="userLiked === true ? 'text-gray-400 border-gray-200' : ''"
        @click="clickLike"
      >
        {{ userLiked === false ? $t('shared.likes') : $t('shared.hasLikes') }}
        <div class="min-h-[16px] min-w-[16px] bg-gray-100 px-1">
          {{ likesNumberDisplayName }}
        </div>
      </div>
    </div>

    <!-- endpoint -->
    <div
      v-else-if="repoType === 'endpoint'"
      class="flex flex-wrap w-full gap-[16px] items-center mb-[16px]"
    >
      <el-avatar
        :size="24"
        :src="avatar"
        class="flex-shrink-0"
      ></el-avatar>
      <span class="max-w-full break-words">{{
        nickname.trim() === '' ? name : nickname
      }}</span>
      <div
        class="border border-[#DCDFE6] px-3 py-[2px] text-center text-xs text-[#606266] font-medium rounded"
      >
        {{ repoDetailStore.isPrivate ? $t('all.private') : $t('all.public') }}
      </div>
      <AppStatus
        v-if="appStatus"
        :appStatus="appStatus"
        :spaceResource="spaceResource"
      />
    </div>

    <!-- finetune -->
    <div
      v-else-if="repoType === 'finetune'"
      class="flex flex-wrap w-full gap-[16px] items-center mb-[16px]"
    >
      <SvgIcon
        name="finetune_create"
        width="16"
        height="16"
        class="flex-shrink-0"
      />
      <span class="max-w-full break-words">{{
        nickname.trim() === '' ? name : nickname
      }}</span>
      <div
        class="flex cursor-pointer gap-[4px] border border-[#DCDFE6] pl-3 pr-1 py-[2px] text-center text-xs text-[#606266] font-medium rounded hover:bg-gray-50 active:ring-4 active:ring-gray-400 active:ring-opacity-25 active:bg-white"
        :class="userLiked === true ? 'text-gray-400 border-gray-200' : ''"
        @click="clickLike"
      >
        {{ userLiked === false ? $t('shared.likes') : $t('shared.hasLikes') }}
        <div class="min-h-[16px] min-w-[16px] bg-gray-100 px-1">
          {{ likesNumberDisplayName }}
        </div>
      </div>
      <AppStatus
        v-if="appStatus"
        :appStatus="appStatus"
        :spaceResource="spaceResource"
      />
    </div>

    <!-- other repo -->
    <div
      v-else
      class="flex flex-wrap w-full gap-[16px] items-center mb-[16px]"
    >
      <el-avatar
        :size="24"
        :src="avatar"
        class="flex-shrink-0"
      ></el-avatar>
      <span class="max-w-full break-words">{{
        nickname.trim() === '' ? name : nickname
      }}</span>
      <div
        class="border border-[#DCDFE6] px-3 py-[2px] text-center text-xs text-[#606266] font-medium rounded"
      >
        {{ repoDetailStore.isPrivate ? $t('all.private') : $t('all.public') }}
      </div>
      <div
        class="flex cursor-pointer gap-[4px] border border-[#DCDFE6] pl-3 pr-1 py-[2px] text-center text-xs text-[#606266] font-medium rounded hover:bg-gray-50 active:ring-4 active:ring-gray-400 active:ring-opacity-25 active:bg-white"
        :class="userLiked === true ? 'text-gray-400 border-gray-200' : ''"
        @click="clickLike"
      >
        {{ userLiked === false ? $t('shared.likes') : $t('shared.hasLikes') }}
        <div class="min-h-[16px] min-w-[16px] bg-gray-100 px-1">
          {{ likesNumberDisplayName }}
        </div>
      </div>
      <AppStatus
        v-if="appStatus"
        :appStatus="appStatus"
        :spaceResource="spaceResource"
      />
      <p
        v-if="canWrite"
        class="cursor-pointer"
        @click="showSpaceLogs"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M7 5.5H4M5 7.5H4M8 3.5H4M10 5.25V3.4C10 2.55992 10 2.13988 9.83651 1.81901C9.6927 1.53677 9.46323 1.3073 9.18099 1.16349C8.86012 1 8.44008 1 7.6 1H4.4C3.55992 1 3.13988 1 2.81901 1.16349C2.53677 1.3073 2.3073 1.53677 2.16349 1.81901C2 2.13988 2 2.55992 2 3.4V8.6C2 9.44008 2 9.86012 2.16349 10.181C2.3073 10.4632 2.53677 10.6927 2.81901 10.8365C3.13988 11 3.55992 11 4.4 11H5.75M11 11L10.25 10.25M10.75 9C10.75 9.9665 9.9665 10.75 9 10.75C8.0335 10.75 7.25 9.9665 7.25 9C7.25 8.0335 8.0335 7.25 9 7.25C9.9665 7.25 10.75 8.0335 10.75 9Z"
            stroke="#475467"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </p>
    </div>

    <div
      class="flex gap-[8px] items-center"
      v-if="repoType !== 'finetune'"
    >
      <a
        class="md:ml-0 hover:text-[#223B99]"
        :href="ownerUrl"
      >
        {{ path.split('/')[0] }}
      </a>
      <div>/</div>
      <a
        class="text-[#303133] max-w-full break-words hover:text-[#223B99]"
        href="#"
      >
        {{ repoType === 'endpoint' ? name : path.split('/')[1] }}
      </a>
      <div
        class="cursor-pointer"
        @click="copyName"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M10.7779 5.3335V5.3335C11.9162 5.3335 12.4854 5.3335 12.9395 5.50441C13.6582 5.77492 14.2254 6.34212 14.4959 7.06083C14.6668 7.51495 14.6668 8.08409 14.6668 9.22239V10.4002C14.6668 11.8936 14.6668 12.6404 14.3762 13.2108C14.1205 13.7126 13.7126 14.1205 13.2108 14.3762C12.6404 14.6668 11.8936 14.6668 10.4002 14.6668H9.22239C8.08409 14.6668 7.51495 14.6668 7.06083 14.4959C6.34212 14.2254 5.77492 13.6582 5.50441 12.9395C5.3335 12.4854 5.3335 11.9162 5.3335 10.7779V10.7779M5.60016 10.6668H6.40016C7.89364 10.6668 8.64037 10.6668 9.2108 10.3762C9.71257 10.1205 10.1205 9.71257 10.3762 9.2108C10.6668 8.64037 10.6668 7.89364 10.6668 6.40016V5.60016C10.6668 4.10669 10.6668 3.35995 10.3762 2.78952C10.1205 2.28776 9.71257 1.87981 9.2108 1.62415C8.64037 1.3335 7.89364 1.3335 6.40016 1.3335H5.60016C4.10669 1.3335 3.35995 1.3335 2.78952 1.62415C2.28776 1.87981 1.87981 2.28776 1.62415 2.78952C1.3335 3.35995 1.3335 4.10669 1.3335 5.60016V6.40016C1.3335 7.89364 1.3335 8.64037 1.62415 9.2108C1.87981 9.71257 2.28776 10.1205 2.78952 10.3762C3.35995 10.6668 4.10669 10.6668 5.60016 10.6668Z"
            stroke="#606266"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div
      v-else
      class="flex gap-[8px] items-center"
    >
      <SvgIcon
        name="finetune_name_icon"
        width="16"
        height="16"
        class="flex-shrink-0"
      />
      <span class="md:ml-0 text-[#344054] font-normal hover:text-[#344054]">
        {{ path.split('/')[0] }}
      </span>
      <div>/</div>
      <span
        class="text-[#344054] font-normal max-w-full break-words hover:text-[#344054]"
        href="#"
      >
        {{ repoType === 'endpoint' ? name : path.split('/')[1] }}
      </span>
      <SvgIcon
        name="finetune_cpu_icon"
        width="16"
        height="16"
        class="flex-shrink-0 ml-6 md:ml-0"
      />
      <span class="text-[#344054] font-normal">{{ spaceName }}</span>
    </div>
  </div>
  <div class="leading-[24px] pb-[16px] md:px-5">{{ desc }}</div>

  <!-- repo tags -->
  <header-tags
    v-if="repoType === 'model' || repoType === 'dataset'"
    :task-tags="tags.task_tags"
    :framework-tags="tags.framework_tags"
    :license-tags="tags.license_tags"
    :language-tags="tags.language_tags"
    :industry-tags="tags.industry_tags"
    :other-tags="tags.other_tags"
    :prefix="`${repoType}s/`"
  />
</template>

<script setup>
  import HeaderTags from '../shared/HeaderTags.vue'
  import AppStatus from '../application_spaces/AppStatus.vue'
  import { copyToClipboard } from '../../packs/clipboard'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import { ref, inject } from 'vue'
  import { computed } from 'vue'
  import jwtFetch from '../../packs/jwtFetch'
  import { ElMessage } from 'element-plus'

  const repoDetailStore = useRepoDetailStore()

  const emit = defineEmits(['toggleSpaceLogsDrawer']);

  const props = defineProps({
    avatar: String,
    name: String,
    nickname: {type: String, default: ''},
    desc: String,
    path: String,
    license: String,
    tags: Object,
    ownerUrl: String,
    repoType: String,
    appStatus: String,
    spaceResource: String,
    canWrite: Boolean,
    repoId: Number,
    totalLikes: {
      type: Number,
      default: 0
    },
    hasLike: Boolean
  });

  const userLiked = ref(props.hasLike)
  const likesNumber = ref(props.totalLikes)
  const csghubServer = inject('csghubServer')

  const copyName = () => {
    copyToClipboard(props.path)
  }

  const showSpaceLogs = () => {
    emit('toggleSpaceLogsDrawer')
  }

  const likesNumberDisplayName = computed(() => {
    if (likesNumber.value > 9999) {
      return '1w+'
    } else if (likesNumber.value > 999) {
      return '1k+'
    } else {
      return likesNumber.value.toString()
    }
  })

  const clickLike = () => {
    userLiked.value === true ? removeLike() : addLike()
  }

  const addLike = async () => {
    const options = { method: 'PUT' }
    const response = await jwtFetch(
      `${csghubServer}/api/v1/user/${props.name}/likes/${props.repoId}`,
      options,
      true
    )
    if (!response.ok) {
      response.json().then((data) => {
        ElMessage({
          type: 'warning',
          message: data
        })
      })
    } else {
      userLiked.value = true
      likesNumber.value += 1
    }
  }

  const removeLike = async () => {
    const options = { method: 'DELETE' }
    const response = await jwtFetch(
      `${csghubServer}/api/v1/user/${props.name}/likes/${props.repoId}`,
      options
    )
    if (!response.ok) {
      response.json().then((data) => {
        ElMessage({
          type: 'warning',
          message: data
        })
      })
    } else {
      userLiked.value = false
      likesNumber.value -= 1
    }
  }
</script>
