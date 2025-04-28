// src/stores/login.ts
import {defineStore} from 'pinia'
import axios from 'axios'
import {RouteRecord, RouteRecordRaw} from "vue-router";
import {useRouter} from 'vue-router';

interface IAccount {
    account: string,
    password: string,
}

// const BASE_URL = 'http://127.0.0.1:4523/m1/6284267-5978600-default'
const useLoginStore = defineStore('login', {
    state: () => ({
        isLogin: false,
        token: localStorage.getItem('token') || undefined,
        id: '',
        userInfo: JSON.parse(localStorage.getItem('userinfo')) ?? {},
        userMenus: JSON.parse(localStorage.getItem('usermenus')) ?? [],
    }),
    actions: {
        async accountLogin(account: IAccount) {
            try {
                const {data} = await axios.post('/api/login', account)
                if (data.code === 200) {
                    this.$patch((state) => {
                        this.isLogin = true
                        this.token = data.data.token
                        this.id = data.data.id
                        // 可在此处添加复杂逻辑
                    })
                    localStorage.setItem('token', data.data.token)
                    return true
                } else {
                    throw new Error(data.message)
                }
            } catch (error) {
                this.handleLoginError()
                throw error // 抛出错误供 UI 层处理
            }
        },
        handleLoginError() {
            this.$reset()
            localStorage.removeItem('token')
        },
        async getRole(id: number) {
            try {
                const {data} = await axios.get(`/api/users/${id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                if (data.code === 200) {
                    // console.log("存储的数据是"+JSON.stringify(data.data))
                    this.userInfo = data.data
                    localStorage.setItem('userinfo', JSON.stringify(data.data))
                    return true
                }
            } catch (e) {
            }
        },
        async getRoleMenusById(id: number) {
            // try {
            const {data} = await axios.get(`/api/role/${id}/menu`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            if (data.code === 200) {
                localStorage.setItem('usermenus', JSON.stringify(data.data))
                this.userMenus = data.data
                console.log("存储的数据是" + JSON.stringify(data.data))
                return true
            }
            // } catch (e) {
            //     console.log("for 循环出现异常")
            // }
        },
        loadLocalCacheAction(router: any) {
            const token = localStorage.getItem('token')
            const userinfo = localStorage.getItem('userinfo')
            const usermenus = localStorage.getItem('usermenus')
            if (token && userinfo && usermenus) {
                const localRoutes: RouteRecordRaw[] = []
                const files: Record<string, any> = import.meta.glob('@/router/**/*.ts', {
                    eager: true
                })
                for (const key in files) {
                    const module = files[key].default
                    localRoutes.push(module)
                }
                for (const menu of this.userMenus) {
                    let addRoute = false
                    for (const submenu of menu.children) {
                        const route = localRoutes.find((item) => item.path === submenu.path)
                        if (route) {
                            if (!addRoute) {
                                router.addRoute("main", {
                                    path: menu.path,
                                    redirect: submenu.path
                                })
                                addRoute = true
                            }
                            router.addRoute("main", route)
                        }
                    }
                }
            }
        }
    }
})

export default useLoginStore