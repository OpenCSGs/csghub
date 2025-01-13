import { config } from '@vue/test-utils';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import CsgButton from './src/components/shared/CsgButton.vue';
import SvgIcon from './src/components/shared/SvgIcon.vue';

config.global.plugins = [ElementPlus];

config.global.components = {
  CsgButton,
  SvgIcon
};
