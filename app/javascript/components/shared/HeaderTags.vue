<template>
  <div class="flex items-center flex-wrap gap-4 md:px-5 md:mb-[30px] md:flex-col md:items-start">
    <!-- Task -->
    <div
      v-if="taskTags.length"
      class="text-sm text-[#909399]"
    >
      {{ $t('all.tasks') }}:
    </div>
    <tag-item
      v-for="tag in theTaskTags"
      :tag="tag"
      @handleTagClick="searchByTag"
    />
    <MoreTags
      v-if="moreTaskTags"
      :num="taskTags.length - 3"
      target="task"
      @view-more-targets="viewMoreTargets"
    />
    <!-- Framework -->
    <div
      v-if="frameworkTags.length"
      class="text-sm text-[#909399]"
    >
      {{ $t('all.framework') }}:
    </div>
    <a
      v-for="tag in theFrameworkTags"
      :href="`/${prefix}?tag=${tag.name}&tag_type=Framework`"
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
      v-if="moreFrameworkTags"
      :num="frameworkTags.length - 3"
      target="framework"
      @view-more-targets="viewMoreTargets"
    />
    <!-- Language -->
    <div
      v-if="languageTags.length"
      class="flex items-center text-sm text-[#909399]"
    >
      {{ $t('all.languages') }}:
    </div>
    <a
      v-for="tag in theLanguageTags"
      :href="`/${prefix}?tag=${tag.label}&tag_type=Language`"
      :style="`color: ${tag.color}`"
      class="text-sm text-[#087443] px-[8px] py-[4px] rounded cursor-pointer flex items-center gap-1 bg-[#F6FEF9]"
    >
      <SvgIcon name="language_tag" />
      {{ this.$i18n.locale === 'zh' ? tag.zh_name || tag.name : tag.name }}
    </a>
    <MoreTags
      v-if="moreLanguageTags"
      :num="languageTags.length - 3"
      target="language"
      @view-more-targets="viewMoreTargets"
    />
    <!-- industryTags -->
    <div
      v-if="industryTags.length"
      class="text-sm text-[#909399]"
    >
      {{ $t('all.industry') }}:
    </div>
    <div
      v-for="tag in theIndustryTags"
      class="text-sm text-[#303133] px-[8px] py-[4px] rounded flex items-center border gap-1"
    >
      {{ this.$i18n.locale === 'zh' ? tag.zh_name || tag.name : tag.name }}
    </div>
    <MoreTags
      v-if="moreIndustryTags"
      :num="industryTags.length - 3"
      target="industry"
      @view-more-targets="viewMoreTargets"
    />
    <!-- Other -->
    <div
      v-if="otherTags.length"
      class="text-sm text-[#909399]"
    >
      {{ $t('all.others') }}:
    </div>
    <div
      v-for="tag in theOtherTags"
      class="text-sm text-[#303133] px-[8px] py-[4px] rounded flex items-center border gap-1"
    >
      {{ tag.name }}
    </div>
    <MoreTags
      v-if="moreOtherTags"
      :num="otherTags.length - 3"
      target="other"
      @view-more-targets="viewMoreTargets"
    />
    <!-- License -->
    <div
      v-if="licenseTags.length"
      class="text-sm text-[#909399]"
    >
      License:
    </div>
    <a
      v-for="tag in theLicenseTags"
      :href="`/${prefix}?tag=${tag.name}&tag_type=License`"
      class="text-sm text-[#303133] px-[8px] py-[3px] rounded cursor-pointer flex items-center border gap-1"
    >
      <SvgIcon name="repo_header_license_icon" />
      {{ tag.zh_name }}
    </a>
    <MoreTags
      v-if="moreLicenseTags"
      :num="licenseTags.length - 3"
      target="license"
      @view-more-targets="viewMoreTargets"
    />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import PyTorch from '../../components/tags/frameworks/PyTorch.vue'
  import TensorFlow from '../../components/tags/frameworks/TensorFlow.vue'
  import Safetensors from '../../components/tags/frameworks/Safetensors.vue'
  import JAX from '../../components/tags/frameworks/JAX.vue'
  import ONNX from '../../components/tags/frameworks/ONNX.vue'
  import PaddlePaddle from '../../components/tags/frameworks/PaddlePaddle.vue'
  import GGUF from '../../components/tags/frameworks/GGUF.vue'
  import Joblib from '../../components/tags/frameworks/Joblib.vue'
  import { useI18n } from 'vue-i18n'
  import TagItem from '../tags/TagItem.vue'
  import MoreTags from './MoreTags.vue'

  const props = defineProps({
    taskTags: Array,
    frameworkTags: Array,
    languageTags: Array,
    licenseTags: Array,
    industryTags: Array,
    otherTags: Array,
    prefix: {
      type: String,
      default: ''
    }
  })

  const { t, locale } = useI18n()

  const moreTaskTags = ref(props.taskTags?.length > 3)
  const moreFrameworkTags = ref(props.frameworkTags?.length > 3)
  const moreLanguageTags = ref(props.languageTags?.length > 3)
  const moreLicenseTags = ref(props.licenseTags?.length > 3)
  const moreIndustryTags = ref(props.industryTags?.length > 3)
  const moreOtherTags = ref(props.otherTags?.length > 3)

  const theTaskTags = ref(props.taskTags.slice(0, 3))
  const theFrameworkTags = ref(props.frameworkTags.slice(0, 3))
  const theLanguageTags = ref(props.languageTags.slice(0, 3))
  const theLicenseTags = ref(props.licenseTags.slice(0, 3))
  const theIndustryTags = ref(props.industryTags.slice(0, 3))
  const theOtherTags = ref(props.otherTags.slice(0, 3))

  const viewMoreTargets = (target) => {
    if (target === 'task') {
      theTaskTags.value = props.taskTags
      moreTaskTags.value = false
    } else if (target === 'framework') {
      theFrameworkTags.value = props.frameworkTags
      moreFrameworkTags.value = false
    } else if (target === 'language') {
      theLanguageTags.value = props.languageTags
      moreLanguageTags.value = false
    } else if (target === 'license') {
      theLicenseTags.value = props.licenseTags
      moreLicenseTags.value = false
    } else if (target === 'industry') {
      theIndustryTags.value = props.industryTags
      moreIndustryTags.value = false
    } else if (target === 'other') {
      theOtherTags.value = props.otherTags
      moreOtherTags.value = false
    }
  }

  const searchByTag = (tag) => {
    window.location.href = `/${props.prefix}?tag=${tag.name}&tag_type=Task`
  }
</script>
