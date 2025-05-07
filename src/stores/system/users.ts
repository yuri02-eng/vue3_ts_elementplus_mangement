import {defineStore} from 'pinia'
import axios from 'axios'
import useLoginStore from "@/stores/login";

const usersStore = defineStore('users', {
    state: () => ({
        roles: [],
        departments: []
    }),
    actions: {
        async getRoles() {
            const {data} = await axios.get('/api/roles')
            if (data.code === 200) {
                this.roles = data.data

            }
        },
        async getDepartments() {
            const {data} = await axios.get('/api/departments')
            if (data.code === 200) {
                this.departments = data.data
            }
        }
    }
})
export default usersStore




