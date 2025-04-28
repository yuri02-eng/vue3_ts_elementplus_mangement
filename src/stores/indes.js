import {createRouter, createWebHistory} from "vue-router"
import Login from "@/components/Login.vue"
import Applayout from "@/layouts/Applayout.vue";
import useLoginStore from "@/stores/login.js";

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
            path: "/home",
            component: Applayout,
            name: "main",
            children: [
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
                },
            ]
        },
        {
            path: "/",
            redirect: "/home"
        }
    ]
})


router.beforeEach((to, from, next) => {
    // console.log('[路由守卫] 触发导航守卫', {
    //     from: from.path,
    //     to: to.path,
    //     fullPath: to.fullPath
    // })

    if (to.path === "/login") {
        // console.log('[路由守卫] 目标路径是登录页，直接放行')
        next()
    } else {
        // console.log('[路由守卫] 目标路径需要验证权限:', to.path)

        const token = localStorage.getItem("token")
        // // console.log('[路由守卫] 检查本地token:', token ? '存在' : '不存在', {
        //     token: token ? `${token.substring(0, 6)}...` : null // 部分显示防止泄露
        // })

        if (token) {
            const loginStore = useLoginStore();
            if (!loginStore.isRoutesLoaded) {
                loginStore.loadLocalCacheAction(router);
                loginStore.isRoutesLoaded = true;
                next({ ...to, replace: true });
            } else {
                next();
            }
        } else {
            // console.warn('[路由守卫] 无有效token，重定向到登录页', {
            //     attemptedPath: to.path
            // })
            next("/login")
        }
    }
})
export default router