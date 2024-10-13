import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

// 对传入参数进行扩展，可以在创建实例的时候传入拦截器，此时的拦截器是局部的而不是全局的
interface MYRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: {
    requestSuccessFn?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
    requestFailureFn?: (err: any) => any
    responseSuccessFn?: (res: T) => T
    responseFailureFn?: (err: any) => any
  }
}

class MYRequest {
  instance: AxiosInstance

  //   instance=>axios
  constructor(config: MYRequestConfig) {
    this.instance = axios.create(config)

    // 每一个instance实例都添加拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log('拦截成功，全局')
        const token = localStorage.getItem('access_token') as string
        if (token) {
          config.headers!.Authorization = 'Bearer ' + token
        }
        return config
      },
      (err) => {
        console.log('拦截失败，全局')
        throw err
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        console.log('响应成功，全局')
        return response
      },
      (err) => {
        console.log('响应失败，全局')
        throw err
      }
    )

    // 针对特定的实例添加拦截器（局部），局部拦截器与全局拦截器不会冲突
    if (config.interceptors) {
      this.instance.interceptors.request.use(
        config.interceptors.requestSuccessFn,
        config.interceptors.requestFailureFn
      )

      this.instance.interceptors.response.use(
        config.interceptors.responseSuccessFn,
        config.interceptors.responseFailureFn
      )
    }
  }

  // 封装网络请求
  request<T = any>(config: MYRequestConfig<T>) {
    // 单次请求拦截器
    if (config.interceptors?.requestSuccessFn) {
      config = config.interceptors.requestSuccessFn(config as InternalAxiosRequestConfig)
    }
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单次响应
          if (config.interceptors?.responseSuccessFn) {
            res = config.interceptors.responseSuccessFn(res)
          }

          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // get
  get<T = any>(config: MYRequestConfig<T>) {
    return this.request({
      ...config,
      method: 'get'
    })
  }

  // post
  post<T = any>(config: MYRequestConfig<T>) {
    return this.request({ ...config, method: 'post' })
  }

  // delete
  delete<T = any>(config: MYRequestConfig<T>) {
    return this.request({ ...config, method: 'delete' })
  }

  // patch
  patch<T = any>(config: MYRequestConfig<T>) {
    return this.request({ ...config, method: 'patch' })
  }
}

export default MYRequest

// 两个难点
// 1.拦截器
// --->全局拦截器、实例拦截器、单次请求拦截器
// 2.响应结果数据处理（泛型）
