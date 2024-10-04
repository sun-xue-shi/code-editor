/**
 * 模版数据
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type templateInfo } from '@/types/template'

// const testData: templateInfo[] = [
//   { author: 'xx1', copiedCount: 6, coverImg: 'xxx2', id: 1, title: 'xx1' },
//   { author: 'xx2', copiedCount: 5, coverImg: 'xxx3', id: 14, title: 'xx2' },
//   { author: 'xx3', copiedCount: 1, coverImg: 'xxx5', id: 33, title: 'xx3' },
//   { author: 'xx4', copiedCount: 2, coverImg: 'xxx9', id: 4, title: 'xx4' },
//   { author: 'xx5', copiedCount: 7, coverImg: 'xxx1', id: 5, title: 'xx5' },
//   { author: 'xx6', copiedCount: 8, coverImg: 'xxx4', id: 6, title: 'xx6' },
//   { author: 'xx7', copiedCount: 3, coverImg: 'xxx5', id: 7, title: 'xx7' }
// ]

export const useTemplateStore = defineStore(
  'template',
  () => {
    const templateInfo = ref()

    //存储模版信息
    const setTemplate = (template: templateInfo[]) => {
      templateInfo.value = template
      console.log('templateInfo4', templateInfo.value)
    }

    //清除模版信息
    const removeTemplate = () => {
      templateInfo.value = [] as templateInfo[]
    }

    return { templateInfo, setTemplate, removeTemplate }
  },
  // pinia定制化
  {
    persist: {
      key: 'template',
      paths: ['template']
    }
  }
)
