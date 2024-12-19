import { config } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import CsgButton from '@/components/shared/CsgButton.vue';  
import SvgIcon from '@/components/shared/SvgIcon.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia'
import en from '@/locales/en.js'
import zh from '@/locales/zh.js'

const pinia = createPinia();
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en,
        zh
    }
});

config.global.plugins = [ElementPlus, i18n, pinia];

// register global components
config.global.components = {
    SvgIcon,
    CsgButton,
    ...ElementPlusIconsVue
};

// gllbal mock

// Mock window.location
const mockLocation = {
    href: '',
    search: ''
};

Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true
});