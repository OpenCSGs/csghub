<template>
  <div class="mb-[96px] md:mb-[64px] w-full bg-white overflow-x-auto">
    <div
      class="rounded-[12px] border md:border-0 border-[#EAECF0] w-[1280px] m-auto"
    >
      <div class="flex md:flex-col justify-between py-[24px] px-[20px] md:py-0">
        <div class="flex items-center font-medium text-[18px] md:mb-[16px]">
          <p>{{ $t('computing.price.gpu') }}</p>
        </div>
        <div class="flex">
          <a
            :href="starcloudUrl"
            target="_blank"
            class="bg-[#3250BD] mr-[16px] flex items-center justify-center py-[10px] px-[12px] md:mb-[16px] rounded-[8px] cursor-pointer"
          >
            <p class="text-[#FFFFFF] font-medium text-[16px]">
              {{ $t('navbar.source') }}
            </p>
          </a>
          <div
            @click="
              toNextPage(
                'https://opencsg.com/lead_forms/form/5P4op4FQHwh5_%E7%AE%97%E5%8A%9B%E9%9C%80%E6%B1%82',
                'connect_compute'
              )
            "
            class="bg-[#3250BD] flex items-center justify-cente py-[10px] px-[12px] md:mb-[16px] rounded-[8px] cursor-pointer"
          >
            <p class="text-[#FFFFFF] font-medium text-[16px]">
              {{ $t('computing.price.consult') }}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex items-center text-[#475467] text-[12px] bg-[#F9FAFB] border border-[#EAECF0]"
        >
          <div class="w-36 py-[12px] px-[24px] responsive-div">
            {{ $t('computing.price.brand') }}
          </div>
          <div class="w-48 py-[12px] px-[24px] responsive-div">
            {{ $t('computing.price.specifications') }}
          </div>
          <div class="w-80 py-[12px] px-[24px] responsive-div">
            {{ $t('computing.price.power') }}
          </div>
          <div class="w-24 py-[12px] px-[24px] responsive-div">
            {{ $t('computing.price.config') }}
          </div>
          <div class="w-20 py-[12px] px-[24px] responsive-div">
            {{ $t('computing.price.inventory') }}
          </div>
          <div class="w-28 py-[12px] px-[24px] responsive-div">
            {{ $t('computing.price.service') }}
          </div>
          <div class="w-44 py-[12px] px-[24px] responsive-div">
            {{ $t('computing.price.type') }}
          </div>
          <div class="w-40 py-[12px] px-[24px] responsive-div">
            {{ $t('computing.price.price') }}
          </div>
        </div>
        <div
          v-for="specification in specificationsList"
          class="flex items-center text-[#101828] text-[14px] border-b border-[#EAECF0] last-of-type:border-0"
        >
          <div
            class="w-36 flex items-center py-[12px] pl-[24px] responsive-div"
          >
            <img
              :src="specification.logo[0]"
              :class="specification.logo[1]"
              alt="nvidia"
            />
            <p class="ml-[12px]">{{ specification.brand }}</p>
          </div>
          <div
            class="w-48 py-[12px] px-[24px] whitespace-pre-wrap responsive-div"
          >
            {{ specification.specification }}
          </div>
          <div
            class="w-80 py-[12px] px-[24px] whitespace-pre-wrap whitespace-nowrap"
          >
            <p>{{ specification.power }}</p>
          </div>
          <div
            class="w-24 py-[12px] px-[24px] whitespace-pre-wrap responsive-div"
          >
            {{ specification.config }}
          </div>
          <div
            class="w-20 py-[12px] px-[24px] whitespace-pre-wrap responsive-div"
          >
            {{ specification.number }}
          </div>
          <div
            class="w-28 py-[12px] px-[24px] whitespace-pre-wrap responsive-div"
          >
            {{ specification.status }}
          </div>
          <div
            class="w-44 py-[12px] px-[24px] whitespace-pre-wrap responsive-div"
          >
            {{ specification.type }}
          </div>
          <div
            class="w-40 py-[12px] px-[24px] whitespace-pre-wrap responsive-div"
          >
            {{ specification.price }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import trackPageEvent from '../../packs/trackPageEvent'

  export default {
    props: {
      starcloudUrl: String
    },
    data() {
      return {
        specificationsList: [
          {
            logo: ['/images/computing/nvidia.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.NVIDIA'),
            specification: 'RTX4090 / 24GB PCIe',
            power: 'FP32 82.6 TFLOPS, FP16 165.2 TFLOPS',
            config: this.$t('computing.price.4ka'),
            number: '30',
            status: this.$t('computing.price.available'),
            type: this.$t('computing.price.physical'),
            price: '98,000/' + this.$t('computing.price.unit')
          },
          {
            logo: ['/images/computing/nvidia.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.NVIDIA'),
            specification: 'RTX4090 / 24GB PCIe',
            power: 'FP32 82.6 TFLOPS, FP16 165.2 TFLOPS',
            config: this.$t('computing.price.8ka'),
            number: '30',
            status: this.$t('computing.price.available'),
            type: this.$t('computing.price.physical'),
            price: '218,000/' + this.$t('computing.price.unit')
          },
          {
            logo: ['/images/computing/nvidia.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.NVIDIA'),
            specification: 'A100 / 80GB SXM',
            power: 'FP32 19.2 TFLOPS, FP16 77.97 TFLOPS',
            config: this.$t('computing.price.8ka'),
            number: '16',
            status: this.$t('computing.price.partnerAvailable'),
            type: this.$t('computing.price.physical'),
            price:
              '50,000/' +
              this.$t('computing.price.unit') +
              '/' +
              this.$t('computing.price.month')
          },
          {
            logo: ['/images/computing/nvidia.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.NVIDIA'),
            specification: 'A800 / 80GB NVLink',
            power: 'FP32 19.49 TFLOPS, FP16 77.97 TFLOPS',
            config: this.$t('computing.price.8ka'),
            number: '16',
            status: this.$t('computing.price.available'),
            type: this.$t('computing.price.physical'),
            price: this.$t('computing.price.console')
          },
          {
            logo: ['/images/computing/nvidia.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.NVIDIA'),
            specification: 'A800 / 80GB NVLink',
            power: 'FP32 29.65 TFLOPS, FP16 118.6 TFLOPS',
            config: this.$t('computing.price.8ka'),
            number: '32',
            status: this.$t('computing.price.available'),
            type: this.$t('computing.price.physical'),
            price: this.$t('computing.price.console')
          },
          {
            logo: ['/images/computing/nvidia.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.NVIDIA'),
            specification: 'L20 / 48GB PCIe',
            power: 'FP32 59.8 TFLOPS, FP16 119.5 TFLOPS',
            config: this.$t('computing.price.8ka'),
            number: '0',
            status: this.$t('computing.price.unavailable'),
            type: this.$t('computing.price.physical'),
            price: this.$t('computing.price.waiting')
          },
          {
            logo: ['/images/computing/nvidia.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.NVIDIA'),
            specification: 'H20 / 96GB NVLink',
            power: 'FP32 44 TFLOPS, FP16 148 TFLOPS',
            config: this.$t('computing.price.8ka'),
            number: '0',
            status: this.$t('computing.price.unavailable'),
            type: this.$t('computing.price.physical'),
            price: this.$t('computing.price.waiting')
          },
          {
            logo: ['/images/computing/nvidia.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.NVIDIA'),
            specification: 'RTX4090 / 24GB PCIe',
            power: 'FP32 82.6 TFLOPS, FP16 165.2 TFLOPS',
            config: this.$t('computing.price.8ka'),
            number: '99',
            status: this.$t('computing.price.available'),
            type: this.$t('computing.price.cloud'),
            price:
              '12,000/' +
              this.$t('computing.price.unit') +
              '/' +
              this.$t('computing.price.month')
          },
          {
            logo: ['/images/computing/nvidia.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.NVIDIA'),
            specification: 'V100 / 32GB NVLink',
            power: 'FP32 15.7 TFLOPS,  FP16 125 TFLOPS',
            config: this.$t('computing.price.8ka'),
            number: '199',
            status: this.$t('computing.price.available'),
            type: this.$t('computing.price.cloud'),
            price:
              '15,000/' +
              this.$t('computing.price.unit') +
              '/' +
              this.$t('computing.price.month')
          },
          {
            logo: ['/images/computing/nvidia.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.NVIDIA'),
            specification: 'A800 / 80GB NVLink',
            power: 'FP32 19.49 TFLOPS, FP16 77.97 TFLOPS',
            config: this.$t('computing.price.8ka'),
            number: '16',
            status: this.$t('computing.price.available'),
            type: this.$t('computing.price.cloud'),
            price:
              '48,000/' +
              this.$t('computing.price.unit') +
              '/' +
              this.$t('computing.price.month')
          },
          {
            logo: ['/images/computing/nvidia.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.NVIDIA'),
            specification: 'H800 / 80GB NVLink',
            power: 'FP32 29.65 TFLOPS, FP16 118.6 TFLOPS',
            config: this.$t('computing.price.8ka'),
            number: '32',
            status: this.$t('computing.price.available'),
            type: this.$t('computing.price.cloud'),
            price:
              '98,000/' +
              this.$t('computing.price.unit') +
              '/' +
              this.$t('computing.price.month')
          },
          {
            logo: ['/images/computing/ascend.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.Huawei'),
            specification: '910B / 64GB PCIe',
            power: 'INT8 640 TOPS, FP16 320 TFLOPS',
            config: this.$t('computing.price.8ka'),
            number: '32',
            status: this.$t('computing.price.available'),
            type: this.$t('computing.price.cloud'),
            price: 'N/A'
          },
          {
            logo: ['/images/computing/enflame.png', 'w-[40px] h-[40px]'],
            brand: this.$t('computing.price.Enflame'),
            specification: 'i20 / 16GB PCIe',
            power: 'INT8 256 TOPS, FP16 128 TFLOPS',
            config: this.$t('computing.price.8ka'),
            number: '199',
            status: this.$t('computing.price.available'),
            type: this.$t('computing.price.cloud'),
            price: '9,999/' + this.$t('computing.price.unit')
          }
        ]
      }
    },
    methods: {
      toNextPage(url, id) {
        trackPageEvent({ id: id, m: 'Connect' })
        window.location.href = url
      }
    }
  }
</script>
