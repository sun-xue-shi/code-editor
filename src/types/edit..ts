export interface EditorData {
  /**编辑器渲染数组 */
  components: CompData[]
  currentElement: string
}

export interface CompData {
  /**元素属性 */
  props: { [key: string]: any }
  id: string
  /**业务组件名称 */
  name: string
}
