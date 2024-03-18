<template>
  <div class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]">
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

export default {
  props: {
    path: String,
    applicationSpaceNickname: String,
    applicationSpaceDesc: String,
    default_branch: String,
    private: Boolean
  },
  components: {},
  data() {
    return {
      visibility: this.private ? 'Private' : 'Public',
      delDesc: '',
      applicationSpaceName: this.path.split('/')[1],
      theApplicationSpaceNickname: this.applicationSpaceNickname || "",
      theApplicationSpaceDesc: this.applicationSpaceDesc || "",
      applicationSpacePath: this.path,
      options: [{value: 'Private', label: this.$t('all.private')},
        {value: 'Public', label:  this.$t('all.public')}]
    };
  },
  mounted() {
  },
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

    async deleteApplicationSpace() {
      const applicationSpaceDeleteEndpoint = "/internal_api/application_spaces/" + this.path
      const option = {method: 'DELETE'}
      const response = await csrfFetch(applicationSpaceDeleteEndpoint, option)

      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.message)
        })
      } else {
        ElMessage({message: this.$t('all.delSuccess'), type: "success"})
        setTimeout(() => {
          window.location.href = "/application_spaces"
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
      const applicationSpaceUpdateEndpoint = "/internal_api/application_spaces/" + this.path
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
    }
  }
}
</script>
