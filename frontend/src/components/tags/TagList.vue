<template>
  <el-input
    v-model="taskTagFilterInput"
    class="mt-[28px]"
    size="large"
    :placeholder="$t('all.filterTags')"
    :prefix-icon="Search" />

  <div v-show="activeCategory === 'task'">
    <div class="">
      <div v-for="(value, key) in filteredTaskTags">
        <h3 class="text-gray-500 text-xs my-[16px]">
          {{ $t(`tags.${key}`) }}
        </h3>
        <div class="flex gap-[8px] flex-wrap">
          <TaskTagItem
            v-for="tag in value"
            :tag="tag"
            :active="activeTags['task']?.includes(tag.name)"
            @handleTagClick="setActiveTag" />
        </div>
      </div>
    </div>
  </div>

  <div v-show="activeCategory === 'framework'">
    <div class="flex gap-[8px] flex-wrap">
      <PyTorch
        @setActiveFrameworkTag="setActiveTag"
        :active="activeTags['framework']?.includes('PyTorch')" />
      <TensorFlow
        @setActiveFrameworkTag="setActiveTag"
        :active="activeTags['framework']?.includes('TensorFlow')" />
      <Safetensors
        @setActiveFrameworkTag="setActiveTag"
        :active="activeTags['framework']?.includes('Safetensors')" />
      <ONNX
        @setActiveFrameworkTag="setActiveTag"
        :active="activeTags['framework']?.includes('ONNX')" />
      <JAX
        @setActiveFrameworkTag="setActiveTag"
        :active="activeTags['framework']?.includes('JAX')" />
      <PaddlePaddle
        @setActiveFrameworkTag="setActiveTag"
        :active="activeTags['framework']?.includes('PaddlePaddle')" />
      <Joblib
        @setActiveFrameworkTag="setActiveTag"
        :active="activeTags['framework']?.includes('Joblib')" />
      <GGUF
        @setActiveFrameworkTag="setActiveTag"
        :active="activeTags['framework']?.includes('GGUF')" />
    </div>
  </div>

  <div v-show="activeCategory === 'language'">
    <div class="flex gap-[8px] flex-wrap">
      <LanguageTagItem
        v-for="languageTag in filteredTags"
        :tag="languageTag"
        :active="activeTags['language']?.includes(languageTag.name)"
        @handleTagClick="setActiveTag" />
    </div>
  </div>

  <div v-show="activeCategory === 'license'">
    <div class="flex gap-1 flex-wrap">
      <LicenseTagItem
        v-for="licenseTag in filteredTags"
        :tag="licenseTag"
        :active="activeTags['license']?.includes(licenseTag.name)"
        @handleTagClick="setActiveTag" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
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

  const props = defineProps({
    activeCategory: String,
    activeTags: Object,
    taskTags: Object,
    tags: Array
  })

  const emit = defineEmits(['setActiveTag'])

  const taskTagFilterInput = ref('')

  const specificCategories = ['task', 'framework', 'language', 'license']

  const filteredTaskTags = computed(() => {
    const keywordsRegex = new RegExp(taskTagFilterInput.value, 'i')
    return removeNotMatchedTaskTags(props.taskTags, keywordsRegex)
  })

  const filteredTags = computed(() => {
    const keywordsRegex = new RegExp(taskTagFilterInput.value, 'i')
    return removeNotMatchedTags(props.tags, keywordsRegex)
  })

  const removeNotMatchedTaskTags = (json, regex) => {
    const newJson = {}
    if (json === undefined) {
      return newJson
    }
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

  const removeNotMatchedTags = (tags, regex) => {
    if (tags === undefined || props.activeCategory === 'task') {
      return []
    }
    const matchedTags = tags.filter(
      (tag) => regex.test(tag.show_name) || regex.test(tag.name)
    )
    return matchedTags
  }
</script>