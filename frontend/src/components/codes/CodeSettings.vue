<template>
  <div
  class="flex flex-col gap-6 my-8 md:my-0 md:border-none py-6">
    <!-- 展示英文名 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('codes.codeName') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('codes.codeNameTips') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-gray-700 text-sm">
          {{ $t('codes.namespaceCodeName') }}
        </p>
        <div
          class="w-[512px] sm:w-full rounded-md bg-gray-50 px-3.5 py-2.5 border">
          {{ codePath }}
        </div>
      </div>
    </div>


    <!-- 更新别名 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('codes.codeNickName') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('codes.edit.tips') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-input
          v-model="theCodeNickname"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full" />
        <CsgButton
          v-if="hasNicknameChanged"
          @click="updateNickname"
          class="btn btn-secondary-gray btn-sm w-fit"
          data-test="update-nickname"
          :name="$t('all.update')" />
      </div>
    </div>


    <!-- 更新简介 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('codes.codeDesc') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('codes.edit.tips2') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-input
          v-model="theCodeDesc"
          clearable
          size="large"
          type="textarea"
          class="!w-[512px] sm:!w-full" />
        <CsgButton
          v-if="hasDescChanged"
          @click="updateCodeDesc"
          class="btn btn-secondary-gray btn-sm w-fit"
          :name="$t('all.update')" />
      </div>
    </div>

    <el-divider />

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('codes.edit.changeVisibility') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('codes.edit.statusText') }}
          <span class="text-black font-semibold"
            >[{{
              isPrivate ? $t('all.private') : $t('all.public')
            }}]</span
          >
          {{ $t('codes.edit.status') }} {{
            isPrivate
              ? $t('codes.edit.privateVis')
              : $t('codes.edit.publicVis')
          }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-gray-700 text-sm">
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


    <!-- 删除 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col gap-1.5">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('codes.edit.delCode') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('codes.edit.delTips') }}
          <span class="text-black font-medium">{{ $t('codes.edit.canNot') }}</span>
          {{ $t('codes.edit.delTips2') }}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('codes.edit.delTips3') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('codes.edit.enterPls') }}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('codes.edit.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-gray-700 text-sm">{{ $t('codes.codeName') }}</p>
        <el-input
          v-model="delDesc"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full" />
        <div class="flex">
          <CsgButton
            id="confirmDelete"
            @click="clickDelete"
            class="btn btn-danger btn-sm w-fit"
            :disabled="delDesc !== codePath"
            :name="$t('codes.edit.confirmDel')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { h } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import useFetchApi from '../../packs/useFetchApi'
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
        delDesc: '',
        codeName: this.path.split('/')[1],
        theCodeNickname: this.codeNickname || '',
        theCodeDesc: this.codeDesc || '',
        codePath: this.path,
        originalCodeNickname: this.codeNickname || '',
        originalCodeDesc: this.codeDesc || '',
        options: [
          { value: 'Private', label: this.$t('all.private') },
          { value: 'Public', label: this.$t('all.public') }
        ]
      }
    },
    computed: {
      ...mapState(useRepoDetailStore, ['isPrivate']),
      ...mapWritableState(useRepoDetailStore, ['privateVisibility']),
      hasNicknameChanged() {
        return this.theCodeNickname.trim() !== this.originalCodeNickname.trim()
      },
      hasDescChanged() {
        return this.theCodeDesc.trim() !== this.originalCodeDesc.trim()
      },
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
    inject: ['fetchRepoDetail'],
    methods: {
      ...mapActions(useRepoDetailStore, ['updateVisibility']),
      clickDelete() {
        if (this.delDesc === this.codePath) {
          this.deleteCode().catch((err) => {
            ElMessage.warning(err.message)
          })
        }
      },

      async deleteCode() {
        const codeDeleteEndpoint = `/codes/${this.path}`
        const { error } = await useFetchApi(codeDeleteEndpoint).delete().json()

        if (error.value) {
          ElMessage.warning(error.value.msg)
        } else {
          ElMessage.success(this.$t('all.delSuccess'))
          setTimeout(() => {
            window.location.href = '/codes'
          }, 1000)
          return true
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
            ElMessage.warning(this.$t('all.changeCancel'))
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
          ElMessage.warning(this.$t('codes.edit.needCodeName'))
        }
      },

      updateCodeDesc() {
        if (!!this.theCodeDesc.trim()) {
          const payload = { description: this.theCodeDesc }
          this.updateCode(payload)
        } else {
          ElMessage.warning(this.$t('codes.edit.needCodeDesc'))
        }
      },

      async updateCode(payload) {
        const codeUpdateEndpoint = `/codes/${this.path}`
        const options = {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
        const { _, error } = await useFetchApi(codeUpdateEndpoint, options).put().json()
        if (error.value) {
          ElMessage.warning(error.value.msg)
        } else {
          ElMessage.success('Success')
          if (payload.hasOwnProperty('private')) {
            this.updateVisibility(payload.private)
          }
          this.fetchRepoDetail(true)
        }
      },

      handleMouseOver() {
        if (this.delDesc !== '') {
          document
            .getElementById('confirmDelete')
            .classList.replace('bg-error-600', 'bg-error-700')
        }
      },
      handleMouseLeave() {
        document
          .getElementById('confirmDelete')
          .classList.replace('bg-error-700', 'bg-error-600')
      }
    }
  }
</script>
