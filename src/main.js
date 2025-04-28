import './assets/main.css'
import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from "@/stores/indes.js";
import {createPinia} from 'pinia'
import registerIcons from '@/global/register.js'
import 'core-js/stable'; // 引入 core-js 全量 polyfill（可选，推荐依赖 Babel 自动注入）
import 'regenerator-runtime/runtime';
import useLoginStore from "@/stores/login.js"; // 支持 async/await
try {
    // 1. 初始化 Mock 服务
    if (import.meta.env.MODE === 'development') {
        const { worker } = await import('./mocks/browser')
        await worker.start()
    }

    // 2. 创建应用实例
    const app = createApp(App)
    const pinia = createPinia()

    // 3. 按正确顺序挂载插件
    app.use(router)
        .use(pinia)
        .use(ElementPlus)
        .use(registerIcons)

    // 4. 挂载应用
    app.mount('#app')

} catch (error) {
    console.error('Failed to initialize the application:', error)
}