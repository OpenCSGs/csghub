<template>
  <div class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]">
    <div class="flex flex-col gap-[8px]">
      <div class="flex items-center gap-[20px] text-[20px] leading-[28px] font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
              d="M14.6663 7.99984C14.6663 9.6665 12.6663 13.3332 7.99967 13.3332C3.33301 13.3332 1.33301 9.6665 1.33301 7.99984C1.33301 6.33317 3.33301 2.6665 7.99967 2.6665C12.6663 2.6665 14.6663 6.33317 14.6663 7.99984Z"
              stroke="#606266" stroke-linecap="round"/>
          <path
              d="M9.99967 7.99984C9.99967 9.10441 9.10424 9.99984 7.99967 9.99984C6.89511 9.99984 5.99967 9.10441 5.99967 7.99984C5.99967 6.89527 6.89511 5.99984 7.99967 5.99984C9.10424 5.99984 9.99967 6.89527 9.99967 7.99984Z"
              stroke="#606266" stroke-linecap="round"/>
        </svg>
        修改数据集可见性
      </div>
      <div class="max-w-[864px] ml-[36px] text-[14px] text-[#606266] leading-[22px]">当前数据集目前是<span
          class="text-black font-semibold">【{{ visibility=='Private'?'私有':'公开' }}】</span>状态。只有您（个人模式）或您组织的成员（组织模式）可见并可以提交变更到当前数据集。
      </div>
      <el-select v-model="visibility"
                 :disabled="true"
                 @change="changeVisibility"
                 placeholder="Select"
                 class="w-[240px] ml-[36px]">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </div>
    <el-divider/>
    <div class="flex flex-col gap-[8px]">
      <div class="flex items-center gap-[20px] text-[20px] leading-[28px] font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
              d="M2.66634 3.3335L3.09677 10.6507C3.17992 12.0643 3.22149 12.7711 3.52319 13.3075C3.78878 13.7797 4.19189 14.1597 4.67885 14.3971C5.23202 14.6668 5.94003 14.6668 7.35607 14.6668H8.64328C10.0593 14.6668 10.7673 14.6668 11.3205 14.3971C11.8075 14.1597 12.2106 13.7797 12.4762 13.3075C12.7779 12.7711 12.8194 12.0643 12.9026 10.6507L13.333 3.3335M2.66634 3.3335H1.33301M2.66634 3.3335H13.333M13.333 3.3335H14.6663M10.6663 3.3335L10.3644 2.42753C10.2332 2.03412 10.1676 1.83742 10.046 1.69199C9.93863 1.56356 9.80072 1.46416 9.64492 1.40288C9.4685 1.3335 9.26115 1.3335 8.84646 1.3335H7.15289C6.7382 1.3335 6.53085 1.3335 6.35443 1.40288C6.19863 1.46416 6.06071 1.56356 5.95332 1.69199C5.8317 1.83742 5.76613 2.03412 5.635 2.42753L5.33301 3.3335M6.66634 6.66683V11.3335M9.33301 6.66683V9.3335"
              stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        删除数据集
      </div>
      <div class="ml-[36px] text-[14px] text-[#606266] leading-[22px]">此操作<span
          class="text-black font-semibold">无法</span> 撤销. 这将永久删除<span
          class="text-black font-semibold">{{ path }}</span>数据集及其所有文件。
      </div>
      <div class="ml-[36px] text-[14px] text-[#606266] leading-[22px]">请输入<span
          class="text-black font-semibold">{{ path }}</span>以确认删除.
      </div>
      <el-input
          v-model="delDesc"
          clearable
          class="max-w-[240px] ml-[36px]"
      />
      <div class="ml-[36px] flex">
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
</template>
<script>
import {h} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import csrfFetch from "../../packs/csrfFetch"

export default {
  props: {
    path: String,
    default_branch: String,
    private: Boolean
  },
  components: {},
  data() {
    return {
      visibility: this.private ? 'Private' : 'Public',
      delDesc: '',
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
