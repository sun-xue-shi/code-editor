import { type ComponentData } from 'editor-components-sw'
import type { AllComponentProps } from './props'

export interface EditorData {
  /**编辑器渲染数组 */
  components: ComponentData[]
  currentElement: string
  pageData: PageData
}

export interface PageData {
  title: string
  props: AllComponentProps
}

export interface EditWrapper {
  id: string
  active: boolean
  props: Record<string, any>
}
