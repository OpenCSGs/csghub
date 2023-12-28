import "trix"
import "@rails/actiontext"

// Vue config
import { createApp } from "vue/dist/vue.esm-bundler.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import Navbar from "./components/about/Navbar.vue"
import Hero from "./components/about/Hero.vue"
import Feature from "./components/about/Feature.vue"
import Team from "./components/about/Team.vue"
import Joinus from "./components/about/Joinus.vue"
import Foot from "./components/about/Footer.vue"

const app2 = createApp({
    components: {
        Navbar,
        Hero,
        Feature,
        Team,
        Joinus,
        Foot
    }
}).use(ElementPlus);

// register Element UI Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app2.component(key, component)
}
app2.mount("#app2")
