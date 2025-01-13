<template>
  <div class="flex bg-white flex-col pt-[32px] pb-[60px]">
    <div class="flex flex-wrap gap-1">
      <TagCategory
        v-for="category in avaliableCategories"
        :name="category.name"
        :zhName="category.show_name"
        :activeCategory="activeNavItem"
        @changeActiveItem="changeActiveItem" />
    </div>
    <div>
      <TagList
        :activeCategory="activeNavItem"
        :taskTags="tagsForCategory['task']"
        :tags="tagsForCategory[activeNavItem]"
        :activeTags="activeTags"
        @setActiveTag="setActiveTag"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue'
  import TagList from './TagList.vue'
  import useFetchApi from '../../packs/useFetchApi'
  import { ElMessage } from 'element-plus'
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
  const tagsForCategory = ref({})

  const activeNavItem = ref('task')

  const activeTags = ref({})

  const avaliableCategories = computed(() => {
    return tagCategories.value.filter((c) => c.scope === props.repoType)
  })

  watch(avaliableCategories,
    (newValue, _) => {
      if (newValue.length > 0 && newValue[0]?.name) {
        activeNavItem.value = newValue[0].name
      }
    }
  )

  const changeActiveItem = (currentCategory) => {
    activeNavItem.value = currentCategory
  }

  const emitTag = () => {
    emit('resetTags', activeTags.value)
  }

  const setActiveTag = (category, tagName) => {
    if (activeTags.value[category] === undefined) {
      activeTags.value[category] = []
      activeTags.value[category].push(tagName)
    } else if (Array.isArray(activeTags.value[category])) {
      if (activeTags.value[category].includes(tagName)) {
        const filteredTags = activeTags.value[category].filter((tag) => tag !== tagName)
        activeTags.value[category] = filteredTags
      } else {
        activeTags.value[category].push(tagName)
      }
    }
    emitTag()
  }

  const setTagNameFromParams = () => {
    if (activeTags.value[props.selectedTagType] === undefined) {
      activeTags.value[props.selectedTagType] = []
    } else if (Array.isArray(activeTags.value[props.selectedTagType])) {
      activeTags.value[props.selectedTagType].push(props.selectedTag)
    }
  }

  const setTagTypeFromParams = () => {
    if (props.selectedTagType) {
      activeNavItem.value = props.selectedTagType
    }
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

      avaliableCategories.value.forEach((category) => {
        if (category.name === 'task') {
          tagsForCategory.value['task'] = tempTaskTags
        } else {
          tagsForCategory.value[category.name] = data.value.data.filter(
            (tag) =>
              tag.category === category.name &&
              tag.scope === props.repoType &&
              tag.built_in === true
          )
        }
      })
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

  onMounted(async () => {
    await fetchTagCategories()
    await fetchTags()

    // init selected tag from params
    emitTagFromParams()

    // activeNavItem.value = avaliableCategories[0]?.name

    // init initial tag category

    // if (props.repoType === 'code' || props.repoType === 'space') {
    //   activeNavItem.value = 'license'
    //   // toggleTagType()
    // } else {
    //   activeNavItem.value = 'task'
    // }
  })
</script>

<style scoped>
  .active-type {
    box-shadow: 0px 0px 0px 4px rgba(152, 162, 179, 0.14);
    border-radius: var(--border-radius-sm);
  }
</style>
