export function postPageListData(pageName:string,queryInfo:any) {
    return request.post(`/api/${pageName}/List`,queryInfo)
}