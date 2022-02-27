const BASE_URL = "http://123.207.32.32:9001"
const LOGIN_BASE_URL = "http://123.207.32.32:3000"
const token = wx.getStorageSync('token')
class YuanRequest {
  constructor(baseURL,baseHeader = {}) {
    this.baseURL = baseURL
    this.baseHeader = baseHeader 
  }
  request(url, method, params,isAuton=false,header={}) {
    const finalHeader = isAuton? { ...this.baseHeader, ...header }: header
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + url,
        method: method,
        header:finalHeader,
        data: params,
        success: function(res) {
          resolve(res.data)
        },
        fail: function(err){
          reject(err)
        }
      })
    })
  }

  get(url, params,isAuton=false,header) {
    return this.request(url, "GET", params,isAuton=false,header)
  }

  post(url, data,isAuton=false,header) {
    return this.request(url, "POST", data,isAuton=false,header)
  }
}

const YUANRequest = new YuanRequest(BASE_URL)
export const YUANLoginRequest = new YuanRequest(LOGIN_BASE_URL,{
  token
})
export default YUANRequest