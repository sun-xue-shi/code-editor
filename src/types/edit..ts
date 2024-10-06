import type {
  AllComponentProps,
  ImageComponentProps,
  PageData,
  ShapeComponentProps,
  TextComponentProps
} from './props'

export interface EditorData {
  /**编辑器渲染数组 */
  components: CompData[]
  currentElement: string
  page: PageData
  copyComponent?: CompData
  histories: HistoryProps[]
  historyIndex: number
  cacheOldValue: any
  maxHistoryNumber: number
}

export interface CompData {
  /**元素属性 */
  props: Partial<TextComponentProps & ImageComponentProps & ShapeComponentProps & PageProps>
  id: string
  /**业务组件名称 */
  name: string
  isHidden?: boolean
  isLocked?: boolean
  layerName?: string
}

export interface EditWrapper {
  id: string
  active: boolean
  props: AllComponentProps
}

export interface GroupProps {
  text: string
  items: string[]
}

export interface PageProps {
  backgroundColor: string
  backgroundImage: string
  backgroundRepeat: string
  backgroundSize: string
  height: string
}

export interface PositionType {
  left?: number
  top?: number
  right?: number
  bottom?: number
  id: string
}
export interface MoveType {
  direction: 'Up' | 'Down' | 'Right' | 'Left'
  amount: number
  id: string
}

export interface HistoryProps {
  id: string
  currentElId: string
  type: 'add' | 'delete' | 'modify'
  data: any
  index?: number
}

export interface UpdateComponentsType {
  key: keyof AllComponentProps | Array<keyof AllComponentProps>
  value: string | string[]
  id: string
  isRoot?: boolean
}

export interface ItemType {
  action: (id?: string) => void
  leftText: string
  rightText: string
}
