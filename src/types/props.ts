import ColorPicker from '@/component/ColorPicker.vue'
import { Input, InputNumber, Select, Slider, RadioGroup, RadioButton } from 'ant-design-vue'

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

export interface PropToForm {
  component: any
  value?: string
  extraProps?: Record<string, any>
  text: string
  subComponent?: any
  options?: { text: string; value: any }[]
  initailTransform?: (v: any) => any
}

export type PropToForms = {
  [p in keyof TextComponentProps]?: PropToForm
}

// 这里只有text 可能是没写完 然后我觉得 这个地方不应该存放mapPropsToForms这样的一个变量 因为这个地方应该只放props的类型才对
export const mapPropsToForms: PropToForms = {
  text: {
    component: Input,
    text: '文本'
  },
  fontSize: {
    component: InputNumber,
    text: '字号',
    initailTransform: (v: string) => parseInt(v)
  },
  lineHeight: {
    component: Slider,
    text: '行高',
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    },
    initailTransform: (v: string) => parseFloat(v)
  },
  textAlign: {
    component: RadioGroup,
    subComponent: RadioButton,
    text: '对齐',
    options: [
      { value: 'left', text: '左' },
      { value: 'center', text: '中' },
      { value: 'right', text: '右' }
    ]
  },
  fontFamily: {
    component: Select,
    subComponent: RadioButton,
    text: '字体',
    options: [
      { value: '', text: '无' },
      { value: '宋体', text: '"SimSun","STSong' },
      { value: '黑体', text: '"SimHei,"STHeiti"' },
      { value: '楷体', text: '"KaiTi,"STKaiti"' },
      { value: '仿宋', text: '"FangSong,"STFangsong"' }
    ]
  },
  color: {
    text: '字体颜色',
    component: ColorPicker
  }
}
