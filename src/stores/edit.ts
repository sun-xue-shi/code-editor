/**
 * 模版数据
 */
import { v4 } from 'uuid'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type ComponentData, textDefaultProps } from 'editor-components-sw'
import type { EditorData } from '@/types/edit.'
import type { AllComponentProps } from '@/types/props'
import { message } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'

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
      width: '100px',
      height: '100px',
      lineHeight: '1',
      boxSizing: 'border-box',
      position: 'absolute',
      textAlign: 'left',
      top: '10px',
      left: '10px',
      backgroundColor: '#efefef'
    }
  }
  // {
  //   id: v4(),
  //   name: 'text-comp',
  //   layerName: '图层2',
  //   isHidden: false,
  //   isLocked: false,
  //   props: {
  //     ...textDefaultProps,
  //     text: 'test1',
  //     fontSize: '20px',
  //     // actionType: 'url',
  //     // url: 'https://www.baidu.com',
  //     tag: 'div',
  //     width: '50px',
  //     height: '20px',
  //     position: ''
  //   }
  // },
  // {
  //   id: v4(),
  //   name: 'text-comp',
  //   layerName: '图层3',
  //   isHidden: true,
  //   isLocked: true,
  //   props: {
  //     ...textDefaultProps,
  //     text: 'test2',
  //     color: 'blue',
  //     tag: 'div',
  //     width: '50px',
  //     height: '20px',
  //     position: ''
  //   }
  // }
]

const pageDefaultData = {
  backgroundColor: '#fff',
  backgroundImage: '',
  height: '560px',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
}

interface UpdateData {
  key: string
  id?: string
  value: string
  isRoot?: boolean
  isPage?: boolean
}

export const useEditStore = defineStore(
  'edit',
  () => {
    const editInfo = ref<EditorData>({
      components: testData,
      currentElement: '',
      pageData: {
        props: pageDefaultData,
        title: 'test'
      },
      copyComponent: null
    })

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

    function setActive(currentId: string) {
      editInfo.value.currentElement = currentId
    }

    function getCurrentElement() {
      const comp = editInfo.value.components.find(
        (component: ComponentData) => component.id === editInfo.value.currentElement
      )
      return comp
    }

    function updateComponent(updateData: UpdateData) {
      const { id, isRoot, key, value } = updateData

      const updateComponent = editInfo.value.components.find(
        (component: ComponentData) => component.id === (id || editInfo.value.currentElement)
      )

      if (updateComponent) {
        if (isRoot) {
          updateComponent[key as keyof ComponentData] = value
        }
        //传入更新的value为空 --- 删除画布区图片
        else if (!updateData.value && updateData.key === 'src') {
          const deleteCompIndex = editInfo.value.components.findIndex(
            (component: ComponentData) => component.id === updateComponent.id
          )

          editInfo.value.components.splice(deleteCompIndex, 1)
        } else {
          updateComponent.props[key as keyof AllComponentProps] = value
        }
      }
    }

    function updatePage(updateData: UpdateData) {
      const { key, value } = updateData
      editInfo.value.pageData.props[key as keyof AllComponentProps] = value
    }

    function copyComponent(id: string) {
      const copyComponent = editInfo.value.components.find(
        (component: ComponentData) => component.id === (id || editInfo.value.currentElement)
      )
      if (copyComponent) {
        console.log('copyComponent', copyComponent)
        editInfo.value.copyComponent = copyComponent
        message.success('当前图层复制成功！')
      }
    }

    function pasteComponent() {
      if (editInfo.value.copyComponent) {
        const cloneComponent = cloneDeep(editInfo.value.copyComponent)
        cloneComponent.id = v4()
        cloneComponent.layerName = '默认图层(副本)'
        editInfo.value.components.push(cloneComponent)
        message.success('已粘贴复制图层')
      } else {
        message.warn('当前未复制图层!')
      }
    }

    function deleteComponent(id: string) {
      const deleteCompIndex = editInfo.value.components.findIndex(
        (component: ComponentData) => component.id === id
      )

      if (deleteCompIndex !== -1) {
        editInfo.value.components.splice(deleteCompIndex, 1)
        message.success('已删除选中图层')
      }
    }

    return {
      editInfo,
      setEditInfo,
      removeEditInfo,
      addEditInfo,
      setActive,
      getCurrentElement,
      updateComponent,
      updatePage,
      copyComponent,
      pasteComponent,
      deleteComponent
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
