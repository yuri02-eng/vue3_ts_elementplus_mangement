import './assets/main.css'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router   from "@/stores/indes.js";
import { createPinia } from 'pinia'
try {
    const app = createApp(App)
    app.use(ElementPlus)
    app.use(router)
    app.use(createPinia())
    app.mount('#app')
} catch (error) {
    console.error('Failed to initialize the application:', error)
}