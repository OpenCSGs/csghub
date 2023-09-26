import { createApp } from "vue/dist/vue.esm-bundler.js"
import Navbar from "./navbar.vue"

const app = createApp({
  data() {  
    return {  
      sayHi: 'Intro to Vue 3 and Rails'  
    }  
  } 
});

app.component('Navbar', Navbar)  

app.mount("#navbar")
