<template>
  <div
    class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]">
    <!-- 展示英文名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('codes.codeName') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('codes.codeNickName') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('codes.namespaceCodeName') }}
        </p>
        <div
          class="w-[512px] sm:w-full rounded-[8px] bg-[#F9FAFB] px-[14px] py-[10px] border">
          {{ codePath }}
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 更新别名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('codes.codeNickName') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('codes.edit.tips') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
          v-model="theCodeNickname"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full" />
        <el-button
          @click="updateNickname"
          class="w-[100px]"
          >{{ $t('all.update') }}</el-button
        >
      </div>
    </div>

    <el-divider />

    <!-- 更新简介 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('codes.codeDesc') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('codes.edit.tips2') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
          v-model="theCodeDesc"
          clearable
          size="large"
          type="textarea"
          class="!w-[512px] sm:!w-full" />
        <el-button
          @click="updateCodeDesc"
          class="w-[100px]"
          >{{ $t('all.update') }}</el-button
        >
      </div>
    </div>

    <el-divider />

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('codes.edit.changeVisibility') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('codes.edit.statusText') }}
          <span class="text-black font-semibold"
            >【{{
              isPrivate ? this.$t('all.private') : this.$t('all.public')
            }}】</span
          >
          {{ $t('codes.edit.status') }}。{{
            isPrivate
              ? this.$t('codes.edit.privateVis')
              : this.$t('codes.edit.publicVis')
          }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[#344054] text-[14px]">
          {{ $t('codes.edit.codeVisibility') }}
        </p>
        <el-select
          v-model="visibilityName"
          @change="changeVisibility"
          placeholder="Select"
          size="large"
          class="!w-[512px] sm:!w-full">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </div>
    </div>

    <el-divider />

    <!-- 删除 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col gap-[6px]">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('codes.edit.delCode') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('codes.edit.delTips') }}
          <span class="text-black font-medium">{{ $t('all.canNot') }}</span>
          {{ $t('codes.edit.delTips2') }}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('codes.edit.delTips3') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('all.enterPls') }}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('all.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-[8px]">
        <p class="text-[#344054] text-[14px]">{{ $t('codes.codeName') }}</p>
        <el-input
          v-model="delDesc"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full" />
        <div class="flex">
          <div
            id="confirmDelete"
            @click="clickDelete"
            class="text-[#98A2B3] py-[8px] px-[12px] text-[14px] leading-[20px] rounded-[8px]"
            :class="
              delDesc === codePath
                ? 'bg-[#D92D20] text-[#FFFFFF] cursor-pointer active:shadow-box active:space-y-0 active:space-x-0 active:ring-4 active:ring-red-400 active:ring-opacity-25 active:bg-[#D92D20] hover:text-white'
                : 'bg-[#F2F4F7]'
            "
            @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave">
            {{ $t('codes.edit.confirmDel') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { h, inject } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import csrfFetch from '../../packs/csrfFetch'
  import jwtFetch from '../../packs/jwtFetch'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import { mapState, mapWritableState, mapActions } from 'pinia'

  export default {
    props: {
      path: String,
      codeNickname: String,
      codeDesc: String,
      default_branch: String
    },
    components: {},
    data() {
      return {
        csghubServer: inject('csghubServer'),
        delDesc: '',
        codeName: this.path.split('/')[1],
        theCodeNickname: this.codeNickname || '',
        theCodeDesc: this.codeDesc || '',
        codePath: this.path,
        options: [
          { value: 'Private', label: this.$t('all.private') },
          { value: 'Public', label: this.$t('all.public') }
        ]
      }
    },
    computed: {
      ...mapState(useRepoDetailStore, ['isPrivate']),
      ...mapWritableState(useRepoDetailStore, ['privateVisibility']),
      visibilityName: {
        get() {
          return !!this.privateVisibility ? 'Private' : 'Public'
        },
        set(newValue) {
          this.privateVisibility = newValue === 'Private'
        }
      }
    },
    watch: {
      codeNickname(newNickname, _) {
        this.theCodeNickname = newNickname
      },
      codeDesc(newDesc, _) {
        this.theCodeDesc = newDesc
      }
    },
    mounted() {},
    methods: {
      ...mapActions(useRepoDetailStore, ['updateVisibility']),
      clickDelete() {
        if (this.delDesc === this.codePath) {
          this.deleteCode().catch((err) => {
            ElMessage({
              message: err.message,
              type: 'warning'
            })
          })
        }
      },

      async deleteCode() {
        const codeDeleteEndpoint = `${this.csghubServer}/api/v1/codes/${this.path}`
        const option = { method: 'DELETE' }
        const response = await jwtFetch(codeDeleteEndpoint, option)

        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.message)
          })
        } else {
          ElMessage({ message: this.$t('all.delSuccess'), type: 'success' })
          setTimeout(() => {
            window.location.href = '/codes'
          }, 500)
          return response.json()
        }
      },

      changeVisibility(value) {
        ElMessageBox({
          title: this.$t('codes.edit.changeVisibility'),
          message: h('p', null, [
            h('span', null, this.$t('all.changeVis')),
            h(
              'span',
              null,
              value === 'Private'
                ? this.$t('all.private')
                : this.$t('all.public')
            ),
            h(
              'span',
              null,
              value === 'Private'
                ? this.$t('codes.edit.privateInfo')
                : this.$t('codes.edit.publicInfo')
            )
          ]),
          showCancelButton: true,
          confirmButtonText: this.$t('all.confirm'),
          cancelButtonText: this.$t('all.cancel')
        })
          .then(() => {
            this.changeVisibilityCall(value)
          })
          .catch(() => {
            ElMessage({
              type: 'warning',
              message: this.$t('all.changeCancel')
            })
          })
      },

      changeVisibilityCall(value) {
        const isprivateSelected = value === 'Private' ? true : false
        const payload = { private: isprivateSelected }
        this.updateCode(payload)
      },

      updateNickname() {
        if (!!this.theCodeNickname.trim()) {
          const payload = { nickname: this.theCodeNickname }
          this.updateCode(payload)
        } else {
          ElMessage({
            message: this.$t('codes.edit.needCodeName'),
            type: 'warning'
          })
        }
      },

      updateCodeDesc() {
        if (!!this.theCodeDesc.trim()) {
          const payload = { description: this.theCodeDesc }
          this.updateCode(payload)
        } else {
          ElMessage({
            message: this.$t('codes.edit.needCodeDesc'),
            type: 'warning'
          })
        }
      },

      async updateCode(payload) {
        const codeUpdateEndpoint = `${this.csghubServer}/api/v1/codes/${this.path}`
        const options = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
        const response = await jwtFetch(codeUpdateEndpoint, options)
        if (!response.ok) {
          response.json().then((err) => {
            ElMessage({ message: err.msg, type: 'warning' })
          })
        } else {
          if (payload.hasOwnProperty('private')) {
            this.updateVisibility(payload.private)
          }
          response.json().then((data) => {
            ElMessage({ message: data.msg, type: 'success' })
          })
        }
      },

      handleMouseOver() {
        if (this.delDesc !== '') {
          document
            .getElementById('confirmDelete')
            .classList.replace('bg-[#D92D20]', 'bg-[#B42318]')
        }
      },
      handleMouseLeave() {
        document
          .getElementById('confirmDelete')
          .classList.replace('bg-[#B42318]', 'bg-[#D92D20]')
      }
    }
  }
</script>
