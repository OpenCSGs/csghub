<template>
  <div class="flex w-[421px] p-[16px] bg-[#fff] flex-col">
    <div>
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
      <el-input
        v-model="tagFilterInput"
        class="w-50 my-[16px]"
        size="large"
        placeholder="筛选标签"
        :prefix-icon="Search"
        @change = "filterTags"
      />
    </div>
    <div>
      <div>
        <div v-for="tagField in theTaskTags">
          <h3 class="text-[#909399] text-[12px] mb-[11px] mt-[16px]">{{ tagField.zh_name }}</h3>
          <div class="flex gap-[8px]">
            <span v-for="tag in tagField.tags" class="text-[14px] text-[#303133] px-[8px] py-[4px] rounded-[4px] cursor-pointer"
                  :data-tag_name="tag.name"
                  :style="setTagColor(tag.name, tagField.color)"
                  @click="setActiveTags"
            >
              {{ tag.zh_name }}
            </span>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Search } from '@element-plus/icons-vue'

  const props = defineProps({
    taskTags: String,
    frameworkTags: String
  })

  const activeNavItem = ref('Task')
  const theTaskTags = ref(JSON.parse(props.taskTags))
  const theFrameworkTags = ref(JSON.parse(props.frameworkTags))
  const activeTag = ref('')
  const tagFilterInput = ref('')

  const changeActiveItem = (e) => {
    activeNavItem.value = e.target.dataset.type
  }

  const setActiveTags = (e) => {
    if (activeTag.value === e.target.dataset.tag_name) {
      activeTag.value = ''
    } else {
      activeTag.value = e.target.dataset.tag_name
    }
  }

  const setTagColor = (tagName, tagFieldColor) => {
    if(activeTag.value === tagName) {
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