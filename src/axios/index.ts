import MYRequest from './axios'
import { BASE_URL, TIME_OUT } from './config'
import type { AxiosRequestConfig } from 'axios'

interface PendingTask {
  config: AxiosRequestConfig
  resolve: Function
}

let refreshing = false

const queue: PendingTask[] = []

const request = new MYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT
})

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

      if (refreshing) {
        return new Promise((resolve) => {
          queue.push({
            config,
            resolve
          })
        })
      }

      if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
        refreshing = true

        let res: any
        try {
          res = await refreshToken()
        } catch (error) {
          console.log('error', error)
        }

        refreshing = false

        if (res.status === 200) {
          console.log('queue', queue)

          queue.forEach(({ config, resolve }) => {
            resolve(request.request(config))
          })
          console.log('config', config.url)

          return request.request(config)
        } else {
          setTimeout(() => {
            window.location.href = 'http://localhost:5173/#/login'
          }, 1000)
          throw data
        }
      } else {
        throw err.response.data
      }

      // if (!err.response) {
      //   return Promise.reject({ data: 'no response' })
      // } else {
      //   return Promise.reject(err.response.data)
      // }
    }
  }
})

async function refreshToken() {
  const res = await request.get({
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
