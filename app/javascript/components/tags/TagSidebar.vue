<template>
  <div class="flex bg-[#fff] flex-col pr-[20px]">
    <div class="mb-[16px]">
      <span class="mr-[16px] py-[4px] text-[12px] text-[#667085] cursor-pointer"
            data-type="Task"
            :class="activeNavItem === 'Task' ? 'text-[#344054] font-[600]' : ''"
            @click="changeActiveItem"
      >
        任务
      </span>
      <span class="mr-[16px] py-[4px] text-[12px] text-[#667085] cursor-pointer"
            data-type="Framework"
            :class="activeNavItem === 'Framework' ? 'text-[#344054] font-[600]' : ''"
            @click="changeActiveItem"
      >
        框架
      </span>
      <span class="mr-[16px] py-[4px] text-[12px] text-[#667085] cursor-pointer"
            data-type="License"
            :class="activeNavItem === 'License' ? 'text-[#344054] font-[600]' : ''"
            @click="changeActiveItem"
      >
      License
      </span>
    </div>
    <div>
      <!-- task tags -->
      <div v-show="showTask">
        <el-input
          v-model="tagFilterInput"
          class="!w-[80%]"
          size="large"
          placeholder="筛选标签"
          :prefix-icon="Search"
          @change = "filterTags"
        />
        <div class="mt-[16px]">
          <div v-for="tagField in theTaskTags">
            <h3 class="text-[#909399] text-[12px] my-[11px]">{{ tagField.zh_name }}</h3>
            <div class="flex gap-[8px] flex-wrap">
              <span v-for="tag in tagField.tags" class="text-[14px] text-[#303133] px-[8px] py-[4px] rounded-[4px] cursor-pointer"
                    :data-tag_name="tag.name"
                    :style="setTagColor(tag.name, tagField.color)"
                    @click="setActiveTaskTag"
              >
                {{ tag.zh_name }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- framework tags -->
      <div v-show="showFramework" class="flex gap-[8px] flex-wrap">
        <PyTorch @setActiveFrameworkTag="setActiveFrameworkTag"
                 :activeTag="activeFrameworkTag" />
        <TensorFlow @setActiveFrameworkTag="setActiveFrameworkTag"
                    :activeTag="activeFrameworkTag" />
        <Safetensors @setActiveFrameworkTag="setActiveFrameworkTag"
                     :activeTag="activeFrameworkTag" />
        <ONNX @setActiveFrameworkTag="setActiveFrameworkTag"
              :activeTag="activeFrameworkTag" />
        <JAX @setActiveFrameworkTag="setActiveFrameworkTag"
             :activeTag="activeFrameworkTag" />
        <PaddlePaddle @setActiveFrameworkTag="setActiveFrameworkTag"
                      :activeTag="activeFrameworkTag" />
        <Joblib @setActiveFrameworkTag="setActiveFrameworkTag"
                      :activeTag="activeFrameworkTag" />
        <GGUF @setActiveFrameworkTag="setActiveFrameworkTag"
                      :activeTag="activeFrameworkTag" />
      </div>

      <div v-show="showLicense" class="flex gap-[8px] flex-wrap">
        <span v-for="licenseTag in theLicenseTags" class="text-[14px] text-[#303133] px-[8px] py-[4px] rounded-[4px] cursor-pointer flex items-center gap-[4px] border"
              :data-tag_name="licenseTag.name"
              :style="setLicenseTagColor(licenseTag.name)"
              @click="setActiveLicenseTag"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none"> <path d="M6 2.99995V11M6 2.99995H4.28328C4.17763 2.99995 4.12481 2.99995 4.07307 3.00719C4.02712 3.01362 3.98186 3.02431 3.93789 3.0391C3.88837 3.05576 3.84112 3.07939 3.74663 3.12664L3 3.49995M6 2.99995H7.71672C7.82237 2.99995 7.87519 2.99995 7.92693 3.00719C7.97288 3.01362 8.01814 3.02431 8.06211 3.0391C8.11163 3.05576 8.15888 3.07939 8.25337 3.12664L9 3.49995M6 2.99995V1M6 11H8.5M6 11H3.5M1 3.99995H1.71672C1.82237 3.99995 1.87519 3.99995 1.92693 3.9927C1.97288 3.98627 2.01814 3.97559 2.06211 3.96079C2.11163 3.94413 2.15888 3.92051 2.25337 3.87326L3 3.49995M11 3.99995H10.2833C10.1776 3.99995 10.1248 3.99995 10.0731 3.9927C10.0271 3.98627 9.98186 3.97559 9.93789 3.96079C9.88837 3.94413 9.84112 3.92051 9.74663 3.87326L9 3.49995M3 3.49995L1.93102 7.06321C1.80356 7.48809 1.73982 7.70054 1.76796 7.87165C1.80739 8.11139 1.9605 8.31718 2.1788 8.42383C2.33461 8.49995 2.55641 8.49995 3 8.49995V8.49995C3.44359 8.49995 3.66539 8.49995 3.8212 8.42383C4.0395 8.31718 4.19261 8.11139 4.23204 7.87165C4.26018 7.70054 4.19644 7.48809 4.06898 7.06321L3 3.49995ZM9 3.49995L7.93102 7.06321C7.80356 7.48809 7.73982 7.70054 7.76796 7.87165C7.80739 8.11139 7.9605 8.31718 8.1788 8.42383C8.33461 8.49995 8.55641 8.49995 9 8.49995V8.49995V8.49995C9.44359 8.49995 9.66539 8.49995 9.8212 8.42383C10.0395 8.31718 10.1926 8.11139 10.232 7.87165C10.2602 7.70054 10.1964 7.48809 10.069 7.06321L9 3.49995Z" stroke="#606266" stroke-linecap="round" stroke-linejoin="round"/> </svg>
          {{ licenseTag.zh_name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import PyTorch from './frameworks/PyTorch.vue'
  import TensorFlow from './frameworks/TensorFlow.vue'
  import Safetensors from './frameworks/Safetensors.vue'
  import JAX from './frameworks/JAX.vue'
  import ONNX from './frameworks/ONNX.vue'
  import PaddlePaddle from './frameworks/PaddlePaddle.vue'
  import Joblib from './frameworks/Joblib.vue'
  import GGUF from './frameworks/GGUF.vue'

  const props = defineProps({
    taskTags: String,
    frameworkTags: String,
    licenseTags: String
  })

  const emit = defineEmits(['resetTags'])

  const activeNavItem = ref('Task')
  const theTaskTags = ref(JSON.parse(props.taskTags))
  const theFrameworkTags = ref(JSON.parse(props.frameworkTags))
  const theLicenseTags = ref(JSON.parse(props.licenseTags))
  const activeTaskTag = ref('')
  const activeFrameworkTag = ref('')
  const activeLicenseTag = ref('')
  const tagFilterInput = ref('')
  const showTask = ref(true)
  const showFramework = ref(false)
  const showLicense = ref(false)

  const changeActiveItem = (e) => {
    activeNavItem.value = e.target.dataset.type
    if (activeNavItem.value === 'Task') {
      showTask.value = true
      showFramework.value = false
      showLicense.value = false
    } else if (activeNavItem.value === 'Framework') {
      showFramework.value = true
      showTask.value = false
      showLicense.value = false
    } else if (activeNavItem.value === 'License') {
      showLicense.value = true
      showFramework.value = false
      showTask.value = false
    }
  }

  const setActiveTaskTag = (e) => {
    if (activeTaskTag.value === e.target.dataset.tag_name) {
      activeTaskTag.value = ''
    } else {
      activeTaskTag.value = e.target.dataset.tag_name
    }
    emit('resetTags', activeTaskTag.value, activeFrameworkTag.value, activeLicenseTag.value)
  }

  const setActiveFrameworkTag = (tagName) => {
    if (activeFrameworkTag.value === tagName) {
      activeFrameworkTag.value = ''
    } else {
      activeFrameworkTag.value = tagName
    }
    emit('resetTags', activeTaskTag.value, activeFrameworkTag.value, activeLicenseTag.value)
  }

  const setActiveLicenseTag = (e) => {
    if (activeLicenseTag.value === e.target.dataset.tag_name) {
      activeLicenseTag.value = ''
    } else {
      activeLicenseTag.value = e.target.dataset.tag_name
    }
    emit('resetTags', activeTaskTag.value, activeFrameworkTag.value, activeLicenseTag.value)
  }

  const setTagColor = (tagName, tagFieldColor) => {
    if(activeTaskTag.value === tagName) {
      return `color: white; background-color: ${tagFieldColor}`
    } else {
      return `color: ${tagFieldColor}; border: solid`
    }
  }

  const setLicenseTagColor = (tagName) => {
    if (activeLicenseTag.value === tagName) {
      return "color: white; background-color: rgb(5 183 141 / 63%)"
    } else {
      return `color: #303133; border: solid`
    }
  }

  const filterTags = (keywords) => {
    const keywordsRegex = new RegExp(keywords);
    const newTags = JSON.parse(props.taskTags)
    const result = removeNotMatchedTags(newTags, keywordsRegex)
    theTaskTags.value = result
  }

  const removeNotMatchedTags = (json, regex) => {
    const newJson = {}
    for (const [field, { color, zh_name, tags }] of Object.entries(json)) {
      const matchedTags = tags.filter((tag) => regex.test(tag.zh_name))
      newJson[field] = { color, zh_name, tags: matchedTags }
    }
    return newJson
  }
</script>