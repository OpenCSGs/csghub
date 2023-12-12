<template>
  <div class="flex w-[421px] p-[16px] bg-[#fff] flex-col">
    <div>
      <span class="mr-[16px] py-[4px] text-[12px] text-[#667085]"
            data-type="Task"
            :class="this.activeNavItem === 'Task' ? 'text-[#344054] font-[600]' : ''"
            @click="changeActiveItem"
      >
        Task
      </span>
      <span class="mr-[16px] py-[4px] text-[12px] text-[#667085]"
            data-type="Framework"
            :class="this.activeNavItem === 'Framework' ? 'text-[#344054] font-[600]' : ''"
            @click="changeActiveItem"
      >
        Framework
      </span>
    </div>
    <div>
      <div>
        <div v-for="tagField in this.theTaskTags">
          <h3 class="text-[#909399] text-[12px] mb-[11px] mt-[16px]">{{ tagField.zh_name }}</h3>
          <div class="flex gap-[8px]">
            <span v-for="tag in tagField.tags" class="text-[14px] text-[#303133] px-[8px] py-[4px] bg-[#F2F3F5] rounded-[4px] cursor-pointer"
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
<script>
export default {
  props: {
    taskTags: String,
    frameworkTags: String
  },

  data() {
    return {
      activeNavItem: 'Task',
      theTaskTags: JSON.parse(this.taskTags),
      theFrameworkTags: JSON.parse(this.frameworkTags),
      activeTag: ''
    }
  },

  methods: {
    changeActiveItem(e) {
      this.activeNavItem = e.target.dataset.type
    },
    setActiveTags(e) {
      if (this.activeTag === e.target.dataset.tag_name) {
        this.activeTag = ''
      } else {
        this.activeTag = e.target.dataset.tag_name
      }
    },
    setTagColor(tagName, tagFieldColor) {
      if(this.activeTag === tagName) {
        return `color: white; background-color: ${tagFieldColor}`
      } else {
        return `color: ${tagFieldColor}; background-color: #F2F3F5`
      }
    }
  }
}
</script>