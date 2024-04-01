<template>
  <div class="relative">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="isApplicationSpace ? $t('application_spaces.app') : $t('all.summary')"
                   name="summary"
      >
        <slot name="summary"></slot>
      </el-tab-pane>
      <el-tab-pane :label="$t('all.files')" name="files">
        <slot name="files"></slot>
      </el-tab-pane>
      <el-tab-pane :label="$t('all.community')" name="community" class="min-h-[300px]">
        <slot name="community"></slot>
      </el-tab-pane>
      <el-tab-pane v-if="settingsVisibility" :label="$t('all.settings')" name="settings" class="min-h-[300px]">
        <slot name="settings"></slot>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
  .el-tabs__header {
    margin-bottom: 0;
    z-index: 0;
  }

  .el-tabs__nav-wrap:after {
    height: 1px;
  }

  .el-tabs__nav-scroll {
    @media screen and (max-width: 768px) {
      padding-left: 20px;
    }
  }
</style>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  defaultTab: String,
  settingsVisibility: Boolean,
  repoType: String
})

const isApplicationSpace = computed(() => {
  return props.repoType === 'space'
})

const activeName = ref(props.defaultTab)
</script>
