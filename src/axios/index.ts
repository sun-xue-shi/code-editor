// import { message } from 'ant-design-vue'
import MYRequest from './axios'
import { BASE_URL, TIME_OUT } from './config'
// import type { AxiosRequestConfig } from 'axios'

// interface PendingTask {
//   config: AxiosRequestConfig
//   resolve: Function
// }

let isRefreshing = false
let refreshPromisesQueue: any[] = []

const myRequest = new MYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  //拦截器里 在请求拦截器里取出token并带上
  interceptors: {
    // 局部网络请求
    requestSuccessFn: (config) => {
      const token = localStorage.getItem('access_token')
      if (config.headers && token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    responseSuccessFn(res) {
      return res
    },
    async responseFailureFn(err) {
      if (!err.response) {
        return Promise.reject(err)
      }

      const { data, config } = err.response

      if (isRefreshing) {
        // 如果已经有刷新 token 的请求在进行中，将当前请求加入队列
        return new Promise((resolve, reject) => {
          refreshPromisesQueue.push(() => {
            myRequest.request(config).then(resolve, reject)
          })
        })
      }

      if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
        isRefreshing = true

        try {
          const res = await refreshToken()
          if (res.status === 200) {
            const token = localStorage.getItem('access_token')

            // 更新所有队列中的请求的 Authorization 头
            await refreshPromisesQueue.map((promiseCallback) => promiseCallback())
            refreshPromisesQueue = [] // 清空队列
            isRefreshing = false

            // 重新发送当前请求
            config.headers!.Authorization = token
            return myRequest.request(config)
          } else {
            // 如果刷新 token 失败，重定向到登录页面
            setTimeout(() => {
              window.location.href = 'http://localhost:5173/#/login'
            }, 1000)
            throw data
          }
        } catch (error) {
          console.log('error', error)
          // 如果刷新 token 失败，重定向到登录页面
          setTimeout(() => {
            window.location.href = 'http://localhost:5173/#/login'
          }, 1000)
          throw error.response.data
        } finally {
          isRefreshing = false
          refreshPromisesQueue = [] // 确保队列被清空
        }
      } else {
        throw err.response.data
      }
    }
  }
})

async function refreshToken() {
  const res = await myRequest.get({
    url: '/user/refresh',
    params: {
      token: localStorage.getItem('refresh_token')
    },
    interceptors: {
      requestSuccessFn: (config) => {
        console.log('局部请求拦截成功')
        return config
      },
      requestFailureFn: (error) => {
        console.log('局部请求拦截失败')
        return Promise.reject(error)
      },
      responseSuccessFn: (response) => {
        console.log('局部响应拦截成功')
        return response
      },
      responseFailureFn: (error) => {
        console.log('局部响应拦截失败')
        return Promise.reject(error)
      }
    }
  })

  localStorage.setItem('access_token', res.data.data.accessToken || '')
  localStorage.setItem('refresh_token', res.data.data.refreshToken || '')

  return res
}

export default myRequest
