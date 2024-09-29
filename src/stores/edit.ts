/**
 * 模版数据
 */
import { v4 } from 'uuid'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { type ComponentData, textDefaultProps } from 'editor-components-sw'
import type { EditorData, HistoryData, UpdateData, UpdateHistoryData } from '@/types/edit.'
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

function updateHistory(history: HistoryData, components: ComponentData[], type: 'undo' | 'redo') {
  const { data, componentId } = history
  const { newData, key, preData } = data
  const updateComponent = components.find(
    (component: ComponentData) => component.id === componentId
  )

  if (updateComponent) {
    const data = type === 'redo' ? newData : preData
    if (Array.isArray(key) && Array.isArray(newData)) {
      key.map((item, index) => (updateComponent.props[item] = data[index]))
    } else {
      updateComponent.props[key] = data
    }
  }
}

function addHistory(editInfo: EditorData, historyData: HistoryData) {
  if (editInfo.historyIndex !== -1) {
    editInfo.history = editInfo.history.splice(0, editInfo.historyIndex)
    editInfo.historyIndex = -1
  }

  if (editInfo.history.length >= editInfo.maxRecordLength) {
    editInfo.history.shift()
    editInfo.history.push(historyData)
  } else {
    editInfo.history.push(historyData)
  }
}

function addUpdateHistory(editInfo: EditorData, updateHistoryData: UpdateHistoryData) {
  console.log('editInfo.debounceOldData', editInfo.debounceOldData)

  const { id, key, newData } = updateHistoryData

  addHistory(editInfo, {
    id: v4(),
    type: 'update',
    componentId: id || editInfo.currentElement,
    data: { key, preData: editInfo.debounceOldData, newData }
  })
  // editInfo.history.push()
  editInfo.debounceOldData = null
}

function debounce(cb: (...args: any) => void, timeout = 1000) {
  let timer = 0
  return (...args: any) => {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      cb(...args)
    }, timeout)
  }
}

const debounceAddUpdateHistory = debounce(addUpdateHistory)

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
      // editInfo.value.history.push({
      //   id: v4(),
      //   componentId: componentData.id,
      //   data: cloneDeep(componentData),
      //   type: 'add'
      // })
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

      console.log('updateComponent', updateComponent)

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
          console.log('更新后历史记录', editInfo.value.history)
        } else {
          const preData = Array.isArray(key)
            ? key.map((item) => updateComponent.props[item])
            : updateComponent.props[key as keyof AllComponentProps]

          if (!editInfo.value.debounceOldData) {
            editInfo.value.debounceOldData = preData
          }

          console.log('preData', preData)

          // editInfo.value.history.push({
          //   id: v4(),
          //   type: 'update',
          //   componentId: id || updateComponent.id,
          //   data: { key, preData, newData: value }
          // })

          const addHistoryData = {
            id,
            newData: value,
            key
          }

          debounceAddUpdateHistory(editInfo.value, addHistoryData)

          console.log('更新后历史记录', editInfo.value.history)

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
        editInfo.value.history.push({
          id: v4(),
          componentId: cloneComponent.id,
          data: cloneDeep(cloneComponent),
          type: 'add'
        })
        console.log('粘贴添加后历史记录', editInfo.value.history)
        console.log('粘贴添加后组件列表', editInfo.value.components)
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
        // editInfo.value.history.push()
        console.log('删除后历史记录', editInfo.value.history)

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
            console.log('撤销 add --- add', history.componentId)
            console.log('撤销前editInfo.value.components', editInfo.value.components)
            editInfo.value.components = editInfo.value.components.filter(
              (component: ComponentData) => component.id !== history.componentId
            )
            console.log('撤销后editInfo.value.components', editInfo.value.components)

            break

          case 'delete':
            console.log('撤销 delete --- delete', history.index, history.data)
            editInfo.value.components.splice(history.index, 0, history.data)
            break

          case 'update':
            // {
            //   console.log('撤销 update --- update', history.data.key, history.data.preData)

            //   const { data, componentId } = history
            //   const { preData, key } = data
            //   const updateComponent = editInfo.value.components.find(
            //     (component: ComponentData) => component.id === componentId
            //   )

            //   if (updateComponent) {
            //     if (Array.isArray(preData) && Array.isArray(key)) {
            //       key.map((item, index) => (updateComponent.props[item] = preData[index]))
            //     } else {
            //       updateComponent.props[key] = preData
            //     }
            //   }
            // }
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
          console.log('重做 add --- add', history.data)

          editInfo.value.components.push(history.data)
          break
        case 'delete':
          console.log('重做 delete --- delete', history.componentId)
          editInfo.value.components = editInfo.value.components.filter(
            (component: ComponentData) => component.id !== history.componentId
          )
          break
        case 'update':
          // {
          //   const { data, componentId } = history
          //   const { newData, key, preData } = data
          //   const updateComponent = editInfo.value.components.find(
          //     (component: ComponentData) => component.id === componentId
          //   )

          //   if (updateComponent) {
          //     if (Array.isArray(key) && Array.isArray(newData)) {
          //       key.map((item, index) => (updateComponent.props[item] = newData[index]))
          //     } else {
          //       updateComponent.props[key] = newData
          //     }
          //   }
          // }
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
