<template>
  <div class="demo">
    <div class="demo-container">
      <div class="demo-container-title">
        {{ $t('home.headTitle6') }}<span>{{ $t('home.headTitle7') }}</span>
      </div>
      <div class="demo-container-desc">
        {{ $t('home.StarStream') }}
      </div>
      <div class="demo-container-action" @click="dialogFormVisible = true">
        {{ $t('home.Demo') }}
      </div>
    </div>
    <ContactUS :dialogFormVisible="dialogFormVisible" @closeDialog="closeDialog" />
  </div>
</template>

<style lang="scss" scoped>
  .demo-container {
    margin: 0 auto;
    max-width: 1280px;
    padding-top: 64px;

    @media (max-width: 768px) {
      padding-left: 20px;
      padding-right: 20px;
    }

    &-title {
      color: #000;
      font-size: 48px;
      font-weight: 600;
      margin-bottom: 24px;
      text-align: center;

      @media (max-width: 768px) {
        font-size: 24px;
        margin-bottom: 16px;
      }

      span {
        color: #FF8000;
      }
    }

    &-desc {
      color: #000;
      text-align: center;
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 24px;

      @media (max-width: 768px) {
        font-size: 14px;
        margin-bottom: 16px;
      }
    }

    &-action {
      display: flex;
      width: 200px;
      height: 48px;
      justify-content: center;
      align-items: center;
      border-radius: 40px;
      background: #000;
      color: #fff;
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      margin: 0 auto;
      cursor: pointer;

      @media (max-width: 768px) {
        font-size: 18px;
      }
    }
  }
</style>

<script>
  import ContactUS from '../ContactUs.vue'

  export default {
    name: 'Demo',
    components: {
      ContactUS
    },
    data() {
      return {
        dialogFormVisible: false,
      }
    },
    methods: {
      closeDialog() {
        this.dialogFormVisible = false;
      },
    }
  }
</script>
