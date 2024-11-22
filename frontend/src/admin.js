import { createApp, h } from "vue";
import { createI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { ROUTERS } from "./components/admin_next/router";

import "element-plus/dist/index.css";
import "./assets/stylesheets/element-plus/_variables.css";
import "./assets/stylesheets/markdown.css";
import "./style.css";
import { createWebHistory, createRouter } from "vue-router";

import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "./locales/en.js";
import zh from "./locales/zh.js";

import SvgIcon from "./components/shared/SvgIcon.vue";
// import FlashMessage from "./components/shared/FlashMessage.vue";

import AdminLayout from "./components/admin_next/admin_component/Layout.vue";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  messages: {
    en,
    zh,
  },
});

const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(),
  routes: ROUTERS,
});

const app = createApp(AdminLayout);
// register Element UI Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.component("SvgIcon", SvgIcon);
// app.component("FlashMessage", FlashMessage);

app.provide("defaultTags", DEFAULT_TAGS);
app.provide("csghubServer", CSGHUB_SERVER);
app.provide("onPremise", ON_PREMISE || false);
app.provide(
  "nameRule",
  /^(?=.{2,64}$)(?!.*[-_.]{2})[a-zA-Z][a-zA-Z0-9_.-]*[a-zA-Z0-9]+$/
);

app.use(ElementPlus, {
  locale: zhCn,
});
app.use(i18n);
app.use(pinia);
app.use(router);

app.mount("#admin");
