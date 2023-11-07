import "trix"
import "@rails/actiontext"

// Vue config
import { createApp } from "vue/dist/vue.esm-bundler.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import Navbar from "./components/TheNavbar.vue"
import SpaceIntro from "./components/SpaceIntro.vue"
import SpaceCard from "./components/SpaceCard.vue"
import SpaceCards from "./components/SpaceCards.vue"
import Foot from "./components/TheFooter.vue"
import CommentList from "./components/comment/CommentList.vue"
import ExpertCard from "./components/ExpertCard.vue"
import PartnerCard from "./components/PartnerCard.vue"
import DatasetCard from "./components/DatasetCard.vue"
import ModelCard from "./components/ModelCard.vue"
import NewpartnerForm from "./components/form/NewpartnerForm.vue"

app = createApp({
  components: {
    Navbar,
    SpaceIntro,
    SpaceCard,
    SpaceCards,
    CommentList,
    DatasetCard,
    ExpertCard,
    ModelCard,
    PartnerCard,
    NewpartnerForm,
    Foot,
  },
  provide:{
    defaultTags: DefaultTags
  }
}).use(ElementPlus);

// register Element UI Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount("#app")
