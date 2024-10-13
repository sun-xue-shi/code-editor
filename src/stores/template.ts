/**
 * 模版数据
 */

import myRequest from '@/axios'
import { type templateInfo } from '@/types/template'
import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTemplateStore = defineStore(
  'template',
  () => {
    const templateList = ref<Record<string, any>[]>([])

    //存储模版信息
    const setTemplate = (template: templateInfo[]) => {
      templateList.value = template
    }

    //清除模版信息
    const removeTemplate = () => {
      templateList.value = [] as templateInfo[]
    }

    const currentTemplateId = ref('')

    async function getWorkList() {
      try {
        await myRequest
          .get({
            url: 'work/work-list',
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
          .then((res) => {
            templateList.value = res.data.data.list
          })
      } catch (error: any) {
        message.error(error)
      }
    }



    return {
      setTemplate,
      removeTemplate,
      getWorkList,
      templateList,
      currentTemplateId,
    }
  },

  // pinia定制化
  {
    persist: {
      key: 'template',
      paths: ['template']
    }
  }
)
