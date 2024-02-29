<template>
  <div class="p-[20px] bg-white rounded my-6 text-[#606266]">
    <p>
      {{ $t('space.Desc1') }}
    </p>
    <p>
      {{ $t('space.Desc2') }} <a :href="starChainAddress" target="_blank" class="text-[#1a8b7b] underline"> StarChain</a>{{ $t('space.Desc3') }}
    </p>
    <p>
      {{ $t('space.Desc4') }}
    </p>
  </div>
</template>
<script>
export default {
  props: {
    starChainAddress: String
  },
  data() {
    return {}
  }
}
</script>