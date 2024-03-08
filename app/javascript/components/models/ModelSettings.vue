<template>
  <div class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]">
    <!-- 展示英文名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          模型名称
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          应用于模型路径，创建后不可更改
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">命名空间/模型名称</p>
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
          模型别名
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          将会显示在模型列表页面中，选填
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
            v-model="theModelNickname"
            clearable
            size="large"
            class="!w-[512px] sm:!w-full"
        />
        <el-button @click="updateNickname" class="w-[100px]">更新</el-button>
      </div>
    </div>

    <el-divider/>

    <!-- 更新模型简介 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          模型简介
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          一段关于模型的介绍，选填
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
        <el-button @click="updateModelDesc" class="w-[100px]">更新</el-button>
      </div>
    </div>

    <el-divider/>

        <!-- 模型标签 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          模型标签
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          选择模型对应的分类标签，便于用户在筛选时更快的找到您的模型。
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">模型可见性</p>
        <div class="flex flex-col gap-[6px]">
        <el-input
            v-model="theModelNickname"
            clearable
            size="large"
            class="!w-[512px] sm:!w-full"
        />
        <el-button @click="updateNickname" class="w-[100px]">更新</el-button>
      </div>
      </div>
    </div>

    <el-divider/>

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          修改模型可见性
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          当前模型目前是
          <span class="text-black font-semibold">【{{ visibility=='Private'?'私有':'公开' }}】</span>
          状态。{{ visibility=='Private'?'只有创建者或组织成员可见':'任何人都可以看到此模型'}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">模型可见性</p>
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
          删除模型
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          此操作
          <span class="text-black font-medium">无法</span>
          撤销，这将永久删除
          <span class="text-black font-medium break-words">{{ path }}</span>
          模型仓库及其所有文件。
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          请输入
          <span class="text-black font-medium break-words">{{ path }}</span>
          以确认删除.
        </div>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p class="text-[#344054] text-[14px]">模型名称</p>
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
              我已知晓,确认删除
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
      options: [{value: 'Private', label: '私有'},
        {value: 'Public', label: '公开'}]
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
        ElMessage({message: "删除成功", type: "success"})
        setTimeout(() => {
          window.location.href = "/models"
        }, 500)
        return response.json()
      }
    },

    changeVisibility(value) {
      ElMessageBox({
        title: '修改模型可见性',
        message: h('p', null, [
          h('span', null, '修改可见性为'),
          h('span', null, this.visibility=='Private'?'私有':'公开'),
          h('span', null, this.visibility=='Private'?'，仅创建者或者组织管理员可进行提交':'， 任何互联网上的人都可以看到此模型。')
        ]),
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }).then(() => {
        this.changeVisibilityCall(value)
      }).catch(() => {
        this.visibility = this.visibility === 'Private' ? 'Public' : 'Private'
        ElMessage({
          type: 'warning',
          message: '操作取消',
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
        ElMessage({ message: "请先提供模型别名", type: "warning" })
      }
    },

    updateModelDesc() {
      if (!!this.theModelDesc.trim()) {
        const payload = {desc: this.theModelDesc}
        this.updateModel(payload)
      } else {
        ElMessage({ message: "请先提供模型介绍", type: "warning" })
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
