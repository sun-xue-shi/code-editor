import ColorPicker from '@/component/ColorPicker.vue'
import {
  Textarea,
  InputNumber,
  Select,
  Slider,
  RadioGroup,
  RadioButton,
  Input,
  Image
} from 'ant-design-vue'
import type { VNode } from 'vue'
import { h } from 'vue'
import imageProesser from '@/component/imageProesser.vue'

/**元素通用属性 */
export interface CommonComponentProps {
  // actions
  actionType?: string
  url?: string
  src?: string
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
  [p in keyof TextComponentProps]?: PropToForm
}

const fontFamilyArr = [
  { value: '', text: '无' },
  { text: '宋体', value: '"SimSun","STSong' },
  { text: '黑体', value: '"SimHei,"STHeiti"' },
  { text: '楷体', value: '"KaiTi,"STKaiti"' },
  { text: '仿宋', value: '"FangSong,"STFangsong"' }
]
const fontFamilyOptions = fontFamilyArr.map((font) => {
  return {
    value: font.value,
    text: h('span', { style: { fontFamily: font.value } }, font.text)
  }
})

export const mapPropsToForms: PropToForms = {
  text: {
    component: Textarea,
    text: '文本',
    extraProps: { rows: 3 },
    afterTransform: (e: any) => e.target.value
  },
  fontSize: {
    component: InputNumber,
    text: '字号',
    initailTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : '')
  },
  lineHeight: {
    component: Slider,
    text: '行高',
    extraProps: {
      min: 0,
      max: 3,
      step: 1,
      style: {
        width: '150px'
      }
    },
    initailTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString()
  },
  textAlign: {
    component: RadioGroup,
    subComponent: RadioButton,
    text: '对齐',
    options: [
      { value: 'left', text: '左' },
      { value: 'center', text: '中' },
      { value: 'right', text: '右' }
    ],
    afterTransform: (e: any) => e.target.value
  },
  fontFamily: {
    component: Select,
    subComponent: RadioButton,
    text: '字体',
    options: [{ value: '', text: '无' }, ...fontFamilyOptions]
  },
  color: {
    component: ColorPicker,
    text: '文本颜色'
  },
  width: {
    component: Input,
    text: '宽度',
    afterTransform: (e: any) => e.target.value
  },
  src: {
    component: imageProesser,
    text: '',
  }
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
