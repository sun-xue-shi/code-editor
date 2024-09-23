/**
 * 模版数据
 */

import { v4 } from 'uuid'
import type { EditorData, CompData } from '@/types/edit.'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AllComponentProps, TextComponentProps } from '@/types/props'

const testData: CompData[] = [
  {
    id: v4(),
    name: 'text-comp',
    props: {
      text: 'test',
      fontSize: '10px',
      color: '#000000',
      tag: 'span'
    }
  },
  {
    id: v4(),
    name: 'text-comp',
    props: {
      text: 'test1',
      fontSize: '20px',
      actionType: 'url',
      url: 'https://www.baidu.com',
      tag: 'div'
    }
  },
  {
    id: v4(),
    name: 'text-comp',
    props: {
      text: 'test2',
      color: 'blue',
      tag: 'div'
    }
  },
  {
    id: v4(),
    name: 'image-comp',
    props: {
      src: 'https://imgs.699pic.com/images/500/618/976.jpg!seo.v1',
      width: '100px'
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

    const addEditInfo = (componentData: CompData) => {
      editInfo.value.components.push(componentData)
    }

    function setActive(editInfo: EditorData, currentId: string) {
      editInfo.currentElement = currentId
    }

    function getCurrentElement(editInfo1: EditorData) {
      const comp = editInfo1.components.find(
        (component) => component.id === editInfo1.currentElement
      )
      return comp
    }

    function updateComponent(editInfo2: EditorData, { key, value }) {
      const update = editInfo2.components.find(
        (component) => component.id === editInfo2.currentElement
      )
      if (update) {
        update.props[key as keyof AllComponentProps] = value
      }
    }

    return {
      editInfo,
      setEditInfo,
      removeEditInfo,
      addEditInfo,
      setActive,
      getCurrentElement,
      updateComponent
    }
  },
  // pinia定制化
  {
    persist: {
      key: 'edit',
      paths: ['edit']
    }
  }
)
