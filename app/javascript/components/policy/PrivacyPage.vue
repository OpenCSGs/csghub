<template>
  <div>
    <div class="py-[96px] md:py-[64px] text-center w-full banner bg-white">
      <div class="flex justify-center items-center flex-col max-w-[1280px] m-auto">
        <div class="mb-[12px] text-[16px] text-[#223B99] leading-[24px]">
          Privacy Policy
        </div>
        <div
            class="mb-[24px] max-w-[1216px] m-auto text-[72px] md:text-[36px] md:font-medium md:leading-[44px] text-[#101828] leading-[90px]">
          用户协议与隐私政策
        </div>
        <div
            class="flex justify-center items-center mt-[48px] bg-[#F9FAFB] p-[6px] gap-[4px] rounded-[12px] border border-[#EAECF0] text-[#344054]">
          <div class="py-[8px] px-[12px] md:px-[38px] rounded-[6px] cursor-pointer"
               :class="theFlag === 'protocol' ?'bg-white border':'text-[#667085]'"
               @click="theFlag = 'protocol'">用户协议
          </div>
          <div class="py-[8px] px-[12px] md:px-[38px] rounded-[6px] cursor-pointer"
               :class="theFlag === 'policy' ?'bg-white border':'text-[#667085]'"
               @click="theFlag = 'policy'">隐私政策
          </div>
        </div>
      </div>
    </div>
    <ProtocolContent v-if="theFlag === 'protocol'"/>
    <PolicyContent v-if="theFlag === 'policy'"/>
  </div>
</template>
<script>
import ProtocolContent from "./ProtocolContent.vue"
import PolicyContent from "./PolicyContent.vue"
export default {
  props: {},
  data() {
    return {
      theFlag: 'protocol'
    }
  },
  components: {
    ProtocolContent,
    PolicyContent,
  },
};
</script>