<template>
  <div>
    <el-dropdown class="h-9">
      <el-button plain type="default" class="btn btn-secondary-gray btn-sm !h-full">
        <SvgIcon name="laptop-notebook" class="mr-2" />
        <div class="text-gray-700">{{ t("all.useModel") }}</div>
        <el-icon class="ml-1 el-icon--right">
          <arrow-down />
        </el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <!-- finetune -->
          <div v-if="!actionLimited && repoType === 'model' && !enableFinetune" class="flex items-center w-[80%]">
            <el-dropdown-item :disabled="true">
              <div class="flex items-center">
                <SvgIcon name="model_finetune_create" class="mr-2 w-[14px]" />
                {{ t("finetune.title") }}
              </div>
            </el-dropdown-item>
            
            <el-tooltip
              placement="top"
              effect="dark"
              :show-after="0"
              popper-class="custom-tooltip"
              style="margin-left: -20px"
            >
              <template #content>
                <div>
                  <span  v-if="repo.disableFinetuneReason">{{ repo.disableFinetuneReason }},</span> 
                  <a href="https://opencsg.com/docs/inferencefinetune/finetune_faq" target="_blank" style="color: #fff; text-decoration: underline;">
                    {{ t('all.viewDocumentation') }}
                  </a>
                </div>
              </template>
              <SvgIcon name="info" width="13" height="13" class="cursor-pointer" />
            </el-tooltip>
          </div>
          
          <div v-else-if="!actionLimited && repoType === 'model'" class="flex items-center w-[80%]">
            <el-dropdown-item 
              :disabled="mirrorTaskRunning"
              @click="handleFinetuneClick"
            >
              <div class="flex items-center">
                <SvgIcon name="model_finetune_create" class="mr-2  w-[14px]" />
                {{ t("finetune.title") }}
              </div>
            </el-dropdown-item>
            
            <el-tooltip
              placement="top"
              effect="dark"
              :show-after="0"
              popper-class="custom-tooltip"
              style="margin-left: -20px"
            >
              <template #content>
                <a href="https://opencsg.com/docs/inferencefinetune/finetune_create" target="_blank" style="color: #fff; text-decoration: underline;">
                  {{ t('all.viewDocumentation') }}
                </a>
              </template>
              <SvgIcon name="input_tip" width="13" height="13" class="cursor-pointer" />
            </el-tooltip>
          </div>
          
          <!-- endpoint -->
          <div v-if="!actionLimited && repoType === 'model' && enableEndpoint" class="flex items-center w-[80%]">
            <el-dropdown-item 
              @click="handleEndpointClick"
            >
              <div class="flex items-center">
                <SvgIcon name="model_endpoint_create" class="mr-2  w-[14px]" />
                {{ t("endpoints.new.dedicated") }}
              </div>
            </el-dropdown-item>
            
            <el-tooltip
              placement="top"
              effect="dark"
              :show-after="0"
              popper-class="custom-tooltip"
              style="margin-left: -20px"
            >
              <template #content>
                <a href="https://opencsg.com/docs/inferencefinetune/endpoint_create" target="_blank" style="color: #fff; text-decoration: underline;">
                  {{ t('all.viewDocumentation') }}
                </a>
              </template>
              <SvgIcon name="input_tip" width="13" height="13" class="cursor-pointer" />
            </el-tooltip>
          </div>
          
          <div v-else class="flex items-center w-[80%]">
            <el-dropdown-item :disabled="true">
              <div class="flex items-center">
                <SvgIcon name="model_endpoint_create" class="mr-2 w-[14px]" />
                {{ t("endpoints.new.dedicated") }}
              </div>
            </el-dropdown-item>
            
            <el-tooltip
              placement="top"
              effect="dark"
              :show-after="0"
              popper-class="custom-tooltip"
              style="margin-left: -20px"
            >
              <template #content>
                <div>
                  <span v-if="repo.disableInferenceReason">{{ repo.disableInferenceReason }},</span>
                  <a href="https://opencsg.com/docs/inferencefinetune/endpoint_faq" target="_blank" style="color: #fff; text-decoration: underline;">
                    {{ t('all.viewDocumentation') }}
                  </a>
                </div>
              </template>
              <SvgIcon name="info" width="13" height="13" class="cursor-pointer" />
            </el-tooltip>
          </div>
          
          <!-- notebook -->
          <el-dropdown-item>
            <a class="flex items-center" href="/notebooks/new">
                <SvgIcon name="laptop-notebook" class="mr-2" />
                {{ t("notebooks.useNotebook") }}
            </a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router';
import useUserStore from '../../stores/UserStore.js';
import { storeToRefs } from 'pinia';
import { ToLoginPage } from '@/packs/utils';
import { computed } from 'vue';
import SvgIcon from './SvgIcon.vue'

const props = defineProps({
  repo: Object,
  enableFinetune: Boolean,
  enableEndpoint: Boolean,
  modelId: String,
  repoType: {
    type: String,
    default: 'model'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const { isLoggedIn, actionLimited } = storeToRefs(userStore);

const httpCloneUrl = computed(() => {
  return props.repo?.http_clone_url || "";
});

const mirrorTaskRunning = computed(() => {
  return props.repo.mirrorTaskStatus === 'running'
})
  
const handleFinetuneClick = () => {
  if (isLoggedIn.value) {
    window.location.href = `/finetune/new?model_id=${props.modelId}&repoType=model`;
  } else {
    ToLoginPage();
  }
};

const handleEndpointClick = () => {
  if (isLoggedIn.value) {
    window.location.href = `/endpoints/new?model_id=${props.modelId}`;
  } else {
    ToLoginPage();
  }
};
</script>

<style lang="less" scoped>
.custom-tooltip {
  z-index: 9999;
}

.flex.items-center {
  position: relative;
  
  .el-tooltip {
    display: inline-flex;
    align-items: center;
  }
}

// 优化下拉菜单中的内容对齐
.el-dropdown-menu {
  .el-dropdown-item {
    padding-right: 30px; // 留出空间给tooltip图标
  }
}
</style>
