import { createApp } from "vue/dist/vue.esm-bundler.js"
import TDesign from 'tdesign-vue-next';
import Course from "./course.vue"

import 'tdesign-vue-next/es/style/index.css'

const app = createApp({
  data() {  
    return {  
      sayHi: 'Intro to Vue 3 and Rails'  
    }  
  } 
}).use(TDesign);

app.component('Course', Course)  

app.mount("#app")
