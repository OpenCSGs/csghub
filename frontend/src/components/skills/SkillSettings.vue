<template>
  <div
  class="flex flex-col gap-6 my-8 md:my-0 md:border-none py-6">
    <!-- 展示英文名 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('skills.skillName') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('skills.skillNameTips') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-gray-700 text-sm">
          {{ $t('skills.namespaceSkillName') }}
        </p>
        <div
          class="w-[512px] sm:w-full rounded-md bg-gray-50 px-3.5 py-2.5 border">
          {{ skillPath }}
        </div>
      </div>
    </div>


    <!-- 更新别名 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('skills.skillNickName') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('skills.edit.tips') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-input
          v-model="theSkillNickname"
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
          {{ $t('skills.skillDesc') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('skills.edit.tips2') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-input
          v-model="theSkillDesc"
          clearable
          size="large"
          type="textarea"
          class="!w-[512px] sm:!w-full" />
        <CsgButton
          v-if="hasDescChanged"
          @click="updateSkillDesc"
          class="btn btn-secondary-gray btn-sm w-fit"
          :name="$t('all.update')" />
      </div>
    </div>

    <!-- 更新默认分支 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('skills.edit.defaultBranch') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('skills.edit.defaultBranchDesc') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-select
          v-model="theDefaultBranch"
          size="large"
          class="!w-[512px] sm:!w-full">
          <el-option
            v-for="branch in branchList"
            :key="branch.name"
            :label="branch.name"
            :value="branch.name" />
        </el-select>
        <CsgButton
          v-if="hasDefaultBranchChanged"
          @click="updateDefaultBranch"
          class="btn btn-secondary-gray btn-sm w-fit"
          :name="$t('all.update')" />
      </div>
    </div>

    <el-divider />

    <!-- Skill 标签 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('skills.skillTag') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('skills.skillTagDesc') }}
        </div>
      </div>
      <div
        class="flex flex-col gap-1.5"
        ref="tagListContainer">
        <p class="text-gray-700 text-sm">{{ $t('skills.skillTag') }}</p>
        <div class="flex flex-col gap-1.5 w-[512px] sm:w-full">
          <div
            class="flex gap-1 flex-wrap items-center w-full border rounded-md border-gray-300 min-h-[40px] p-1.5">
            <div
              class="scroll-container flex gap-1 flex-wrap max-h-[120px] overflow-y-auto">
              <span
                v-for="tag in selectedTags"
                :key="tag.uid"
                class="flex items-center text-sm text-gray-700 gap-1 border rounded-sm border-gray-300 px-1 py-0.5">
                {{
                  this.$i18n.locale === 'zh'
                    ? tag.zh_name || tag.show_name || tag.name
                    : tag.name
                }}
                <el-icon><Close @click="removeTag(tag.uid)" /></el-icon>
              </span>
            </div>
            <input
              class="w-full max-h-8 outline-none"
              v-model="tagInput"
              @input="showTagList" />
          </div>
          <div
            v-show="shouldShowTagList"
            class="rounded-md max-h-[300px] overflow-y-auto border border-gray-200 bg-white shadow-lg py-1 px-1.5">
            <p
              v-for="tag in theTagList"
              :key="tag.name"
              @click="selectTag(tag)"
              class="flex gap-2 items-center cursor-pointer p-2.5">
              {{
                this.$i18n.locale === 'zh' ? tag.show_name || tag.name : tag.name
              }}
            </p>
          </div>
          <CsgButton
            v-if="hasTagsChanged"
            @click="updateTags"
            class="btn btn-secondary-gray btn-sm w-fit"
            :name="$t('all.update')"
            :loading="isUpdatingTags"
            :disabled="isUpdatingTags"
          />
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('skills.edit.changeVisibility') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('skills.edit.statusText') }}
          <span class="text-black font-semibold"
            >[{{
              isPrivate ? $t('all.private') : $t('all.public')
            }}]</span
          >
          {{ $t('skills.edit.status') }} {{
            isPrivate
              ? $t('skills.edit.privateVis')
              : $t('skills.edit.publicVis')
          }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-gray-700 text-sm">
          {{ $t('skills.edit.skillVisibility') }}
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
          {{ $t('skills.edit.delSkill') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('skills.edit.delTips') }}
          <span class="text-black font-medium">{{ $t('skills.edit.canNot') }}</span>
          {{ $t('skills.edit.delTips2') }}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('skills.edit.delTips3') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('skills.edit.enterPls') }}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('skills.edit.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-gray-700 text-sm">{{ $t('skills.skillName') }}</p>
        <el-input
          v-model.trim="delDesc"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full" />
        <div class="flex">
          <CsgButton
            id="confirmDelete"
            @click="clickDelete"
            class="btn btn-danger btn-sm w-fit"
            :disabled="delDesc !== skillPath"
            :name="$t('skills.edit.confirmDel')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { h } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Close } from '@element-plus/icons-vue'
  import useFetchApi from '../../packs/useFetchApi'
  import useRepoDetailStore from '../../stores/RepoDetailStore'
  import { mapState, mapWritableState, mapActions } from 'pinia'

  export default {
    props: {
      path: String,
      skillNickname: String,
      skillDesc: String,
      default_branch: String,
      tagList: Object,
      tags: Object
    },
    components: {
      Close
    },
    data() {
      return {
        theTagList: this.tagList,
        selectedTags: [],
        shouldShowTagList: false,
        tagInput: '',
        delDesc: '',
        skillName: this.path.split('/')[1],
        theSkillNickname: this.skillNickname || '',
        theSkillDesc: this.skillDesc || '',
        skillPath: this.path,
        originalSkillNickname: this.skillNickname || '',
        originalSkillDesc: this.skillDesc || '',
        originalDefaultBranch: this.default_branch || '',
        theDefaultBranch: this.default_branch || '',
        branchList: [],
        isUpdatingTags: false,
        originalTags: [],
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
        return this.theSkillNickname.trim() !== this.originalSkillNickname.trim()
      },
      hasDescChanged() {
        return this.theSkillDesc.trim() !== this.originalSkillDesc.trim()
      },
      hasDefaultBranchChanged() {
        return this.theDefaultBranch.trim() !== this.originalDefaultBranch.trim()
      },
      hasTagsChanged() {
        if (this.originalTags.length !== this.selectedTags.length) return true
        const originalTagIds = this.originalTags.map(tag => tag.uid).sort()
        const currentTagIds = this.selectedTags.map(tag => tag.uid).sort()
        return JSON.stringify(originalTagIds) !== JSON.stringify(currentTagIds)
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
      skillNickname(newNickname, _) {
        this.theSkillNickname = newNickname
      },
      skillDesc(newDesc, _) {
        this.theSkillDesc = newDesc
      },
      default_branch(newBranch) {
        this.theDefaultBranch = newBranch
        this.originalDefaultBranch = newBranch
      },
      tagList(newTagList, _) {
        this.theTagList = newTagList
      },
      tags(_) {
        this.getSelectTags()
      }
    },
    mounted() {
      if (Object.keys(this.tags || {}).length > 0) {
        this.getSelectTags()
      }
      this.fetchBranches()
      document.addEventListener('click', this.collapseTagList)
    },
    beforeUnmount() {
      document.removeEventListener('click', this.collapseTagList)
    },
    inject: ['fetchRepoDetail'],
    methods: {
      ...mapActions(useRepoDetailStore, ['updateVisibility']),
      clickDelete() {
        if (this.delDesc === this.skillPath) {
          this.deleteSkill().catch((err) => {
            ElMessage.warning(err.message)
          })
        }
      },

      async deleteSkill() {
        const skillDeleteEndpoint = `/skills/${this.path}`
        const { error } = await useFetchApi(skillDeleteEndpoint).delete().json()

        if (error.value) {
          ElMessage.warning(error.value.msg)
        } else {
          ElMessage.success(this.$t('all.delSuccess'))
          setTimeout(() => {
            window.location.href = '/skills'
          }, 1000)
          return true
        }
      },

      changeVisibility(value) {
        ElMessageBox({
          title: this.$t('skills.edit.changeVisibility'),
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
                ? this.$t('skills.edit.privateInfo')
                : this.$t('skills.edit.publicInfo')
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
            this.visibilityName = value === 'Private' ? 'Public' : 'Private'
            ElMessage.warning(this.$t('all.changeCancel'))
          })
      },

      changeVisibilityCall(value) {
        const isprivateSelected = value === 'Private' ? true : false
        const payload = { private: isprivateSelected }
        this.updateSkill(payload)
      },

      updateNickname() {
        if (!!this.theSkillNickname.trim()) {
          const payload = { nickname: this.theSkillNickname }
          this.updateSkill(payload)
        } else {
          ElMessage.warning(this.$t('skills.edit.needSkillName'))
        }
      },

      updateSkillDesc() {
        if (!!this.theSkillDesc.trim()) {
          const payload = { description: this.theSkillDesc }
          this.updateSkill(payload)
        } else {
          ElMessage.warning(this.$t('skills.edit.needSkillDesc'))
        }
      },

      updateDefaultBranch() {
        const branch = this.theDefaultBranch.trim()
        if (!branch) return
        this.updateSkill({ default_branch: branch })
      },

      async fetchBranches() {
        const { data } = await useFetchApi(`/skills/${this.path}/branches`).json()
        this.branchList = data.value?.data || []
      },

      async updateSkill(payload) {
        const skillUpdateEndpoint = `/skills/${this.path}`
        const options = {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
        const { _, error } = await useFetchApi(skillUpdateEndpoint, options).put().json()
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
      },

      collapseTagList(event) {
        if (!this.$refs.tagListContainer?.contains(event.target)) {
          this.shouldShowTagList = false
        }
      },

      getSelectTags() {
        const taskTags = this.tags?.task_tags || []
        const otherTags = this.tags?.other_tags || []
        
        this.selectedTags = [
          ...taskTags.map((tag) => {
            Object.assign(tag, {
              uid: tag.category + tag.name,
            })
            return tag
          }),
          ...otherTags.map((tag) => {
            Object.assign(tag, {
              uid: tag.category + tag.name,
            })
            return tag
          })
        ]
        
        if (this.originalTags.length === 0) {
          this.originalTags = JSON.parse(JSON.stringify(this.selectedTags))
        }
      },

      showTagList(e) {
        if (this.tagInput != '') {
          const userTriggerTagList = this.tagList.filter((tag) => {
            return (
              tag.show_name.includes(this.tagInput) ||
              tag.name.includes(this.tagInput)
            )
          })
          if (userTriggerTagList.length > 0) {
            this.theTagList = userTriggerTagList
            this.shouldShowTagList = true
          }
        } else {
          this.shouldShowTagList = false
        }
      },

      selectTag(newTag) {
        const findTag = this.selectedTags.find(
          (tag) => tag.uid === (newTag.category + newTag.name)
        )
        if (!findTag) {
          this.selectedTags.push({ 
            name: newTag.name, 
            zh_name: newTag.show_name, 
            category: newTag.category,
            uid: newTag.category + newTag.name 
          })
          this.tagInput = ''
          this.shouldShowTagList = false
        }
      },

      removeTag(tagUid) {
        this.selectedTags = this.selectedTags.filter((item) => item.uid !== tagUid)
      },

      async updateTags() {
        if (this.isUpdatingTags) return
        
        if (this.selectedTags.length !== 0) {
          this.isUpdatingTags = true
          try {
            const newSelectedTags = this.selectedTags.map((tag) => tag.name)
            await this.updateTagsAPI(newSelectedTags)
          } catch (error) {
            ElMessage({ message: error.message || this.$t('all.updateFailed'), type: 'warning' })
          } finally {
            this.isUpdatingTags = false
          }
        } else {
          ElMessage({
            message: this.$t('skills.edit.needSkillTag'),
            type: 'warning'
          })
        }
      },

      async updateTagsAPI(tags) {
        const tagOptions = {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tags)
        }
        const { error } = await useFetchApi(
          `/skills/${this.path}/tags/task`,
          tagOptions
        ).post().json()
        if (error.value) {
          ElMessage({ message: error.value.msg, type: 'warning' })
        } else {
          this.fetchRepoDetail(true)
          this.originalTags = JSON.parse(JSON.stringify(this.selectedTags))
          ElMessage({ message: this.$t('all.updateSuccess'), type: 'success' })
        }
      }
    }
  }
</script>
