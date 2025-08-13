<template>
  <div>
    <el-dropdown class="h-9">
      <el-button plain type="default" class="btn btn-secondary-gray btn-sm !h-full">
        <SvgIcon name="sync" class="mr-1" />
        <div class="text-gray-700">{{ $t('repo.source.sync') }}</div>
        <el-icon class="ml-1 el-icon--right">
          <arrow-down />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :disabled="!commitId">
            <p class="flex gap-2" @click="showDiff">
              <SvgIcon name="sync-diff" class="mr-1" />
              {{ $t('repo.source.syncDiff') }}
            </p>
          </el-dropdown-item>
          <el-dropdown-item>
            <p class="flex gap-2" @click="emit('syncRepo')">
              <SvgIcon name="sync-remote" class="mr-1" />
              {{ syncInprogress ? $t('repo.source.syncing') : $t('repo.source.syncButton') }}
            </p>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

  <el-dialog
    v-model="dialogVisible"
    top="200px"
    :style="{ borderRadius: '10px' }"
    width="450"
    class="invite_dialog"
  >
    <template #header="{ close }">
      <div class="flex gap-4">
        <div class="border border-gray-200 rounded-[10px] flex justify-center items-center p-3">
          <SvgIcon name="sync-diff" width="24" height="24" />
        </div>
        <div class="flex flex-col gap-1">
          <p class="text-gray-900 text-lg font-medium leading-7">{{ $t('repo.source.checkSyncDiff') }}</p>
          <p class="text-gray-600 text-sm font-light leading-[22px]"> {{ modelPath }} </p>
        </div>
      </div>
    </template>

    <hr class="my-2" />

    <div v-if="!hasRemoteChanges">
      <p class="py-5">
        {{ $t('repo.source.nodiffs') }}
      </p>
    </div>
    <div v-else class="flex flex-col gap-3">
      <p v-for="item in diffs.added" :key="item" class="flex justify-between">
       <span class="text-gray-600 text-md font-light"> {{ item }} </span>
       <span class="border border-success-200 rounded-2xl text-xs bg-success-50 px-2 py-1 text-success-700 leading-4">{{ $t('repo.source.added') }}</span>
      </p>
      <p v-for="item in diffs.removed" :key="item" class="flex justify-between">
       <span class="text-gray-600 text-md font-light"> {{ item }} </span>
       <span class="border border-error-200 rounded-2xl text-xs bg-error-50 px-2 py-1 text-error-700 leading-4">{{ $t('repo.source.removed') }}</span>
      </p>
      <p v-for="item in diffs.modified" :key="item" class="flex justify-between">
       <span class="text-gray-600 text-md font-light"> {{ item }} </span>
       <span class="border border-brand-200 rounded-2xl text-xs bg-brand-50 px-2 py-1 text-brand-700 leading-4">{{ $t('repo.source.modified') }}</span>
      </p>
    </div>

    <hr class="my-2" />

    <template #footer>
      <div v-if="hasRemoteChanges" class="flex justify-end gap-3 px-5">
        <CsgButton
          class="btn btn-secondary-gray btn-sm"
          :name="$t('all.cancel')"
          @click="dialogVisible = false"
        />
        <CsgButton
          class="btn btn-primary btn-sm"
          :name="$t('repo.source.sync')"
          @click="emit('syncRepo')"
        />
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, computed } from "vue";
  import { useI18n } from "vue-i18n";
  import useFetchApi from '@/packs/useFetchApi'
  import { ElMessage } from "element-plus";

  const { t } = useI18n();
  const dialogVisible = ref(false);
  const diffs = ref({ "added": [], "removed": [], "modified": [] })

  const emit = defineEmits(["syncRepo"]);

  const props = defineProps({
    syncInprogress: Boolean,
    repoType: String,
    modelPath: String,
    commitId: String,
  });

  const hasRemoteChanges = computed(() => {
    return diffs.value.added.length > 0 || diffs.value.removed.length > 0 || diffs.value.modified.length > 0
  })

  const showDiff = async () => {
    if (!props.commitId) { return }
    try {
      const url = `/${props.repoType}s/${props.modelPath}/remote_diff?left_commit_id=${props.commitId}`
      const { data, error } = await useFetchApi(url).json()
      if (error.value) {
        ElMessage.warning(error.value.msg || t('repo.source.syncDiffError'))
      } else {
        dialogVisible.value = true
        if (data.value.data) {
          diffs.value = data.value.data[0]
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
</script>
