# Pinia 使用教程文档

## 1. 概述

### 1.1 什么是 Pinia?
Pinia 是 Vue.js 的下一代状态管理库，由 Vue 核心团队维护。它具有以下核心特性：
• 完整的 TypeScript 支持
• 去除了 mutations 的概念，简化 API
• 支持 Composition API 和 Options API
• 模块化架构，天然支持代码拆分
• 开发工具集成（Vue DevTools）
• 轻量级（约 1KB）

### 1.2 与 Vuex 对比
| 特性                | Pinia          | Vuex 4+       |
|---------------------|----------------|---------------|
| API 复杂度          | 更简洁         | 较复杂        |
| 类型推断            | 完整支持       | 部分支持      |
| Composition API     | 原生支持       | 需要适配      |
| 模块热更新          | 支持           | 有限支持      |
| 包体积              | ~1KB           | ~10KB         |

## 2. 安装与配置

### 2.1 安装
```bash
# 使用 npm
npm install pinia

# 使用 yarn
yarn add pinia

# 使用 pnpm
pnpm add pinia
```

### 2.2 基本配置
```javascript
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

## 3. 核心概念

### 3.1 定义 Store
```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    lastChange: null
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    formattedCount() {
      return `Current count: ${this.count}`
    }
  },
  actions: {
    increment() {
      this.count++
      this.lastChange = new Date().toISOString()
    },
    async fetchData() {
      const res = await fetch('/api/data')
      // 更新 state...
    }
  }
})
```

### 3.2 使用 Store
```vue
<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

// 访问 state
console.log(counter.count) 

// 使用 getter
console.log(counter.doubleCount)

// 调用 action
counter.increment()

// 重置 store
counter.$reset()

// 订阅变化
counter.$subscribe((mutation, state) => {
  console.log('State changed:', mutation.type)
})
</script>
```

## 4. 高级用法

### 4.1 模块化开发
推荐目录结构：
```
src/
  stores/
    index.js       # 聚合所有 store
    user.js        # 用户相关状态
    products.js    # 商品模块
    cart.js        # 购物车模块
```

模块间通信示例：
```javascript
// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false
  })
})

// stores/cart.js
export const useCartStore = defineStore('cart', {
  actions: {
    checkout() {
      const user = useUserStore()
      if (!user.isLoggedIn) {
        return this.redirectToLogin()
      }
      // 结账逻辑...
    }
  }
})
```

### 4.2 组合式 API
```javascript
// stores/search.js
export const useSearchStore = defineStore('search', () => {
  const query = ref('')
  const results = ref([])
  const isLoading = ref(false)

  async function search() {
    isLoading.value = true
    try {
      results.value = await fetchResults(query.value)
    } finally {
      isLoading.value = false
    }
  }

  return { query, results, isLoading, search }
})
```

### 4.3 插件开发
持久化存储插件示例：
```javascript
const persistPlugin = ({ store }) => {
  const key = `pinia-${store.$id}`
  
  // 从 localStorage 恢复状态
  const savedState = localStorage.getItem(key)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }

  // 订阅变化保存状态
  store.$subscribe((mutation, state) => {
    localStorage.setItem(key, JSON.stringify(state))
  })
}

// 使用插件
const pinia = createPinia()
pinia.use(persistPlugin)
```

## 5. TypeScript 集成
类型化 Store 示例：
```typescript
interface UserState {
  id: string | null
  name: string
  email: string
  preferences: {
    theme: 'light' | 'dark'
    locale: string
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: null,
    name: '',
    email: '',
    preferences: {
      theme: 'light',
      locale: 'en-US'
    }
  }),
  actions: {
    async updatePreferences(newPrefs: Partial<UserState['preferences']>) {
      this.preferences = { ...this.preferences, ...newPrefs }
    }
  }
})

// 组件中使用
const userStore = useUserStore()
userStore.updatePreferences({ theme: 'dark' }) // 类型检查生效
```

## 6. 最佳实践

1. **状态结构设计**
   • 保持扁平化结构
   • 避免嵌套过深
   • 对大型数据集使用 normalize

2. **性能优化**
   • 避免在 getters 中进行复杂计算
   • 使用 `store.$patch` 进行批量更新
   • 对大型列表使用虚拟滚动

3. **测试策略**
```javascript
// 测试示例
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '@/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('increment action', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })
})
```

## 7. 常见问题

### 7.1 响应式丢失问题
```javascript
// 错误方式
const { count } = store // 失去响应性

// 正确方式
import { storeToRefs } from 'pinia'
const { count } = storeToRefs(store)
```

### 7.2 循环依赖处理
当 Store A 依赖 Store B，同时 Store B 也依赖 Store A 时：
```javascript
// 在 actions/getters 内部动态获取
export const useStoreA = defineStore('A', {
  actions: {
    someAction() {
      const storeB = useStoreB()
      // 使用 storeB...
    }
  }
})
```

## 8. 调试工具

1. 安装 Vue DevTools
2. 在开发者工具中查看 Pinia 标签页
3. 支持的功能：
   • 状态快照查看
   • 时间旅行调试
   • Action 追踪
   • 状态热更新

## 9. 生态系统

• [pinia-plugin-persist](https://github.com/Seb-L/pinia-plugin-persist) - 持久化存储
• [pinia-orm](https://github.com/CodeDredd/pinia-orm) - 数据模型管理
• [pinia-shared-state](https://github.com/wobsoriano/pinia-shared-state) - 跨标签页状态同步

## 10. 升级指南

从 Vuex 迁移建议步骤：
1. 保留 Vuex 作为子模块
2. 新功能使用 Pinia 开发
3. 逐步迁移现有模块
4. 使用兼容层处理共享状态

## 附录：官方资源

• [Pinia 官方文档](https://pinia.vuejs.org/)
• [迁移指南](https://pinia.vuejs.org/cookbook/migration-vuex.html)
• [示例项目](https://github.com/posva/pinia/tree/v2/packages/example-vue-3)

---

本教程持续更新，建议结合官方文档和项目实践进行深入使用。遇到问题时，可通过 Pinia 的 GitHub Issues 或 Vue 社区获取支持。



# 高级教程如下
# Pinia 高级教程
Pinia 是 Vue 3 的官方状态管理库，提供了一种更简洁、更灵活的方式来管理应用状态。本教程将深入探讨 Pinia 的高级用法，包括模块化开发、组合式 API、插件开发、TypeScript 集成、最佳实践和调试工具。
# Pinia 使用教程文档

## 1. 概述

### 1.1 什么是 Pinia?
Pinia 是 Vue.js 的下一代状态管理库，由 Vue 核心团队维护。它具有以下核心特性：
• 完整的 TypeScript 支持
• 去除了 mutations 的概念，简化 API
• 支持 Composition API 和 Options API
• 模块化架构，天然支持代码拆分
• 开发工具集成（Vue DevTools）
• 轻量级（约 1KB）

### 1.2 与 Vuex 对比
| 特性                | Pinia          | Vuex 4+       |
|---------------------|----------------|---------------|
| API 复杂度          | 更简洁         | 较复杂        |
| 类型推断            | 完整支持       | 部分支持      |
| Composition API     | 原生支持       | 需要适配      |
| 模块热更新          | 支持           | 有限支持      |
| 包体积              | ~1KB           | ~10KB         |

## 2. 安装与配置

### 2.1 安装
```bash
# 使用 npm
npm install pinia

# 使用 yarn
yarn add pinia

# 使用 pnpm
pnpm add pinia
```

### 2.2 基本配置
```javascript
// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

## 3. 核心概念

### 3.1 定义 Store
```javascript
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    lastChange: null
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    formattedCount() {
      return `Current count: ${this.count}`
    }
  },
  actions: {
    increment() {
      this.count++
      this.lastChange = new Date().toISOString()
    },
    async fetchData() {
      const res = await fetch('/api/data')
      // 更新 state...
    }
  }
})
```

### 3.2 使用 Store
```vue
<script setup>
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

// 访问 state
console.log(counter.count) 

// 使用 getter
console.log(counter.doubleCount)

// 调用 action
counter.increment()

// 重置 store
counter.$reset()

// 订阅变化
counter.$subscribe((mutation, state) => {
  console.log('State changed:', mutation.type)
})
</script>
```

## 4. 高级用法

### 4.1 模块化开发
推荐目录结构：
```
src/
  stores/
    index.js       # 聚合所有 store
    user.js        # 用户相关状态
    products.js    # 商品模块
    cart.js        # 购物车模块
```

模块间通信示例：
```javascript
// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false
  })
})

// stores/cart.js
export const useCartStore = defineStore('cart', {
  actions: {
    checkout() {
      const user = useUserStore()
      if (!user.isLoggedIn) {
        return this.redirectToLogin()
      }
      // 结账逻辑...
    }
  }
})
```

### 4.2 组合式 API
```javascript
// stores/search.js
export const useSearchStore = defineStore('search', () => {
  const query = ref('')
  const results = ref([])
  const isLoading = ref(false)

  async function search() {
    isLoading.value = true
    try {
      results.value = await fetchResults(query.value)
    } finally {
      isLoading.value = false
    }
  }

  return { query, results, isLoading, search }
})
```

### 4.3 插件开发
持久化存储插件示例：
```javascript
const persistPlugin = ({ store }) => {
  const key = `pinia-${store.$id}`
  
  // 从 localStorage 恢复状态
  const savedState = localStorage.getItem(key)
  if (savedState) {
    store.$patch(JSON.parse(savedState))
  }

  // 订阅变化保存状态
  store.$subscribe((mutation, state) => {
    localStorage.setItem(key, JSON.stringify(state))
  })
}

// 使用插件
const pinia = createPinia()
pinia.use(persistPlugin)
```

## 5. TypeScript 集成
类型化 Store 示例：
```typescript
interface UserState {
  id: string | null
  name: string
  email: string
  preferences: {
    theme: 'light' | 'dark'
    locale: string
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: null,
    name: '',
    email: '',
    preferences: {
      theme: 'light',
      locale: 'en-US'
    }
  }),
  actions: {
    async updatePreferences(newPrefs: Partial<UserState['preferences']>) {
      this.preferences = { ...this.preferences, ...newPrefs }
    }
  }
})

// 组件中使用
const userStore = useUserStore()
userStore.updatePreferences({ theme: 'dark' }) // 类型检查生效
```

## 6. 最佳实践

1. **状态结构设计**
   • 保持扁平化结构
   • 避免嵌套过深
   • 对大型数据集使用 normalize

2. **性能优化**
   • 避免在 getters 中进行复杂计算
   • 使用 `store.$patch` 进行批量更新
   • 对大型列表使用虚拟滚动

3. **测试策略**
```javascript
// 测试示例
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '@/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('increment action', () => {
    const store = useCounterStore()
    store.increment()
    expect(store.count).toBe(1)
  })
})
```

## 7. 常见问题

### 7.1 响应式丢失问题
```javascript
// 错误方式
const { count } = store // 失去响应性

// 正确方式
import { storeToRefs } from 'pinia'
const { count } = storeToRefs(store)
```

### 7.2 循环依赖处理
当 Store A 依赖 Store B，同时 Store B 也依赖 Store A 时：
```javascript
// 在 actions/getters 内部动态获取
export const useStoreA = defineStore('A', {
  actions: {
    someAction() {
      const storeB = useStoreB()
      // 使用 storeB...
    }
  }
})
```

## 8. 调试工具

1. 安装 Vue DevTools
2. 在开发者工具中查看 Pinia 标签页
3. 支持的功能：
   • 状态快照查看
   • 时间旅行调试
   • Action 追踪
   • 状态热更新

## 9. 生态系统

• [pinia-plugin-persist](https://github.com/Seb-L/pinia-plugin-persist) - 持久化存储
• [pinia-orm](https://github.com/CodeDredd/pinia-orm) - 数据模型管理
• [pinia-shared-state](https://github.com/wobsoriano/pinia-shared-state) - 跨标签页状态同步

## 10. 升级指南

从 Vuex 迁移建议步骤：
1. 保留 Vuex 作为子模块
2. 新功能使用 Pinia 开发
3. 逐步迁移现有模块
4. 使用兼容层处理共享状态

## 附录：官方资源

• [Pinia 官方文档](https://pinia.vuejs.org/)
• [迁移指南](https://pinia.vuejs.org/cookbook/migration-vuex.html)
• [示例项目](https://github.com/posva/pinia/tree/v2/packages/example-vue-3)

---

本教程持续更新，建议结合官方文档和项目实践进行深入使用。遇到问题时，可通过 Pinia 的 GitHub Issues 或 Vue 社区获取支持。
