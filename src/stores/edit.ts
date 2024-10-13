/**
 * 模版数据
 */

import { v4 } from 'uuid'
import type {
  EditorData,
  CompData,
  PageProps,
  MoveType,
  UpdateComponentsType,
  HistoryProps
} from '@/types/edit.'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AllComponentProps, PageData } from '@/types/props'
import textDefaultProps from 'editor-components-sw'
import { message } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { insertAt } from '@/utils/helper'
import myRequest from '@/axios'

const testData: CompData[] = [
  {
    id: v4(),
    name: 'text-comp',
    isHidden: true,
    isLocked: false,
    layerName: '图层1',
    props: {
      ...textDefaultProps,
      text: 'test',
      fontSize: '18px',
      color: '#000000',
      tag: 'span',
      height: '100px',
      width: '100px',
      lineHeight: '1',
      boxSizing: 'content-box',
      position: 'absolute',
      textAlign: 'left',
      top: '10px',
      left: '10px',
      backgroundColor: '#efefef'
    }
  }
]

const pageDefaultProps = {
  backgroundColor: '',
  backgroundImage: '',
  height: '',
  backgroundSize: '',
  backgroundRepeat: ''
}

export const useEditStore = defineStore(
  'edit',
  () => {
    const editInfo = ref<EditorData>({
      components: [],
      currentElement: '',
      page: {
        props: pageDefaultProps,
        coverImg: '',
        desc: '',
        id: '',
        title: ''
      },
      histories: [],
      historyIndex: -1,
      cacheOldValue: null,
      maxHistoryNumber: 5,
      isNeedSave: false
    })

    //存储模版信息
    const setEditInfo = (template: EditorData) => {
      editInfo.value = template
    }

    //清除模版信息
    const removeEditInfo = () => {
      editInfo.value = {} as EditorData
    }

    const addEditInfo = (componentData: CompData) => {
      editInfo.value.isNeedSave = true
      componentData.layerName = '图层' + (editInfo.value.components.length + 1)
      editInfo.value.components.push(componentData)
      pushHistory(editInfo.value, {
        id: v4(),
        currentElId: componentData.id,
        type: 'add',
        data: cloneDeep(componentData)
      })
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

    function debounceChange(callback: (...arg: any) => void, timeout = 1000) {
      let timer = 0
      return (...arg: any) => {
        clearTimeout(timer)
        timer = window.setTimeout(() => {
          callback(...arg)
        }, timeout)
      }
    }

    function pushMotifyHistory(
      editValue: EditorData,
      { key, value, id }: UpdateComponentsType,
      oldValue: any
    ) {
      pushHistory(editValue, {
        id: v4(),
        currentElId: id || editValue.currentElement,
        type: 'modify',
        data: {
          oldValue: editValue.cacheOldValue,
          newValue: value,
          key
        }
      })
      editValue.cacheOldValue = null
    }

    const pushHistoryDebounce = debounceChange(pushMotifyHistory)
    function pushHistory(editValue: EditorData, historyRecord: HistoryProps) {
      if (editValue.historyIndex !== -1) {
        editValue.histories = editValue.histories.slice(0, editValue.historyIndex)
        editValue.historyIndex = -1
      }
      if (editValue.maxHistoryNumber > editValue.histories.length) {
        editValue.histories.push(historyRecord)
      } else {
        editValue.histories.shift()
        editValue.histories.push(historyRecord)
      }
    }

    function updateComponent(
      editInfo2: EditorData,
      { key, value, id, isRoot }: UpdateComponentsType
    ) {
      const update = editInfo2.components.find(
        (component) => component.id === (id || editInfo2.currentElement)
      )
      if (update) {
        editInfo.value.isNeedSave = true

        if (isRoot) {
          ;(update as any)[key as string] = value
        } else if (!value && key === 'src') {
          const preData = update.props[key as keyof AllComponentProps]
          editInfo.value.components = editInfo.value.components.filter(
            (comp) => comp.id !== update.id
          )
          pushHistory(editInfo.value, {
            id: v4(),
            currentElId: update.id,
            type: 'modify',
            data: { preData, key, newValue: value }
          })
        } else {
          const oldValue = Array.isArray(key)
            ? key.map((key) => update.props[key])
            : update.props[key]
          if (!editInfo2.cacheOldValue) {
            editInfo2.cacheOldValue = oldValue
          }
          pushHistoryDebounce(editInfo2, { key, value, id }, oldValue)
          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach((keyName, index) => {
              update.props[keyName] = value[index]
            })
          } else if (typeof key === 'string' && typeof value === 'string') {
            update.props[key] = value
          }
        }
      }
    }

    function updatePage(editInfo3: EditorData, { key, value, isRoot = false }) {
      editInfo.value.isNeedSave = true
      if (isRoot) {
        editInfo3.page[key as keyof PageData] = value
      } else {
        editInfo3.page.props[key as keyof PageProps] = value
      }
    }

    function copyComponent(editValue: EditorData, id: string) {
      const comp = editValue.components.find(
        (component) => component.id === (id || editValue.currentElement)
      )
      if (comp) {
        editInfo.value.copyComponent = comp
        message.success('已拷贝当前图层', 1)
      }
    }

    function pasteCopyComponnet(editValue: EditorData) {
      if (editValue.copyComponent) {
        const clone = cloneDeep(editValue.copyComponent)
        clone.id = v4()
        clone.layerName = clone.layerName + '副本'
        editValue.components.push(clone)
        pushHistory(editValue, {
          id: v4(),
          currentElId: clone.id,
          type: 'add',
          data: cloneDeep(clone)
        })
        editInfo.value.isNeedSave = true
        message.success('粘贴成功', 1)
      }
    }

    function deleteComponet(editValue: EditorData, id: string) {
      const comp = editValue.components.find(
        (component) => component.id === (id || editValue.currentElement)
      )
      if (comp) {
        const currentIndex = editValue.components.findIndex((comp) => {
          comp.id === id
        })
        editInfo.value.isNeedSave = true
        editValue.components = editValue.components.filter((comp) => comp.id !== id)
        pushHistory(editValue, {
          id: v4(),
          currentElId: comp.id,
          type: 'delete',
          data: comp,
          index: currentIndex
        })
        message.success('删除成功', 1)
      }
    }

    function moveComponent(editValue: EditorData, data: MoveType) {
      const currentElement = editValue.components.find(
        (component) => component.id === (data.id || editValue.currentElement)
      )

      if (currentElement) {
        const oldTop = parseInt(currentElement.props.top || '0')
        const oldLeft = parseInt(currentElement.props.left || '0')
        const { direction, amount } = data

        switch (direction) {
          case 'Up': {
            const newTop = oldTop - amount + 'px'
            updateComponent(editValue, { key: 'top', value: newTop, id: data.id, isRoot: false })
            break
          }
          case 'Down': {
            const newTop = oldTop + amount + 'px'
            updateComponent(editValue, { key: 'top', value: newTop, id: data.id, isRoot: false })
            break
          }
          case 'Left': {
            const newLeft = oldLeft - amount + 'px'
            updateComponent(editValue, { key: 'left', value: newLeft, id: data.id, isRoot: false })
            break
          }
          case 'Right': {
            const newLeft = oldLeft + amount + 'px'
            updateComponent(editValue, { key: 'left', value: newLeft, id: data.id, isRoot: false })
            break
          }
          default:
            break
        }
      }
    }

    function motifyHistory(editValue: EditorData, history: HistoryProps, type: 'undo' | 'redo') {
      const { currentElId, data } = history
      const { key, oldValue, newValue } = data
      const newKey = key as keyof AllComponentProps | Array<keyof AllComponentProps>
      const updateComp = editValue.components.find((comp) => comp.id === currentElId)
      if (updateComp) {
        if (Array.isArray(newKey)) {
          newKey.forEach((keyName, index) => {
            updateComp.props[keyName] = type === 'undo' ? oldValue[index] : newValue[index]
          })
        } else {
          updateComp.props[newKey] = type === 'undo' ? oldValue : newValue
        }
      }
    }

    function undo(editValue: EditorData) {
      if (editValue.historyIndex === -1) {
        editValue.historyIndex = editValue.histories.length - 1
      } else {
        editValue.historyIndex--
      }
      editInfo.value.isNeedSave = false

      const history = editValue.histories[editValue.historyIndex]
      switch (history.type) {
        case 'add': {
          editValue.components = editValue.components.filter((comp) => comp.id !== history.data.id)
          break
        }
        case 'delete': {
          editValue.components = insertAt(
            editValue.components,
            history.index as number,
            history.data
          )
          break
        }
        case 'modify': {
          motifyHistory(editValue, history, 'undo')
          break
        }
        default:
          break
      }
    }

    function redo(editValue: EditorData) {
      if (editValue.historyIndex === -1) {
        return
      }
      editInfo.value.isNeedSave = false

      const history = editValue.histories[editValue.historyIndex]
      switch (history.type) {
        case 'add': {
          editValue.components.push(history.data)
          break
        }
        case 'delete': {
          editValue.components = editValue.components.filter((comp) => comp.id !== history.id)
          break
        }
        case 'modify': {
          motifyHistory(editValue, history, 'redo')

          break
        }
        default:
          break
      }
      editValue.historyIndex++
    }

    function resetEditor(editValue: EditorData) {
      editValue.components = []
      editValue.currentElement = ''
      editValue.histories = []
      editValue.historyIndex = -1
    }

    function checkUndoDisable(editvalue: EditorData) {
      if (editvalue.histories.length === 0 || editvalue.historyIndex === 0) {
        return true
      } else {
        return false
      }
    }

    function checkRedoDisable(editValue: EditorData) {
      if (
        editValue.histories.length === 0 ||
        editValue.historyIndex === -1 ||
        editValue.historyIndex === editValue.histories.length
      ) {
        return true
      } else {
        return false
      }
    }

    function getWorkDetail(id: string) {
      myRequest
        .get({
          url: `work/${id}`
        })
        .then((res) => {
          editInfo.value.components = res.data.data.content.components
          editInfo.value.page.props = res.data.data.content.props
          editInfo.value.page = { ...res.data.data }
        })
        .catch((e) => {
          console.log(e)
        })
    }

    function updateWork(id: string, data: Record<string, any>) {
      myRequest
        .patch({
          url: `work/update/${id}`,
          data
        })
        .then(() => {
          message.success('保存成功!', 1)
          editInfo.value.histories = []
          editInfo.value.isNeedSave = false
        })
    }

    function createChannel(data: { name: string; workId: string }) {
      myRequest
        .post({
          url: 'work/create-channel',
          data
        })
        .then((res) => {
          message.success(res.data.message)
        })
    }

    function deleteChannel(id: string, workId: string) {
      myRequest.delete({ url: `work/delete-channel`, params: { workId, id } }).then((res) => {
        message.success(res.data.message)
      })
    }
    return {
      editInfo,
      getWorkDetail,
      setEditInfo,
      removeEditInfo,
      addEditInfo,
      setActive,
      getCurrentElement,
      updateComponent,
      updatePage,
      copyComponent,
      pasteCopyComponnet,
      deleteComponet,
      moveComponent,
      undo,
      resetEditor,
      redo,
      checkRedoDisable,
      checkUndoDisable,
      updateWork,
      createChannel,
      deleteChannel
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
