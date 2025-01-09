<template>
  <div class="flex bg-white flex-col pt-[32px] pb-[60px]">
    <div class="flex flex-wrap gap-1">
      <TagCategory
        v-for="category in avaliableCategories"
        :name="category.name"
        :activeCategory="activeNavItem"
        @changeActiveItem="changeActiveItem" />
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
          @input="filterTaskTags" />
        <div class="">
          <div v-for="(value, key) in theTaskTags">
            <h3 class="text-gray-500 text-xs my-[16px]">
              {{ $t(`tags.${key}`) }}
            </h3>
            <div class="flex gap-[8px] flex-wrap">
              <TaskTagItem
                v-for="tag in value"
                :tag="tag"
                :active="activeTaskTag.includes(tag.name)"
                @handleTagClick="setActiveTaskTag" />
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
          @input="filterFrameworkTags" />
        <div class="flex gap-[8px] flex-wrap">
          <PyTorch
            v-show="frameworkTagExist('PyTorch')"
            @setActiveFrameworkTag="setActiveFrameworkTag"
            :activeTag="activeFrameworkTag" />
          <TensorFlow
            v-show="frameworkTagExist('TensorFlow')"
            @setActiveFrameworkTag="setActiveFrameworkTag"
            :activeTag="activeFrameworkTag" />
          <Safetensors
            v-show="frameworkTagExist('Safetensors')"
            @setActiveFrameworkTag="setActiveFrameworkTag"
            :activeTag="activeFrameworkTag" />
          <ONNX
            v-show="frameworkTagExist('ONNX')"
            @setActiveFrameworkTag="setActiveFrameworkTag"
            :activeTag="activeFrameworkTag" />
          <JAX
            v-show="frameworkTagExist('JAX')"
            @setActiveFrameworkTag="setActiveFrameworkTag"
            :activeTag="activeFrameworkTag" />
          <PaddlePaddle
            v-show="frameworkTagExist('PaddlePaddle')"
            @setActiveFrameworkTag="setActiveFrameworkTag"
            :activeTag="activeFrameworkTag" />
          <Joblib
            v-show="frameworkTagExist('Joblib')"
            @setActiveFrameworkTag="setActiveFrameworkTag"
            :activeTag="activeFrameworkTag" />
          <GGUF
            v-show="frameworkTagExist('GGUF')"
            @setActiveFrameworkTag="setActiveFrameworkTag"
            :activeTag="activeFrameworkTag" />
        </div>
      </div>
      <!-- language tags -->
      <div v-show="showLanguage">
        <el-input
          v-model="LanguageTagFilterInput"
          class="mt-7 mb-4"
          size="large"
          :placeholder="$t('all.filterTags')"
          :prefix-icon="Search"
          @input="filterLanguageTags" />
        <div class="flex gap-[8px] flex-wrap">
          <LanguageTagItem
            v-for="languageTag in theLanguageTags"
            :tag="languageTag"
            :active="activeLanguageTag.includes(languageTag.name)"
            @handleTagClick="setActiveLanguageTag" />
        </div>
      </div>

      <div v-show="showLicense">
        <el-input
          v-model="licenseTagFilterInput"
          class="mt-7 mb-4"
          size="large"
          :placeholder="$t('all.filterTags')"
          :prefix-icon="Search"
          @input="filterLicenseTags" />
        <div class="flex gap-1 flex-wrap">
          <LicenseTagItem
            v-for="licenseTag in theLicenseTags"
            :tag="licenseTag"
            :active="activeLicenseTag.includes(licenseTag.name)"
            @handleTagClick="setActiveLicenseTag" />
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
  import TaskTagItem from './TaskTagItem.vue'
  import LanguageTagItem from './LanguageTagItem.vue'
  import LicenseTagItem from './LicenseTagItem.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElInput, ElMessage } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import TagCategory from './TagCategory.vue'

  const props = defineProps({
    repoType: String,
    selectedTag: String,
    selectedTagType: String
  })

  const emit = defineEmits(['resetTags'])

  const { t } = useI18n()

  const tagFields = {
    model: [
      'computer_vision',
      'natural_language_processing',
      'audio_processing',
      'multimodal'
    ],
    dataset: ['text_processing', 'graphics', 'audio', 'video', 'multimodal'],
    code: []
  }

  const tagCategories = ref([])

  const taskTags = ref({})
  const frameworkTags = ref([])
  const languageTags = ref([])
  const licenseTags = ref([])

  const activeNavItem = ref('Task')

  const theTaskTags = ref({})
  watch(taskTags, (newValue) => {
    theTaskTags.value = newValue
  })

  const theFrameworkTags = ref([])
  watch(frameworkTags, (newValue) => {
    theFrameworkTags.value = newValue
  })

  const theLanguageTags = ref([])
  watch(languageTags, (newValue) => {
    theLanguageTags.value = newValue
  })

  const theLicenseTags = ref([])
  watch(licenseTags, (newValue) => {
    theLicenseTags.value = newValue
  })

  const activeTaskTag = ref([])
  const activeFrameworkTag = ref([])
  const activeLanguageTag = ref([])
  const activeLicenseTag = ref([])
  const taskTagFilterInput = ref('')
  const frameworkTagFilterInput = ref('')
  const LanguageTagFilterInput = ref('')
  const licenseTagFilterInput = ref('')
  const showTask = ref(true)
  const showFramework = ref(false)
  const showLanguage = ref(false)
  const showLicense = ref(false)

  const avaliableCategories = computed(() => {
    return tagCategories.value.filter((c) => c.scope === props.repoType)
  })

  const changeActiveItem = (currentType) => {
    activeNavItem.value = currentType
    toggleTagType()
  }

  const toggleTagType = () => {
    if (activeNavItem.value === 'task') {
      showTask.value = true
      showFramework.value = false
      showLanguage.value = false
      showLicense.value = false
    } else if (activeNavItem.value === 'framework') {
      showTask.value = false
      showFramework.value = true
      showLanguage.value = false
      showLicense.value = false
    } else if (activeNavItem.value === 'language') {
      showTask.value = false
      showFramework.value = false
      showLanguage.value = true
      showLicense.value = false
    } else if (activeNavItem.value === 'license') {
      showTask.value = false
      showFramework.value = false
      showLanguage.value = false
      showLicense.value = true
    }
  }

  const setActiveTaskTag = (tag) => {
    if (activeTaskTag.value.includes(tag.name)) {
      activeTaskTag.value = activeTaskTag.value.filter(
        (atn) => atn !== tag.name
      )
    } else {
      activeTaskTag.value.push(tag.name)
    }
    emitTag()
  }

  const setActiveFrameworkTag = (tagName) => {
    if (activeFrameworkTag.value.includes(tagName)) {
      activeFrameworkTag.value = activeFrameworkTag.value.filter(
        (atn) => atn !== tagName
      )
    } else {
      activeFrameworkTag.value.push(tagName)
    }
    emitTag()
  }

  const setActiveLanguageTag = (tagName) => {
    if (activeLanguageTag.value.includes(tagName)) {
      activeLanguageTag.value = activeLanguageTag.value.filter(
        (atn) => atn !== tagName
      )
    } else {
      activeLanguageTag.value.push(tagName)
    }
    emitTag()
  }

  const setActiveLicenseTag = (tagName) => {
    if (activeLicenseTag.value.includes(tagName)) {
      activeLicenseTag.value = activeLicenseTag.value.filter(
        (atn) => atn !== tagName
      )
    } else {
      activeLicenseTag.value.push(tagName)
    }
    emitTag()
  }

  // const setLanguageTagColor = (tagName) => {
  //   if (activeLanguageTag.value.includes(tagName)) {
  //     return 'color: white; background-color: #0DAF66'
  //   } else {
  //     return `color: #087443; background-color: #F6FEF9`
  //   }
  // }

  // const setLicenseTagColor = (tagName) => {
  //   if (activeLicenseTag.value.includes(tagName)) {
  //     return 'color: white; background-color: #4D6AD6'
  //   } else {
  //     return `color: #303133`
  //   }
  // }

  const filterTaskTags = (keywords) => {
    const keywordsRegex = new RegExp(keywords, 'i')
    const newTags = taskTags.value
    const result = removeNotMatchedTaskTags(newTags, keywordsRegex)
    theTaskTags.value = result
  }

  const filterFrameworkTags = (keywords) => {
    const keywordsRegex = new RegExp(keywords, 'i')
    const newTags = frameworkTags.value
    const result = removeNotMatchedTags(newTags, keywordsRegex)
    theFrameworkTags.value = result
  }

  const filterLanguageTags = (keywords) => {
    const keywordsRegex = new RegExp(keywords, 'i')
    const newTags = languageTags.value
    const result = removeNotMatchedTags(newTags, keywordsRegex)
    theLanguageTags.value = result
  }

  const filterLicenseTags = (keywords) => {
    const keywordsRegex = new RegExp(keywords, 'i')
    const newTags = licenseTags.value
    const result = removeNotMatchedTags(newTags, keywordsRegex)
    theLicenseTags.value = result
  }

  const removeNotMatchedTags = (tags, regex) => {
    const matchedTags = tags.filter(
      (tag) => regex.test(tag.show_name) || regex.test(tag.name)
    )
    return matchedTags
  }

  const frameworkTagExist = (tagName) => {
    const result = theFrameworkTags.value.find(
      (ftag) => ftag.name.toLowerCase() === tagName.toLowerCase()
    )
    return result
  }

  const removeNotMatchedTaskTags = (json, regex) => {
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
    emit(
      'resetTags',
      activeTaskTag.value,
      activeFrameworkTag.value,
      activeLanguageTag.value,
      activeLicenseTag.value
    )
  }

  const setTagNameFromParams = () => {
    if (props.selectedTagType === 'Task') {
      activeTaskTag.value.push(props.selectedTag)
    } else if (props.selectedTagType === 'Framework') {
      activeFrameworkTag.value.push(props.selectedTag)
    } else if (props.selectedTagType === 'License') {
      activeLicenseTag.value.push(props.selectedTag)
    } else if (props.selectedTagType === 'Language') {
      activeLanguageTag.value.push(props.selectedTag)
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

  async function fetchTags() {
    const { error, data } = await useFetchApi(`/tags`).json()
    if (!data.value) {
      ElMessage({
        message: error.value.msg || t('all.fetchError'),
        type: 'warning'
      })
    } else {
      let tempTaskTags = {}
      const allTaskTags = data.value.data.filter(
        (tag) =>
          tag.category === 'task' &&
          tag.scope === props.repoType &&
          tag.built_in === true
      )
      tagFields[props.repoType]?.forEach((field) => {
        const fieldTags = allTaskTags.filter((tag) => tag.group === field)
        tempTaskTags[field] = fieldTags
      })

      taskTags.value = tempTaskTags
      frameworkTags.value = data.value.data.filter(
        (tag) =>
          tag.category === 'framework' &&
          tag.scope === props.repoType &&
          tag.built_in === true
      )
      languageTags.value = data.value.data.filter(
        (tag) =>
          tag.category === 'language' &&
          tag.scope === props.repoType &&
          tag.built_in === true
      )
      licenseTags.value = data.value.data.filter(
        (tag) =>
          tag.category === 'license' &&
          tag.scope === props.repoType &&
          tag.built_in === true
      )
    }
  }

  const fetchTagCategories = async () => {
    const { data, error } = await useFetchApi('/tags/categories').json()
    if (data.value) {
      tagCategories.value = data.value.data
    } else {
      ElMessage.error(`Failed to fetch tag category: ${error.value}`)
    }
  }

  onMounted(() => {
    fetchTags()
    fetchTagCategories()
    emitTagFromParams()

    if (props.repoType === 'code' || props.repoType === 'space') {
      activeNavItem.value = 'License'
      toggleTagType()
    } else {
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
