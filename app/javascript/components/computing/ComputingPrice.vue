<template>
  <div class="pb-[96px] md:pb-[64px] w-full bg-white overflow-hidden">
    <div class="rounded-[12px] border md:border-0 border-[#EAECF0] max-w-[1280px] min-w-[750px] m-auto">
      <div class="flex md:flex-col justify-between py-[24px] px-[20px] md:py-0">
        <div class="flex items-center font-medium text-[18px] md:mb-[16px]"><p>GPU 云主机</p></div>
        <div class="bg-[#3250BD] w-[90px] py-[10px] px-[12px] md:mb-[16px] rounded-[8px] cursor-pointer"><p class="text-[#FFFFFF] font-medium text-[16px]">
          咨询销售</p></div>
      </div>
      <div>
        <div class="flex items-center text-[#475467] text-[12px] bg-[#F9FAFB] border border-[#EAECF0]">
          <div class="w-[304px] py-[12px] px-[24px]" style="width: 310px;">规格名称</div>
          <div class="w-[304px] py-[12px] px-[24px]" style="width: 310px;">规格</div>
          <div class="w-[304px] py-[12px] px-[24px]" style="width: 310px;">显卡数</div>
          <div class="w-[304px] py-[12px] px-[24px]" style="width: 310px;">标资（元/月）</div>
        </div>
        <div v-for="specification in specificationsList" class="flex items-center text-[#101828] text-[14px] border-b border-[#EAECF0]">
          <div class="flex items-center w-[304px] py-[12px] px-[24px]" style="width: 310px;">
            <img src="/images/computing/nvidia.png" class="w-[40px] h-[40px]" alt="nvidia">
            <p class="ml-[8px]">{{specification.specificationName}}</p>
          </div>
          <div class="w-[304px] py-[12px] px-[24px]" style="width: 310px;"><div class="w-[150px] whitespace-pre-wrap">{{specification.specification}}</div></div>
          <div class="w-[304px] py-[12px] px-[24px]" style="width: 310px;"><div class="w-[110px] whitespace-pre-wrap">{{specification.cardsNumber}}</div></div>
          <div class="w-[304px] py-[12px] px-[24px]" style="width: 310px;">{{specification.price}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      specificationsList: [
        {
          specificationName: 'V100 GPU',
          specification: '8C 64G-40GB',
          cardsNumber: '1 * NVIDIA       V100-PCIe-32G',
          price: '5,000 或 咨询销售'
        },
        {
          specificationName: 'V100 GPU',
          specification: '16C 128G-40GB',
          cardsNumber: '2 * NVIDIA       V100-PCIe-32G',
          price: '10,000 或 咨询销售'
        },
        {
          specificationName: 'V100 GPU',
          specification: '32C 256G-40GB',
          cardsNumber: '4 * NVIDIA       V100-PCIe-32G',
          price: '20,000 或 咨询销售'
        },
        {
          specificationName: 'V100 GPU',
          specification: '64C 512G-40GB',
          cardsNumber: '8 * NVIDIA       V100-PCIe-32G',
          price: '40,000 或 咨询销售'
        },
        {
          specificationName: 'H800 GPU',
          specification: '96C 2048G                     8 * 960G NVME SSD',
          cardsNumber: 'NVIDIA H800 (80G NVlink) * 8',
          price: '140,000 或 咨询销售'
        },
        {
          specificationName: 'A800 GPU',
          specification: '64C 1024G                     1 * 7.68TB NVME SSD',
          cardsNumber: 'NVIDIA A800 (80G SXM) * 8',
          price: '60,000 或 咨询销售'
        },
        {
          specificationName: '1 * 3090',
          specification: '16C 64G                      2TB固态硬盘',
          cardsNumber: 'NIVIDIA 3090 * 1',
          price: '6,000 或 咨询销售'
        },
        {
          specificationName: '2 * 3090',
          specification: '32C 128G                     4TB固态硬盘',
          cardsNumber: 'NIVIDIA 3090 * 2',
          price: '13,000 或 咨询销售'
        },
      ]
    }
  }
}
</script>
