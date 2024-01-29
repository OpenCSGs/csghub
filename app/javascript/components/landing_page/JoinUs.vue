<template>
  <div id="joinUs" class="flex flex-col py-[96px] md:py-[64px] text-left">
    <div class="max-w-[1280px] m-auto md:px-[16px] px-[32px]">
      <div class="text-[16px] leading-[24px] md:text-[14px] md:leading-[20px] text-[#223B99] mb-[8px]">加入我们</div>
      <div class="text-[36px] leading-[44px] md:text-[30px] md:leading-[38px] text-[#101828] mb-[20px]">我们正在寻找优秀的人才</div>
      <div class="text-[20px] leading-[30px] md:text-[18px] md:leading-[28px] text-[#475467] mb-[64px] md:mb-[48px]" >我们是一支分布在全国的分布式远程团队。加入我们吧</div>
      <div class="grid grid-cols-2  gap-x-[64px] gap-y-[48px] mb-[64px] md:grid-cols-1 text-left">
        <a class="w-[578px] md:w-full flex flex-col pt-[24px] border-t border-t-[1px] border-[#EAECF0]"
         v-for="(item,index) in data" :key="index" :href="hrefUrl">
          <div class=" flex gap-[8px] mb-[8px]">
            <div class="text-[#101828] text-[18px] leading-[28px]">{{item.name}}</div>
            <div :style="getTagStyles(item)" class="px-[10px] text-[14px] leading-[20px] border border-[#B2DDFF] bg-[#EFF8FF] rounded-[16px] flex items-center gap-[8px]">
              <div class="rounded-full w-[8px] h-[8px] bg-[#2E90FA]" :style="'background-color:'+item.pointColor"></div>
              {{item.tag}}
            </div>
          </div>
          <div class="text-[16px] text-[#475467] leading-[24px] font-light mb-[24px] md:mb-[16px] overflow-hidden whitespace-nowrap text-ellipsis">
            {{item.desc}}
          </div>
          <div class="text-[16px] text-[#475467] leading-[24px] flex gap-[20px]">
            <div class="flex gap-[8px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9.99992 10.416C11.3806 10.416 12.4999 9.29673 12.4999 7.91602C12.4999 6.5353 11.3806 5.41602 9.99992 5.41602C8.61921 5.41602 7.49992 6.5353 7.49992 7.91602C7.49992 9.29673 8.61921 10.416 9.99992 10.416Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.99992 18.3327C11.6666 14.9993 16.6666 12.8479 16.6666 8.33268C16.6666 4.65078 13.6818 1.66602 9.99992 1.66602C6.31802 1.66602 3.33325 4.65078 3.33325 8.33268C3.33325 12.8479 8.33325 14.9993 9.99992 18.3327Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{item.remote}}
            </div>
            <div class="flex gap-[8px]">
              <svg v-if="item.isInternship" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><g clip-path="url(#clip0_1936_4603)"><path d="M10.0001 4.99935V9.99935L13.3334 11.666M18.3334 9.99935C18.3334 14.6017 14.6025 18.3327 10.0001 18.3327C5.39771 18.3327 1.66675 14.6017 1.66675 9.99935C1.66675 5.39698 5.39771 1.66602 10.0001 1.66602C14.6025 1.66602 18.3334 5.39698 18.3334 9.99935Z" stroke="#98A2B3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1936_4603"><rect width="20" height="20" fill="white"/></clipPath></defs></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13.3334 5.83333C13.3334 5.05836 13.3334 4.67087 13.2482 4.35295C13.0171 3.49022 12.3432 2.81635 11.4805 2.58519C11.1625 2.5 10.7751 2.5 10.0001 2.5C9.22511 2.5 8.83762 2.5 8.5197 2.58519C7.65697 2.81635 6.9831 3.49022 6.75193 4.35295C6.66675 4.67087 6.66675 5.05836 6.66675 5.83333M4.33342 17.5H15.6667C16.6002 17.5 17.0669 17.5 17.4234 17.3183C17.737 17.1586 17.992 16.9036 18.1518 16.59C18.3334 16.2335 18.3334 15.7668 18.3334 14.8333V8.5C18.3334 7.56658 18.3334 7.09987 18.1518 6.74335C17.992 6.42975 17.737 6.17478 17.4234 6.01499C17.0669 5.83333 16.6002 5.83333 15.6667 5.83333H4.33341C3.39999 5.83333 2.93328 5.83333 2.57676 6.01499C2.26316 6.17478 2.00819 6.42975 1.8484 6.74335C1.66675 7.09987 1.66675 7.56658 1.66675 8.5V14.8333C1.66675 15.7668 1.66675 16.2335 1.8484 16.59C2.00819 16.9036 2.26316 17.1586 2.57676 17.3183C2.93328 17.5 3.39999 17.5 4.33342 17.5Z" stroke="#98A2B3" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{item.time}}
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {},
  
    data() {
      return {
        hrefUrl:"https://www.zhipin.com/gongsi/76f4b428e71d5d1d1HR43Nq9FVY~.html?ka=search_rcmd_company_name_76f4b428e71d5d1d1HR43Nq9FVY~_custompage",
        data:[{pointColor:"#2E90FA",color:"#175CD3",bgColor:"#EFF8FF",borderColor:"#B2DDFF",name:'首席科学家',tag:'机器学习',desc:'追踪学术界和工业界的前沿发展，在大模型训练、有监督微调、增强学习等方向的算法',remote:'北京 海淀区 学院路',time:'5-10年',isInternship:false},
              {pointColor:"#2E90FA",color:"#175CD3",bgColor:"#EFF8FF",borderColor:"#B2DDFF",name:'算法工程师',tag:'大模型开发',desc:'参与大语言模型的研发、部署、微调, 究和开发NLP领域算法，并将算法应用到实际业务场景',remote:'北京 海淀区 学院路',time:'3-5年',isInternship:false},
              {pointColor:"#2E90FA",color:"#175CD3",bgColor:"#EFF8FF",borderColor:"#B2DDFF",name:'数据工程师',tag:'数据开发',desc:'负责数据抓取、清洗、融合等工作',remote:'北京 海淀区 学院路',time:'1-3年',isInternship:false},
              {pointColor:"#17B26A",color:"#067647",bgColor:"#ECFDF3",borderColor:"#ABEFC6",name:'AI工程方向实习生',tag:'机器学习算法/工程化经验',desc:'参与研发AI算法管理平台及AI应用的研发与落地。',remote:'北京 海淀区 学院路',time:'4天/周',isInternship:true},
              {pointColor:"#2E90FA",color:"#175CD3",bgColor:"#EFF8FF",borderColor:"#B2DDFF",name:'算法实习生',tag:'研究导向',desc:'参与多模态理解与生成模型的的研发与优化',remote:'北京 海淀区 学院路',time:'4天/周',isInternship:true},
              {pointColor:"#EF6820",color:"#B93815",bgColor:"#FEF6EE",borderColor:"#F9DBAF",name:'销售实习生',tag:'互联网/科技',desc:'我们正在寻找一名聪明、伶俐、懂技术、背景出色、学习速度快的销售实习生，以加入我们的团队。',remote:'北京 海淀区 学院路',time:'4天/周',isInternship:true}]
      };
    },
  
    components: {},
  
    mounted() {},
    methods: {
      getTagStyles(item) {
        return {
          border: `1px solid ${item.borderColor}`,
          backgroundColor: item.bgColor,
          color: item.color
        };
      }
    },
  };
  </script>
  <style scoped></style>
  