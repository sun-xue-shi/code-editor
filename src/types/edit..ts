import type { ImageComponentProps, TextComponentProps } from './props'

export interface EditorData {
  /**编辑器渲染数组 */
  components: CompData[]
  currentElement: string
}

export interface CompData {
  /**元素属性 */
  props: Partial<TextComponentProps & ImageComponentProps>
  id: string
  /**业务组件名称 */
  name: string
}

export interface EditWrapper {
  id: string
  active: boolean
}
