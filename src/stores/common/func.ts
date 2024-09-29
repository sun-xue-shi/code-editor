import type { EditorData, HistoryData, UpdateHistoryData } from '@/types/edit.'
import { debounce } from '@/utils/edit'
import type { ComponentData } from 'editor-components-sw'
import { v4 } from 'uuid'

export function updateHistory(
  history: HistoryData,
  components: ComponentData[],
  type: 'undo' | 'redo'
) {
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

export function addHistory(editInfo: EditorData, historyData: HistoryData) {
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

export function addUpdateHistory(editInfo: EditorData, updateHistoryData: UpdateHistoryData) {
  const { id, key, newData } = updateHistoryData

  addHistory(editInfo, {
    id: v4(),
    type: 'update',
    componentId: id || editInfo.currentElement,
    data: { key, preData: editInfo.debounceOldData, newData }
  })

  editInfo.debounceOldData = null
}

export const debounceAddUpdateHistory = debounce(addUpdateHistory)
