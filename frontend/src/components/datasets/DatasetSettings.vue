<template>
  <div
    class="border border-gray-200 rounded-md my-8 md:my-0 md:border-none px-6 py-6">
    <!-- 展示英文名 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('datasets.datasetName') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('datasets.datasetNameTips') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-sm text-gray-600">
          {{ $t('datasets.namespaceDatasetName') }}
        </p>
        <div
          class="w-[512px] sm:w-full rounded-md bg-gray-50 px-3.5 py-2.5 border">
          {{ datasetPath }}
        </div>
      </div>
    </div>

    <el-divider />

    <!-- 更新数据集别名 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('datasets.datasetNickName') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('datasets.edit.tips') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-input
          v-model="theDatasetNickname"
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

    <!-- 更新数据集简介 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('datasets.datasetDesc') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('datasets.edit.tips2') }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <el-input
          v-model="theDatasetDesc"
          clearable
          size="large"
          type="textarea"
          class="!w-[512px] sm:!w-full" />
        <CsgButton
          @click="updateDatasetDesc"
          class="btn btn-secondary-gray btn-sm w-fit"
          :name="$t('all.update')"
        />
      </div>
    </div>

    <el-divider />

    <!-- 数据集标签 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('datasets.datasetTag') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('datasets.edit.tips3') }}
        </div>
      </div>
      <div
        class="flex flex-col gap-1.5"
        ref="tagListContainer">
        <p class="text-gray-700 text-sm">
          {{ $t('datasets.datasetTag') }}
        </p>
        <div class="flex flex-col gap-1.5 w-[512px] md:w-full">
          <div
            class="flex gap-1 flex-wrap items-center w-full border rounded-sm border-gray-300 min-h-[40px] p-1.5">
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
              class="w-full max-h-[36px] outline-none"
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
          {{ $t('datasets.datasetIndustryTag') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('datasets.edit.tips4') }}
        </div>
      </div>
      <div
        class="flex flex-col gap-1.5"
        ref="IndustryTagListContainer">
        <p class="text-gray-700 text-sm">
          {{ $t('datasets.datasetIndustryTag') }}
        </p>
        <div class="flex flex-col gap-1.5 w-[512px] md:w-full">
          <div
            class="flex gap-1 flex-wrap items-center w-full border rounded-sm border-gray-300 min-h-[40px] p-1.5">
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
              class="w-full max-h-[36px] outline-none"
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
          {{ $t('datasets.edit.changeVisibility') }}
        </div>
        <div class="max-w-[864px] text-sm text-gray-600 leading-5">
          {{ $t('datasets.edit.statusText') }}
          <span class="text-black font-medium"
            >[{{
              isPrivate ? $t('all.private') : $t('all.public')
            }}]</span
          >
          {{ $t('datasets.edit.status') }} {{
            isPrivate
              ? $t('datasets.edit.privateVis')
              : $t('datasets.edit.publicVis')
          }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <p class="text-sm text-gray-600">
          {{ $t('datasets.edit.datasetVisibility') }}
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

    <!-- 数据集删除 -->
    <div class="flex xl:flex-col gap-8">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-sm text-gray-700 leading-5 font-medium">
          {{ $t('datasets.edit.delDataset') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('datasets.edit.delTips') }}
          <span class="text-black font-medium">{{ $t('datasets.edit.canNot') }}</span>
          {{ $t('datasets.edit.delTips2') }}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('datasets.edit.delTips3') }}
        </div>
        <div class="text-sm text-gray-600 leading-5">
          {{ $t('datasets.edit.enterPls') }}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('datasets.edit.sureDel') }}
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm text-gray-600">
          {{ $t('datasets.datasetName') }}
        </p>
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
            :disabled="delDesc !== datasetPath"
            data-test="confirm-delete"
            :name="$t('datasets.edit.confirmDel')"
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
  import { mapState, mapWritableState } from 'pinia'
  import parseMD from 'parse-md'
  import yaml from 'js-yaml'
  import { atob_utf8, btoa_utf8 } from '../../packs/utils'

  export default {
    props: {
      path: String,
      datasetNickname: String,
      datasetDesc: String,
      default_branch: String,
      tagList: Object,
      tags: Object
    },
    components: {},
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
        datasetName: this.path.split('/')[1],
        theDatasetNickname: this.datasetNickname || '',
        theDatasetDesc: this.datasetDesc || '',
        datasetPath: this.path,
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
      if (Object.keys(this.tags).length > 0) {
        this.getSelectTags()
      }
      // 监听全局点击事件
      document.addEventListener('click', this.collapseTagList)
      this.getIndustryTags()
      this.fetchReadme()
    },
    watch: {
      datasetNickname(newNickname, _) {
        this.theDatasetNickname = newNickname
      },
      datasetDesc(newDesc, _) {
        this.theDatasetDesc = newDesc
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
      async getIndustryTags() {
        const { data, error } = await useFetchApi('/tags').json()
        if (error.value) {
          ElMessage({ message: error.value.msg, type: 'warning' })
        } else {
          const tags = data.value.data
          this.industryTagsList = tags.filter(
            (item) => item.category === 'industry' && item.scope === 'dataset'
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
        if (this.delDesc === this.datasetPath) {
          this.deleteDataset().catch((err) => {
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

      async deleteDataset() {
        const datasetDeleteEndpoint = `/datasets/${this.path}`

        const { error } = await useFetchApi(datasetDeleteEndpoint).delete().json()

        if (error.value) {
          ElMessage({ message: error.value.msg, type: 'warning' })
        } else {
          ElMessage({ message: this.$t('all.delSuccess'), type: 'success' })
          setTimeout(() => {
            window.location.href = document.referrer || '/datasets'
          }, 1000)
          return true
        }
      },

      changeVisibility(value) {
        ElMessageBox({
          title: this.$t('datasets.edit.changeVisibility'),
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
                ? this.$t('datasets.edit.privateInfo')
                : this.$t('datasets.edit.publicInfo')
            )
          ]),
          showCancelButton: true,
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel'
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
        this.updateDataset(payload)
      },
      updateTags() {
        if (this.selectedTags.length !== 0) {
          const newSelectedTags = this.selectedTags.map((tag) => tag.name)
          this.updateTagsInReadme(newSelectedTags)
        } else {
          ElMessage({
            message: this.$t('datasets.edit.needDatasetTag'),
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
            message: this.$t('datasets.edit.needDatasetTag'),
            type: 'warning'
          })
        }
      },

      async fetchReadme() {
        const url = `datasets/${this.path}/blob/README.md`

        const { data } = await useFetchApi(url).get().json()

        if (data.value) {
          const res = data.value
          this.readmeContent = atob_utf8(res.data.content)
          this.readmeSha = res.data.sha
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
        const updateReadmeEndpoint = `/datasets/${this.path}/raw/README.md`
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
        const { error } = await useFetchApi(updateReadmeEndpoint, option).put().json()
        if (!error.value) {
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
          `/datasets/${this.path}/tags/industry`,
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
        if (!!this.theDatasetNickname.trim()) {
          const payload = { nickname: this.theDatasetNickname }
          this.updateDataset(payload)
        } else {
          ElMessage({
            message: this.$t('datasets.edit.needDatasetName'),
            type: 'warning'
          })
        }
      },

      updateDatasetDesc() {
        if (!!this.theDatasetDesc.trim()) {
          const payload = { description: this.theDatasetDesc }
          this.updateDataset(payload)
        } else {
          ElMessage({
            message: this.$t('datasets.edit.needDatasetDesc'),
            type: 'warning'
          })
        }
      },

      async updateDataset(payload) {
        const datasetUpdateEndpoint = `/datasets/${this.path}`
        const options = {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
        const { _, error } = await useFetchApi(datasetUpdateEndpoint, options).put().json()
        if (error.value) {
          ElMessage.warning(error.value.msg)
        } else {
          this.fetchRepoDetail()
          ElMessage.success(this.$t('datasets.edit.updateSuccess'))
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
