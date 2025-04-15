See [vue-router](https://router.vuejs.org/zh/guide/)
以下是一份更加详细的 Vue Router 使用文档，涵盖了从基础到高级使用场景，并提供了丰富的代码示例和最佳实践建议。

# Vue Router 详细使用文档

## 1. 简介

Vue Router 是 Vue.js 官方的路由管理器，用于构建单页面应用（SPA）。它允许开发者通过定义路由规则来管理页面的导航和组件的切换。Vue Router 提供了强大的功能，包括动态路由、嵌套路由、导航守卫、路由懒加载等，帮助开发者构建复杂的前端应用。

## 2. 安装与配置

### 2.1 通过 npm 安装

```bash
npm install vue-router@4
```

### 2.2 在项目中引入

```javascript
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [] // 路由配置
});

// 挂载路由到 Vue 应用
const app = createApp(App);
app.use(router);
app.mount('#app');
```

## 3. 基本用法

### 3.1 定义路由规则

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import About from './views/About.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});
```

### 3.2 在模板中使用路由链接

```html
<template>
  <div>
    <!-- 使用 router-link 创建导航链接 -->
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link>
    </nav>

    <!-- 路由匹配的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
</template>
```

## 4. 动态路由

动态路由允许路由路径中包含动态参数，这些参数可以在组件中通过 `$route.params` 获取。

### 4.1 定义动态路由

```javascript
const routes = [
  { path: '/user/:id', component: User }
];
```

### 4.2 在组件中获取动态参数

```javascript
export default {
  computed: {
    userId() {
      return this.$route.params.id;
    }
  }
}
```

## 5. 嵌套路由

嵌套路由允许在一个路由下定义子路由，子路由的组件会渲染在父路由组件的 `<router-view>` 中。

### 5.1 定义嵌套路由

```javascript
const routes = [
  {
    path: '/user',
    component: User,
    children: [
      { path: 'profile', component: Profile },
      { path: 'settings', component: Settings }
    ]
  }
];
```

### 5.2 在父组件中使用 `<router-view>`

```html
<template>
  <div>
    <h1>用户页面</h1>
    <router-view></router-view>
  </div>
</template>
```

## 6. 导航守卫

导航守卫是 Vue Router 提供的一种机制，用于在导航过程中执行逻辑，比如权限验证、加载进度条等。

### 6.1 全局前置守卫

```javascript
router.beforeEach((to, from, next) => {
  console.log('导航到:', to.path);
  // 执行逻辑，比如权限验证
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});
```

### 6.2 组件内守卫

```javascript
export default {
  beforeRouteEnter(to, from, next) {
    console.log('进入组件');
    next();
  },
  beforeRouteUpdate(to, from, next) {
    console.log('更新组件');
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log('离开组件');
    next();
  }
}
```

## 7. 路由懒加载

懒加载允许路由组件在首次访问时才加载，从而提高应用的初始加载速度。

### 7.1 实现路由懒加载

```javascript
const routes = [
  {
    path: '/home',
    component: () => import('./views/Home.vue')
  }
];
```

## 8. 命名路由和导航

命名路由允许通过路由名称而不是路径进行导航，这在动态路径或复杂路由中非常有用。

### 8.1 定义命名路由

```javascript
const routes = [
  { path: '/home', name: 'home', component: Home }
];
```

### 8.2 在模板中使用命名路由

```html
<router-link :to="{ name: 'home' }">首页</router-link>
```

### 8.3 在代码中导航

```javascript
this.$router.push({ name: 'home' });
```

## 9. 路由元信息

路由元信息允许为路由定义额外的属性，这些属性可以在导航守卫或组件中使用。

### 9.1 定义路由元信息

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true }
  }
];
```

### 9.2 在导航守卫中使用元信息

```javascript
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});
```

## 10. 路由参数和查询

### 10.1 动态参数

```javascript
const routes = [
  { path: '/user/:id', component: User }
];
```

在组件中获取参数：

```javascript
this.$route.params.id
```

### 10.2 查询参数

在模板中：

```html
<router-link :to="{ path: '/search', query: { q: 'vue' }}">搜索</router-link>
```

在组件中获取查询参数：

```javascript
this.$route.query.q
```

## 11. 路由滚动行为

路由滚动行为允许控制在导航时页面的滚动位置。

### 11.1 配置滚动行为

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 返回顶部
    return { top: 0 };
  }
});
```

## 12. 路由模式

Vue Router 支持两种模式：HTML5 历史模式和哈希模式。

### 12.1 HTML5 历史模式

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes
});
```

### 12.2 哈希模式

```javascript
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
```

## 13. 路由缓存

Vue Router 提供了 `<keep-alive>` 组件，用于缓存路由组件，避免重复渲染。

```html
<template>
  <div>
    <router-link to="/">首页</router-link>
    <router-link to="/about">关于</router-link>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
```

## 14. 路由状态管理

在复杂的单页面应用中，路由状态管理是一个重要的环节。可以结合 Vuex 或 Pinia 来管理路由相关的状态。

### 14.1 使用 Vuex 管理路由状态

```javascript
import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      isAuthenticated: false
    };
  },
  mutations: {
    SET_AUTHENTICATED(state, value) {
      state.isAuthenticated = value;
    }
  }
});
```

在导航守卫中使用 Vuex 状态：

```javascript
import store from './store';

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});
```

## 15. 常见问题和最佳实践

### 15.1 路由懒加载的最佳实践

- 使用 Webpack 的代码分割功能
- 为每个路由组件单独懒加载
- 避免在路由配置中直接导入组件

### 15.2 路由性能优化

- 减少路由嵌套的深度
- 使用路由缓存（`<keep-alive>`）
- 避免过多的动态路由

### 15.3 路由错误处理

- 捕获路由导航错误
- 定义 404 页面
- 使用全局错误处理

```javascript
router.onError((error) => {
  console.error('路由错误:', error);
});
```

## 16. 参考资源

- [Vue Router 官方文档](https://router.vuejs.org/)
- [Vue.js 官方文档](https://vuejs.org/)
- [Vuex 官方文档](https://vuex.vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)

希望这份详细的 Vue Router 使用文档能帮助你更好地理解和应用 Vue Router。如果需要更深入的学习，可以参考 Vue Router 的官方文档和相关资源。

## 17. 多级导航（个人使用经验）
在 Vue Router 中，多级导航是指在一个路由中嵌套另一个路由，形成多个级别的导航结构。这在构建复杂的单页面应用时非常有用。下面是如何在 Vue Router 中实现多级导航的步骤：
## 1. 安装 Vue Router
在开始之前，确保你已经安装了 Vue Router。如果还没有安装，可以使用 npm 或 yarn 进行安装：
```bash
npm install vue-router
```
或者
```bash
yarn add vue-router
```
## 2. 创建路由配置
在项目中创建一个路由配置文件，例如 `router/index.js`，并在其中定义你的路由。以下是一个简单的多级导航示例：
这里的children就是子路由，子路由的页面组件User下的页面进行路由。
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import User from '../views/User.vue'
import UserProfile from '../views/UserProfile.vue'
import UserPosts from '../views/UserPosts.vue'
import NotFound from '../views/NotFound.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        path: 'profile',
        component: UserProfile
      },
      {
        path: 'posts',
        component: UserPosts
      }
    ]
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
export default router
```
在这个示例中，我们定义了四个路由：Home、About、User 和 NotFound。User 路由有一个子路由，分别是 UserProfile 和 UserPosts。当访问 `/user/:id/profile` 时，会渲染 UserProfile 组件；当访问 `/user/:id/posts` 时，会渲染 UserPosts 组件。
## 3. 在 Vue 应用中使用路由
在 Vue 应用中使用路由，需要在 `main.js` 文件中导入路由配置，并将其传递给 Vue 实例：
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
createApp(App).use(router).mount('#app')
```
## 4. 在模板中使用路由链接和视图
在 Vue 组件的模板中，可以使用 `<router-link>` 组件来创建导航链接，使用 `<router-view>` 组件来渲染当前路由对应的组件：
```html
<template>
  <div>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link :to="{ name: 'User', params: { id: 1 }}">User</router-link>
    <router-view></router-view>
  </div>
</template>
```
在这个示例中，我们创建了三个导航链接：Home、About 和 User。当点击 User 链接时，会导航到 `/user/:id` 路由，并渲染 User 组件。在 User 组件中，可以使用 `<router-view>` 组件来渲染子路由对应的组件。
## 5. 在子路由中使用导航链接
在子路由中，可以使用 `<router-link>` 组件来创建导航链接，使用 `<router-view>` 组件来渲染当前路由对应的组件：
子路由的页面在父路由页面的下面。类似一个树状的连接关系。
```html
<template>
  <div>
    <h1>User</h1>
    <router-link :to="{ name: 'UserProfile', params: { id: $route.params.id }}">Profile</router-link>
    <router-link :to="{ name: 'UserPosts', params: { id: $route.params.id }}">Posts</router-link>
    <router-view></router-view>
  </div>
</template>
```
在这个示例中，我们创建了两个导航链接：Profile 和 Posts。当点击 Profile 链接时，会导航到 `/user/:id/profile` 路由，并渲染 UserProfile 组件；当点击 Posts 链接时，会导航到 `/user/:id/posts` 路由，并渲染 UserPosts 组件。
## 6. 总结
通过以上步骤，你可以在 Vue Router 中实现多级导航。在路由配置中，使用 `children` 属性来定义子路由，在模板中使用 `<router-link>` 和 `<router-view>` 组件来创建导航链接和渲染组件。希望这个示例能帮助你更好地理解 Vue Router 的多级导航功能。
# Vue Router 使用文档
