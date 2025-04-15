import { createRouter, createWebHistory } from "vue-router"
import Login from "@/components/Login.vue"
import Applayout from "@/layouts/Applayout.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // 独立登录页（无侧边栏）
        {
            path: "/login",
            component: Login
        },
        // 主布局路由（包含侧边栏）
        {
            path: "/",
            component: Applayout,
            children: [
                {
                    path: "",
                    redirect: "home"
                },
                {
                    path: "home",
                    component: () => import("@/components/router/home.vue")
                },
                {
                    path: "project",
                    component: () => import("@/components/router/project.vue")
                },
                {
                    path: "product",
                    component: () => import("@/components/router/product.vue")
                },
                {
                    path: "classes",
                    component: () => import("@/components/router/classes.vue")
                }
            ]
        }
    ]
})

export default router