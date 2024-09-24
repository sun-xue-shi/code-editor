// import type { AllComponentProps, ImageComponentProps, TextComponentProps } from './props'
import { type ComponentData } from 'editor-components-sw'

export interface EditorData {
  /**编辑器渲染数组 */
  components: ComponentData[]
  currentElement: string
}

export interface EditWrapper {
  id: string
  active: boolean
}
