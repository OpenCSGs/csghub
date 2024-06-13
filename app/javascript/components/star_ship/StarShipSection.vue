<template>
  <div class="max-w-[1280px] m-auto pt-24 md:pt-16 text-center">
    <div class="px-8">
      <div class="text-[16px] leading-[24px] text-[#223B99] mb-3">使用场景</div>
      <div class="text-[36px] leading-[44px] mb-6">基于软件研发流程的Copilot</div>
      <div class="text-[20px] text-[#475467] max-w-[768px] m-auto leading-[30px] font-light mb-24">
        涵盖代码生成、代码审查、代码问答、GitLab助手和数字员工管理驾驶舱全面提升开发效率、代码质量、问题解决能力和管理透明度，实现降本增效。
      </div>
    </div>
    <div
      class="flex flex-warp mb-[100px] items-center relative lg:flex-col gap-2 px-8 md:px-0 lg:gap-1"
      v-for="(item, index) in data"
      :key="item.id"
      :class="index % 2 == '1' ? 'flex-row-reverse' : ''"
    >
      <div class="flex flex-col w-1/2 lg:w-full items-start text-left md:mb-[0px] mb-16 md:px-8">
        <div
          class="px-[12px] py-[12px] rounded-[40px] bg-[#ACBDFF] mb-6 border-[8px] border-[#CED8FF]"
        >
          <SvgIcon :name="item.icon" />
        </div>
        <div class="flex flex-col gap-[8px]">
          <div class="text-[30px] text-[#101828] leading-[38px] mb-4">
            {{ item.title }}
          </div>
          <div class="text-[18px] text-[##75467] leading-[28px] font-light mb-8">
            {{ item.desc }}
          </div>
        </div>
        <div class="flex flex-col gap-5 text-[#475467] text-[18px] leading-[28px] font-light">
          <div
            class="flex gap-3 items-start"
            v-for="(detail, index) in item.details"
            :key="index"
          >
            <SvgIcon name="check_circle" />{{ detail }}
          </div>
        </div>
      </div>
      <div class="m-auto w-1/2 lg:w-full bg-[#F2F4F7] p-10 md:px-4 md:py-6 md:mx-2">
        <img
          class="w-full relative z-10"
          :src="item.img"
        />
        <img
        src="images/star_ship/line_pattern.png"
        class="lg:hidden w-[300px] absolute"
        :class="
          index == 0
            ? '-right-[96px] -bottom-[96px]'
            : index % 2 == '1'
            ? '-left-[96px] -bottom-[96px]'
            : '-right-[96px] -top-[96px]'
        "
      />
      </div>
  
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const data = ref([
    {
      id: 1,
      icon: 'star_ship_code_snippet',
      img: 'images/star_ship/start_ship_section1.png',
      title: '代码生成',
      desc: '代码生成功能通过需求理解、代码检索、编程计划和编写代码四个步骤完成实现，与主流 DevOps 流程完美融合，实现大模型与人类工程师的协同作业',
      details: [
        '四大步骤完成从需求到代码的实现：需求理解、代码检索、编程计划、编写代码',
        'SWEBench Resolved 23.67%（🔗 swebench.com）',
        '与主流 DevOps 流程完美融合，实现大模型与人类工程师的协作'
      ]
    },
    {
      id: 2,
      icon: 'check',
      img: 'images/star_ship/start_ship_section2.png',
      title: '代码审查',
      desc: '代码审查功能自动审阅代码变更、总结内容并提供修改建议，通过动态可配置的审查项进行全面评估，辅助审核者快速理解并给出评估分值和意见。',
      details: [
        '自动审阅代码变更并给出修改建议',
        '自动审阅代码变更内容，辅助审核者快速理解',
        '全面评估，给出评估分和评估意见',
        '动态可配置的代码审查项：语法错误、代码规范、接口问题等'
      ]
    },
    {
      id: 3,
      icon: 'message_chat_circle',
      img: 'images/star_ship/start_ship_section3.png',
      title: '代码回答',
      desc: '代码问答功能提供基于代码仓库的多轮对话智能问答，帮助用户快速深入了解代码并提高编码效率。',
      details: ['提供基于代码仓库的多轮对话智能问答功能', '帮助用户快速深入了解代码，提高编码效率']
    },
    {
      id: 4,
      icon: 'star_ship_users',
      img: 'images/star_ship/start_ship_section4.png',
      title: 'GitLab助手',
      desc: '针对用户在使用GitLab过程中遇到的问题，提供专业的服务助手功能，给出针对性解决方案，帮助用户高效解决问题，提升使用体验。',
      details: []
    },
    {
      id: 5,
      icon: 'start_ship_line_chart_up',
      img: 'images/star_ship/start_ship_banner.png',
      title: '数字员工管理驾驶舱',
      desc: '数字员工管理驾驶舱通过可视化管理实现降本增效、掌控运行成本、确保工作质量和反馈一目了然。',
      details: [
        '成效：降本增效，成效一目了然',
        '省钱：运行成本了如指掌',
        '放心：数字员工工作质量和评价反馈',
        '可观测：运行过程可视化，工作成果可观测'
      ]
    }
  ])
</script>
