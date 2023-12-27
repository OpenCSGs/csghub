<template>
    <div class="web">
        <div class="fixed">
            <div class="header">
                <div class="logoBox">
                    <nuxt-link to="/">
                        <img src="~/assets/images/logo.png" alt="OpenCsg">
                    </nuxt-link>
                    <!-- <img src="~/assets/images/logo.png" alt="OpenCsg"> -->
                    <div class="menuBox hide">
                        <nuxt-link :class="this.$route.path == '/' ? 'active_menu' : 'menu'" to="/">{{ $t('Overview')
                        }}</nuxt-link>
                        <!-- <nuxt-link :class="this.$route.path == '/Models' ? 'active_menu' : 'menu'" to="Models">{{
                            $t('Models') }}</nuxt-link> -->
                        <div :class="this.$route.path == '/Models' ? 'active_menu' : 'menu'" @click="goModels">{{
                            $t('Models') }}</div>
                        <!-- <nuxt-link :class="this.$route.path == '/MarketPlace' ? 'active_menu' : 'menu'" to="MarketPlace">{{
                            $t('MarketPlace') }}</nuxt-link> -->
                        <div :class="this.$route.path == '/MarketPlace' ? 'active_menu' : 'menu'" @click="goMarketPlace">{{
                            $t('MarketPlace') }}</div>
                        <!-- <nuxt-link :class="this.$route.path == '/Scheme' ? 'active_menu' : 'menu'" to="Scheme">{{
                            $t('Scheme') }}</nuxt-link> -->
                        <div :class="this.$route.path == '/Scheme' ? 'active_menu' : 'menu'" @click="goScheme">{{
                            $t('Scheme') }}</div>
                        <!-- <nuxt-link :class="this.$route.path == '/Train' ? 'active_menu' : 'menu'" to="Train">{{ $t('Train')
                        }}</nuxt-link> -->
                        <div :class="this.$route.path == '/Train' ? 'active_menu' : 'menu'" @click="goTrain">{{
                            $t('Train') }}</div>
                        <!-- <nuxt-link :class="this.$route.path == '/Pricing' ? 'active_menu' : 'menu'" to="Pricing">{{
                            $t('Pricing') }}</nuxt-link> -->
                        <div :class="this.$route.path == '/Pricing' ? 'active_menu' : 'menu'" @click="goPricing">{{
                            $t('Pricing') }}</div>

                        <!-- <nuxt-link class="menu" to="Blog">{{$t('Train') }}123123</nuxt-link> -->
                        <div class="menu" @click="goBlog">{{ $t('Blog') }}</div>

                    </div>
                </div>

                <div class="buttonBox">
                    <div class="menuBtutton hidemin">
                        <el-popover placement="bottom" width="150" v-model="popshow" trigger="click">
                            <div @click="closePop">
                                <nuxt-link style="display: block;text-align: center;"
                                    :class="this.$route.path == '/' ? 'active_menu' : 'menu'" to="/">{{ $t('Overview')
                                    }}</nuxt-link>
                            </div>
                            <div @click="closePop">
                                <div style="display: block;text-align: center;"
                                    :class="this.$route.path == '/Models' ? 'active_menu' : 'menu'" @click="goModels">{{
                                        $t('Models')
                                    }}</div>
                            </div>
                            <div @click="closePop">
                                <div style="display: block;text-align: center;"
                                    :class="this.$route.path == '/MarketPlace' ? 'active_menu' : 'menu'"
                                    @click="goMarketPlace">{{
                                        $t('MarketPlace')
                                    }}</div>
                            </div>
                            <div @click="closePop">
                                <div style="display: block;text-align: center;"
                                    :class="this.$route.path == '/Scheme' ? 'active_menu' : 'menu'" @click="goScheme">{{
                                        $t('Scheme')
                                    }}</div>
                            </div>
                            <div @click="closePop">
                                <div style="display: block;text-align: center;"
                                    :class="this.$route.path == '/Train' ? 'active_menu' : 'menu'" @click="goTrain">{{
                                        $t('Train')
                                    }}</div>
                            </div>
                            <div @click="closePop">
                                <div style="display: block;text-align: center;"
                                    :class="this.$route.path == '/Pricing' ? 'active_menu' : 'menu'" @click="goPricing">{{
                                        $t('Pricing') }}</div>
                            </div>
                            <div style="text-align: center;" @click="goBlog" class="menu">{{ $t('Blog') }}</div>
                            <el-button style="margin:0 auto ;backdrop-filter: blur(15px);background: transparent;"
                                class="menu" slot="reference">
                                <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20" width="30" height="30">
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"></path>
                                </svg> -->
                                <img src="~/assets/images/menu.png" alt="">
                            </el-button>
                        </el-popover>
                    </div>
                    <div class="lang" @click="changeLang">
                        <img src="~/assets/images/lang.png" alt="" srcset="">
                    </div>
                    <div class="contact_button" @click="dialogFormVisible = true">{{ $t('ContactUs') }}</div>

                </div>
            </div>
            <div class="topInfo" v-show="showInfo"><div class="info" @click="goInfo">重磅：OpenCSG获国信中数、联想创投数千万元投资</div><i @click="showInfo=flase" class="closeBtn el-icon-close"></i></div>
        </div>

        <nuxt />
        <div class="footer">
            <!-- <div class="contactBox">
                <div class="contact">
                    <div>Ready to Get Started?</div>
                    <div class="button">Contact Us</div>
                </div>
            </div> -->
            <div class="content">
                <div class="erwei"><img src="~/assets/images/erwei.png" alt=""></div>
                <div class="pb24">{{ $t('WeChatNo') }}</div>
                <!-- <div class="pb100">contact@opencsg.com</div> -->
            </div>
            <div class="gs">
                Copyright © 2023 {{ $t('OpenCSG') }} | <a href="http://beian.miit.gov.cn/" target="_blank">
                    京ICP备2023006263号-1 | </a>
                <img src="~/assets/gongan.png" class="logo" alt="" />
                <a target="_blank" rel="noopener"
                    href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11011202004415">京公网安备
                    11011202004415号</a>

            </div>
        </div>
        <ContactUS :dialogFormVisible="dialogFormVisible" @closeDialog="closeDialog" />
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
            showInfo:true,
            popshow: false,
            dialogFormVisible: false,
            menu: [{ name: '我们', path: '/' }, { name: '模型', path: '/Models' }, { name: '应用', path: '/MarketPlace' }, { name: '方案', path: '/Scheme' }, { name: '培训', path: '/Train' }, { name: '价格', path: '/Pricing' },]
        }
    },
    mounted() {
        console.log(this.$i18n.locale);
        var lang = navigator.language || navigator.userLanguage;//常规浏览器语言和IE浏览器
        lang = lang.substr(0, 2);//截取lang前2位字符
        if (lang == 'zh') {
            this.$i18n.locale = 'zh';
        } else {
            this.$i18n.locale = 'en'
        }

    },
    beforeRouteEnter(to, from, next) {
        console.log(to);
        console.log(from);
    },
    methods: {
        closePop() {
            this.popshow = false;
        },
        closeDialog() {
            this.dialogFormVisible = false;
        },
        changeLang() {
            if (this.$i18n.locale == 'zh') {
                this.$i18n.locale = 'en'
            } else {
                this.$i18n.locale = 'zh'
            }

        },
        goBlog() {
            window.location.href = 'https://opencsg.com/blog/'
        },
        goScheme() {
            window.location.href = 'https://opencsg.com/Scheme/'
        },
        goTrain() {
            window.location.href = 'https://opencsg.com/Train/'
        },
        goMarketPlace() {
            window.location.href = 'https://opencsg.com/MarketPlace/'
        },
        goModels() {
            window.location.href = 'https://opencsg.com/Models/'
        },
        goPricing() {
            window.location.href = 'https://opencsg.com/Pricing/'
        },
        goInfo(){
            window.location.href = 'https://opencsg.com/blog/news/8/'
        }
    }

}
</script>
<style lang="scss" scoped>
.topInfo {
    background: #FF0000;
    color:#FFFFFF;
    cursor: pointer;
    width: 100%;
    padding: 5px 16px;
    margin: 0;
    font-size: 16px;
     @media(max-width:1000px) {
        font-size: 13px;
    }
    font-weight: bold;
    box-sizing: border-box;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity .2s;
    .info{
        width: 90%;
        text-align: center;
    }
}
.closeBtn{
    position: absolute;
    padding: 20px;
    right: 0px;
    z-index: 999;
}
.contact_button {
    white-space: nowrap;
}

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

        @media(max-width:1000px) {
            img {
                width: 80px;
                height: 24px;
            }
        }
    }

    .menuBox {
        display: flex;
        margin-left: 8rem;
    }

    .menu,
    .active_menu {
        margin-right: 3.2rem;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        cursor: pointer;
    }

    .menu:hover {
        color: #1a8b7b;

    }

    .lang {
        // margin-right: 2rem;
        cursor: pointer;
        margin: 0 2rem;

        @media(max-width:1000px) {
            img {
                width: 24px;
                height: 24px;
            }
        }
    }

    .buttonBox {
        display: flex;
        align-items: center;
    }
}

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
            padding: 0 7.5rem;
        }

        .contact {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 3.7rem 4rem 3.7rem 6rem;

            @media(max-width:1000px) {
                padding: 2.2rem;
                text-align: center;
                font-size: 12px;
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
                top: -6.5rem;
                border-radius: 10px;
            }

            .button {
                font-size: 24px;
                background: #FFFFFF;
                padding: 2.7rem 9.3rem;

                @media(max-width:1000px) {
                    padding: 0.5rem 1rem;
                    text-align: center;
                    font-size: 12px;
                    border-radius: 10px;


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

    @media(max-width:1000px) {
        font-size: 12px;
    }

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

    @media(max-width:1000px) {
        font-size: 12px;
    }

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
}
</style>
  