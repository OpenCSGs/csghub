<template>
  <div
    class="my-8 md:my-0 md:border-none py-6">
    <!-- 展示英文名 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('models.modelName') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('models.modelNameTips') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-gray-700 text-sm">
          {{ $t('models.namespaceModelName') }}
        </p>
        <div
          class="w-[512px] sm:w-full rounded-md bg-gray-50 px-3.5 py-2.5 border">
          {{ modelPath }}
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 更新模型别名 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('models.modelNickName') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('models.edit.tips') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-input
          v-model="theModelNickname"
          clearable
          size="large"
          class="!w-[512px] sm:!w-full" />
        <CsgButton
          @click="updateNickname"
          class="btn btn-secondary-gray btn-sm w-fit"
          :name="$t('all.update')"
        />
      </div>
    </div>

    <el-divider />

    <!-- 更新模型简介 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('models.modelDesc') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('models.edit.tips2') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-input
          v-model="theModelDesc"
          clearable
          size="large"
          type="textarea"
          class="!w-[512px] sm:!w-full" />
        <CsgButton
          @click="updateModelDesc"
          class="btn btn-secondary-gray btn-sm w-fit"
          :name="$t('all.update')"
        />
      </div>
    </div>

    <el-divider />

    <!-- 模型标签 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('models.modelTag') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('models.edit.tips3') }}
        </div>
      </div>
      <div
        class="flex flex-col gap-1.5"
        ref="tagListContainer">
        <p class="text-gray-700 text-sm">{{ $t('models.modelTag') }}</p>
        <div class="flex flex-col gap-1.5 w-[512px] md:w-full">
          <div
            class="flex gap-1 flex-wrap items-center w-full border rounded-md border-gray-300 min-h-[40px] p-1.5">
            <div
              class="scroll-container flex gap-1 flex-wrap max-h-[120px] overflow-y-auto">
              <span
                v-for="tag in selectedTags"
                class="flex items-center text-sm text-gray-700 gap-1 border rounded-sm border-gray-300 px-1 py-0.5">
                {{
                  this.$i18n.locale === 'zh'
                    ? tag.zh_name || tag.show_name || tag.name
                    : tag.name
                }}
                <el-icon><Close @click="removeTag(tag.name)" /></el-icon>
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
              @click="selectTag(tag)"
              class="flex gap-2 items-center cursor-pointer p-2.5">
              {{
                this.$i18n.locale === 'zh' ? tag.show_name || tag.name : tag.name
              }}
            </p>
          </div>
          <CsgButton
            @click="updateTags"
            class="btn btn-secondary-gray btn-sm w-fit"
            :name="$t('all.update')"
          />
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 行业标签 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('models.modelIndustryTag') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('models.edit.tips3') }}
        </div>
      </div>
      <div
        class="flex flex-col gap-1.5"
        ref="IndustryTagListContainer">
        <p class="text-gray-700 text-sm">
          {{ $t('models.modelIndustryTag') }}
        </p>
        <div class="flex flex-col gap-1.5 w-[512px] md:w-full">
          <div
            class="flex gap-1 flex-wrap items-center w-full border rounded-md border-gray-300 min-h-[40px] p-1.5">
            <div
              class="scroll-container flex gap-1 flex-wrap max-h-[120px] overflow-y-auto">
              <span
                v-for="tag in selectedIndustryTags"
                class="flex items-center text-sm text-gray-700 gap-1 border rounded-sm border-gray-300 px-1 py-0.5">
                {{
                  this.$i18n.locale === 'zh'
                    ? tag.zh_name || tag.show_name || tag.name
                    : tag.name
                }}
                <el-icon
                  ><Close @click="removeIndustryTag(tag.name)"
                /></el-icon>
              </span>
            </div>
            <input
              class="w-full max-h-8 outline-none"
              v-model="industryTagInput"
              @input="showIndustryTagList" />
          </div>
          <div
            v-show="shouldShowIndustryTagList"
            class="rounded-md max-h-[300px] overflow-y-auto border border-gray-200 bg-white shadow-lg py-1 px-1.5">
            <p
              v-for="tag in theIndustryTagsList"
              @click="selectIndustryTag(tag)"
              class="flex gap-2 items-center cursor-pointer p-2.5">
              {{
                this.$i18n.locale === 'zh'
                  ? tag.show_name || tag.name
                  : tag.name
              }}
            </p>
          </div>
          <CsgButton
            @click="updateIndustryTags"
            class="btn btn-secondary-gray btn-sm w-fit"
            :name="$t('all.update')"
          />
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('models.edit.changeVisibility') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('models.edit.statusText') }}
          <span class="text-gray-700 font-medium"
            >[{{
              isPrivate ? $t('all.private') : $t('all.public')
            }}]</span
          >
          {{ $t('models.edit.status') }} {{
            isPrivate
              ? $t('models.edit.privateVis')
              : $t('models.edit.publicVis')
          }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-gray-700 text-sm">
          {{ $t('models.edit.modelVisibility') }}
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

    <!-- 删除模型 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col gap-1.5">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('models.edit.delModel') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('models.edit.delTips') }}
          <span class="text-gray-700 font-medium">{{ $t('models.edit.canNot') }}</span>
          {{ $t('models.edit.delTips2') }}
          <span class="text-gray-700 font-medium break-words">{{ path }}</span>
          {{ $t('models.edit.delTips3') }}
        </div>
        <div class="text-sm font-light text-gray-600 leading-5">
          {{ $t('all.enterPls') }}
          <span class="text-gray-700 font-medium break-words">{{ path }}</span>
          {{ $t('all.sureDel') }}
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <p class="text-gray-700 text-sm">{{ $t('models.modelName') }}</p>
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
            :disabled="delDesc !== modelPath"
            :name="$t('models.edit.confirmDel')"
          />
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
  import parseMD from 'parse-md'
  import yaml from 'js-yaml'
  import { atob_utf8, btoa_utf8 } from '../../packs/utils'

  export default {
    props: {
      path: String,
      modelNickname: String,
      modelDesc: String,
      default_branch: String,
      tagList: Object,
      tags: Object
    },
    data() {
      return {
        theTagList: this.tagList,
        industryTagsList: [],
        theIndustryTagsList: this.industryTagsList,
        selectedTags: [],
        selectedIndustryTags: [],
        shouldShowTagList: false,
        shouldShowIndustryTagList: false,
        tagInput: '',
        industryTagInput: '',
        delDesc: '',
        theModelNickname: this.modelNickname || '',
        theModelDesc: this.modelDesc || '',
        modelPath: this.path,
        readmeContent: '',
        readmeSha: '',
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
    mounted() {
      // 监听全局点击事件
      if (Object.keys(this.tags).length > 0) {
        this.getSelectTags()
      }
      document.addEventListener('click', this.collapseTagList)
      this.getIndustryTags()
      this.fetchReadme()
    },
    watch: {
      modelNickname(newNickname, _) {
        this.theModelNickname = newNickname
      },
      modelDesc(newDesc, _) {
        this.theModelDesc = newDesc
      },
      tagList(newTagList, _) {
        this.theTagList = newTagList
      },
      tags(_) {
        this.getSelectTags()
      }
    },
    beforeDestroy() {
      // 组件销毁前移除事件监听
      document.removeEventListener('click', this.collapseTagList)
    },
    inject: ['fetchRepoDetail'],
    methods: {
      ...mapActions(useRepoDetailStore, ['updateVisibility']),
      async getIndustryTags() {
        const { data, error } = await useFetchApi('/tags').json()
        if (error.value) {
          ElMessage({ message: error.value.msg, type: 'warning' })
        } else {
          const body = data.value
          this.industryTagsList = body.data.filter(
            (item) => item.category === 'industry' && item.scope === 'model'
          )
        }
      },
      collapseTagList(event) {
        if (!this.$refs.tagListContainer?.contains(event.target)) {
          this.shouldShowTagList = false
        }
        if (!this.$refs.IndustryTagListContainer?.contains(event.target)) {
          this.shouldShowIndustryTagList = false
        }
      },
      getSelectTags() {
        this.selectedTags = [
          ...this.tags.task_tags.map((tag) => tag),
          ...this.tags.other_tags.map((tag) => tag)
        ]
        this.selectedIndustryTags = [
          ...this.tags.industry_tags.map((tag) => tag)
        ]
      },
      clickDelete() {
        if (this.delDesc === this.modelPath) {
          this.deleteModel().catch((err) => {
            ElMessage({
              message: err.message,
              type: 'warning'
            })
          })
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

      showIndustryTagList(e) {
        if (this.industryTagInput != '') {
          const userTriggerIndustryTagList = this.industryTagsList.filter(
            (tag) => {
              return (
                tag.name.includes(this.industryTagInput) ||
                tag.show_name.includes(this.industryTagInput)
              )
            }
          )
          if (userTriggerIndustryTagList.length > 0) {
            this.theIndustryTagsList = userTriggerIndustryTagList
            this.shouldShowIndustryTagList = true
          }
        } else {
          this.shouldShowIndustryTagList = false
        }
      },

      selectTag(newTag) {
        const findTag = this.selectedTags.find(
          (tag) => tag.name === newTag.name
        )
        if (!findTag) {
          this.selectedTags.push({ name: newTag.name, zh_name: newTag.show_name })
          this.tagInput = ''
          this.shouldShowTagList = false
        }
      },

      selectIndustryTag(newTag) {
        const findIndustryTag = this.selectedIndustryTags.find(
          (tag) => tag.name === newTag.name
        )
        if (!findIndustryTag) {
          this.selectedIndustryTags.push({
            name: newTag.name,
            zh_name: newTag.show_name
          })
          this.industryTagInput = ''
          this.shouldShowIndustryTagList = false
        }
      },

      removeTag(tagName) {
        this.selectedTags = this.selectedTags.filter(
          (item) => item.name !== tagName
        )
      },

      removeIndustryTag(tagName) {
        this.selectedIndustryTags = this.selectedIndustryTags.filter(
          (item) => item.name !== tagName
        )
      },

      async deleteModel() {
        const modelDeleteEndpoint = `/models/${this.path}`
        const { error } = await useFetchApi(modelDeleteEndpoint).delete().json()

        if (error.value) {
          ElMessage({ message: error.value.msg, type: 'warning' })
        } else {
          ElMessage({ message: this.$t('all.delSuccess'), type: 'success' })
          setTimeout(() => {
            window.location.href = document.referrer || '/models'
          }, 1000)
          return true
        }
      },

      changeVisibility(value) {
        ElMessageBox({
          title: this.$t('models.edit.changeVisibility'),
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
                ? this.$t('models.edit.privateInfo')
                : this.$t('models.edit.publicInfo')
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
        this.updateModel(payload)
      },
      updateTags() {
        if (this.selectedTags.length !== 0) {
          const newSelectedTags = this.selectedTags.map((tag) => tag.name)
          this.updateTagsInReadme(newSelectedTags)
        } else {
          ElMessage({
            message: this.$t('models.edit.needModelTag'),
            type: 'warning'
          })
        }
      },

      updateIndustryTags() {
        if (this.selectedIndustryTags.length !== 0) {
          const newSelectedIndustryTags = this.selectedIndustryTags.map(
            (tag) => tag.name
          )
          this.updateIndustryTagsAPI(newSelectedIndustryTags)
        } else {
          ElMessage({
            message: this.$t('models.edit.needModelTag'),
            type: 'warning'
          })
        }
      },

      async fetchReadme() {
        const url = `/models/${this.path}/blob/README.md`
        const { data } = await useFetchApi(url).json()
        if (data.value) {
          const body = data.value
          this.readmeContent = atob_utf8(body.data.content)
          this.readmeSha = body.data.sha
        }
      },
      async updateTagsInReadme(newTags) {
        if (this.readmeContent) {
          const { metadata, content } = parseMD(this.readmeContent)
          const newMetadata = {
            ...metadata,
            tags: newTags
          }
          const newMetadataString = yaml.dump(newMetadata)
          const newContent = `---\n${newMetadataString}\n---\n\n${content}`
          this.updateReadme(newContent)
        }
      },
      async updateReadme(newContent) {
        const updateReadmeEndpoint = `/models/${this.path}/raw/README.md`
        const bodyData = {
          content: btoa_utf8(newContent),
          message: 'Update README.md',
          branch: this.default_branch,
          new_branch: this.default_branch,
          sha: this.readmeSha
        }
        const option = {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyData)
        }
        const { data, error } = await useFetchApi(updateReadmeEndpoint, option).put().json()
        if (data.value) {
          this.fetchRepoDetail()
          ElMessage({ message: this.$t('all.updateSuccess'), type: 'success' })
        } else {
          ElMessage({ message: error.value.msg, type: 'warning' })
        }
      },
      async updateIndustryTagsAPI(tags) {
        const industryOptions = {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tags)
        }
        const { error } = await useFetchApi(
          `/models/${this.path}/tags/industry`,
          industryOptions
        ).post().json()
        if (error.value) {
          ElMessage({ message: error.value.msg, type: 'warning' })
        } else {
          this.fetchRepoDetail()
          ElMessage({ message: this.$t('all.addSuccess'), type: 'success' })
        }
      },

      updateNickname() {
        if (!!this.theModelNickname.trim()) {
          const payload = { nickname: this.theModelNickname }
          this.updateModel(payload)
        } else {
          ElMessage({
            message: this.$t('models.edit.needModelName'),
            type: 'warning'
          })
        }
      },

      updateModelDesc() {
        if (!!this.theModelDesc.trim()) {
          const payload = { description: this.theModelDesc }
          this.updateModel(payload)
        } else {
          ElMessage({
            message: this.$t('models.edit.needModelDesc'),
            type: 'warning'
          })
        }
      },

      async updateModel(payload) {
        const modelUpdateEndpoint = `/models/${this.path}`
        const options = {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
        const { error } = await useFetchApi(modelUpdateEndpoint, options).put().json()
        if (error.value) {
          ElMessage({ message: error.value.msg, type: 'warning' })
        } else {
          if (payload.hasOwnProperty('private')) {
            this.updateVisibility(payload.private)
          }
          this.fetchRepoDetail()
          ElMessage({ message: 'Success', type: 'success' })
        }
      }
    }
  }
</script>
