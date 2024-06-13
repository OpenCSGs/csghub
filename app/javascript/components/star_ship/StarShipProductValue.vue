<template>
  <div class="bg-[#F9FAFB]">
    <div class="max-w-[1280px] m-auto py-24 px-8">
      <div class="text-[36px] leading-[44px] mb-5">StarShip 产品产品价值</div>
      <div class="text-[20px] text-[#475467] leading-[30px] font-light mb-16">
        StarShip通过替代初级工程师、支持复杂项目和存量系统协作，贯穿完整的DevOps流程，实现任务驱动的研发需求解决方案，全面提升软件开发效率并节省成本。
      </div>
      <div class="grid grid-cols-3 gap-[32px] md:grid-cols-1">
        <div
          class="flex flex-col items-start gap-[20px] md:mb-[0px] mb-16"
          v-for="item in data"
          :key="item.id"
        >
          <div
            class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] border-[8px] border-[#CED8FF]"
          >
            <SvgIcon :name="item.icon" />
          </div>
          <div class="flex flex-col gap-[8px]">
            <div class="text-[20px] text-[#101828] leading-[30px]">
              {{ item.title }}
            </div>
            <div class="text-[16px] text-[##75467] leading-[24px] font-light">
              {{ item.desc }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const data = ref([
    {
      id: 1,
      icon: 'star_ship_users',
      title: '企业数字员工平台',
      desc: '不同于LLM+IDE Plugin的方案，StarShip的目标不仅是提高编码阶段的效率, 而是替代各类初级工程师的人力。'
    },
    {
      id: 2,
      icon: 'star_ship_tool',
      title: '支持复杂项目',
      desc: 'StarShip可以支持大型的复杂软件项目，而且可以在无人工干预的情况下独立完成指定的研发需求任务。'
    },
    {
      id: 3,
      icon: 'star_ship_code_square',
      title: '参与存量系统工作',
      desc: 'StarShip支持与存量系统协作，能够很好的分析和理解已有代码仓库'
    },
    {
      id: 4,
      icon: 'star_ship_infinity',
      title: '支持DevOps完整流程',
      desc: 'StarShip支持Dev，QA、Deploy等DevOps完整流程的角色定义，实现整个研发流程的降本增效。'
    },
    {
      id: 5,
      icon: 'star_ship_target',
      title: '任务驱动的工作过程',
      desc: 'StarShip通过“需求整理”、“代码搜索”和“编码计划”三个核心阶段实现解决研发需求的完整代码方案'
    }
  ])
</script>
