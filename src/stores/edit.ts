/**
 * 模版数据
 */

import { v4 } from 'uuid'
import type { EditorData } from '@/types/edit.'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AllComponentProps } from '@/types/props'
import { type ComponentData } from 'editor-components-sw'

const testData: ComponentData[] = [
  {
    id: v4(),
    name: 'text-comp',
    isHidden: true,
    isLocked: false,
    layerName: '图层1',
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
    layerName: '图层2',
    isHidden: false,
    isLocked: false,
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
    layerName: '图层3',
    isHidden: true,
    isLocked: true,
    props: {
      text: 'test2',
      color: 'blue',
      tag: 'div'
    }
  },
  {
    id: v4(),
    name: 'image-comp',
    layerName: '图层4',
    isHidden: true,
    isLocked: false,
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

    const addEditInfo = (componentData: ComponentData) => {
      editInfo.value.components.push(componentData)
    }

    function setActive(editInfo: EditorData, currentId: string) {
      editInfo.currentElement = currentId
    }

    function getCurrentElement(editData: EditorData) {
      const comp = editData.components.find((component) => component.id === editData.currentElement)
      return comp
    }

    function updateComponent(editData: EditorData, { key, id, value, isRoot }) {
      const updateComponent = editData.components.find(
        (component) => component.id === (id || editData.currentElement)
      )

      if (updateComponent) {
        if (isRoot) {
          updateComponent[key as keyof ComponentData] = value
        } else {
          updateComponent.props[key as keyof AllComponentProps] = value
        }
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
