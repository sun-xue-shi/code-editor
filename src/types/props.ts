import ColorPicker from '@/component/ColorPicker.vue'
import {
  Textarea,
  InputNumber,
  Select,
  Slider,
  RadioGroup,
  RadioButton,
  SelectOption,
  Input
} from 'ant-design-vue'
import type { VNode } from 'vue'
import { h } from 'vue'
import type { PageProps } from './edit.'
import BackgroundProcesser from '@/component/BackgroundProcesser.vue'
import ImageProesser from '@/component/imageProesser.vue'

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
  boxSizing?: string
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

export interface PageData {
  props: PageProps
  coverImg: string
  id: string
  desc: string
  title: string
}

export type AllComponentProps = TextComponentProps &
  ImageComponentProps &
  ShapeComponentProps &
  PageProps

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
  parent?: string
}

export type PropToForms = {
  [p in keyof AllComponentProps]?: PropToForm
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
    extraProps: {
      min: 0
    },
    initailTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : '')
  },
  lineHeight: {
    component: Slider,
    text: '行高',
    extraProps: {
      min: 0,
      max: 10,
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
    extraProps: {
      style: {
        width: '100px'
      }
    },
    options: [...fontFamilyOptions]
  },
  color: {
    component: ColorPicker,
    text: '文本颜色'
  },
  width: {
    component: InputNumber,
    text: '宽度',
    extraProps: {
      min: 0
    },
    initailTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : '')
  },
  height: {
    component: InputNumber,
    text: '高度',
    extraProps: {
      min: 0
    },
    initailTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : '')
  },
  src: {
    component: ImageProesser
  },
  backgroundColor: {
    component: ColorPicker,
    text: '背景颜色'
  },
  borderWidth: {
    component: InputNumber,
    text: '边框宽度',
    extraProps: {
      min: 0
    },
    initailTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : '')
  },
  paddingTop: {
    component: InputNumber,
    text: '内上边距',
    extraProps: {
      min: 0
    },
    initailTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : '')
  },
  paddingBottom: {
    component: InputNumber,
    text: '内下边距',
    extraProps: {
      min: 0
    },
    initailTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : '')
  },
  paddingLeft: {
    component: InputNumber,
    text: '内左边距',
    extraProps: {
      min: 0
    },
    initailTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : '')
  },
  paddingRight: {
    component: InputNumber,
    text: '内右边距',
    extraProps: {
      min: 0
    },
    initailTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : '')
  },
  opacity: {
    component: Slider,
    text: '透明度',
    extraProps: {
      min: 0,
      max: 1,
      step: 0.1,
      style: {
        width: '150px'
      }
    },
    initailTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString()
  },
  backgroundImage: {
    component: BackgroundProcesser,
    text: '背景图片',
    initailTransform(v) {
      if (v) {
        const reg = /\(["'](.+)["']\)/g
        const res = reg.exec(v)
        if (res && res.length >= 1) {
          return res
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  actionType: {
    component: Select,
    subComponent: SelectOption,
    text: '点击',
    extraProps: {
      style: {
        width: '150px'
      }
    },
    options: [
      { value: '', text: '无' },
      { value: 'url', text: '跳转到 URL' }
    ]
  },
  url: {
    component: Input,
    afterTransform: (e: any) => e.target.value,
    text: '链接',
    parent: 'actionType'
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
  isHidden?: boolean
}
