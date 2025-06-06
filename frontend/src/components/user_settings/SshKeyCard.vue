<template>
  <div class="mt-[16px] rounded-lg bg-gray-100 p-[12px] w-[480px] lg:w-full">
    <div class="flex items-center pb-[16px] pt-[2px] border-b-2 md:block relative">
      <p class="font-medium text-base break-words mr-[8px]">{{ theSshKeyName }}</p>
      <p class="text-gray-500 text-[13px] md:pl-0 md:mt-[4px]"> {{ passedTime }}</p>
      <div @click="deleteDialogVisible = true"
           class="flex items-center justify-center absolute top-0 right-0 btn btn-secondary-gray btn-sm">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
              d="M2.33366 2.91699L2.73981 9.82157C2.80217 10.8818 2.83336 11.4119 3.05963 11.8141C3.25882 12.1683 3.56115 12.4533 3.92637 12.6314C4.34125 12.8337 4.87226 12.8337 5.93429 12.8337H8.06636C9.12839 12.8337 9.6594 12.8337 10.0743 12.6314C10.4395 12.4533 10.7418 12.1683 10.941 11.8141C11.1673 11.4119 11.1985 10.8818 11.2608 9.82157L11.667 2.91699M2.33366 2.91699H1.16699M2.33366 2.91699H11.667M11.667 2.91699H12.8337M9.33366 2.91699L9.30372 2.82719C9.21047 2.54744 9.16385 2.40756 9.10498 2.28735C8.8112 1.68746 8.23732 1.27383 7.57531 1.18483C7.44265 1.16699 7.29521 1.16699 7.00033 1.16699V1.16699C6.70544 1.16699 6.558 1.16699 6.42535 1.18483C5.76333 1.27383 5.18946 1.68746 4.89567 2.28735C4.8368 2.40756 4.79018 2.54744 4.69693 2.82719L4.66699 2.91699M5.83366 5.83366V9.91699M8.16699 5.83366V8.16699"
                stroke="#606266" stroke-width="0.857143" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
      </div>
    </div>
    <div class="pt-[16px]">
      <div class="flex items-center">
        <el-input
          v-model="theSshKey"
          type="password"
          show-password
          onfocus="this.blur()"
          :show-copy="false"
        />
        <div
          class="btn btn-secondary-gray btn-sm ml-2"
          @click="copyKey"
        >
          <SvgIcon name="copy" />
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="deleteDialogVisible" :title="$t('sshKey.delKeyName', {value: sshKeyName})" width="30%" class="dialogWidth"
             style="border-radius: var(--border-radius-md);" left>
    <div class="flex items-start justify-start h-auto">
      <p>{{ $t('sshKey.sureDelKey') }}</p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <CsgButton :name="$t('all.cancel')" class="btn btn-secondary-gray btn-sm" @click="deleteDialogVisible = false" />
        <CsgButton :name="$t('all.delete')" class="btn btn-danger btn-sm ml-[12px]" @click="confirmDeleteSshKey(theSshKeyName)" />
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {ElMessage} from "element-plus"
import useFetchApi from '../../packs/useFetchApi'
import SvgIcon from '../shared/SvgIcon.vue'
import { copyToClipboard } from '../../packs/clipboard'

export default {
  components: {
    SvgIcon
  },
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
      const now = new Date()
      const createTime = new Date(this.theCreateTime)
      const passedTimeInSeconds = (now - createTime)/1000
      const oneMinute = 60
      const oneHour = oneMinute * 60
      const oneDay = oneHour * 24
      
      // Show specific date if more than 30 days
      if (passedTimeInSeconds > oneDay * 30) {
        return this.$t('sshKey.addedOn', {
          year: createTime.getFullYear(),
          month: createTime.getMonth() + 1,
          day: createTime.getDate()
        })
      }
      
      if (passedTimeInSeconds < oneHour) {
        return this.$t('sshKey.addedMinutesAgo', {
          minutes: Math.ceil(passedTimeInSeconds/oneMinute)
        })
      } else if (passedTimeInSeconds < oneDay) {
        return this.$t('sshKey.addedHoursAgo', {
          hours: Math.ceil(passedTimeInSeconds/oneHour)
        })
      } else {
        return this.$t('sshKey.addedDaysAgo', {
          days: Math.ceil(passedTimeInSeconds/oneDay)
        })
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
    },
    copyKey() {
      copyToClipboard(this.theSshKey)
    }
  }
}
</script>
