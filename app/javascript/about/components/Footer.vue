<!-- Please remove this file from your project -->
<template>
  <div class="footer">
    <div class="contactBox">
      <div class="contact">
        <div>Ready to Get Started?</div>
        <div class="button">Contact Us</div>
      </div>
    </div>
    <div class="content">
      <div class="erwei"><img src="~/assets/images/erwei.png" alt=""></div>
      <div class="pb24">联系我们</div>
      <div class="pb100">contact@opencsg.com</div>
    </div>
    <div class="gs">
      Copyright © 2023 北京开放传神科技有限公司 | <a href="http://beian.miit.gov.cn/" target="_blank">
        京ICP备2023006263号-1 | </a>
      <img src="~/assets/gongan.png" class="logo" alt="" />
      <a target="_blank" rel="noopener"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011202004415">京公网安备 11011202004415号</a>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>
<style lang="scss" scoped>
.pb24 {
  padding-bottom: 2.4rem;
}

.pb100 {
  padding-bottom: 10rem;
}

.footer {
  background: url(~/assets/images/footer.png) no-repeat;
  background-size: 100% 100%;

  .contactBox {
    padding: 0 36rem;

    @media(max-width:1000px) {
      padding: 0 3px;
    }

    .contact {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 3.7rem 4rem 3.7rem 6rem;

      @media(max-width:1000px) {
        padding:0.5rem 1rem;
        text-align: center;
      }

      background: #35CAB5;
      border-radius: 20px;
      font-size: 32px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 48px;
      position: relative;
      top: -7.5rem;
      @media(max-width:1000px) {
          top: -2.5rem;
        }
      .button {
        font-size: 24px;
        background: #FFFFFF;
        padding: 2.7rem 9.3rem;

        @media(max-width:1000px) {
          padding: 0.5rem 1rem;
          text-align: center;
        }

        border-radius: 20px;
        font-weight: 400;
        color: #1A8B7B;
        line-height: 36px;
        cursor: pointer;
      }
    }

  }
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  color: #FFFFFF70;
  font-size: 24px;
  line-height: 36px;
}

.gs {
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
  font-size: 20px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #FBFBFB;
  line-height: 30px;

  .logo {
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }

  a {
    color: #FBFBFB;
    text-decoration: none;

  }
}

.erwei {
  width: 28rem;
  height: 28rem;

  img {
    width: 28rem;
    height: 28rem;
  }

  margin: 0 auto;
  padding: 14rem 0 2rem;
}</style>

