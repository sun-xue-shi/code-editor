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

export const TextPropsList = [
  {
    text: '大标题',
    fontSize: '30px',
    fontWeight: 'bold',
    tag: 'h2'
  },
  {
    text: '楷体副标题',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: '"KaiTi","STKaiti"',
    tag: 'h2'
  },
  {
    text: '正文内容',
    tag: 'p',
    lineHeight: '2px'
  },
  {
    text: '宋体正文内容',
    tag: 'p',
    fontFamily: '"SimSun","STSong"'
  },
  {
    text: 'Arial style',
    tag: 'p',
    fontFamily: '"Arial", sans-serif'
  },
  {
    text: 'Comic Sans',
    tag: 'p',
    fontFamily: '"Comic Sans MS"'
  },
  {
    text: 'Courier New',
    tag: 'p',
    fontFamily: '"Courier New", monospace'
  },
  {
    text: 'Times New Roman',
    tag: 'p',
    fontFamily: '"Times New Roman", serif'
  },
  {
    text: '链接内容',
    color: '#1890ff',
    textDecoration: 'underline',
    tag: 'p'
  },
  {
    text: '按钮内容',
    color: '#ffffff',
    backgroundColor: '#1890ff',
    borderWidth: '1px',
    borderColor: '#1890ff',
    borderStyle: 'solid',
    borderRadius: '2px',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
    width: '100px',
    tag: 'button',
    textAlign: 'center'
  }
]

export const DefaultGroupProps = [
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
  }
]

export const MAX_EDIT_WIDTH = 373

export const CHUNK_SIZE = 100 * 1024
