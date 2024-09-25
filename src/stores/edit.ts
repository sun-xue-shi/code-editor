/**
 * 模版数据
 */
import { v4 } from 'uuid'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type ComponentData, textDefaultProps } from 'editor-components-sw'
import type { EditorData } from '@/types/edit.'
import type { AllComponentProps } from '@/types/props'

const testData: ComponentData[] = [
  {
    id: v4(),
    name: 'text-comp',
    isHidden: true,
    isLocked: false,
    layerName: '图层1',
    props: {
      ...textDefaultProps,
      text: 'test',
      fontSize: '10px',
      color: '#000000',
      width: '50px',
      height: '20px',
      position: ''
    }
  },
  {
    id: v4(),
    name: 'text-comp',
    layerName: '图层2',
    isHidden: false,
    isLocked: false,
    props: {
      ...textDefaultProps,
      text: 'test1',
      fontSize: '20px',
      // actionType: 'url',
      // url: 'https://www.baidu.com',
      tag: 'div',
      width: '50px',
      height: '20px',
      position: ''
    }
  },
  {
    id: v4(),
    name: 'text-comp',
    layerName: '图层3',
    isHidden: true,
    isLocked: true,
    props: {
      ...textDefaultProps,
      text: 'test2',
      color: 'blue',
      tag: 'div',
      width: '50px',
      height: '20px',
      position: ''
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
