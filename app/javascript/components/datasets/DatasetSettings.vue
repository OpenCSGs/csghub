<template>
  <div class="border border-[#DCDFE6] rounded-[8px] my-[32px] md:my-0 md:border-none px-[24px] py-[24px]">
    <!-- 展示英文名 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('datasets.datasetName')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('datasets.datasetNameTips')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[14px] text-[#475467]">{{ $t('datasets.namespaceDatasetName')}}</p>
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
          {{ $t('datasets.datasetNickName')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('datasets.edit.tips')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <el-input
            v-model="theDatasetNickname"
            clearable
            size="large"
            class="!w-[512px] sm:!w-full"
        />
        <el-button @click="updateNickname" class="w-[100px]">{{ $t('all.update')}}</el-button>
      </div>
    </div>

    <el-divider/>

    <!-- 更新数据集简介 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('datasets.datasetDesc')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('datasets.edit.tips2')}}
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
        <el-button @click="updateDatasetDesc" class="w-[100px]">{{ $t('all.update')}}</el-button>
      </div>
    </div>

    <el-divider/>

    <!-- 数据集标签 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('datasets.datasetTag') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('datasets.edit.tips3') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]" ref="tagListContainer">
        <p class="text-[#344054] text-[14px]">{{ $t('datasets.datasetTag')}}</p>
        <div class="flex flex-col gap-[6px] w-[512px] md:w-full">
          <div class="flex gap-[4px] flex-wrap items-center w-full border rounded-[4px] border-gray-300 min-h-[40px] p-[6px]">
            <div class="scroll-container flex gap-[4px] flex-wrap max-h-[120px] overflow-y-auto">
              <span v-for="tag in selectedTags" class="flex items-center gap-[5px] border rounded-[5px] border-gray-300 px-[5px] py-[2px]">
                {{ this.$i18n.locale === 'zh'? (tag.zh_name || tag.name) : tag.name }}
                <el-icon><Close @click="removeTag(tag.name)" /></el-icon>
              </span>
            </div>
            <input class="w-full max-h-[36px] outline-none"
                    v-model="tagInput"
                    @input="showTagList" />
          </div>
          <div v-show="shouldShowTagList" class="rounded-md max-h-[300px] overflow-y-auto border border-gray-200 bg-white shadow-lg py-[4px] px-[6px]">
            <p v-for="tag in theTagList"
                @click="selectTag(tag)"
                class="flex gap-[8px] items-center cursor-pointer p-[10px]"
            >
              {{ this.$i18n.locale === 'zh'? (tag.zh_name || tag.name) : tag.name}}
            </p>
          </div>
          <el-button @click="updateTags" class="w-[100px]">{{ $t('all.update') }}</el-button>
        </div>
      </div>
    </div>

    <el-divider/>

    <!-- 行业标签 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('datasets.datasetIndustryTag') }}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('datasets.edit.tips3') }}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]" ref="IndustryTagListContainer">
        <p class="text-[#344054] text-[14px]">{{ $t('datasets.datasetIndustryTag')}}</p>
        <div class="flex flex-col gap-[6px] w-[512px] md:w-full">
          <div class="flex gap-[4px] flex-wrap items-center w-full border rounded-[4px] border-gray-300 min-h-[40px] p-[6px]">
            <div class="scroll-container flex gap-[4px] flex-wrap max-h-[120px] overflow-y-auto">
              <span v-for="tag in selectedIndustryTags" class="flex items-center gap-[5px] border rounded-[5px] border-gray-300 px-[5px] py-[2px]">
                {{ this.$i18n.locale === 'zh'? (tag.zh_name || tag.name) : tag.name }}
                <el-icon><Close @click="removeIndustryTag(tag.name)" /></el-icon>
              </span>
            </div>
            <input class="w-full max-h-[36px] outline-none"
                    v-model="industryTagInput"
                    @input="showIndustryTagList" />
          </div>
          <div v-show="shouldShowIndustryTagList" class="rounded-md max-h-[300px] overflow-y-auto border border-gray-200 bg-white shadow-lg py-[4px] px-[6px]">
            <p v-for="tag in theIndustryTagsList"
                @click="selectIndustryTag(tag)"
                class="flex gap-[8px] items-center cursor-pointer p-[10px]"
            >
              {{ this.$i18n.locale === 'zh'? (tag.show_name || tag.name) : tag.name}}
            </p>
          </div>
          <el-button @click="updateIndustryTags" class="w-[100px]">{{ $t('all.update') }}</el-button>
        </div>
      </div>
    </div>

    <el-divider/>

    <!-- 修改可见性 -->
    <div class="flex xl:flex-col gap-[32px]">
      <div class="w-[380px] sm:w-full flex flex-col">
        <div class="text-[14px] text-[#344054] leading-[20px] font-medium">
          {{ $t('datasets.edit.changeVisibility')}}
        </div>
        <div class="max-w-[864px] text-[14px] text-[#475467] leading-[20px]">
          {{ $t('datasets.edit.statusText')}}
          <span class="text-black font-medium">【{{ isPrivate ? this.$t('all.private') : this.$t('all.public') }}】</span>
          {{ $t('datasets.edit.status')}}。{{ isPrivate ? this.$t('datasets.edit.privateVis') : this.$t('datasets.edit.publicVis')}}
        </div>
      </div>
      <div class="flex flex-col gap-[6px]">
        <p class="text-[14px] text-[#475467]">{{ $t('datasets.edit.datasetVisibility')}}</p>
        <el-select v-model="visibilityName"
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
          {{ $t('datasets.edit.delDataset')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('datasets.edit.delTips')}}
          <span class="text-black font-medium">{{ $t('all.canNot')}}</span>
          {{ $t('datasets.edit.delTips2')}}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('datasets.edit.delTips3')}}
        </div>
        <div class="text-[14px] text-[#475467] leading-[20px]">
          {{ $t('all.enterPls')}}
          <span class="text-black font-medium break-words">{{ path }}</span>
          {{ $t('all.sureDel')}}
        </div>
      </div>

      <div class="flex flex-col gap-[8px]">
        <p class="text-[14px] text-[#475467]">{{ $t('datasets.datasetName')}}</p>
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
              {{ $t('datasets.edit.confirmDel')}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { h, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import csrfFetch from "../../packs/csrfFetch"
import jwtFetch from '../../packs/jwtFetch'
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
      csghubServer: inject('csghubServer'),
      theTagList:this.tagList,
      industryTagsList: [],
      theIndustryTagsList:this.industryTagsList,
      selectedTags:[],
      selectedIndustryTags:[],
      shouldShowTagList:false,
      shouldShowIndustryTagList:false,
      tagInput:'',
      industryTagInput:'',
      delDesc: '',
      datasetName: this.path.split('/')[1],
      theDatasetNickname: this.datasetNickname || "",
      theDatasetDesc: this.datasetDesc || "",
      datasetPath: this.path,
      readmeContent: '',
      readmeSha: '',
      options: [{value: 'Private', label: this.$t('all.private')},
        {value: 'Public', label: this.$t('all.public')}]
    };
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
    document.addEventListener('click', this.collapseTagList);

    this.getIndustryTags()
    this.fetchReadme()
  },
  watch: {
    tags() {
      this.getSelectTags()
    }
  },
  beforeDestroy() {
    // 组件销毁前移除事件监听
    document.removeEventListener('click', this.collapseTagList);
  },
  methods: {
    async getIndustryTags() {
      const getIndustryOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
      }
      const response = await jwtFetch(`${this.csghubServer}/api/v1/tags`, getIndustryOptions)
      if (!response.ok) {
        response.json().then(({ err }) => {
          ElMessage({ message: err.message, type: "warning" })
        })
      } else {
        response.json().then(({ data }) => {
          this.industryTagsList = data.filter(item => item.category === 'industry' && item.scope === 'dataset');
        })
      }
    },
    collapseTagList(event) {
      if (!this.$refs.tagListContainer.contains(event.target)) {
        this.shouldShowTagList = false;
      }
      if (!this.$refs.IndustryTagListContainer.contains(event.target)) {
        this.shouldShowIndustryTagList = false;
      }
    },
    getSelectTags(){
      this.selectedTags = [
        ...this.tags.task_tags.map(tag => tag),
        ...this.tags.other_tags.map(tag => tag)
      ];
      this.selectedIndustryTags = [
        ...this.tags.industry_tags.map(tag => tag)
      ]
    },
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

    showTagList(e){
      if(this.tagInput != ''){
        const userTriggerTagList = this.tagList.filter(tag => {
          return tag.zh_name.includes(this.tagInput) || tag.name.includes(this.tagInput)
        })
        if (userTriggerTagList.length > 0) {
          this.theTagList = userTriggerTagList
          this.shouldShowTagList = true
        }
      }else{
        this.shouldShowTagList = false
      }
    },

    showIndustryTagList(e){
      if(this.industryTagInput != ''){
        const userTriggerIndustryTagList = this.industryTagsList.filter(tag => {
          return tag.name.includes(this.industryTagInput) || tag.show_name.includes(this.industryTagInput)
        })
        if (userTriggerIndustryTagList.length > 0) {
          this.theIndustryTagsList = userTriggerIndustryTagList
          this.shouldShowIndustryTagList = true
        }
      }else{
        this.shouldShowIndustryTagList = false
      }
    },

    selectTag(newTag){
      const findTag = this.selectedTags.find(tag => tag.name === newTag.name)
      if (!findTag) {
        this.selectedTags.push({name: newTag.name, zh_name: newTag.zh_name})
      }
    },

    selectIndustryTag(newTag){
      const findIndustryTag = this.selectedIndustryTags.find(tag => tag.name === newTag.name)
      if (!findIndustryTag) {
        this.selectedIndustryTags.push({name: newTag.name, zh_name: newTag.show_name})
      }
    },

    removeTag(tagName){
      this.selectedTags = this.selectedTags.filter( item => item.name !== tagName )
    },

    removeIndustryTag(tagName){
      this.selectedIndustryTags = this.selectedIndustryTags.filter( item => item.name !== tagName )
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
        ElMessage({message: this.$t('all.delSuccess'), type: "success"})
        setTimeout(() => {
          window.location.href = "/datasets"
        }, 1000)
        return response.json()
      }
    },

    changeVisibility(value) {
      ElMessageBox({
        title: this.$t('datasets.edit.changeVisibility'),
        message: h('p', null, [
          h('span', null, this.$t('all.changeVis')),
          h('span', null, value === 'Private'? this.$t('all.private') : this.$t('all.public')),
          h('span', null, value === 'Private'? this.$t('datasets.edit.privateInfo') : this.$t('datasets.edit.publicInfo'))
        ]),
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
      }).then((action) => {
        ElMessage({
          type: 'success',
          message: this.$t('all.changeSuccess'),
        })
      }).catch(() => {
        ElMessage({
          type: 'warning',
          message: this.$t('all.changeCancel'),
        })
      })
    },

    updateTags(){
      if(this.selectedTags.length !== 0){
        const newSelectedTags = this.selectedTags.map(tag => tag.name)
        this.updateTagsInReadme(newSelectedTags)
      } else {
        ElMessage({ message: this.$t('datasets.edit.needDatasetTag'), type: "warning" })
      }

    },

    updateIndustryTags(){
      if(this.selectedIndustryTags.length !==0){
        const newSelectedIndustryTags = this.selectedIndustryTags.map(tag => tag.name)
        this.updateIndustryTagsAPI(newSelectedIndustryTags)
      } else {
        ElMessage({ message: this.$t('datasets.edit.needDatasetTag'), type: "warning" })
      }
    },
    
    async fetchReadme() {
      const url = `${this.csghubServer}/api/v1/datasets/${this.path}/blob/README.md`
      const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
      await jwtFetch(url, options).then((response) => {
        response
          .json()
          .then(({ data }) => {
            this.readmeContent = atob_utf8(data.content)
            this.readmeSha = data.sha
          })
          .catch((error) => {
            console.error(error)
          })
      })
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
      const updateReadmeEndpoint = `${this.csghubServer}/api/v1/datasets/${this.path}/raw/README.md`
      const bodyData = {
        content: btoa_utf8(newContent),
        message: 'Update README.md',
        branch: 'main',
        new_branch: 'main',
        sha: this.readmeSha
      }
      const option = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      }
      const response = await jwtFetch(updateReadmeEndpoint, option)
      if (response.ok) {
        ElMessage({ message: this.$t('all.updateSuccess'), type: 'success' })
      } else {
        response.json().then((data) => {
          ElMessage({ message: data.msg, type: 'warning' })
        })
      }
    },
    
    async updateIndustryTagsAPI(tags){
      const industryOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tags)
      }
      const response = await jwtFetch(`${this.csghubServer}/api/v1/datasets/${this.path}/tags/industry`, industryOptions)
      if (!response.ok) {
        response.json().then((err) => {
          ElMessage({ message: err.message, type: "warning" })
        })
      } else {
        response.json().then((data) => {
          ElMessage({ message: this.$t('all.addSuccess'), type: "success" })
        })
      }
    },

    updateNickname() {
      if (!!this.theDatasetNickname.trim()) {
        const payload = {nickname: this.theDatasetNickname}
        this.updateDataset(payload)
      } else {
        ElMessage({ message: this.$t('datasets.edit.needDatasetName'), type: "warning" })
      }
    },

    updateDatasetDesc() {
      if (!!this.theDatasetDesc.trim()) {
        const payload = {desc: this.theDatasetDesc}
        this.updateDataset(payload)
      } else {
        ElMessage({ message: this.$t('datasets.edit.needDatasetDesc'), type: "warning" })
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
