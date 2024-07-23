<template>
  <div class="sm:w-[100%] sm:mt-[36px]">
    <!-- models -->
    <div>
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon
          name="models"
          width="18"
          height="18"
        />
        <span>{{ $t('organization.model') }}</span>
      </h3>
      <div
        v-if="hasModels"
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <repo-item
          v-for="model in models.data"
          :repo="model"
          repo-type="model"
        ></repo-item>
      </div>
      <div
        v-else
        class="flex flex-wrap gap-4 mb-4 mt-[16px]"
      >
        {{ $t('all.noData') }}
      </div>
    </div>

    <!-- datasets -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon
          name="datasets"
          width="18"
          height="18"
        />
        <span>{{ $t('organization.dataset') }}</span>
      </h3>
      <div
        v-if="hasDatasets"
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <repo-item
          v-for="dataset in datasets.data"
          :repo="dataset"
          repo-type="dataset"
        ></repo-item>
      </div>
      <div
        v-else
        class="flex flex-wrap gap-4 mb-4 mt-[16px]"
      >
        {{ $t('all.noData') }}
      </div>
    </div>

    <!-- code repo -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon
          name="codes"
          width="18"
          height="18"
        />
        <span>{{ $t('organization.code') }}</span>
      </h3>
      <div
        v-if="hasCodes"
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <repo-item
          v-for="code in codes.data"
          :repo="code"
          repo-type="code"
        ></repo-item>
      </div>
      <div
        v-else
        class="flex flex-wrap gap-4 mb-4 mt-[16px]"
      >
        {{ $t('all.noData') }}
      </div>
    </div>

    <!-- spaces -->
    <div class="mt-[32px]">
      <h3 class="text-[20px] text-[#303133] flex items-center gap-[8px]">
        <SvgIcon
          name="spaces"
          width="18"
          height="18"
        />
        <span>{{ $t('organization.space') }}</span>
      </h3>
      <div
        v-if="hasSpaces"
        class="grid grid-cols-2 xl:grid-cols-1 gap-4 mb-4 mt-[16px]"
      >
        <application-space-item
          v-for="repo in spaces.data"
          :repo="repo"
          repo-type="space"
        />
      </div>
      <div
        v-else
        class="flex flex-wrap gap-4 mb-4 mt-[16px]"
      >
        {{ $t('all.noData') }}
      </div>
    </div>
  </div>
</template>
<script setup>
  import { computed, ref, onMounted, inject } from 'vue'

  import RepoItem from "'../shared/RepoItem.vue"
  import ApplicationSpaceItem from "../application_spaces/ApplicationSpaceItem.vue"

  const models = ref([])
  const datasets = ref([])
  const codes = ref([])
  const spaces = ref([])

  const hasModels = computed(() => models.value?.total > 0)
  const hasDatasets = computed(() => datasets.value?.total > 0)
  const hasCodes = computed(() => codes.value?.total > 0)
  const hasSpaces = computed(() => spaces.value?.total > 0)
</script>
