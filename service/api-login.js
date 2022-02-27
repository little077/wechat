import {YUANLoginRequest} from "./index"

export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: res => {
        const code = res.code
        resolve(code)
      },
      fail: err => {
        console.log(err)
        reject(err)
      }
    })
  })
}

export function codeToToken(code) {
  return YUANLoginRequest.post("/login", { code })
}

export function postFavorRequest(id) {
  return hyLoginRequest.post("/api/favor", { id }, true)
}

// export function checkToken() {
//   return YUANLoginRequest.post("/auth", {}, true)
// }
export function checkToken() {
  return YUANLoginRequest.post("/auth", {}, true)
}

export function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}
