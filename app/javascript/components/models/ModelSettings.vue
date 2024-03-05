<template>
  <div class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]">
    <!-- 展示英文名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('models.modelName')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('models.modelNickName')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">{{ $t('models.namespaceModelName')}}</p>
        <div class="w-[512px] sm:w-full rounded-[8px] bg-[#F9FAFB] px-[14px] py-[10px] border">
          {{ modelPath }}
        </div>
      </div>
    </div>

    <el-divider/>

    <!-- 更新模型别名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('models.modelNickName')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('models.edit.tips')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
            v-model="theModelNickname"
            clearable
            size="large"
            class="!w-[512px] sm:!w-full"
        />
        <el-button @click="updateNickname" class="w-[100px]">{{ $t('all.update')}}</el-button>
      </div>
    </div>

    <el-divider/>

    <!-- 更新模型简介 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('models.modelDesc')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('models.edit.tips2')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
            v-model="theModelDesc"
            clearable
            size="large"
            type="textarea"
            class="!w-[512px] sm:!w-full"
        />
        <el-button @click="updateModelDesc" class="w-[100px]">{{ $t('all.update')}}</el-button>
      </div>
    </div>

    <el-divider/>

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('models.edit.changeVisibility')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('models.edit.statusText')}}
          <span class="text-black font-semibold">【{{ visibility=='Private' ? this.$t('all.private') : this.$t('all.public') }}】</span>
          {{ $t('models.edit.status')}}。{{ visibility=='Private' ? this.$t('models.edit.privateVis') : this.$t('models.edit.publicVis')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">{{ $t('models.edit.modelVisibility')}}</p>
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

    <!-- 删除模型 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('models.edit.delModel')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('models.edit.delTips')}}
          <span class="text-black font-medium">{{ $t('all.canNot')}}</span>
          {{ $t('models.edit.delTips2')}}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('models.edit.delTips3')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('all.enterPls')}}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('all.sureDel')}}
        </div>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p class="text-[#344054] text-[14px]">{{ $t('models.modelName')}}</p>
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
              :class="delDesc === modelPath ?'bg-[#D92D20] text-[#FFFFFF] cursor-pointer active:shadow-box active:space-y-0 active:space-x-0 active:ring-4 active:ring-red-400 active:ring-opacity-25 active:bg-[#D92D20] hover:text-white':'bg-[#F2F4F7]'"
              @mouseover="handleMouseOver"
              @mouseleave="handleMouseLeave">
              {{ $t('models.edit.confirmDel')}}
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
    modelNickname: String,
    modelDesc: String,
    default_branch: String,
    private: Boolean
  },
  components: {},
  data() {
    return {
      visibility: this.private ? 'Private' : 'Public',
      delDesc: '',
      modelName: this.path.split('/')[1],
      theModelNickname: this.modelNickname || "",
      theModelDesc: this.modelDesc || "",
      modelPath: this.path,
      options: [{value: 'Private', label: this.$t('all.private')},
        {value: 'Public', label:  this.$t('all.public')}]
    };
  },
  mounted() {
  },
  methods: {
    clickDelete() {
      if (this.delDesc === this.modelPath) {
        this.deleteModel().catch((err) => {
          ElMessage({
            message: err.message,
            type: "warning",
          })
        })
      }
    },

    async deleteModel() {
      const modelDeleteEndpoint = "/internal_api/models/" + this.path
      const option = {method: 'DELETE'}
      const response = await csrfFetch(modelDeleteEndpoint, option)

      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.message)
        })
      } else {
        ElMessage({message: this.$t('all.delSuccess'), type: "success"})
        setTimeout(() => {
          window.location.href = "/models"
        }, 500)
        return response.json()
      }
    },

    changeVisibility(value) {
      ElMessageBox({
        title: this.$t('models.edit.changeVisibility'),
        message: h('p', null, [
          h('span', null, this.$t('all.changeVis')),
          h('span', null, this.visibility=='Private'? this.$t('all.private') : this.$t('all.public')),
          h('span', null, this.visibility=='Private'? this.$t('models.edit.privateInfo') : this.$t('models.edit.publicInfo'))
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
      this.updateModel(payload)
    },

    updateNickname() {
      if (!!this.theModelNickname.trim()) {
        const payload = {nickname: this.theModelNickname}
        this.updateModel(payload)
      } else {
        ElMessage({ message: this.$t('models.edit.needDatasetName'), type: "warning" })
      }
    },

    updateModelDesc() {
      if (!!this.theModelDesc.trim()) {
        const payload = {desc: this.theModelDesc}
        this.updateModel(payload)
      } else {
        ElMessage({ message: this.$t('models.edit.needDatasetDesc'), type: "warning" })
      }
    },

    async updateModel(payload) {
      const modelUpdateEndpoint = "/internal_api/models/" + this.path
      const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      }
      const response = await csrfFetch(modelUpdateEndpoint, options)
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
