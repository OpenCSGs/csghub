<template>
  <el-dialog
    v-model="visible"
    width="400px"
    :close-on-click-modal="!isLoading"
    :close-on-press-escape="!isLoading"
    :show-close="false"
    @update:model-value="handleDialogClose"
    class="leave-org-dialog"
  >
    <div class="p-[30px]">
      <!-- Header with icon and close button -->
      <div class="flex items-start justify-between mb-6">
        <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 18H22M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="#D92D20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <button 
          @click="handleCancel"
          :disabled="isLoading"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">{{ $t('organization.leaveOrgTitle') }}</h3>
        <p class="text-gray-600 leading-relaxed">{{ $t('organization.leaveOrgContent') }}</p>
      </div>
      
      <!-- Footer buttons -->
      <div class="flex gap-3">
        <button 
          @click="handleCancel"
          :disabled="isLoading"
          class="flex-1 h-[44px] px-[10px] bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
        >
          {{ $t('organization.cancel') }}
        </button>
        <button 
          @click="handleLeave"
          :disabled="isLoading"
          class="flex-1 h-[44px] px-[10px] text-white rounded-md font-medium transition-colors flex items-center justify-center"
          :class="isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#D92D20] hover:bg-[#B91C1C]'"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ $t('organization.leaveOrgButton') }}
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import useFetchApi from '../../packs/useFetchApi'
import useUserStore from '../../stores/UserStore'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  organizationName: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const { t } = useI18n()
const userStore = useUserStore()
const isLoading = ref(false)

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleDialogClose = (value) => {
  if (!isLoading.value) {
    emit('update:modelValue', value)
  }
}

const handleCancel = () => {
  if (!isLoading.value) {
    emit('update:modelValue', false)
  }
}

const handleLeave = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    const { response, error } = await useFetchApi(`/organization/${props.organizationName}/members/${userStore.username}`, { body: JSON.stringify({role: props.userRole}) })
      .delete()
      .json()
    
    if (error.value) {
      ElMessage.error(t('organization.leaveOrgFailure'))
    } else if (response.value.ok) {
      // Update organizations in store before redirect
      await userStore.fetchOrgs()
      ElMessage.success(t('organization.leaveOrgSuccess'))
      
      // Redirect to profile page
      window.location.href = `/profile/${userStore.username}`
    } else {
      ElMessage.error(t('organization.leaveOrgFailure'))
    }
  } catch (error) {
    console.error('Leave organization error:', error)
    ElMessage.error(t('organization.leaveOrgNetworkError'))
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
.el-dialog.leave-org-dialog {
  padding: 0 !important;
}

.el-dialog.leave-org-dialog .el-dialog__header {
  padding: 0 !important;
}

.el-dialog.leave-org-dialog .el-dialog__body {
  padding: 0 !important;
}
</style>