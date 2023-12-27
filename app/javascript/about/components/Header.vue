<template>
    <div class="fixed">
        <div class="header">
            <div class="logoBox">
                <nuxt-link to="/">
                    <img src="~/assets/images/logo.png" alt="OpenCsg">
                </nuxt-link>
                <!-- <img src="~/assets/images/logo.png" alt="OpenCsg"> -->
                <div class="menuBox hide">
                    <nuxt-link :class="this.$route.path == '/' ? 'active_menu' : 'menu'" to="/">我们</nuxt-link>
                    <nuxt-link :class="this.$route.path == '/Models' ? 'active_menu' : 'menu'" to="Models">模型</nuxt-link>
                    <nuxt-link :class="this.$route.path == '/MarketPlace' ? 'active_menu' : 'menu'"
                        to="MarketPlace">应用</nuxt-link>
                    <nuxt-link :class="this.$route.path == '/Scheme' ? 'active_menu' : 'menu'" to="Scheme">方案</nuxt-link>
                    <nuxt-link :class="this.$route.path == '/Train' ? 'active_menu' : 'menu'" to="Train">培训</nuxt-link>
                    <nuxt-link :class="this.$route.path == '/Pricing' ? 'active_menu' : 'menu'" to="Pricing">价格</nuxt-link>
                    <div class="menu">社区</div>

                </div>
            </div>

            <div class="buttonBox">
                <div class="lang">中</div>
                <div class="contact_button" @click="dialogFormVisible = true">联系我们</div>
                <div class="menuBtutton hidemin">
                    <el-popover placement="bottom" width="150" v-model="popshow" trigger="click">
                        <nuxt-link style="display: block;text-align: center;"
                            :class="this.$route.path == '/' ? 'active_menu' : 'menu'" to="/">我们</nuxt-link>
                        <nuxt-link style="display: block;text-align: center;"
                            :class="this.$route.path == '/Models' ? 'active_menu' : 'menu'" to="Models">模型</nuxt-link>
                        <nuxt-link style="display: block;text-align: center;"
                            :class="this.$route.path == '/MarketPlace' ? 'active_menu' : 'menu'"
                            to="MarketPlace">应用</nuxt-link>
                        <nuxt-link style="display: block;text-align: center;"
                            :class="this.$route.path == '/Scheme' ? 'active_menu' : 'menu'" to="Scheme">方案</nuxt-link>
                        <nuxt-link style="display: block;text-align: center;"
                            :class="this.$route.path == '/Train' ? 'active_menu' : 'menu'" to="Train">培训</nuxt-link>
                        <nuxt-link style="display: block;text-align: center;"
                            :class="this.$route.path == '/Pricing' ? 'active_menu' : 'menu'" to="Pricing">价格</nuxt-link>
                        <div style="text-align: center;" class="menu">社区</div>
                        <el-button style="margin:0 auto ;backdrop-filter: blur(15px);" class="menu" slot="reference">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20" width="30" height="30">
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"></path>
                            </svg>
                        </el-button>
                    </el-popover>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ContactUS from './ContactUs'
export default {
    name: 'Header',
    components: {
        ContactUS
    },
    data() {
        return {
            path: '',
            popshow: false,
            dialogFormVisible: false,
            menu: [{ name: '我们', path: '/' }, { name: '模型', path: '/Models' }, { name: '应用', path: '/MarketPlace' }, { name: '方案', path: '/Scheme' }, { name: '培训', path: '/Train' }, { name: '价格', path: '/Pricing' },]
        }
    },
    mounted() {

    },
    methods: {
        closeDialog() {
            this.dialogFormVisible = false;
        },
    }

}
</script>
<style lang="scss" scoped>
.hide {
    @media(max-width:1000px) {
        display: none !important;
    }
}

.hidemin {
    @media(min-width:1000px) {
        display: none !important;
    }
}

.menuBtutton {
    backdrop-filter: blur(15px);

    .el-popover {
        z-index: 9999;
    }

    .el-button {
        padding: 0;
        color: #131313;
        opacity: 0.85;
        border: none;
    }
}

.fixed {
    position: fixed;
    width: 100%;
    z-index: 999;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    border-left: 1px solid rgba(255, 255, 255, 0.5);
    /*设置背景样式*/
    //   background: rgba(255, 255, 255, 0.1);

    /*让透过card的底部元素模糊化,达到毛玻璃效果*/
    backdrop-filter: blur(15px);
}

.header {
    display: flex;
    align-items: center;
    padding: 0 36rem;

    @media(max-width:1000px) {
        padding: 0 3.6rem;
    }

    justify-content: space-between;

    .logoBox {
        padding: 1.3rem 0;
        display: flex;
        align-items: center;
    }

    .menuBox {
        display: flex;
        margin-left: 8rem;
    }

    .menu,
    .active_menu {
        margin-right: 3.2rem;
    }

    .lang {
        margin-right: 2rem;
    }

    .buttonBox {
        display: flex;
        align-items: center;
    }
}
</style>
  