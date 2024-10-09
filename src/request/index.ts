// index.ts
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import { refreshToken } from './user'
import { useMainStore } from '@/stores/main'

type Result<T> = {
  code: number
  message: string
  result: T
}

let refreshing = false
const queue: { config: any; resolve: (value: unknown) => void }[] = []

const mainStore = useMainStore()

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // axios 实例
  instance: AxiosInstance
  // 基础配置，url和超时时间
  baseConfig: AxiosRequestConfig = { baseURL: 'http://localhost:3000/', timeout: 5000 }

  constructor(config: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    this.instance.interceptors.request.use(
      (config: any) => {
        mainStore.isMainLoading = true
        // 一般会请求拦截里面加token，用于后端的验证
        const token = localStorage.getItem('accessToken') as string
        if (token) {
          config.headers!.Authorization = 'Bearer ' + token
        }

        return config
      },
      (err: any) => {
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(err)
      }
    )

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // 直接返回res，当然你也可以只返回res.data
        // 系统如果有自定义code也可以在这里处理
        mainStore.isMainLoading = false
        return res.data
      },
      async (error: any) => {
        mainStore.isMainLoading = false
        const { data, config } = error.response

        if (refreshing && !config.url.includes('/user/refresh')) {
          return new Promise((resolve) => {
            queue.push({
              config,
              resolve
            })
          })
        }

        if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
          let res: any

          refreshing = true

          try {
            res = await refreshToken()
          } catch (error) {
  
          } finally {
            refreshing = false
          }

          if (res && res.code === 200) {
      

            queue.forEach(({ config, resolve }) => {
              resolve(this.instance(config))
            })
        

            return this.instance(config)
          } else {
            message.error('登录已过期,请重新登录')
            setTimeout(() => {
              window.location.href = '/login'
            }, 1500)
          }
        } else {
          message.error(error.response.data.message)

          return Promise.reject(error.response)
        }
      }
    )
  }

  // 定义请求方法
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config)
  }

  public get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.get(url, config)
  }

  public post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.post(url, data, config)
  }

  public put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.put(url, data, config)
  }

  public patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.patch(url, data, config)
  }

  public delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.delete(url, config)
  }
}

// 默认导出Request实例
export default new Request({})
