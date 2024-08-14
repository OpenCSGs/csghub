<template>
  <div class="mt-[16px] rounded-lg bg-[#F5F7FA] p-[12px] w-[480px] lg:w-full">
    <div class="flex items-center pb-[16px] pt-[2px] border-b-2 md:block relative">
      <p class="font-medium text-base break-words mr-[8px]">{{ theSshKeyName }}</p>
      <p class="text-[#606266] text-[13px] md:pl-0 md:mt-[4px]"> {{ passedTime }}</p>
      <div @click="deleteDialogVisible = true"
           class="flex items-center justify-center absolute top-0 right-0 w-[46px] h-[32px] bg-white rounded border-2 text-right">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M2.33366 2.91699L2.73981 9.82157C2.80217 10.8818 2.83336 11.4119 3.05963 11.8141C3.25882 12.1683 3.56115 12.4533 3.92637 12.6314C4.34125 12.8337 4.87226 12.8337 5.93429 12.8337H8.06636C9.12839 12.8337 9.6594 12.8337 10.0743 12.6314C10.4395 12.4533 10.7418 12.1683 10.941 11.8141C11.1673 11.4119 11.1985 10.8818 11.2608 9.82157L11.667 2.91699M2.33366 2.91699H1.16699M2.33366 2.91699H11.667M11.667 2.91699H12.8337M9.33366 2.91699L9.30372 2.82719C9.21047 2.54744 9.16385 2.40756 9.10498 2.28735C8.8112 1.68746 8.23732 1.27383 7.57531 1.18483C7.44265 1.16699 7.29521 1.16699 7.00033 1.16699V1.16699C6.70544 1.16699 6.558 1.16699 6.42535 1.18483C5.76333 1.27383 5.18946 1.68746 4.89567 2.28735C4.8368 2.40756 4.79018 2.54744 4.69693 2.82719L4.66699 2.91699M5.83366 5.83366V9.91699M8.16699 5.83366V8.16699"
              stroke="#606266" stroke-width="0.857143" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    <div class="pt-[16px]"><p class="break-all text-[#606266] text-sm">{{ theSshKey }}</p></div>
  </div>
  <el-dialog v-model="deleteDialogVisible" :title="$t('sshKey.delKeyName', {value: sshKeyName})" width="30%" class="dialogWidth"
             style="border-radius: 0.5rem;" left>
    <div class="flex items-center justify-center h-[108px]">
      <p>{{ $t('sshKey.sureDelKey') }}</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmDeleteSshKey(theSshKeyName)">
          {{ $t('all.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {ElMessage} from "element-plus"
import useFetchApi from '../../packs/useFetchApi'

export default {
  props: {
    profileName: String,
    sshKeyName: String,
    sshKey: String,
    createTime: String,
    sshKeyId: Number
  },

  data() {
    return {
      deleteDialogVisible: false,
      theSshKeyName: this.sshKeyName,
      theSshKey: this.sshKey,
      theSshKeyId: this.sshKeyId,
      theCreateTime: this.createTime,
      theMinutesDifference: '',
      theHoursDifference: '',
      theDaysDifference: '',
    }
  },

  computed: {
    passedTime() {
      const passedTimeInSeconds = (new Date() - new Date(this.theCreateTime))/1000
      const oneHour = 60*60
      if (passedTimeInSeconds < oneHour) {
        return `不到 ${Math.ceil(passedTimeInSeconds/60)} 分钟前添加`
      } else if (passedTimeInSeconds < oneHour*24) {
        return `不到 ${Math.ceil(passedTimeInSeconds/oneHour)} 小时前添加`
      } else {
        return `不到 ${Math.ceil(passedTimeInSeconds/(oneHour*24))} 天前添加`
      }
    }
  },

  methods: {
    async confirmDeleteSshKey(theSshKeyName) {
      this.deleteDialogVisible = false
      const { error } = await useFetchApi(`/user/${this.profileName}/ssh_key/${this.theSshKeyName}`).delete().json()

      if (error.value) {
        ElMessage({message: error.value, type: "warning"})
      } else {
        setTimeout(() => {
          window.location.href = "/settings/ssh-keys"
        }, 1000)
        ElMessage({message: this.$t('all.delSuccess'), type: "success"})
      }
    }
  }
}
</script>
