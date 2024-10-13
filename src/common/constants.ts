import type { GroupProps } from '@/types/edit.'

export const DEFAULT_COLOR = [
  '#ffffff',
  '#f5222d',
  '#fa541c',
  '#fadb14',
  '#52c41a',
  '#1890ff',
  '#722ed1',
  '#8c8c8c',
  '#000000',
  ''
]

export const MAX_EDIT_WIDTH = 373

export const defaultGroupProps = [
  {
    name: '尺寸',
    items: ['width', 'height', 'paddingLeft']
  },
  {
    name: '边框',
    items: ['borderColor', 'borderWidth', 'borderRadius']
  },
  {
    name: '透明度',
    items: ['opacity']
  },
  {
    name: '文本',
    items: ['color', 'text', 'fontSize', 'lineHeight']
  },
  {
    name: '事件',
    items: ['actionType', 'url']
  }
]
