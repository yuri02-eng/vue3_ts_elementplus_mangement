// stores/userStore.ts
import {defineStore} from 'pinia'
import postPageListData from './service'
// userStore.js
export const useUserStore = defineStore('user', {
        state: () => ({
            List: [],
            totol: 0,
        }),
        actions: {
            // 同步修改
            async getList(pageName:string,quertInfo:any) {
            const pageResult=await postPageListData(pageName,quertInfo)
                if(pageResult.code===200){
                    this.List=pageResult.data.list
                    console.log(this.List)
                }
            }
        }
    })
;
export default userStore