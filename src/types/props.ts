import type { VNode } from 'vue'

/**元素通用属性 */
export interface CommonComponentProps {
  // actions
  actionType?: string
  url?: string
  // size
  height?: string
  width?: string
  paddingLeft?: string
  paddingRight?: string
  paddingTop?: string
  paddingBottom?: string
  // border type
  borderStyle?: string
  borderColor?: string
  borderWidth?: string
  borderRadius?: string
  // shadow and opacity
  boxShadow?: string
  opacity?: string
  // position and x,y
  position?: string
  left?: string
  top?: string
  right?: string
}

/**text属性 */
export interface TextComponentProps extends CommonComponentProps {
  /**文本 */
  text?: string
  fontSize?: string
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  textDecoration?: string
  lineHeight?: string
  textAlign?: string
  color?: string
  backgroundColor?: string
  tag?: string
}
export interface ImageComponentProps extends CommonComponentProps {
  src: string
}

export interface ShapeComponentProps extends CommonComponentProps {
  backgroundColor: string
}

export type AllComponentProps = TextComponentProps & ImageComponentProps & ShapeComponentProps

export interface PropToForm {
  component: any
  extraProps?: Record<string, any>
  text?: string
  subComponent?: any
  options?: { text: string | VNode; value: any }[]
  initailTransform?: (v: any) => any
  afterTransform?: (v: any) => any
  valueProp?: string
  envenName?: string
}

export type PropToForms = {
  [p in keyof AllComponentProps]?: PropToForm
}

export interface FormProp {
  component: any
  value: string
  extraProps?: Record<string, any> | undefined
  text?: string | VNode
  subComponent?: any
  options?: { text: string | VNode; value: any }[]
  valueProp: string
  envenName: string
  events?: { [key: string]: (e: any) => void }
}
