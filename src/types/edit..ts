import type { AllComponentProps } from './props'

export interface UpdateData {
  key?: string | string[]
  id?: string
  value: string | string[]
  isRoot?: boolean
  isPage?: boolean
}

export interface HistoryData {
  id: string
  componentId: string
  type: 'delete' | 'add' | 'update'
  data: any
  //删除时记录数组位置方便插入
  index?: number
}

export interface EditorData {
  /**编辑器渲染数组 */
  components: ComponentData[]
  currentElement: string
  pageData: PageData
  copyComponent: ComponentData | null
  history: HistoryData[]
  historyIndex: number
  debounceOldData: any
  maxRecordLength: number
  isdirty: boolean
  channels: Channel[]
}

export interface PageData {
  id: string
  desc: string
  title: string
  props: AllComponentProps
  coverImg: string
}

export interface UpdateHistoryData {
  key?: string | string[]
  preData?: string | string[]
  newData?: string | string[]
  id?: string
}

export interface EditWrapper {
  id: string
  active: boolean
  props: Record<string, any>
}

export interface WorkData extends Omit<PageData, 'props'> {
  content: {
    components: ComponentData[]
    props?: AllComponentProps
  }
}

export interface ComponentData {
  props: Record<string, any>
  id: string
  name: string
  layerName: string
  isHidden: boolean
  isLocked: boolean
}

export interface Channel {
  name: string
  id: string
}
