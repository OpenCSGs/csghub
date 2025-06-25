<template>
  <el-input
    v-model="taskTagFilterInput"
    class="mt-7 mb-4"
    size="large"
    :placeholder="$t('all.filterTags')"
    :prefix-icon="Search" />

  <div v-show="activeCategory === 'task' && repoType !== 'mcp' && (taskTagFilterInput === '' || hasMatchingTaskTags)">
    <div class="">
      <div v-for="(value, key) in filteredTaskTags">
        <template v-if="taskTagFilterInput === '' || value.length > 0">
          <h3 v-if="getTranslatedTag(key)" class="text-gray-500 text-xs my-4">
            {{ $t(`tags.${key}`) }}
          </h3>
          <div v-if="getTranslatedTag(key)" class="flex gap-2 flex-wrap">
            <TaskTagItem
              v-for="tag in value"
              :tag="tag"
              :active="activeTags['task']?.includes(tag.name)"
              @handleTagClick="handleTagClick" />
          </div>
        </template>
      </div>
    </div>
  </div>

  <div v-show="activeCategory === 'task' && repoType === 'mcp' && (taskTagFilterInput === '' || filteredTags.length > 0)">
    <div class="flex gap-1 flex-wrap">
      <TaskTagItem
        v-for="tag in filteredTags"
        :noIcon="true"
        :tag="tag"
        :active="activeTags['task']?.includes(tag.name)"
        @handleTagClick="handleTagClick" />
    </div>
  </div>

  <div v-show="activeCategory === 'framework' && (taskTagFilterInput === '' || filteredTags.length > 0)">
    <div class="flex gap-2 flex-wrap">
      <PyTorch
        @setActiveFrameworkTag="handleTagClick"
        :active="activeTags['framework']?.includes('pytorch')" />
      <TensorFlow
        @setActiveFrameworkTag="handleTagClick"
        :active="activeTags['framework']?.includes('tensorflow')" />
      <Safetensors
        @setActiveFrameworkTag="handleTagClick"
        :active="activeTags['framework']?.includes('safetensors')" />
      <ONNX
        @setActiveFrameworkTag="handleTagClick"
        :active="activeTags['framework']?.includes('onnx')" />
      <JAX
        @setActiveFrameworkTag="handleTagClick"
        :active="activeTags['framework']?.includes('jax')" />
      <PaddlePaddle
        @setActiveFrameworkTag="handleTagClick"
        :active="activeTags['framework']?.includes('paddlepaddle')" />
      <Joblib
        @setActiveFrameworkTag="handleTagClick"
        :active="activeTags['framework']?.includes('joblib')" />
      <GGUF
        @setActiveFrameworkTag="handleTagClick"
        :active="activeTags['framework']?.includes('gguf')" />
    </div>
  </div>

  <div v-show="activeCategory === 'language' && (taskTagFilterInput === '' || filteredTags.length > 0)">
    <div class="flex gap-2 flex-wrap">
      <LanguageTagItem
        v-for="languageTag in filteredTags"
        :tag="languageTag"
        :active="activeTags['language']?.includes(languageTag.name)"
        @handleTagClick="handleTagClick" />
    </div>
  </div>

  <div v-show="activeCategory === 'license' && (taskTagFilterInput === '' || filteredTags.length > 0)">
    <div class="flex gap-1 flex-wrap">
      <LicenseTagItem
        v-for="licenseTag in filteredTags"
        :tag="licenseTag"
        :active="activeTags['license']?.includes(licenseTag.name)"
        @handleTagClick="handleTagClick" />
    </div>
  </div>

  <div v-show="isGeneralCategory && (taskTagFilterInput === '' || filteredTags.length > 0)">
    <div class="flex gap-1 flex-wrap">
      <TagItem
        v-for="tag in filteredTags"
        :tag="tag"
        :activeCategory="activeCategory"
        :active="activeTags[activeCategory]?.includes(tag.name)"
        @handleTagClick="handleTagClick" />
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
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
  import TagItem from './TagItem.vue'

  const props = defineProps({
    activeCategory: String,
    activeTags: Object,
    taskTags: Object,
    tags: Array,
    repoType: String,
  })

  const { t } = useI18n()

  const emit = defineEmits(['setActiveTag'])

  const taskTagFilterInput = ref('')

  const specificCategories = ['task', 'framework', 'language', 'license']

  const handleTagClick = (category, tagName) => {
    emit('setActiveTag', category, tagName)
  }

  const isGeneralCategory = computed(() => {
    return !specificCategories.includes(props.activeCategory)
  })

  const filteredTaskTags = computed(() => {
    if (props.repoType === 'mcp') {
      return []
    }
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
    if (tags === undefined || (props.activeCategory === 'task' && props.repoType !== 'mcp')) {
      return []
    }
    const matchedTags = tags.filter(
      (tag) => regex.test(tag.show_name) || regex.test(tag.name)
    )
    return matchedTags
  }

  const getTranslatedTag = (key) => {
      const translation = t(`tags.${key}`);
      let ret = translation !== 'tags.' + key && translation !== '';
      return ret;
  }

  const hasMatchingTaskTags = computed(() => {
    if (props.repoType === 'mcp') {
      return false;
    }
    return Object.values(props.taskTags).some(tags => tags.length > 0);
  });
</script>