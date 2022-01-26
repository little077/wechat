// pages/detail-search/index.js
import {getHotSearch,searchReasult} from "../../service/api-search"
import {antiskake} from '../../utils/search'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hotSearch:[],
        suggestsearch:[],
        searchValue:"",
        songsresult:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        getHotSearch().then(res=>{
            this.setData({hotSearch:res.result.hots})
        })
     
        
    },
    search(e){
       this.setData({searchValue:e.detail})
       if(!e.detail.length) return 
        antiskake(200,e.detail,this)
       
    },
    // 回车时搜索逻辑
    bandleSearchAction(){
        const {searchValue} = this.data
        searchReasult(searchValue).then(res=>{
            this.setData({songsresult:res.result.songs})
        })
    },
    //点击搜索item时搜索逻辑
    getSearchValue(e){
        const index= e.currentTarget.dataset.item
        this.setData({searchValue:this.data.suggestsearch[index].keyword})
        searchReasult(this.data.suggestsearch[index].keyword).then(res=>{
            this.setData({songsresult:res.result.songs,suggestsearch:[]})
        })
    },
    //点击推荐时的逻辑
    hotsearch(e){
     const index = e.target.dataset.item
     this.setData({searchValue:this.data.hotSearch[index].first})
     searchReasult(this.data.hotSearch[index].first).then(res=>{
        this.setData({songsresult:res.result.songs})
    })
    },
    //清空结果的bug修复
    clearSongsResult(){
        this.setData({songsresult:[]})
    }
})