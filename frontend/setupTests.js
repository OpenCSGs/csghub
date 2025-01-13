import { config } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import CsgButton from '@/components/shared/CsgButton.vue';

config.global.plugins = [ElementPlus];

config.global.components = {
  CsgButton,
};
