import './assets/main.css'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Applayout from './layouts/Applayout.vue'
import router   from "@/stores/indes.js";
try {
    const app = createApp(Applayout)
    
    app.use(ElementPlus)
    app.use(router)
    app.mount('#app')
} catch (error) {
    console.error('Failed to initialize the application:', error)
}