<template>
  <div class="mb-[96px] md:mb-[64px] w-full bg-white overflow-x-auto">
    <div class="rounded-[12px] border md:border-0 border-[#EAECF0] max-w-[1280px] xl:max-w-[1000px] min-w-[900px] m-auto">
      <div class="flex md:flex-col justify-between py-[24px] px-[20px] md:py-0">
        <div class="flex items-center font-medium text-[18px] md:mb-[16px]"><p>GPU 云主机</p></div>
        <a href="https://portal.opencsg.com/lead_forms/form/5P4op4FQHwh5_%E7%AE%97%E5%8A%9B%E9%9C%80%E6%B1%82" class="bg-[#3250BD] w-[90px] py-[10px] px-[12px] md:mb-[16px] rounded-[8px] cursor-pointer"><p
            class="text-[#FFFFFF] font-medium text-[16px]">
          咨询销售</p></a>
      </div>
      <div>
        <div class="flex items-center text-[#475467] text-[12px] bg-[#F9FAFB] border border-[#EAECF0]">
          <div class="w-96 xl:w-72 lg:w-56 py-[12px] px-[24px] responsive-div">品牌</div>
          <div class="w-96 xl:w-72 lg:w-56 py-[12px] px-[24px] responsive-div">规格</div>
          <div class="w-100 py-[12px] px-[24px] responsive-div">算力</div>
        </div>
        <div v-for="specification in specificationsList"
             class="flex items-center text-[#101828] text-[14px] border-b border-[#EAECF0] last-of-type:border-0">
          <div class="w-96 xl:w-72 lg:w-56 flex items-center py-[12px] pl-[24px] responsive-div">
              <img :src="specification.logo[0]" :class="specification.logo[1]" alt="nvidia">
              <p class="ml-[12px]">{{ specification.brand }}</p>
          </div>
          <div class="w-96 xl:w-72 lg:w-56 py-[12px] px-[24px] whitespace-pre-wrap responsive-div">
              {{ specification.specification }}
          </div>
          <div class="w-100 py-[12px] px-[24px] whitespace-pre-wrap whitespace-nowrap">
              <p>{{ specification.power }}</p>
          </div>
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
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          specification: 'RTX4090 / 24GB PCIe',
          power: 'FP32 82.6 TFLOPS, FP16 165.2 TFLOPS',
        },
        {
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          specification: 'A800 / 80GB NVLink',
          power: 'FP32 19.49 TFLOPS, FP16 77.97 TFLOPS',
        },
        {
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          specification: 'A800 / 80GB PCIe',
          power: 'FP32 19.49 TFLOPS, FP16 77.97 TFLOPS',
        },
        {
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          specification: 'H800 / 80GB NVLink',
          power: 'FP32 29.65 TFLOPS, FP16 118.6 TFLOPS',
        },
        {
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          specification: 'V100 / 32GB NVLink',
          power: 'FP32 15.7 TFLOPS,  FP16 125 TFLOPS',
        },
        {
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          specification: 'L20 / 48GB PCIe',
          power: 'FP32 59.8 TFLOPS, FP16 119.5 TFLOPS',
        },
        {
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          specification: 'H20 / 96GB NVLink',
          power: 'FP32 44 TFLOPS, FP16 148 TFLOPS',
        },
        {
          logo: ['/images/computing/ascend.png','w-[40px] h-[40px]'],
          brand: '华为',
          specification: '910B / 64GB PCIe',
          power: 'INT8 640 TOPS, FP16 320 TFLOPS',
        },
        {
          logo: ['/images/computing/enflame.png','w-[40px] h-[40px]'],
          brand: '燧原',
          specification: 'i20 / 16GB PCIe',
          power: 'INT8 256 TOPS, FP16 128 TFLOPS',
        }
      ]
    }
  }
}
</script>

