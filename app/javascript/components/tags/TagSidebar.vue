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
    frameworkTags: String
  })

  const activeNavItem = ref('Task')
  const theTaskTags = ref(JSON.parse(props.taskTags))
  const theFrameworkTags = ref(JSON.parse(props.frameworkTags))
  const activeTaskTag = ref('')
  const activeFrameworkTag = ref('')
  const tagFilterInput = ref('')
  const showTask = ref(true)
  const showFramework = ref(false)

  const changeActiveItem = (e) => {
    activeNavItem.value = e.target.dataset.type
    if (activeNavItem.value === 'Task') {
      showTask.value = true
      showFramework.value = false
    } else if (activeNavItem.value === 'Framework') {
      showFramework.value = true
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

  const setTagColor = (tagName, tagFieldColor) => {
    if(activeTaskTag.value === tagName) {
      return `color: white; background-color: ${tagFieldColor}`
    } else {
      return `color: ${tagFieldColor}; border: solid`
    }
  }

  const filterTags = (keywords) => {
    const keywordsRegex = new RegExp(keywords);
    const newTags = JSON.parse(props.taskTags)
    const result = removeNotMatchedTags(newTags, keywordsRegex)
    theTaskTags.value = result
  }

  const removeNotMatchedTags = (json, regex) => {
    let newJson = {}
    const fields = Object.keys(json)
    for (let field of fields) {
      newJson[field] = {color: json[field].color, zh_name: json[field].zh_name}
      newJson[field].tags = []
      for (let tag of json[field].tags) {
        const matchResult = regex.test(tag.zh_name)
        if (matchResult) {
          newJson[field].tags.push(tag)
        }
      }
    }
    return newJson
  }
</script>