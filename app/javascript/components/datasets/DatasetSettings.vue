<template>
  <div class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]">
    <!-- 展示英文名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          数据集名称
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          应用于数据集路径，创建后不可更改
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[14px] text-[#475467]">命名空间/数据集名称</p>
        <div class="w-[512px] sm:w-full rounded-[8px] bg-[#F9FAFB] px-[14px] py-[10px] border">
          {{ datasetPath }}
        </div>
      </div>
    </div>

    <el-divider/>

    <!-- 更新数据集别名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          数据集别名
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          将会显示在数据集列表页面中，选填
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
            v-model="theDatasetNickname"
            clearable
            size="large"
            class="!w-[512px] sm:!w-full"
        />
        <el-button @click="updateNickname" class="w-[100px]">更新</el-button>
      </div>
    </div>

    <el-divider/>

    <!-- 更新数据集简介 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          数据集简介
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          一段关于数据集的介绍，选填
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
            v-model="theDatasetDesc"
            clearable
            size="large"
            type="textarea"
            class="!w-[512px] sm:!w-full"
        />
        <el-button @click="updateDatasetDesc" class="w-[100px]">更新</el-button>
      </div>
    </div>

    <el-divider/>

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          修改数据集可见性
        </div>
        <div class="max-w-[864px] text-[14px] text-[#475467] leading-[20px]">
          当前数据集目前是
          <span class="text-black font-medium">【{{ visibility=='Private'?'私有':'公开' }}】</span>
          状态。{{ visibility=='Private'?'只有创建者或组织成员可见':'任何人都可以看到此数据集'}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[14px] text-[#475467]">数据集可见性</p>
        <el-select v-model="visibility"
                   @change="changeVisibility"
                   placeholder="Select"
                   size="large"
                   class="!w-[512px] sm:!w-full"
                   :disabled="true"
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

    <!-- 数据集删除 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          删除数据集
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          此操作
          <span class="text-black font-medium">无法</span>
          撤销，这将永久删除
          <span class="text-black font-medium break-words">{{ path }}</span>
          数据集及其所有文件。
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          请输入
          <span class="text-black font-medium break-words">{{ path }}</span>
          以确认删除.
        </div>
      </div>

      <div class="flex flex-col gap-[8px]">
        <p class="text-[14px] text-[#475467]">数据集名称</p>
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
              :class="delDesc === datasetPath ?'bg-[#D92D20] text-[#FFFFFF] cursor-pointer active:shadow-box active:space-y-0 active:space-x-0 active:ring-4 active:ring-red-400 active:ring-opacity-25 active:bg-[#D92D20] hover:text-white':'bg-[#F2F4F7]'"
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
    datasetNickname: String,
    datasetDesc: String,
    default_branch: String,
    private: Boolean
  },
  components: {},
  data() {
    return {
      visibility: this.private ? 'Private' : 'Public',
      delDesc: '',
      datasetName: this.path.split('/')[1],
      theDatasetNickname: this.datasetNickname || "",
      theDatasetDesc: this.datasetDesc || "",
      datasetPath: this.path,
      options: [{value: 'Private', label: '私有'},
        {value: 'Public', label: '公开'}]
    };
  },
  mounted() {},
  methods: {
    clickDelete() {
      if (this.delDesc === this.datasetPath) {
        this.deleteDataset().catch((err) => {
          ElMessage({
            message: err.message,
            type: "warning",
          })
        })
      }
    },
    async deleteDataset() {
      const datesetDeleteEndpoint = "/internal_api/datasets/" + this.path
      const option = {method: 'DELETE'}
      const response = await csrfFetch(datesetDeleteEndpoint, option)

      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.message)
        })
      } else {
        ElMessage({message: "删除成功", type: "success"})
        setTimeout(() => {
          window.location.href = "/datasets"
        }, 1000)
        return response.json()
      }
    },

    changeVisibility(value) {
      ElMessageBox({
        title: '修改数据集可见性',
        message: h('p', null, [
          h('span', null, '修改可见性为'),
          h('span', null, this.visibility=='Private'?'私有':'公开'),
          h('span', null, this.visibility=='Private'?'，仅创建者或者组织管理员可进行提交':'， 任何互联网上的人都可以看到此数据集。')
        ]),
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }).then((action) => {
        ElMessage({
          type: 'success',
          message: '切换成功',
        })
      }).catch(() => {
        this.visibility = value === 'Public' ? 'Private' : 'Public'
        ElMessage({
          type: 'warning',
          message: '操作取消',
        })
      })
    },

    updateNickname() {
      if (!!this.theDatasetNickname.trim()) {
        const payload = {nickname: this.theDatasetNickname}
        this.updateDataset(payload)
      } else {
        ElMessage({ message: "请先提供数据集别名", type: "warning" })
      }
    },

    updateDatasetDesc() {
      if (!!this.theDatasetDesc.trim()) {
        const payload = {desc: this.theDatasetDesc}
        this.updateDataset(payload)
      } else {
        ElMessage({ message: "请先提供数据集介绍", type: "warning" })
      }
    },

    async updateDataset(payload) {
      const datasetUpdateEndpoint = "/internal_api/datasets/" + this.path
      const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      }
      const response = await csrfFetch(datasetUpdateEndpoint, options)
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
