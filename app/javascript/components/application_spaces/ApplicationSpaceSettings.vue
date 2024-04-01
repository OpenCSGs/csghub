<template>
  <div v-if="deployFailed"
       class="flex gap-[8px] mt-[32px] mb-[24px] p-[16px] border border-[#D0D5DD] rounded-[12px] shadow-xs"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clip-path="url(#clip0_8886_11536)">
        <path d="M9.99984 6.66699V10.0003M9.99984 13.3337H10.0082M18.3332 10.0003C18.3332 14.6027 14.6022 18.3337 9.99984 18.3337C5.39746 18.3337 1.6665 14.6027 1.6665 10.0003C1.6665 5.39795 5.39746 1.66699 9.99984 1.66699C14.6022 1.66699 18.3332 5.39795 18.3332 10.0003Z" stroke="#D92D20" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_8886_11536">
          <rect width="20" height="20" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    <div>
      <h3 class="text-[#475467] text-[14px] font-[500]">{{ $t('application_spaces.errorPage.errorAlert') }}</h3>
      <p class="text-[#475467] text-[14px]">{{ $t('application_spaces.errorPage.errorAlertDesc') }}</p>
      <p class="text-[#223B99] font-[400] text-[12px] mt-[12px] cursor-pointer" @click="showErrorLogs">{{ $t('application_spaces.errorPage.showErrorLogs') }}</p>
    </div>
  </div>

  <div class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]">
    <!-- cloud resource -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('application_spaces.edit.cloudResource')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('application_spaces.edit.cloudResourceDesc')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">{{ $t('application_spaces.edit.currentCloudResource')}}</p>
        <el-select v-model="theCloudResource"
                    placeholder="选择"
                    size="large"
                    class="!w-[512px] sm:!w-full"
        >
          <el-option
            v-for="item in spaceResources"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="disabledOptions.includes(item.value)"/>
        </el-select>
      </div>
    </div>

    <el-divider/>

    <!-- 暂停 Space -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('application_spaces.stopSpace')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <div class="flex flex-col gap-[6px]">
          <el-button @click="stopSpace"
                     class="w-[100px]"
                     :disabled="!initialized || isSpaceStopped"
          >
            {{ $t('application_spaces.stop')}}
          </el-button>
        </div>
        <!-- <el-switch
          v-model="isSpaceStopped"
          size="large"
          :before-change="toggleSpaceStatus"
          :active-text="$t('application_spaces.status.running')"
          :inactive-text="$t('application_spaces.status.stopped')"
        /> -->
      </div>
    </div>

    <el-divider/>

    <!-- 重启 Space -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('application_spaces.restartSpace')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-button @click="restartSpace"
                   class="w-[100px]"
                   :disabled="notInitialized"
        >
          {{ $t('application_spaces.restart')}}
        </el-button>
      </div>
    </div>

    <el-divider/>

    <!-- 展示英文名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('application_spaces.name')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('application_spaces.nickname')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">{{ $t('application_spaces.namespaceName')}}</p>
        <div class="w-[512px] sm:w-full rounded-[8px] bg-[#F9FAFB] px-[14px] py-[10px] border">
          {{ applicationSpacePath }}
        </div>
      </div>
    </div>

    <el-divider/>

    <!-- 更新应用空间别名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('application_spaces.nickname')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('application_spaces.edit.tips')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
            v-model="theApplicationSpaceNickname"
            clearable
            size="large"
            class="!w-[512px] sm:!w-full"
        />
        <el-button @click="updateNickname" class="w-[100px]">{{ $t('all.update')}}</el-button>
      </div>
    </div>

    <el-divider/>

    <!-- 更新应用空间简介 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('application_spaces.desc')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('application_spaces.edit.tips2')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
            v-model="theApplicationSpaceDesc"
            clearable
            size="large"
            type="textarea"
            class="!w-[512px] sm:!w-full"
        />
        <el-button @click="updateApplicationSpaceDesc" class="w-[100px]">{{ $t('all.update')}}</el-button>
      </div>
    </div>

    <el-divider/>

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('application_spaces.edit.changeVisibility')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('application_spaces.edit.statusText')}}
          <span class="text-black font-semibold">【{{ visibility=='Private' ? this.$t('all.private') : this.$t('all.public') }}】</span>
          {{ $t('application_spaces.edit.status')}}。{{ visibility=='Private' ? this.$t('application_spaces.edit.privateVis') : this.$t('application_spaces.edit.publicVis')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">{{ $t('application_spaces.edit.visibility')}}</p>
        <el-select v-model="visibility"
                   @change="changeVisibility"
                   placeholder="Select"
                   size="large"
                   class="!w-[512px] sm:!w-full"
        >
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <el-divider/>

    <!-- 删除应用空间 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('application_spaces.edit.del')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('application_spaces.edit.delTips')}}
          <span class="text-black font-medium">{{ $t('all.canNot')}}</span>
          {{ $t('application_spaces.edit.delTips2')}}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('application_spaces.edit.delTips3')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('all.enterPls')}}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('all.sureDel')}}
        </div>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p class="text-[#344054] text-[14px]">{{ $t('application_spaces.namespaceName')}}</p>
        <el-input
            v-model="delDesc"
            clearable
            size="large"
            class="!w-[512px] sm:!w-full"
        />
        <div class="flex">
          <div id="confirmDelete"
              @click="clickDelete"
              class="text-[#98A2B3] py-[8px] px-[12px] text-[14px] leading-[20px] rounded-[8px]"
              :class="delDesc === applicationSpacePath ?'bg-[#D92D20] text-[#FFFFFF] cursor-pointer active:shadow-box active:space-y-0 active:space-x-0 active:ring-4 active:ring-red-400 active:ring-opacity-25 active:bg-[#D92D20] hover:text-white':'bg-[#F2F4F7]'"
              @mouseover="handleMouseOver"
              @mouseleave="handleMouseLeave">
              {{ $t('application_spaces.edit.confirmDel')}}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import {h} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import csrfFetch from "../../packs/csrfFetch"
import { useCookies } from "vue3-cookies"

export default {
  props: {
    path: String,
    applicationSpaceNickname: String,
    applicationSpaceDesc: String,
    default_branch: String,
    appStatus: String,
    cloudResource: String,
    private: Boolean
  },

  components: {},

  data() {
    return {
      visibility: this.private ? 'Private' : 'Public',
      delDesc: '',
      applicationSpacePath: this.path,
      theApplicationSpaceNickname: this.applicationSpaceNickname || "",
      theApplicationSpaceDesc: this.applicationSpaceDesc || "",
      theCloudResource: this.cloudResource,
      options: [{value: 'Private', label: this.$t('all.private')},
                {value: 'Public', label:  this.$t('all.public')}],
      spaceResources:[
        {label: "CPU basic · 2 vCPU · 16GB ·免费", value: "CPU basic · 2 vCPU · 16GB"},
        {label: "NVIDIA T4 · 4 vCPU · 15 GB ·即将推出", value: "NVIDIA T4 · 4 vCPU · 15 GB"},
        {label: "NVIDIA A10G · 4 vCPU · 15 GB ·即将推出", value: "NVIDIA A10G · 4 vCPU · 15 GB"},
        {label: "NVIDIA A10G · 12 vCPU · 46 GB ·即将推出", value: "NVIDIA A10G · 12 vCPU · 46 GB"}
      ],
      disabledOptions: [
        "NVIDIA T4 · 4 vCPU · 15 GB",
        "NVIDIA A10G · 4 vCPU · 15 GB",
        "NVIDIA A10G · 12 vCPU · 46 GB"
      ],
      deployFailed: ['BuildingFailed', 'DeployFailed', 'RuntimeError'].includes(this.appStatus),
      initialized: ['Building', 'Deploying', 'Startup', 'Running', 'Stopped', 'Sleeping', 'BuildingFailed', 'DeployFailed', 'RuntimeError'].includes(this.appStatus),
      notInitialized: this.appStatus === 'NoAppFile',
      cookies: useCookies().cookies
    };
  },

  computed: {
    isSpaceStopped() {
      return this.appStatus === 'Stopped' ? true : false
    }
  },

  emits: ['showSpaceLogs'],

  mounted() {},

  methods: {
    clickDelete() {
      if (this.delDesc === this.applicationSpacePath) {
        this.deleteApplicationSpace().catch((err) => {
          ElMessage({
            message: err.message,
            type: "warning",
          })
        })
      }
    },

    async stopSpace() {
      stopUrl = `${csghubServer}/api/v1/spaces/${this.path}/stop`
      const response = await fetch(stopUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.cookies.get('user_token')}`,
        }
      })

      if (response.ok) {
        ElMessage({message: this.$t('application_spaces.toggleStatusSuccess'), type: "success"})
        return true
      } else {
        if (response.status === 401) {
          ElMessageBox.alert(t('user_sessions.expiredDesc'), t('user_sessions.expiredTitle'), {
            'show-close': false,
            confirmButtonText: t('user_sessions.reLogin'),
            callback: () => {
              window.location.href = "/logout"
            },
          })
        } else {
          response.json().then(data => {
            ElMessage({
              message: data.msg,
              type: 'warning'
            })
          })
        }
      }
    },

    async restartSpace() {
      restartUrl = `${csghubServer}/api/v1/spaces/${this.path}/run`
      const response = await fetch(restartUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.cookies.get('user_token')}`,
        }
      })

      if (response.ok) {
        ElMessage({message: this.$t('application_spaces.toggleStatusSuccess'), type: "success"})
        return true
      } else {
        if (response.status === 401) {
          ElMessageBox.alert(t('user_sessions.expiredDesc'), t('user_sessions.expiredTitle'), {
            'show-close': false,
            confirmButtonText: t('user_sessions.reLogin'),
            callback: () => {
              window.location.href = "/logout"
            },
          })
        } else {
          response.json().then(data => {
            ElMessage({
              message: data.msg,
              type: 'warning'
            })
          })
        }
      }
    },

    async toggleSpaceStatus() {
      let toggleUrl = ''
      if (this.appStatus === 'Stopped') {
        toggleUrl = `${csghubServer}/api/v1/spaces/${this.path}/run`
      } else {
        toggleUrl = `${csghubServer}/api/v1/spaces/${this.path}/stop`
      }
      const response = await fetch(toggleUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.cookies.get('user_token')}`,
        }
      })

      if (response.ok) {
        ElMessage({message: this.$t('application_spaces.toggleStatusSuccess'), type: "success"})
        return true
      } else {
        response.json().then(data => {
          ElMessage({
            message: data.msg,
            type: 'warning'
          });
        });
      }
    },

    async deleteApplicationSpace() {
      const applicationSpaceDeleteEndpoint = "/internal_api/spaces/" + this.path
      const option = {method: 'DELETE'}
      const response = await csrfFetch(applicationSpaceDeleteEndpoint, option)

      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.message)
        })
      } else {
        ElMessage({message: this.$t('all.delSuccess'), type: "success"})
        setTimeout(() => {
          window.location.href = "/spaces"
        }, 500)
        return response.json()
      }
    },

    changeVisibility(value) {
      ElMessageBox({
        title: this.$t('application_spaces.edit.changeVisibility'),
        message: h('p', null, [
          h('span', null, this.$t('all.changeVis')),
          h('span', null, this.visibility=='Private'? this.$t('all.private') : this.$t('all.public')),
          h('span', null, this.visibility=='Private'? this.$t('application_spaces.edit.privateInfo') : this.$t('application_spaces.edit.publicInfo'))
        ]),
        showCancelButton: true,
        confirmButtonText: this.$t('all.confirm'),
        cancelButtonText: this.$t('all.cancel')
      }).then(() => {
        this.changeVisibilityCall(value)
      }).catch(() => {
        this.visibility = this.visibility === 'Private' ? 'Public' : 'Private'
        ElMessage({
          type: 'warning',
          message: this.$t('all.changeCancel'),
        })
      })
    },

    changeVisibilityCall(value) {
      const privateSelected = (value === 'Private') ? true : false
      const payload = {private: privateSelected}
      this.updateApplicationSpace(payload)
    },

    updateNickname() {
      if (!!this.theApplicationSpaceNickname.trim()) {
        const payload = {nickname: this.theApplicationSpaceNickname}
        this.updateApplicationSpace(payload)
      } else {
        ElMessage({ message: this.$t('application_spaces.edit.needName'), type: "warning" })
      }
    },

    updateApplicationSpaceDesc() {
      if (!!this.theApplicationSpaceDesc.trim()) {
        const payload = {desc: this.theApplicationSpaceDesc}
        this.updateApplicationSpace(payload)
      } else {
        ElMessage({ message: this.$t('application_spaces.edit.needDesc'), type: "warning" })
      }
    },

    async updateApplicationSpace(payload) {
      const applicationSpaceUpdateEndpoint = "/internal_api/spaces/" + this.path
      const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      }
      const response = await csrfFetch(applicationSpaceUpdateEndpoint, options)
      if (!response.ok) {
        response.json().then((err) => {
          ElMessage({ message: err.message, type: "warning" })
        })
      } else {
        response.json().then((data) => {
          ElMessage({ message: data.message, type: "success" })
        })
      }
    },

    handleMouseOver() {
      if (this.delDesc !== '') {
        document.getElementById('confirmDelete').classList.replace('bg-[#D92D20]', 'bg-[#B42318]')
      }
    },

    handleMouseLeave() {
      document.getElementById('confirmDelete').classList.replace('bg-[#B42318]', 'bg-[#D92D20]')
    },

    showErrorLogs() {
      this.$emit("showSpaceLogs");
    }
  }
}
</script>
