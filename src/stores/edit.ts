/**
 * 模版数据
 */

import { v4 } from 'uuid'
import type { EditorData, CompData } from '@/types/edit.'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const testData: CompData[] = [
  {
    id: v4(),
    name: 'div',
    props: {
      text: 'test',
      fontSize: '10px',
      color: 'red',
      actionType: 'url',
      url: 'https://www.weibo.com'
    }
  },
  {
    id: v4(),
    name: 'div',
    props: { text: 'test1', fontSize: '20px', actionType: 'url', url: 'https://www.baidu.com' }
  },
  {
    id: v4(),
    name: 'div',
    props: {
      text: 'test2',
      fontSize: '40px',
      actionType: 'url',
      url: 'https://www.baidu.com',
      backgroundColor: 'red'
    }
  }
]

export const useEditStore = defineStore(
  'edit',
  () => {
    const editInfo = ref<EditorData>({ components: testData, currentElement: '' })

    //存储模版信息
    const setEditInfo = (template: EditorData) => {
      editInfo.value = template
    }

    //清除模版信息
    const removeEditInfo = () => {
      editInfo.value = {} as EditorData
    }

    const addEditInfo = (props: Record<string, any>) => {
      const newData: CompData = {
        id: v4(),
        name: 'div',
        props
      }
      editInfo.value.components.push(newData)
    }

    return { editInfo, setEditInfo, removeEditInfo, addEditInfo }
  },
  // pinia定制化
  {
    persist: {
      key: 'edit',
      paths: ['edit']
    }
  }
)
