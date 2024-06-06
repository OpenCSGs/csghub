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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M6 2.99995V11M6 2.99995H4.28328C4.17763 2.99995 4.12481 2.99995 4.07307 3.00719C4.02712 3.01362 3.98186 3.02431 3.93789 3.0391C3.88837 3.05576 3.84112 3.07939 3.74663 3.12664L3 3.49995M6 2.99995H7.71672C7.82237 2.99995 7.87519 2.99995 7.92693 3.00719C7.97288 3.01362 8.01814 3.02431 8.06211 3.0391C8.11163 3.05576 8.15888 3.07939 8.25337 3.12664L9 3.49995M6 2.99995V1M6 11H8.5M6 11H3.5M1 3.99995H1.71672C1.82237 3.99995 1.87519 3.99995 1.92693 3.9927C1.97288 3.98627 2.01814 3.97559 2.06211 3.96079C2.11163 3.94413 2.15888 3.92051 2.25337 3.87326L3 3.49995M11 3.99995H10.2833C10.1776 3.99995 10.1248 3.99995 10.0731 3.9927C10.0271 3.98627 9.98186 3.97559 9.93789 3.96079C9.88837 3.94413 9.84112 3.92051 9.74663 3.87326L9 3.49995M3 3.49995L1.93102 7.06321C1.80356 7.48809 1.73982 7.70054 1.76796 7.87165C1.80739 8.11139 1.9605 8.31718 2.1788 8.42383C2.33461 8.49995 2.55641 8.49995 3 8.49995V8.49995C3.44359 8.49995 3.66539 8.49995 3.8212 8.42383C4.0395 8.31718 4.19261 8.11139 4.23204 7.87165C4.26018 7.70054 4.19644 7.48809 4.06898 7.06321L3 3.49995ZM9 3.49995L7.93102 7.06321C7.80356 7.48809 7.73982 7.70054 7.76796 7.87165C7.80739 8.11139 7.9605 8.31718 8.1788 8.42383C8.33461 8.49995 8.55641 8.49995 9 8.49995V8.49995V8.49995C9.44359 8.49995 9.66539 8.49995 9.8212 8.42383C10.0395 8.31718 10.1926 8.11139 10.232 7.87165C10.2602 7.70054 10.1964 7.48809 10.069 7.06321L9 3.49995Z"
          stroke="#606266"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
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
