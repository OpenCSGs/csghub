<template>
  <div class="flex w-[421px] p-[16px] bg-[#fff] flex-col">
    <div class="my-[16px]">
      <span class="mr-[16px] py-[4px] text-[12px] text-[#667085]"
            data-type="Task"
            :class="activeNavItem === 'Task' ? 'text-[#344054] font-[600]' : ''"
            @click="changeActiveItem"
      >
        任务标签
      </span>
      <span class="mr-[16px] py-[4px] text-[12px] text-[#667085]"
            data-type="Framework"
            :class="activeNavItem === 'Framework' ? 'text-[#344054] font-[600]' : ''"
            @click="changeActiveItem"
      >
        框架标签
      </span>
      <span class="mr-[16px] py-[4px] text-[12px] text-[#667085]"
            data-type="License"
            :class="activeNavItem === 'License' ? 'text-[#344054] font-[600]' : ''"
            @click="changeActiveItem"
      >
        框架标签
      </span>
    </div>
    <div>
      <!-- task tags -->
      <div v-show="showTask">
        <el-input
          v-model="tagFilterInput"
          class="w-50"
          size="large"
          placeholder="筛选标签"
          :prefix-icon="Search"
          @change = "filterTags"
        />
        <div>
          <div v-for="tagField in theTaskTags">
            <h3 class="text-[#909399] text-[12px] mb-[11px] mt-[16px]">{{ tagField.zh_name }}</h3>
            <div class="flex gap-[8px]">
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
      </div>

      <div v-show="showLicense" class="flex gap-[8px] flex-wrap">
        <span v-for="licenseTag in theLicenseTags" class="text-[14px] text-[#303133] px-[8px] py-[4px] rounded-[4px] cursor-pointer flex items-center gap-[4px] border"
              :data-tag_name="licenseTag.name"
              :style="setLicenseTagColor(licenseTag.name)"
              @click="setActiveLicenseTag"
        >
          <svg class="text-xs text-gray-900" width="1em" height="1em" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.46009 5.0945V6.88125C1.46009 7.25201 1.75937 7.55129 2.13012 7.55129C2.50087 7.55129 2.80016 7.25201 2.80016 6.88125V5.0945C2.80016 4.72375 2.50087 4.42446 2.13012 4.42446C1.75937 4.42446 1.46009 4.72375 1.46009 5.0945ZM4.14022 5.0945V6.88125C4.14022 7.25201 4.4395 7.55129 4.81026 7.55129C5.18101 7.55129 5.48029 7.25201 5.48029 6.88125V5.0945C5.48029 4.72375 5.18101 4.42446 4.81026 4.42446C4.4395 4.42446 4.14022 4.72375 4.14022 5.0945ZM1.23674 9.78473H8.38377C8.75452 9.78473 9.0538 9.48545 9.0538 9.1147C9.0538 8.74395 8.75452 8.44466 8.38377 8.44466H1.23674C0.865993 8.44466 0.566711 8.74395 0.566711 9.1147C0.566711 9.48545 0.865993 9.78473 1.23674 9.78473ZM6.82036 5.0945V6.88125C6.82036 7.25201 7.11964 7.55129 7.49039 7.55129C7.86114 7.55129 8.16042 7.25201 8.16042 6.88125V5.0945C8.16042 4.72375 7.86114 4.42446 7.49039 4.42446C7.11964 4.42446 6.82036 4.72375 6.82036 5.0945ZM4.39484 0.623142L0.865993 2.48137C0.682851 2.57517 0.566711 2.76725 0.566711 2.97273C0.566711 3.28094 0.816857 3.53109 1.12507 3.53109H8.49991C8.80365 3.53109 9.0538 3.28094 9.0538 2.97273C9.0538 2.76725 8.93766 2.57517 8.75452 2.48137L5.22568 0.623142C4.9666 0.484669 4.65391 0.484669 4.39484 0.623142V0.623142Z" fill="currentColor"></path></svg>
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

  const props = defineProps({
    taskTags: String,
    frameworkTags: String,
    licenseTags: String
  })

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
  }

  const setActiveFrameworkTag = (tagName) => {
    if (activeFrameworkTag.value === tagName) {
      activeFrameworkTag.value = ''
    } else {
      activeFrameworkTag.value = tagName
    }
  }

  const setActiveLicenseTag = (e) => {
    if (activeLicenseTag.value === e.target.dataset.tag_name) {
      activeLicenseTag.value = ''
    } else {
      activeLicenseTag.value = e.target.dataset.tag_name
    }
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