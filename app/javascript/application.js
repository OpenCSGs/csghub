// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "./controllers"

//import "./components"
//import "./components/navbar_app.js"

import { createApp } from "vue/dist/vue.esm-bundler.js"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Navbar from "./components/navbar.vue"
import Course from "./components/course.vue"

const appNavbar = createApp({
  components: {
    Navbar
  },
  data() {  
    return { }
  } 
}).use(ElementPlus);
appNavbar.mount("#navbar")

const appCourse = createApp({
  data() {  
    return {  }  
  } 
}).use(ElementPlus);
appCourse.component('Course', Course)  
appCourse.mount("#course")