/**
 * 模版数据
 */
import { v4 } from 'uuid'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type ComponentData } from 'editor-components-sw'
import type { EditorData, UpdateData } from '@/types/edit.'
import type { AllComponentProps } from '@/types/props'
import { message } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { pageDefaultData, testData } from './common/constants'
import { addHistory, debounceAddUpdateHistory, updateHistory } from './common/func'

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
      copyComponent: null,
      history: [],
      historyIndex: -1,
      debounceOldData: null,
      maxRecordLength: 5
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
      componentData.layerName = '图层' + (editInfo.value.components.length + 1)
      editInfo.value.components.push(componentData)
      addHistory(editInfo.value, {
        id: v4(),
        componentId: componentData.id,
        data: cloneDeep(componentData),
        type: 'add'
      })
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

    function moveComponent(direction: string, updatedata: UpdateData) {
      const { id, value } = updatedata
      const currentComponent = editInfo.value.components.find(
        (component: ComponentData) => component.id === (id || editInfo.value.currentElement)
      )

      if (currentComponent) {
        const preTop = parseInt(currentComponent.props.top)
        const preLeft = parseInt(currentComponent.props.left)

        switch (direction) {
          case 'up':
            {
              const distance = preTop - parseInt(value as string) + 'px'
              updateComponent({ id, key: 'top', value: distance })
            }

            break
          case 'down':
            {
              const distance = preTop + parseInt(value as string) + 'px'
              updateComponent({ id, key: 'top', value: distance })
            }

            break
          case 'left':
            {
              const distance = preLeft - parseInt(value as string) + 'px'
              updateComponent({ id, key: 'left', value: distance })
            }

            break
          case 'right':
            {
              const distance = preLeft + parseInt(value as string) + 'px'
              updateComponent({ id, key: 'left', value: distance })
            }

            break

          default:
            break
        }
      }
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
        else if (!value && key === 'src') {
          const preData = updateComponent.props[key as keyof AllComponentProps]
          const deleteCompIndex = editInfo.value.components.findIndex(
            (component: ComponentData) => component.id === updateComponent.id
          )

          editInfo.value.components.splice(deleteCompIndex, 1)
          editInfo.value.history.push({
            id: v4(),
            type: 'update',
            componentId: id || updateComponent.id,
            data: { key, preData, newData: value }
          })
        } else {
          const preData = Array.isArray(key)
            ? key.map((item) => updateComponent.props[item])
            : updateComponent.props[key as keyof AllComponentProps]

          if (!editInfo.value.debounceOldData) {
            editInfo.value.debounceOldData = preData
          }

          const addHistoryData = {
            id,
            newData: value,
            key
          }

          debounceAddUpdateHistory(editInfo.value, addHistoryData)

          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((item, index) => {
              updateComponent.props[item] = value[index]
            })
          } else {
            updateComponent.props[key as keyof AllComponentProps] = value
          }
        }
      }
    }

    function updatePage(updateData: UpdateData) {
      const { key, value } = updateData
      editInfo.value.pageData.props[key as keyof AllComponentProps] = value as string
    }

    function copyComponent(id: string) {
      const copyComponent = editInfo.value.components.find(
        (component: ComponentData) => component.id === (id || editInfo.value.currentElement)
      )
      if (copyComponent) {
        editInfo.value.copyComponent = cloneDeep(copyComponent)
        message.success('当前图层复制成功！')
      }
    }

    function pasteComponent() {
      if (editInfo.value.copyComponent) {
        const cloneComponent = cloneDeep(editInfo.value.copyComponent)
        cloneComponent.id = v4()
        cloneComponent.layerName = '(副本)图层' + (editInfo.value.components.length + 1)
        editInfo.value.components.push(cloneComponent)

        addHistory(editInfo.value, {
          id: v4(),
          componentId: cloneComponent.id,
          data: cloneDeep(cloneComponent),
          type: 'add'
        })

        message.success('已粘贴复制图层')
      } else {
        message.warn('当前未复制图层!')
      }
    }

    function deleteComponent(id: string) {
      const currentComponent = editInfo.value.components.find(
        (component: ComponentData) => component.id === id
      )

      const deleteCompIndex = editInfo.value.components.findIndex(
        (component: ComponentData) => component.id === id
      )

      if (deleteCompIndex !== -1) {
        addHistory(editInfo.value, {
          id: v4(),
          componentId: currentComponent.id,
          type: 'delete',
          index: deleteCompIndex,
          data: currentComponent
        })

        editInfo.value.components.splice(deleteCompIndex, 1)
        message.success('已删除选中图层')
      }
    }

    //撤销
    function toLastStep() {
      if (editInfo.value.historyIndex === -1) {
        editInfo.value.historyIndex = editInfo.value.history.length - 1
      } else {
        editInfo.value.historyIndex--
      }

      const history = editInfo.value.history[editInfo.value.historyIndex]

      if (history.type) {
        switch (history.type) {
          case 'add':
            editInfo.value.components = editInfo.value.components.filter(
              (component: ComponentData) => component.id !== history.componentId
            )

            break

          case 'delete':
            editInfo.value.components.splice(history.index, 0, history.data)
            break

          case 'update':
            updateHistory(history, editInfo.value.components, 'undo')
            break

          default:
            break
        }
      }
    }

    //重做
    function toNextStep() {
      // 从没撤销过
      if (editInfo.value.historyIndex === -1) {
        return
      }

      const history = editInfo.value.history[editInfo.value.historyIndex]

      switch (history.type) {
        case 'add':
          editInfo.value.components.push(history.data)
          break
        case 'delete':
          editInfo.value.components = editInfo.value.components.filter(
            (component: ComponentData) => component.id !== history.componentId
          )
          break
        case 'update':
          updateHistory(history, editInfo.value.components, 'redo')
          break
        default:
          break
      }
      editInfo.value.historyIndex++
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
      deleteComponent,
      moveComponent,
      toLastStep,
      toNextStep
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
