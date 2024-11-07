<template>
  <div class="flex bg-white flex-col pt-[32px] pb-[60px]">
    <div class="flex">
      <span v-show="type !== 'code' && type !== 'space'" class="mr-[4px] py-[8px] px-[12px] text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
            data-type="Task"
            :class="activeNavItem === 'Task' ? 'text-gray-700 active-type font-[600] shadow-outline-gray-400 shadow-outline-4' : ''"
            @click="changeActiveItem"
      >
        {{ $t('all.tasks') }}
      </span>
      <span v-show="type === 'model'"
            class="mr-[4px] py-[8px] px-[12px] text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
            data-type="Framework"
            :class="activeNavItem === 'Framework' ? 'text-gray-700 active-type font-[600] shadow-outline-gray-400 shadow-outline-4' : ''"
            @click="changeActiveItem"
      >
      {{ $t('all.framework') }}
      </span>

      <span v-show="type === 'model' || type === 'dataset'"
            class="mr-[4px] py-[8px] px-[12px] text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
            data-type="Language"
            :class="activeNavItem === 'Language' ? 'text-gray-700 active-type font-[600] shadow-outline-gray-400 shadow-outline-4' : ''"
            @click="changeActiveItem"
      >
      {{ $t('all.languages') }}
      </span>

      <span class="mr-[4px] py-[8px] px-[12px] text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
            data-type="License"
            :class="activeNavItem === 'License' ? 'text-gray-700 active-type font-[600] shadow-outline-gray-400 shadow-outline-4' : ''"
            @click="changeActiveItem"
      >
      License
      </span>
    </div>
    <div>
      <!-- task tags -->
      <div v-show="showTask">
        <el-input
          v-model="taskTagFilterInput"
          class="mt-[28px]"
          size="large"
          :placeholder="$t('all.filterTags')"
          :prefix-icon="Search"
          @input = "filterTaskTags"
        />
        <div class="">
          <div v-for="(value, key) in theTaskTags">
            <h3 class="text-gray-500 text-xs my-[16px]">{{ $t(`tags.${key}`) }}</h3>
            <div class="flex gap-[8px] flex-wrap">
              <tag-item v-for="tag in value" :tag="tag" :active="activeTaskTag === tag.name" @handleTagClick="setActiveTaskTag" />
            </div>
          </div>
        </div>
      </div>
      <!-- framework tags -->
      <div v-show="showFramework">
        <el-input
          v-model="frameworkTagFilterInput"
          class="mt-[28px] mb-[16px]"
          size="large"
          :placeholder="$t('all.filterTags')"
          :prefix-icon="Search"
          @input = "filterFrameworkTags"
        />
        <div class="flex gap-[8px] flex-wrap">
          <PyTorch v-show="frameworkTagExist('PyTorch')"
                 @setActiveFrameworkTag="setActiveFrameworkTag"
                 :activeTag="activeFrameworkTag" />
          <TensorFlow v-show="frameworkTagExist('TensorFlow')"
                      @setActiveFrameworkTag="setActiveFrameworkTag"
                      :activeTag="activeFrameworkTag" />
          <Safetensors v-show="frameworkTagExist('Safetensors')"
                      @setActiveFrameworkTag="setActiveFrameworkTag"
                      :activeTag="activeFrameworkTag" />
          <ONNX v-show="frameworkTagExist('ONNX')"
                @setActiveFrameworkTag="setActiveFrameworkTag"
                :activeTag="activeFrameworkTag" />
          <JAX v-show="frameworkTagExist('JAX')"
              @setActiveFrameworkTag="setActiveFrameworkTag"
              :activeTag="activeFrameworkTag" />
          <PaddlePaddle v-show="frameworkTagExist('PaddlePaddle')"
                        @setActiveFrameworkTag="setActiveFrameworkTag"
                        :activeTag="activeFrameworkTag" />
          <Joblib v-show="frameworkTagExist('Joblib')"
                  @setActiveFrameworkTag="setActiveFrameworkTag"
                  :activeTag="activeFrameworkTag" />
          <GGUF v-show="frameworkTagExist('GGUF')"
                @setActiveFrameworkTag="setActiveFrameworkTag"
                :activeTag="activeFrameworkTag" />
        </div>
      </div>
      <!-- language tags -->
      <div v-show="showLanguage">
        <el-input
          v-model="LanguageTagFilterInput"
          class="mt-[28px] mb-[16px]"
          size="large"
          :placeholder="$t('all.filterTags')"
          :prefix-icon="Search"
          @input = "filterLanguageTags"
        />
        <div class="flex gap-[8px] flex-wrap">
          <span v-for="languageTag in theLanguageTags"
                class="text-sm text-gray-700 px-[8px] py-[4px] rounded-xs cursor-pointer flex items-center gap-[4px]"
                :data-tag_name="languageTag.name"
                :style="setLanguageTagColor(languageTag.name)"
                @click="setActiveLanguageTag(languageTag.name)"
          >
            <svg :stroke="setSvgColor(languageTag.name)" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 6C11 8.76142 8.76142 11 6 11M11 6C11 3.23858 8.76142 1 6 1M11 6C11 4.89543 8.76142 4 6 4C3.23858 4 1 4.89543 1 6M11 6C11 7.10457 8.76142 8 6 8C3.23858 8 1 7.10457 1 6M6 11C3.23858 11 1 8.76142 1 6M6 11C7.10457 11 8 8.76142 8 6C8 3.23858 7.10457 1 6 1M6 11C4.89543 11 4 8.76142 4 6C4 3.23858 4.89543 1 6 1M1 6C1 3.23858 3.23858 1 6 1" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ languageTag.show_name ? $t(`languages.${languageTag.show_name}`) : languageTags.name }}
          </span>
        </div>
      </div>

      <div v-show="showLicense">
        <el-input
          v-model="licenseTagFilterInput"
          class="mt-[28px] mb-[16px]"
          size="large"
          :placeholder="$t('all.filterTags')"
          :prefix-icon="Search"
          @input = "filterLicenseTags"
        />
        <div class="flex gap-[8px] flex-wrap">
          <span v-for="licenseTag in theLicenseTags" class="text-sm text-gray-700 px-[8px] py-[3px] rounded-sm cursor-pointer flex items-center gap-[4px] border border-gray-200"
                :data-tag_name="licenseTag.name"
                :style="setLicenseTagColor(licenseTag.name)"
                @click="setActiveLicenseTag"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"> <path d="M6 2.99995V11M6 2.99995H4.28328C4.17763 2.99995 4.12481 2.99995 4.07307 3.00719C4.02712 3.01362 3.98186 3.02431 3.93789 3.0391C3.88837 3.05576 3.84112 3.07939 3.74663 3.12664L3 3.49995M6 2.99995H7.71672C7.82237 2.99995 7.87519 2.99995 7.92693 3.00719C7.97288 3.01362 8.01814 3.02431 8.06211 3.0391C8.11163 3.05576 8.15888 3.07939 8.25337 3.12664L9 3.49995M6 2.99995V1M6 11H8.5M6 11H3.5M1 3.99995H1.71672C1.82237 3.99995 1.87519 3.99995 1.92693 3.9927C1.97288 3.98627 2.01814 3.97559 2.06211 3.96079C2.11163 3.94413 2.15888 3.92051 2.25337 3.87326L3 3.49995M11 3.99995H10.2833C10.1776 3.99995 10.1248 3.99995 10.0731 3.9927C10.0271 3.98627 9.98186 3.97559 9.93789 3.96079C9.88837 3.94413 9.84112 3.92051 9.74663 3.87326L9 3.49995M3 3.49995L1.93102 7.06321C1.80356 7.48809 1.73982 7.70054 1.76796 7.87165C1.80739 8.11139 1.9605 8.31718 2.1788 8.42383C2.33461 8.49995 2.55641 8.49995 3 8.49995V8.49995C3.44359 8.49995 3.66539 8.49995 3.8212 8.42383C4.0395 8.31718 4.19261 8.11139 4.23204 7.87165C4.26018 7.70054 4.19644 7.48809 4.06898 7.06321L3 3.49995ZM9 3.49995L7.93102 7.06321C7.80356 7.48809 7.73982 7.70054 7.76796 7.87165C7.80739 8.11139 7.9605 8.31718 8.1788 8.42383C8.33461 8.49995 8.55641 8.49995 9 8.49995V8.49995V8.49995C9.44359 8.49995 9.66539 8.49995 9.8212 8.42383C10.0395 8.31718 10.1926 8.11139 10.232 7.87165C10.2602 7.70054 10.1964 7.48809 10.069 7.06321L9 3.49995Z" :stroke="activeLicenseTag === licenseTag.name ? 'white' : '#606266'" stroke-linecap="round" stroke-linejoin="round" /> </svg>
            {{ licenseTag.show_name || licenseTag.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, computed } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import PyTorch from './frameworks/PyTorch.vue'
  import TensorFlow from './frameworks/TensorFlow.vue'
  import Safetensors from './frameworks/Safetensors.vue'
  import JAX from './frameworks/JAX.vue'
  import ONNX from './frameworks/ONNX.vue'
  import PaddlePaddle from './frameworks/PaddlePaddle.vue'
  import Joblib from './frameworks/Joblib.vue'
  import GGUF from './frameworks/GGUF.vue'
  import TagItem from './TagItem.vue'

  const props = defineProps({
    taskTags: Object,
    frameworkTags: Array,
    languageTags: Array,
    licenseTags: Array,
    type: String,
    selectedTag: String,
    selectedTagType: String
  })

  const emit = defineEmits(['resetTags'])

  const activeNavItem = ref('Task')

  const theTaskTags = ref({})
  watch(() => props.taskTags, (newValue) => {
    theTaskTags.value = newValue
  })

  const theFrameworkTags = ref([])
  watch(() => props.frameworkTags, (newValue) => {
    theFrameworkTags.value = newValue
  })

  const theLanguageTags = ref([])
  watch(() => props.languageTags, (newValue) => {
    theLanguageTags.value = newValue
  })

  const theLicenseTags = ref([])
  watch(() => props.licenseTags, (newValue) => {
    theLicenseTags.value = newValue
  })

  const activeTaskTag = ref('')
  const activeFrameworkTag = ref('')
  const activeLanguageTag = ref('')
  const activeLicenseTag = ref('')
  const taskTagFilterInput = ref('')
  const frameworkTagFilterInput = ref('')
  const LanguageTagFilterInput = ref('')
  const licenseTagFilterInput = ref('')
  const showTask = ref(true)
  const showFramework = ref(false)
  const showLanguage = ref(false)
  const showLicense = ref(false)

  const changeActiveItem = (e) => {
    activeNavItem.value = e.target.dataset.type
    toggleTagType()
  }

  const toggleTagType = () => {
    if (activeNavItem.value === 'Task') {
      showTask.value = true
      showFramework.value = false
      showLanguage.value = false
      showLicense.value = false
    } else if (activeNavItem.value === 'Framework') {
      showTask.value = false
      showFramework.value = true
      showLanguage.value = false
      showLicense.value = false
    } else if (activeNavItem.value === 'Language') {
      showTask.value = false
      showFramework.value = false
      showLanguage.value = true
      showLicense.value = false
    } else if (activeNavItem.value === 'License') {
      showTask.value = false
      showFramework.value = false
      showLanguage.value = false
      showLicense.value = true
    }
  }

  const setActiveTaskTag = (tag) => {
    if (activeTaskTag.value === tag.name) {
      activeTaskTag.value = ''
    } else {
      activeTaskTag.value = tag.name
    }
    emitTag()
  }

  const setActiveFrameworkTag = (tagName) => {
    if (activeFrameworkTag.value === tagName) {
      activeFrameworkTag.value = ''
    } else {
      activeFrameworkTag.value = tagName
    }
    emitTag()
  }

  const setActiveLanguageTag = (tagName) => {
    if (activeLanguageTag.value === tagName) {
      activeLanguageTag.value = ''
    } else {
      activeLanguageTag.value = tagName
    }
    emitTag()
  }

  const setActiveLicenseTag = (e) => {
    if (activeLicenseTag.value === e.target.dataset.tag_name) {
      activeLicenseTag.value = ''
    } else {
      activeLicenseTag.value = e.target.dataset.tag_name
    }
    emitTag()
  }

  const setLanguageTagColor = (tagName) => {
    if (activeLanguageTag.value === tagName) {
      return "color: white; background-color: #0DAF66"
    } else {
      return `color: #087443; background-color: #F6FEF9`
    }
  }

  const setLicenseTagColor = (tagName) => {
    if (activeLicenseTag.value === tagName) {
      return "color: white; background-color: #4D6AD6"
    } else {
      return `color: #303133`
    }
  }

  const filterTaskTags = (keywords) => {
    const keywordsRegex = new RegExp(keywords, 'i');
    const newTags = props.taskTags
    const result = removeNotMatchedTags(newTags, keywordsRegex)
    theTaskTags.value = result
  }

  const filterFrameworkTags = (keywords) => {
    const keywordsRegex = new RegExp(keywords, 'i');
    const newTags = props.frameworkTags
    const result = removeNotMatchedFrameworkTags(newTags, keywordsRegex)
    theFrameworkTags.value = result
  }

  const filterLanguageTags = (keywords) => {
    const keywordsRegex = new RegExp(keywords, 'i');
    const newTags = props.languageTags
    const result = removeNotMatchedFrameworkTags(newTags, keywordsRegex)
    theLanguageTags.value = result
  }

  const filterLicenseTags = (keywords) => {
    const keywordsRegex = new RegExp(keywords, 'i');
    const newTags = props.licenseTags
    const result = removeNotMatchedFrameworkTags(newTags, keywordsRegex)
    theLicenseTags.value = result
  }

  const removeNotMatchedFrameworkTags = (tags, regex) => {
    const matchedTags = tags.filter((tag) => regex.test(tag.show_name) || regex.test(tag.name))
    return matchedTags
  }

  const frameworkTagExist = (tagName) => {
    const result = theFrameworkTags.value.find(ftag => ftag.name.toLowerCase() === tagName.toLowerCase())
    return result
  }

  const removeNotMatchedTags = (json, regex) => {
    const newJson = {}
    for (const [field, items] of Object.entries(json)) {
      newJson[field] = []
      for (const { show_name, name } of items) {
        if (regex.test(show_name) || regex.test(name)) {
          newJson[field].push({ show_name: show_name, name: name })
        }
      }
    }
    return newJson
  }

  const emitTag = () => {
    emit('resetTags', activeTaskTag.value, activeFrameworkTag.value, activeLanguageTag.value, activeLicenseTag.value)
  }

  const setTagNameFromParams = () => {
    if (props.selectedTagType === 'Task') {
      activeTaskTag.value = props.selectedTag
    } else if (props.selectedTagType === 'Framework') {
      activeFrameworkTag.value = props.selectedTag
    } else if (props.selectedTagType === 'License') {
      activeLicenseTag.value = props.selectedTag
    } else if (props.selectedTagType === 'Language') {
      activeLanguageTag.value = props.selectedTag
    }
  }

  const setTagTypeFromParams = () => {
    activeNavItem.value = props.selectedTagType
    toggleTagType()
  }

  const emitTagFromParams = () => {
    setTagTypeFromParams()
    setTagNameFromParams()
    emitTag()
  }

  const setSvgColor = (tagLabel) => {
    if (activeLanguageTag.value?.toLowerCase() === tagLabel) {
      return "#FAFEF5"
    }
    return "#3B7C0F"
  }

  onMounted(() => {
    emitTagFromParams()

    if (props.type === 'code' || props.type === 'space') {
      activeNavItem.value = 'License'
      toggleTagType()
    }else{
      activeNavItem.value = 'Task'
    }
  })

</script>

<style scoped>
  .active-type {
    box-shadow: 0px 0px 0px 4px rgba(152, 162, 179, 0.14);
    border-radius: var(--border-radius-sm);
  }
</style>