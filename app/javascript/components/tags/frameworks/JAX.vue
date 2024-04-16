<template>
  <span class="flex gap-[4px] items-center text-[14px] border px-[8px] py-[3px] rounded-[6px] cursor-pointer"
        :style="setTagColor()"
        @click="toggleActive"
  >
    <svg class="grayscale" :style="setSvgColor()" xmlns="http://www.w3.org/2000/svg" width="21" height="12" viewBox="0 0 21 12" fill="none">
      <g clip-path="url(#clip0_4087_108615)">
        <path d="M2.35109 6.00029L1.18701 7.99301H3.51517L4.67925 6.00029H2.35109Z" fill="#5E97F6" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M0.0229492 9.98524L1.18703 7.99299H3.51519L2.35111 9.98524H0.0229492Z" fill="#5E97F6" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M5.84331 7.99299H3.51515L2.35107 9.98524H4.67923L5.84331 7.99299Z" fill="#5E97F6" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M8.17144 7.99299H5.84328L4.6792 9.98524H7.00736L8.17144 7.99299Z" fill="#5E97F6" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M7.00734 6.00029L5.84326 7.99301H8.17142L9.3355 6.00029H7.00734Z" fill="#5E97F6" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M8.1714 4.008L7.00732 6.00025H9.33548L10.4996 4.008H8.1714Z" fill="#5E97F6" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M9.33547 2.01576L8.17139 4.00802H10.4995L11.6636 2.01576H9.33547Z" fill="#5E97F6" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M10.4995 0.0235062L9.33545 2.01576H11.6636L12.8277 0.0235062H10.4995Z" fill="#5E97F6" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M0.0229492 9.98524L1.18703 11.9775H3.51519L2.35111 9.98524H0.0229492Z" fill="#2A56C6" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M5.84331 11.9775H3.51515L2.35107 9.98524H4.67923L5.84331 11.9775Z" fill="#2A56C6" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M8.17144 11.9775H5.84328L4.6792 9.98524H7.00736L8.17144 11.9775Z" fill="#2A56C6" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M9.33548 9.98524L8.1714 7.99299L7.00732 9.98524L8.1714 11.9775L9.33548 9.98524Z" fill="#00796B" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M11.6636 6.00025L10.4995 4.008L9.33545 6.00025H11.6636Z" fill="#00796B" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M11.6636 2.01576L10.4995 4.00802L11.6636 6.00027L12.8277 4.00802L11.6636 2.01576Z" fill="#00796B" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M5.8433 7.99301L4.67922 6.00029L3.51514 7.99301H5.8433Z" fill="#3367D6" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M11.6636 6.00029H9.33547L8.17139 7.99301H10.4995L11.6636 6.00029Z" fill="#26A69A" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M13.9918 6.00029H11.6636L10.4995 7.99301H12.8277L13.9918 6.00029Z" fill="#26A69A" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M16.3199 2.01576L15.1558 0.0235062L13.9917 2.01576L15.1558 4.00802L16.3199 2.01576Z" fill="#9C27B0" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M17.4839 4.00802L16.3198 2.01576L15.1558 4.00802L16.3198 6.00027L17.4839 4.00802Z" fill="#9C27B0" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M18.648 6.00025L17.4839 4.008L16.3198 6.00025L17.4839 7.99297L18.648 6.00025Z" fill="#9C27B0" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M19.8125 7.99301L18.6485 6.00029L17.4844 7.99301L18.6485 9.98526L19.8125 7.99301Z" fill="#9C27B0" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M20.9766 9.98524L19.8125 7.99299L18.6484 9.98524L19.8125 11.9775L20.9766 9.98524Z" fill="#9C27B0" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M19.8125 0.0235062L18.6484 2.01576L19.8125 4.00802L20.9766 2.01576L19.8125 0.0235062Z" fill="#9C27B0" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M17.4844 4.00802L18.6485 2.01576L19.8125 4.00802L18.6485 6.00027L17.4844 4.00802Z" fill="#9C27B0" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M16.3198 6.00029L15.1558 7.99301L16.3198 9.98526L17.4839 7.99301L16.3198 6.00029Z" fill="#9C27B0" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M15.1558 11.9775L13.9917 9.98524L15.1558 7.99299L16.3199 9.98524L15.1558 11.9775Z" fill="#9C27B0" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M12.8277 11.9775L11.6636 9.98524H13.9917L15.1558 11.9775H12.8277Z" fill="#6A1B9A" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M10.4995 7.99299H8.17139L9.33547 9.98524H11.6636L10.4995 7.99299Z" fill="#00695C" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M12.8277 7.99299H10.4995L11.6636 9.98524L12.8277 7.99299Z" fill="#00695C" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M12.8276 4.008L13.9917 6.00025H16.3199L15.1558 4.008H12.8276Z" fill="#00695C" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M13.9917 2.01576H11.6636L12.8277 4.00802H15.1558L13.9917 2.01576Z" fill="#00695C" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M19.8121 11.9775L18.648 9.98524H16.3198L17.4839 11.9775H19.8121Z" fill="#00695C" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M17.4839 7.99299L16.3198 9.98524H18.648L17.4839 7.99299Z" fill="#00695C" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M15.1558 0.0235062H12.8277L11.6636 2.01576H13.9917L15.1558 0.0235062Z" fill="#EA80FC" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M15.1558 7.99299H12.8277L11.6636 9.98524H13.9917L15.1558 7.99299Z" fill="#EA80FC" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M16.3199 6.00029H13.9917L12.8276 7.99301H15.1558L16.3199 6.00029Z" fill="#EA80FC" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M19.8121 0.0235062H17.4839L16.3198 2.01576H18.648L19.8121 0.0235062Z" fill="#EA80FC" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
        <path d="M17.4839 4.00802L16.3198 2.01576H18.648L17.4839 4.00802Z" fill="#EA80FC" stroke="#DCE0DF" stroke-width="0.0460105" stroke-linejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_4087_108615">
          <rect width="21" height="12" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    JAX
  </span>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue'
  const props = defineProps({
    activeTag: String
  })

  const emit = defineEmits(['setActiveFrameworkTag'])

  const toggleActive = () => {
    emit('setActiveFrameworkTag', 'JAX')
  }
  const setTagColor = () => {
    if (props.activeTag?.toLowerCase() === 'jax') {
      return "color: white; background-color: #4D6AD6"
    }
  }
  const setSvgColor = () => {
    if (props.activeTag?.toLowerCase() === 'jax') {
      return "filter: drop-shadow(1000px 0 0 white); transform: translate(-1000px);"
    }
  }
  onMounted(() => {
  })
</script>