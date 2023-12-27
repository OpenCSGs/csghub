import "trix"
import "@rails/actiontext"

// Vue config
import { createApp } from "vue/dist/vue.esm-bundler.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import Navbar from "./about/components/home/Navbar.vue"
import Hero from "./about/components/home/Hero.vue"
import Feature from "./about/components/home/Feature.vue"
import Team from "./about/components/home/Team.vue"
import Joinus from "./about/components/home/Joinus.vue"
import Foot from "./about/components/home/Footer.vue"

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
