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
        Change model visibility
      </div>
      <div class="max-w-[864px] ml-[36px] text-[14px] text-[#606266] leading-[22px]">This model is currently <span
          class="text-black font-semibold">【{{ visibility }}】</span>. Only you (personal model) or members of your
        organization (organization model) can see and commit to this model.
      </div>
      <el-select v-model="visibility"
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
        Delete this model
      </div>
      <div class="ml-[36px] text-[14px] text-[#606266] leading-[22px]">This action <span
          class="text-black font-semibold">cannot</span> be undone. This will permanently delete the <span
          class="text-black font-semibold">{{ path }}</span> model repository and all its files.
      </div>
      <div class="ml-[36px] text-[14px] text-[#606266] leading-[22px]">Please type <span
          class="text-black font-semibold">{{ path }}</span> to confirm.
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
          I understand, delete this model
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
      options: [{value: 'Private', label: 'Private'},
        {value: 'Public', label: 'Public'}]
    };
  },
  mounted() {},
  methods: {
    clickDelete() {
      if (this.delDesc === this.datasetPath) {
        this.deleteModel().catch((err) => {
          ElMessage({
            message: err.message,
            type: "warning",
          })
        })
      }
    },
    async deleteModel() {
      const modelDeleteEndpoint = "/models/" + this.path
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
        title: 'Change dataset visibility',
        message: h('p', null, [
          h('span', null, 'After changing visibility to '),
          h('span', null, this.visibility),
          h('span', null, '， anyone on the internet can see this dataset. Only you (personal dataset) or members of your organization (organization dataset) can commit.')
        ]),
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }).then(() => {
        this.changeVisibilityApi(value).then((data) => {
          ElMessage({
            message: data.message,
            type: "success",
          })
        })
      }).catch((err) => {
        ElMessage({
          type: 'warning',
          message: err.message,
        })
      })
    },

    async changeVisibilityApi(value) {
      const modelUpdateEndpoint = "/models/" + this.path
      const jsonData = {
        private: (value === 'Private') ? true : false,
        default_branch: this.default_branch,
        description: "Starhub Server Project Editedaaa."
      }
      const jsonStr = JSON.stringify(jsonData)
      const option = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: jsonStr
      }

      const response = await csrfFetch(modelUpdateEndpoint, option)

      if (!response.ok) {
        return response.json().then((data) => { throw new Error(data.message) })
      } else {
        return response.json()
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
