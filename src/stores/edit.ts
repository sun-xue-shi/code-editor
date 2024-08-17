/**
 * 模版数据
 */

import { v4 } from 'uuid'
import type { EditorData, CompData } from '@/types/edit.'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const testData: CompData[] = [
  { id: v4(), name: 'zl-text', props: { text: 'test' } },
  { id: v4(), name: 'zl-text2', props: { text: 'test1' } },
  { id: v4(), name: 'zl-text3', props: { text: 'test2' } }
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
