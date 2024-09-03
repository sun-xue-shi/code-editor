import { beforeAll, describe, expect, it } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ColorPicker from '@/component/ColorPicker.vue'
import { DEFAULT_COLOR } from '@/common/constants'
import rgbHex from 'rgb-hex'

let wapper: VueWrapper
describe('ColorPicker comp', () => {
  beforeAll(() => {
    wapper = mount(ColorPicker, {
      props: {
        value: '#ffffff'
      }
    })
  })

  it('组件结构是否正确', () => {
    //组件存在input元素  type跟初始颜色
    expect(wapper.find('input').exists()).toBeTruthy()
    const input = wapper.get('input').element
    expect(input.type).toBe('color')
    expect(input.value).toBe('#ffffff')

    //测试默认颜色选择列表 数量，首尾元素是否正确
    expect(wapper.findAll('.default-color-list li').length).toBe(DEFAULT_COLOR.length)
    const fistItem = wapper.get('li:first-child div').element as HTMLElement
    expect('#' + rgbHex(fistItem.style.backgroundColor)).toBe(DEFAULT_COLOR[0])

    const lastItem = wapper.get('li:last-child div').element as HTMLElement
    expect(lastItem.classList.contains('transparent-color')).toBeTruthy()
  })

  it('input框选择颜色后是否发出事件,传出对应值', () => {
    const color = '#000000'
    const input = wapper.get('input')
    input.setValue(color)
    expect(wapper.emitted()).toHaveProperty('change')
    const events = wapper.emitted('change')!
    expect(events[0]).toEqual([color])
  })

  it('默认颜色列表选择颜色后是否发出事件,传出对应值', () => {
    const fistItem = wapper.get('li:first-child div')
    fistItem.trigger('click')
    const events = wapper.emitted('change')!
    console.log('events[1]', events[1][0])

    expect(events[1][0]).toEqual(DEFAULT_COLOR[0])
  })
})
