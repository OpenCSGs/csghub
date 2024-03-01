<template>
  <div class="mb-[96px] md:mb-[64px] w-full bg-white overflow-x-auto">
    <div class="rounded-[12px] border md:border-0 border-[#EAECF0] w-[1280px] m-auto">
      <div class="flex md:flex-col justify-between py-[24px] px-[20px] md:py-0">
        <div class="flex items-center font-medium text-[18px] md:mb-[16px]"><p>{{ $t('computing.price.gpu') }}</p></div>
        <a href="https://portal.opencsg.com/lead_forms/form/5P4op4FQHwh5_%E7%AE%97%E5%8A%9B%E9%9C%80%E6%B1%82" class="bg-[#3250BD] flex items-center justify-center w-[90px] py-[10px] px-[12px] md:mb-[16px] rounded-[8px] cursor-pointer">
          <p class="text-[#FFFFFF] font-medium text-[16px]">
            {{ $t('computing.price.consult') }}
          </p>
        </a>
      </div>
      <div>
        <div class="flex items-center text-[#475467] text-[12px] bg-[#F9FAFB] border border-[#EAECF0]">
          <div class="w-40 py-[12px] px-[24px] responsive-div">{{ $t('computing.price.brand') }}</div>
          <div class="w-48 py-[12px] px-[24px] responsive-div">{{ $t('computing.price.specifications') }}</div>
          <div class="w-80 py-[12px] px-[24px] responsive-div">{{ $t('computing.price.power') }}</div>
          <div class="w-24 py-[12px] px-[24px] responsive-div">{{ $t('computing.price.inventory') }}</div>
          <div class="w-40 py-[12px] px-[24px] responsive-div">{{ $t('computing.price.service') }}</div>
          <div class="w-40 py-[12px] px-[24px] responsive-div">{{ $t('computing.price.type') }}</div>
          <div class="w-40 py-[12px] px-[24px] responsive-div">{{ $t('computing.price.price') }}</div>
        </div>
        <div v-for="specification in specificationsList"
             class="flex items-center text-[#101828] text-[14px] border-b border-[#EAECF0] last-of-type:border-0">
          <div class="w-40 flex items-center py-[12px] pl-[24px] responsive-div">
              <img :src="specification.logo[0]" :class="specification.logo[1]" alt="nvidia">
              <p class="ml-[12px]">{{ this.$i18n.locale === 'zh' ? specification.brand: specification.brand_en }}</p>
          </div>
          <div class="w-48 py-[12px] px-[24px] whitespace-pre-wrap responsive-div">
              {{ specification.specification }}
          </div>
          <div class="w-80 py-[12px] px-[24px] whitespace-pre-wrap whitespace-nowrap">
              <p>{{ specification.power }}</p>
          </div>
          <div class="w-24 py-[12px] px-[24px] whitespace-pre-wrap responsive-div">
            {{ specification.number }}
          </div>
          <div class="w-40 py-[12px] px-[24px] whitespace-pre-wrap responsive-div">
            {{ this.$i18n.locale === 'zh' ? specification.status: specification.status_en }}
          </div>
          <div class="w-40 py-[12px] px-[24px] whitespace-pre-wrap responsive-div">
            {{ this.$i18n.locale === 'zh' ? specification.type: specification.type_en }}
          </div>
          <div class="w-40 py-[12px] px-[24px] whitespace-pre-wrap responsive-div">
            {{ this.$i18n.locale === 'zh' ? specification.price: specification.price_en }}
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
          brand_en: 'NVIDIA',
          specification: 'RTX4090 / 24GB PCIe',
          power: 'FP32 82.6 TFLOPS, FP16 165.2 TFLOPS',
          number: '65',
          status: '可供',
          status_en: 'Available',
          type: '销售',
          type_en: 'Sales',
          price: '65000/台',
          price_en: '65000/unit'
        },
        {
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          brand_en: 'NVIDIA',
          specification: 'A800 / 80GB NVLink',
          power: 'FP32 19.49 TFLOPS, FP16 77.97 TFLOPS',
          number: '53',
          status: '可供',
          status_en: 'Available',
          type: '长租',
          type_en: 'Long term rental',
          price: '48000/月',
          price_en: '48000/month'
        },
        {
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          brand_en: 'NVIDIA',
          specification: 'A800 / 80GB PCIe',
          power: 'FP32 19.49 TFLOPS, FP16 77.97 TFLOPS',
          number: '101',
          status: '可供',
          status_en: 'Available',
          type: '长租',
          type_en: 'Long term rental',
          price: '42000/月',
          price_en: '42000/month'
        },
        {
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          brand_en: 'NVIDIA',
          specification: 'H800 / 80GB NVLink',
          power: 'FP32 29.65 TFLOPS, FP16 118.6 TFLOPS',
          number: '23',
          status: '可供',
          status_en: 'Available',
          type: '长租',
          type_en: 'Long term rental',
          price: '110000/月',
          price_en: '110000/month'
        },
        {
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          brand_en: 'NVIDIA',
          specification: 'V100 / 32GB NVLink',
          power: 'FP32 15.7 TFLOPS,  FP16 125 TFLOPS',
          number: '33',
          status: '库存',
          status_en: 'Inventory',
          type: '长租',
          type_en: 'Long term rental',
          price: 'N/A',
          price_en: 'N/A'

        },
        {
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          brand_en: 'NVIDIA',
          specification: 'L20 / 48GB PCIe',
          power: 'FP32 59.8 TFLOPS, FP16 119.5 TFLOPS',
          number: '36',
          status: '可供',
          status_en: 'Available',
          type: '销售',
          type_en: 'Sales',
          price: '180000/台',
          price_en: '180000/unit'
        },
        {
          logo: ['/images/computing/nvidia.png','w-[40px] h-[40px]'],
          brand: 'NVIDIA',
          brand_en: 'NVIDIA',
          specification: 'H20 / 96GB NVLink',
          power: 'FP32 44 TFLOPS, FP16 148 TFLOPS',
          number: '8',
          status: '库存',
          status_en: 'Inventory',
          type: '长租',
          type_en: 'Long term rental',
          price: 'N/A',
          price_en: 'N/A'
        },
        {
          logo: ['/images/computing/ascend.png','w-[40px] h-[40px]'],
          brand: '华为',
          brand_en: 'Huawei',
          specification: '910B / 64GB PCIe',
          power: 'INT8 640 TOPS, FP16 320 TFLOPS',
          number: '28',
          status: '库存',
          status_en: 'Inventory',
          type: '长租',
          type_en: 'Long term rental',
          price: 'N/A',
          price_en: 'N/A'
        },
        {
          logo: ['/images/computing/enflame.png','w-[40px] h-[40px]'],
          brand: '燧原',
          brand_en: 'Suiyuan',
          specification: 'i20 / 16GB PCIe',
          power: 'INT8 256 TOPS, FP16 128 TFLOPS',
          number: '200',
          status: '库存',
          status_en: 'Inventory',
          type: '长租',
          type_en: 'Long term rental',
          price: 'N/A',
          price_en: 'N/A'
        }
      ]
    }
  }
}
</script>

