// stores/userStore.ts
import { defineStore } from 'pinia'

// userStore.js
export const useUserStore = defineStore('user', {
    state: () => ({
        name: 'Alice',
        age: 25,
    }),
    actions: {
        // 同步修改
        updateName(newName) {
            this.name = newName; // 通过 this 访问状态
        },
        // 异步修改（如调用 API）
        async fetchUser() {
            try {
                const response = await fetch('/api/user');
                const data = await response.json();
                // 更新状态
                this.name = data.name;
                this.age = data.age;
            } catch (error) {
                console.error('Fetch failed:', error);
            }
        }
    }
});