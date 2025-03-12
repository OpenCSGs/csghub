<template>
  <div
    class="flex flex-col gap-[16px] flex-wrap mb-[16px] text-lg text-gray-500 font-semibold md:px-5"
  >
    <!-- dataset repo -->
    <div
      v-if="repoType === 'dataset'"
      class="w-full flex flex-wrap gap-2 items-center md:w-full md:mb-1"
    >
      <SvgIcon
        name="repoheader_dataset"
        width="16"
        height="16"
      />
      <span class="text-gray-500 text-lg font-medium"
        >Dataset:</span
      >
      <el-avatar
        :size="24"
        :src="avatar"
        class="flex-shrink-0"
      ></el-avatar>
      <span class="max-w-full break-words text-gray-700 font-medium">{{
        nickname.trim() === '' ? name : nickname
      }}</span>
      <div
        v-if="repoDetailStore.isPrivate"
        class="border border-gray-300 bg-white px-2 py-[3px] text-center text-xs font-normal text-gray-700 rounded-sm"
      >
        {{ $t('all.private') }}
      </div>
      <div
        class="flex cursor-pointer gap-1 border border-gray-300 bg-white px-2 pr-1 py-[3px] text-center text-xs text-gray-700 font-normal rounded-sm hover:bg-gray-50 active:ring-4 active:ring-gray-400 active:ring-opacity-25 active:bg-white"
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
      class="flex flex-wrap w-full gap-2 items-center"
    >
      <el-avatar
        :size="24"
        :src="avatar"
        class="flex-shrink-0"
      ></el-avatar>
      <span class="max-w-full break-words text-gray-700 font-medium">{{
        nickname.trim() === '' ? name : nickname
      }}</span>
      <div
        v-if="repoDetailStore.isPrivate"
        class="border border-gray-300 bg-white px-2 py-[3px] text-center text-xs font-normal text-gray-700 rounded-sm"
      >
        {{ $t('all.private') }}
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
      class="flex flex-wrap w-full gap-2 items-center"
    >
      <SvgIcon
        name="model_finetune_create"
        width="16"
        height="16"
        class="flex-shrink-0"
      />
      <span class="max-w-full break-words text-gray-700 font-medium">{{
        nickname.trim() === '' ? name : nickname
      }}</span>
      <AppStatus
        v-if="appStatus"
        :appStatus="appStatus"
        :spaceResource="spaceResource"
      />
    </div>

    <!-- other repo -->
    <div
      v-else
      class="flex flex-wrap w-full gap-2 items-center"
    >
      <el-avatar
        :size="24"
        :src="avatar"
        class="flex-shrink-0"
      ></el-avatar>
      <span class="max-w-full break-words text-gray-700 font-medium">{{
        nickname.trim() === '' ? name : nickname
      }}</span>
      <div
        v-if="repoDetailStore.isPrivate"
        class="border border-gray-300 bg-white px-2 py-[3px] text-center text-xs font-normal text-gray-700 rounded-sm"
      >
        {{ $t('all.private') }}
      </div>
      <div
        class="flex cursor-pointer gap-1 border border-gray-300 bg-white px-2 pr-1 py-[3px] text-center text-xs text-gray-700 font-normal rounded-sm hover:bg-gray-50 active:ring-4 active:ring-gray-400 active:ring-opacity-25 active:bg-white"
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
        <SvgIcon
          name="instance_logs"
          width="16"
          height="16"
        />
      </p>
    </div>

    <div
      class="flex gap-1 items-center"
      v-if="repoType !== 'finetune'"
    >
      <a
        class="md:ml-0 hover:text-brand-700 text-gray-500 font-normal"
        v-if="repoType !== 'endpoint'"
        :href="ownerUrl"
      >
        {{ path?.split('/')[0] }}
      </a>
      <div v-if="repoType !== 'endpoint'"
      >/</div>
      <a
        class="max-w-full break-words hover:text-brand-700 text-gray-700 font-normal"
        :href="repoUrl"
      >
        {{ repoType === 'endpoint' ? name : path?.split('/')[1] }}
      </a>
      <div
        class="cursor-pointer"
        data-test="copy-name"
        @click="copyName"
      >
        <SvgIcon
          name="copy"
          width="16"
          height="16"
        />
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
      <a :href="`/models/${props.path}`" class="md:ml-0 text-gray-700 text-md font-normal hover:text-brand-700">
        {{ path }}
      </a>
      <SvgIcon
        name="finetune_cpu_icon"
        width="16"
        height="16"
        class="flex-shrink-0 ml-6 md:ml-0"
      />
      <span class="text-gray-700 font-normal text-md">{{ resourceName }}</span>
    </div>
  </div>
  <div class="leading-[24px] pb-[16px] text-gray-700 md:px-5">{{ desc }}</div>

  <!-- repo tags -->
  <HeaderTags
    v-if="repoType === 'model' || repoType === 'dataset' || repoType === 'code'"
    :tags="tags"
    :prefix="`${repoType}s/`"
  />
</template>

<script setup>
  import HeaderTags from '../shared/HeaderTags.vue'
  import AppStatus from '../application_spaces/AppStatus.vue'
  import { copyToClipboard } from '../../packs/clipboard'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import { ref, computed, watch } from 'vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'

  const repoDetailStore = useRepoDetailStore()

  const emit = defineEmits(['toggleSpaceLogsDrawer'])

  const props = defineProps({
    avatar: String,
    name: String,
    nickname: { type: String, default: '' },
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
    deployId: Number,
    collectionsId: Number,
    totalLikes: {
      type: Number,
      default: 0
    },
    hasLike: Boolean,
    resourceName: String
  })

  const userLiked = ref(props.hasLike)
  const likesNumber = ref(props.totalLikes)

  watch(
    () => props.hasLike,
    (newVal) => {
      userLiked.value = newVal
    }
  )

  watch(
    () => props.totalLikes,
    (newVal) => {
      likesNumber.value = newVal
    }
  )

  const copyName = () => {
    if (props.repoType === 'endpoint') {
      copyToClipboard(props.name)
    } else {
      copyToClipboard(props.path)
    }
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

  const likeUrl = computed(() => {
    if(props.repoType === 'collections'){
      return `/user/${props.name}/likes/collections/${props.repoId}`
    }else{
      return `/user/${props.name}/likes/${props.repoId}`
    }
  })

  const clickLike = () => {
    userLiked.value === true ? removeLike() : addLike()
  }

  const addLike = async () => {
    const { error } = await useFetchApi(likeUrl.value).put().json()
    if (error.value) {
      ElMessage({
        type: 'warning',
        message: error.value.msg
      })
    } else {
      userLiked.value = true
      likesNumber.value += 1
      repoDetailStore.updateLikes(likesNumber.value)
      repoDetailStore.updateUserLikes(true)
    }
  }

  const removeLike = async () => {
    const { error } = await useFetchApi(likeUrl.value).delete().json()
    if (error.value) {
      ElMessage({
        type: 'warning',
        message: error.value.msg
      })
    } else {
      userLiked.value = false
      likesNumber.value -= 1
      repoDetailStore.updateLikes(likesNumber.value)
      repoDetailStore.updateUserLikes(false)
    }
  }

  const repoUrl = computed(() => {
    if (props.repoType === 'endpoint' || props.repoType === 'finetune') {
      return `/${props.repoType}s/${props.path}/${props.deployId}`
    } else if (props.repoType === 'collections') {
      return `/collections/${props.collectionsId}`
    } else {
      return `/${props.repoType}s/${props.path}` 
    }
  })
</script>
