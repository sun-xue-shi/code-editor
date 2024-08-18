/**
 * 模版数据
 */

import { v4 } from 'uuid'
import type { EditorData, CompData } from '@/types/edit.'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const testData: CompData[] = [
  { id: v4(), name: 'div', props: { text: 'test', fontSize: '10px' } },
  { id: v4(), name: 'div', props: { text: 'test1', fontSize: '20px' } },
  { id: v4(), name: 'div', props: { text: 'test2', fontSize: '40px' } }
]

export const useEditStore = defineStore(
  'edit',
  () => {
    const editInfo = ref<EditorData>({ components: testData, currentElement: '' })

    //存储模版信息
    const setTemplate = (template: EditorData) => {
      editInfo.value = template
    }

    //清除模版信息
    const removeTemplate = () => {
      editInfo.value = {} as EditorData
    }

    return { editInfo, setTemplate, removeTemplate }
  },
  // pinia定制化
  {
    persist: {
      key: 'edit',
      paths: ['edit']
    }
  }
)
