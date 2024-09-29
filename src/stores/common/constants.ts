import { textDefaultProps, type ComponentData } from 'editor-components-sw'
import { v4 } from 'uuid'

export const testData: ComponentData[] = [
  {
    id: v4(),
    name: 'text-comp',
    isHidden: true,
    isLocked: false,
    layerName: '图层1',
    props: {
      ...textDefaultProps,
      text: 'test',
      fontSize: '10px',
      color: '#000000',
      width: '100px',
      height: '100px',
      lineHeight: '1',
      boxSizing: 'border-box',
      position: 'absolute',
      textAlign: 'left',
      top: '10px',
      left: '10px',
      backgroundColor: '#efefef'
    }
  }
  // {
  //   id: v4(),
  //   name: 'text-comp',
  //   layerName: '图层2',
  //   isHidden: false,
  //   isLocked: false,
  //   props: {
  //     ...textDefaultProps,
  //     text: 'test1',
  //     fontSize: '20px',
  //     // actionType: 'url',
  //     // url: 'https://www.baidu.com',
  //     tag: 'div',
  //     width: '50px',
  //     height: '20px',
  //     position: ''
  //   }
  // },
  // {
  //   id: v4(),
  //   name: 'text-comp',
  //   layerName: '图层3',
  //   isHidden: true,
  //   isLocked: true,
  //   props: {
  //     ...textDefaultProps,
  //     text: 'test2',
  //     color: 'blue',
  //     tag: 'div',
  //     width: '50px',
  //     height: '20px',
  //     position: ''
  //   }
  // }
]

export const pageDefaultData = {
  backgroundColor: '#fff',
  backgroundImage: '',
  height: '560px',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
}
