<template>
  <div class="flex items-center flex-wrap gap-3 mb-4 md:mb-8 md:px-5">
    <!-- Task -->
    <div
      v-if="taskTags.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.tasks') }}:
    </div>
    <tag-item
      v-for="tag in theTaskTags.theTags"
      :tag="tag"
      @handleTagClick="searchByTag"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-sm cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    />
    <MoreTags
      v-if="theTaskTags.moreTags"
      :num="taskTags.length - 3"
      target="task"
      @view-more-targets="viewMoreTargets"
    />
    <!-- Framework -->
    <div
      v-if="frameworkTags.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.framework') }}:
    </div>
    <a
      v-for="tag in theFrameworkTags.theTags"
      :href="`/${prefix}?tag=${tag.name}&tag_type=Framework`"
      class="text-sm font-normal text-gray-700 rounded-sm cursor-pointer flex items-center gap-1"
    >
      <PyTorch v-if="tag.name.toLowerCase() === 'pytorch'" />
      <TensorFlow v-if="tag.name.toLowerCase() === 'tensorflow'" />
      <Safetensors v-if="tag.name.toLowerCase() === 'safetensors'" />
      <ONNX v-if="tag.name.toLowerCase() === 'onnx'" />
      <JAX v-if="tag.name.toLowerCase() === 'jax'" />
      <PaddlePaddle v-if="tag.name.toLowerCase() === 'paddlepaddle'" />
      <GGUF v-if="tag.name.toLowerCase() === 'gguf'" />
      <Joblib v-if="tag.name.toLowerCase() === 'joblib'" />
    </a>
    <MoreTags
      v-if="theFrameworkTags.moreTags"
      :num="frameworkTags.length - 3"
      target="framework"
      @view-more-targets="viewMoreTargets"
    />
    <!-- Language -->
    <div
      v-if="languageTags.length"
      class="flex items-center text-sm font-normal text-gray-700"
    >
      {{ $t('all.languages') }}:
    </div>
    <a
      v-for="tag in theLanguageTags.theTags"
      :href="`/${prefix}?tag=${tag.label}&tag_type=Language`"
      :style="`color: ${tag.color}`"
      class="text-sm text-success-700 px-2 py-1 rounded-sm cursor-pointer flex items-center gap-1 bg-success-50"
    >
      <SvgIcon name="language_tag" />
      {{ locale === 'zh' ? tag.show_name || tag.name : tag.name }}
    </a>
    <MoreTags
      v-if="theLanguageTags.moreTags"
      :num="languageTags.length - 3"
      target="language"
      @view-more-targets="viewMoreTargets"
    />
    <!-- industryTags -->
    <div
      v-if="industryTags.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.industry') }}:
    </div>
    <div
      v-for="tag in theIndustryTags.theTags"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-sm cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    >
      {{ locale === 'zh' ? tag.show_name || tag.name : tag.name }}
    </div>
    <MoreTags
      v-if="theIndustryTags.moreTags"
      :num="industryTags.length - 3"
      target="industry"
      @view-more-targets="viewMoreTargets"
    />
    <!-- Other -->
    <div
      v-if="otherTags.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.others') }}:
    </div>
    <div
      v-for="tag in theOtherTags.theTags"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-sm cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    >
      {{ tag.name }}
    </div>
    <MoreTags
      v-if="theOtherTags.moreTags"
      :num="otherTags.length - 3"
      target="other"
      @view-more-targets="viewMoreTargets"
    />
    <!-- License -->
    <div
      v-if="licenseTags.length"
      class="text-sm font-normal text-gray-700"
    >
      License:
    </div>
    <a
      v-for="tag in theLicenseTags.theTags"
      :href="`/${prefix}?tag=${tag.name}&tag_type=License`"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-2xl cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    >
      <SvgIcon name="repo_header_license_icon" />
      License: 
      <p class="text-gray-700">{{ tag.name }}</p>
    </a>
    <MoreTags
      v-if="theLicenseTags.moreTags"
      :num="licenseTags.length - 3"
      target="license"
      @view-more-targets="viewMoreTargets"
    />
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import PyTorch from '../../components/tags/frameworks/PyTorch.vue'
  import TensorFlow from '../../components/tags/frameworks/TensorFlow.vue'
  import Safetensors from '../../components/tags/frameworks/Safetensors.vue'
  import JAX from '../../components/tags/frameworks/JAX.vue'
  import ONNX from '../../components/tags/frameworks/ONNX.vue'
  import PaddlePaddle from '../../components/tags/frameworks/PaddlePaddle.vue'
  import GGUF from '../../components/tags/frameworks/GGUF.vue'
  import Joblib from '../../components/tags/frameworks/Joblib.vue'
  import TagItem from '../tags/TagItem.vue'
  import MoreTags from './MoreTags.vue'
  import { useI18n } from 'vue-i18n'

  const { locale } = useI18n()

  const props = defineProps({
    tags: Object,
    prefix: {
      type: String,
      default: ''
    }
  })

  const taskTags = ref([])
  const frameworkTags = ref([])
  const languageTags = ref([])
  const licenseTags = ref([])
  const industryTags = ref([])
  const otherTags = ref([])

  const theTaskTags = ref({})
  const theFrameworkTags = ref({})
  const theLanguageTags = ref({})
  const theLicenseTags = ref({})
  const theIndustryTags = ref({})
  const theOtherTags = ref({})

  watch(() => props.tags, () => {
    taskTags.value = props.tags.task_tags
    frameworkTags.value = props.tags.framework_tags
    languageTags.value = props.tags.language_tags
    licenseTags.value = props.tags.license_tags
    industryTags.value = props.tags.industry_tags
    otherTags.value = props.tags.other_tags

    theTaskTags.value = createTagRefs(taskTags)
    theFrameworkTags.value = createTagRefs(frameworkTags)
    theLanguageTags.value = createTagRefs(languageTags)
    theLicenseTags.value = createTagRefs(licenseTags)
    theIndustryTags.value = createTagRefs(industryTags)
    theOtherTags.value = createTagRefs(otherTags)
  })

  //先定义一个生产参数的方法
  const createTagRefs = (tagType) => {
    const moreTags = ref(tagType.value?.length > 3)
    const theTags = ref(tagType.value?.slice(0, 3))
    return { moreTags, theTags }
  }

  const tagGroups = {
    task: {
      source: taskTags,
      target: theTaskTags
    },
    framework: {
      source: frameworkTags,
      target: theFrameworkTags
    },
    language: {
      source: languageTags,
      target: theLanguageTags
    },
    license: {
      source: licenseTags,
      target: theLicenseTags
    },
    industry: {
      source: industryTags,
      target: theIndustryTags
    },
    other: {
      source: otherTags,
      target: theOtherTags
    }
  }

  const viewMoreTargets = (target) => {
    const tagRef = tagGroups[target].target
    if (tagRef) {
      tagRef.value.theTags = tagGroups[target].source.value
      tagRef.value.moreTags = false
    }
  }

  const searchByTag = (tag) => {
    window.location.href = `/${props.prefix}?tag=${tag.name}&tag_type=Task`
  }
</script>
