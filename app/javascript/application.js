// rails turbo and stimulus js
import "@hotwired/turbo-rails"
import "./controllers"

// Vue config
import { createApp } from "vue/dist/vue.esm-bundler.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import Navbar from "./components/navbar.vue"
import Course from "./components/course.vue"

const appNavbar = createApp({
  components: {
    Navbar,
    Course
  }
}).use(ElementPlus);

// register Element UI Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  appNavbar.component(key, component)
}

appNavbar.mount("#app")