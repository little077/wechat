import {getSuggestSearch} from "../service/api-search"
let timer = null

export function antiskake(time=300,name,_this){
   clearInterval(timer)
    timer =  setTimeout(()=>{
        getSuggestSearch(name).then(res=>{
            _this.setData({suggestsearch:res.result.allMatch})
        })
    },time)
}