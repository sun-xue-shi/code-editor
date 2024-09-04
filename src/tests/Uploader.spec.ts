import { beforeAll, describe, expect, it, vitest, type Mocked } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import ColorPicker from '@/component/ColorPicker.vue'
import axios from 'axios'
import flushPromises from 'flush-promises'

vitest.mock('axios')
const mockedAxioa = axios as Mocked<typeof axios>
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' })

let wapper: VueWrapper
describe('ColorPicker comp', () => {
  beforeAll(() => {
    wapper = shallowMount(ColorPicker, {
      props: {
        action: '#test.url'
      }
    })
  })

  it('组件结构是否正确', () => {
    //上传按钮存在
    expect(wapper.find('button').exists()).toBeTruthy()
    //按钮文字
    expect(wapper.get('button span').text()).toBe('文件上传')
    //默认隐藏文件选择窗口
    expect(wapper.get('input').isVisible()).toBeFalsy()
  })

  it('input框选择颜色后是否发出事件,传出对应值', () => {})

  it('默认颜色列表选择颜色后是否发出事件,传出对应值', () => {})
})
