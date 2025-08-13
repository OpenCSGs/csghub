import { config } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import CsgButton from '@/components/shared/CsgButton.vue';
import SvgIcon from '@/components/shared/SvgIcon.vue';
import FlashMessage from '@/components/shared/FlashMessage.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia'
import en from '@/locales/en.js'
import zh from '@/locales/zh.js'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import '@/assets/stylesheets/element-plus/_variables.css'
import '@/assets/stylesheets/markdown.css'
import '@/style.css'

const pinia = createPinia();
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en,
        zh
    }
});

config.global.components = {
    SvgIcon,
    CsgButton,
    FlashMessage,
    ...ElementPlusIconsVue
};

config.global.plugins = [
    [ElementPlus, {
        locale: zhCn,
    }],
    i18n,
    pinia
];

window.DEFAULT_TAGS = []
window.CSGHUB_SERVER = 'http://localhost:8080'

config.global.provide = {
    defaultTags: DEFAULT_TAGS,
    csghubServer: CSGHUB_SERVER,
    nameRule: /^(?=.{2,64}$)(?!.*[-_.]{2})[a-zA-Z][a-zA-Z0-9_.-]*[a-zA-Z0-9]+$/
};

// Mock window.location
const mockLocation = {
    href: '',
    search: ''
};

Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true
});

// 添加 ResizeObserver 的模拟实现
class ResizeObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver