<template>
  <div class="flex items-center flex-wrap gap-3 my-4 md:mb-8 md:px-5">
    <!-- Task -->
    <div
      v-if="taskTags?.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.task') }}:
    </div>
    <tag-item
      v-for="tag in theTaskTags.theTags"
      :tag="tag"
      @handleTagClick="searchByTag(tag)"
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
      v-if="frameworkTags?.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.framework') }}:
    </div>
    <a
      v-for="tag in theFrameworkTags.theTags"
      :href="getTagUrl('framework', tag.name)"
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
      v-if="languageTags?.length"
      class="flex items-center text-sm font-normal text-gray-700"
    >
      {{ $t('all.language') }}:
    </div>
    <a
      v-for="tag in theLanguageTags.theTags"
      :href="getTagUrl('language', tag.label || tag.name)"
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
    <!-- programLanguageTags -->
    <div
      v-if="programLanguageTags?.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.programLanguage') }}:
    </div>
    <a
      v-for="tag in theProgramLanguageTags.theTags"
      :href="getTagUrl('program_language', tag.name)"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-sm cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    >
      {{ locale === 'zh' ? tag.show_name || tag.name : tag.name }}
    </a>
    <MoreTags
      v-if="theProgramLanguageTags.moreTags"
      :num="programLanguageTags.length - 3"
      target="program_language"
      @view-more-targets="viewMoreTargets"
    />
    <!-- Runmode Tags -->
    <div
      v-if="runmodeTags?.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.runmode') }}:
    </div>
    <a
      v-for="tag in theRunmodeTags.theTags"
      :href="getTagUrl('runmode', tag.name)"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-sm cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    >
      {{ locale === 'zh' ? tag.show_name || tag.name : tag.name }}
    </a>
    <MoreTags
      v-if="theRunmodeTags.moreTags"
      :num="runmodeTags.length - 3"
      target="runmode"
      @view-more-targets="viewMoreTargets"
    />
    <!-- Scene Tags -->
    <div
      v-if="sceneTags?.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.scene') }}:
    </div>
    <a
      v-for="tag in theSceneTags.theTags"
      :href="getTagUrl('scene', tag.name)"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-sm cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    >
      {{ locale === 'zh' ? tag.show_name || tag.name : tag.name }}
    </a>
    <MoreTags
      v-if="theSceneTags.moreTags"
      :num="sceneTags.length - 3"
      target="scene"
      @view-more-targets="viewMoreTargets"
    />
    <!-- industryTags -->
    <div
      v-if="industryTags?.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.industry') }}:
    </div>
    <a
      v-for="tag in theIndustryTags.theTags"
      :href="getTagUrl('industry', tag.name)"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-sm cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    >
      {{ locale === 'zh' ? tag.show_name || tag.name : tag.name }}
    </a>
    <MoreTags
      v-if="theIndustryTags.moreTags"
      :num="industryTags.length - 3"
      target="industry"
      @view-more-targets="viewMoreTargets"
    />
    <!-- Other -->
    <div
      v-if="otherTags?.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.others') }}:
    </div>
    <div
      v-for="tag in theOtherTags.theTags"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-sm flex items-center border border-gray-300 gap-1"
    >
      {{ tag.name }}
    </div>
    <MoreTags
      v-if="theOtherTags.moreTags"
      :num="otherTags.length - 3"
      target="other"
      @view-more-targets="viewMoreTargets"
    />
    <!-- Hardware -->
    <div
      v-if="hardwareTags?.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.hardware') }}:
    </div>
    <a
      v-for="tag in theHardwareTags.theTags"
      :href="getTagUrl('hardware', tag.name)"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-sm cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    >
      <SvgIcon name="hardware_icon" />
      {{ tag.name }}
    </a>
    <MoreTags
      v-if="theHardwareTags.moreTags"
      :num="hardwareTags.length - 3"
      target="hardware"
      @view-more-targets="viewMoreTargets"
    />
    <!-- SDK -->
    <div
      v-if="sdkTags?.length"
      class="text-sm font-normal text-gray-700"
    >
      {{ $t('all.sdk') }}:
    </div>
    <a
      v-for="tag in theSdkTags.theTags"
      :href="getTagUrl('sdk', tag.name)"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-sm cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    >
      <SvgIcon name="space_mcp" v-if="tag.name === 'mcp_server'" />
      {{ tag.name }}
    </a>
    <MoreTags
      v-if="theSdkTags.moreTags"
      :num="sdkTags.length - 3"
      target="sdk"
      @view-more-targets="viewMoreTargets"
    />
    <!-- Lwftest -->
    <div
      v-if="lwftestTags?.length"
      class="text-sm font-normal text-gray-700"
    >
      lwftest:
    </div>
    <a
      v-for="tag in theLwftestTags.theTags"
      :href="getTagUrl('lwftest', tag.name)"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-sm cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    >
      {{ locale === 'zh' ? tag.show_name || tag.name : tag.name }}
    </a>
    <MoreTags
      v-if="theLwftestTags.moreTags"
      :num="lwftestTags.length - 3"
      target="lwftest"
      @view-more-targets="viewMoreTargets"
    />
    <!-- Hhcate01 -->
    <div
      v-if="hhcate01Tags?.length"
      class="text-sm font-normal text-gray-700"
    >
      hhcate01:
    </div>
    <a
      v-for="tag in theHhcate01Tags.theTags"
      :href="getTagUrl('hhcate01', tag.name)"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-sm cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    >
      {{ locale === 'zh' ? tag.show_name || tag.name : tag.name }}
    </a>
    <MoreTags
      v-if="theHhcate01Tags.moreTags"
      :num="hhcate01Tags.length - 3"
      target="hhcate01"
      @view-more-targets="viewMoreTargets"
    />
    <!-- License -->
    <div
      v-if="licenseTags?.length"
      class="text-sm font-normal text-gray-700"
    >
      License:
    </div>
    <a
      v-for="tag in theLicenseTags.theTags"
      :href="getTagUrl('license', tag.name)"
      class="bg-white text-sm font-normal text-gray-700 px-2 py-1 rounded-2xl cursor-pointer flex items-center border border-gray-300 gap-1 hover:bg-gray-50"
    >
      <SvgIcon name="repo_header_license_icon" />
      {{ tag.name }}
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
  import { computed, ref, watch } from 'vue'
  import PyTorch from '../../components/tags/frameworks/PyTorch.vue'
  import TensorFlow from '../../components/tags/frameworks/TensorFlow.vue'
  import Safetensors from '../../components/tags/frameworks/Safetensors.vue'
  import JAX from '../../components/tags/frameworks/JAX.vue'
  import ONNX from '../../components/tags/frameworks/ONNX.vue'
  import PaddlePaddle from '../../components/tags/frameworks/PaddlePaddle.vue'
  import GGUF from '../../components/tags/frameworks/GGUF.vue'
  import Joblib from '../../components/tags/frameworks/Joblib.vue'
  import TagItem from '../tags/TaskTagItem.vue'
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

  // const taskTags = ref([])
  const taskTags = computed(() => {
    return props.tags.task_tags
  })
  // const frameworkTags = ref([])
  const frameworkTags = computed(() => {
    return props.tags.framework_tags
  })
  // const languageTags = ref([])
  const languageTags = computed(() => {
    return props.tags.language_tags
  })
  // const licenseTags = ref([])
  const licenseTags = computed(() => {
    return props.tags.license_tags
  })
  // const industryTags = ref([])
  const industryTags = computed(() => {
    return props.tags.industry_tags
  })
  // const otherTags = ref([])
  const otherTags = computed(() => {
    return props.tags.other_tags
  })

  const programLanguageTags = computed(() => {
    return props.tags.program_language
  })

  const runmodeTags = computed(() => {
    return props.tags.runmode_tags
  })

  const sceneTags = computed(() => {
    return props.tags.scene_tags
  })

  const sdkTags = computed(() => {
    return props.tags.sdk_tags
  })

  const hardwareTags = computed(() => {
    return props.tags.hardware_tags
  })

  const lwftestTags = computed(() => {
    return props.tags.lwftest_tags
  })

  const hhcate01Tags = computed(() => {
    return props.tags.hhcate01_tags
  })

    //先定义一个生产参数的方法
  const createTagRefs = (tagType) => {
    const moreTags = ref(tagType.value?.length > 3)
    const theTags = ref(tagType.value?.slice(0, 3))
    return { moreTags, theTags }
  }

  const theTaskTags = ref(createTagRefs(taskTags))
  const theFrameworkTags = ref(createTagRefs(frameworkTags))
  const theLanguageTags = ref(createTagRefs(languageTags))
  const theLicenseTags = ref(createTagRefs(licenseTags))
  const theIndustryTags = ref(createTagRefs(industryTags))
  const theOtherTags = ref(createTagRefs(otherTags))
  const theProgramLanguageTags = ref(createTagRefs(programLanguageTags))
  const theRunmodeTags = ref(createTagRefs(runmodeTags))
  const theSceneTags = ref(createTagRefs(sceneTags))
  const theSdkTags = ref(createTagRefs(sdkTags))
  const theHardwareTags = ref(createTagRefs(hardwareTags))
  const theLwftestTags = ref(createTagRefs(lwftestTags))
  const theHhcate01Tags = ref(createTagRefs(hhcate01Tags))

  watch(() => props.tags, () => {
    theTaskTags.value = createTagRefs(taskTags)
    theFrameworkTags.value = createTagRefs(frameworkTags)
    theLanguageTags.value = createTagRefs(languageTags)
    theLicenseTags.value = createTagRefs(licenseTags)
    theIndustryTags.value = createTagRefs(industryTags)
    theOtherTags.value = createTagRefs(otherTags)
    theProgramLanguageTags.value = createTagRefs(programLanguageTags)
    theRunmodeTags.value = createTagRefs(runmodeTags)
    theSceneTags.value = createTagRefs(sceneTags)
    theSdkTags.value = createTagRefs(sdkTags)
    theHardwareTags.value = createTagRefs(hardwareTags)
    theLwftestTags.value = createTagRefs(lwftestTags)
    theHhcate01Tags.value = createTagRefs(hhcate01Tags)
  })

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
    },
    program_language: {
      source: programLanguageTags,
      target: theProgramLanguageTags
    },
    runmode: {
      source: runmodeTags,
      target: theRunmodeTags
    },
    scene: {
      source: sceneTags,
      target: theSceneTags
    },
    sdk: {
      source: sdkTags,
      target: theSdkTags
    },
    hardware: {
      source: hardwareTags,
      target: theHardwareTags
    },
    lwftest: {
      source: lwftestTags,
      target: theLwftestTags
    },
    hhcate01: {
      source: hhcate01Tags,
      target: theHhcate01Tags
    }
  }

  const viewMoreTargets = (target) => {
    const tagRef = tagGroups[target].target
    if (tagRef) {
      tagRef.value.theTags = tagGroups[target].source.value
      tagRef.value.moreTags = false
    }
  }

  const getTagUrl = (tagCategory, tagName) => {
    if (!tagName || !tagCategory) {
      return '#'
    }
    
    const url = new URL(window.location.origin)
    
    if (props.prefix === 'mcps/') {
      url.pathname = '/mcp/servers'
    } else {
      url.pathname = `/${props.prefix}`
    }
    
    // Use the same parameter structure as RepoCards.vue
    url.searchParams.set(tagCategory, tagName.toLowerCase())
    url.searchParams.set('page', '1')
    
    return url.toString()
  }

  const searchByTag = (tag) => {
    window.location.href = getTagUrl('task', tag.name)
  }
</script>
