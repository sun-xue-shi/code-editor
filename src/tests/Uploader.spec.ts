import { beforeAll, describe, expect, it, vitest, type Mocked } from 'vitest'
import { mount, shallowMount, VueWrapper } from '@vue/test-utils'
import Uploader from '@/component/Uploader.vue'
import axios from 'axios'
import flushPromises from 'flush-promises'

vitest.mock('axios')
vitest.mock('@ant-design/icons-vue')

const mockedAxios = axios as Mocked<typeof axios>
const testFile = new File(['xyz'], 'test.png', { type: 'image/png' })
const mockComponent = {
  template: '<div><slot></slot></div>'
}
const mockComponents = {
  DeleteOutlined: mockComponent,
  FileOutlined: mockComponent,
  LoadingOutlined: mockComponent
}

function setInputValue(fileInput: HTMLInputElement) {
  const files = [testFile]
  Object.defineProperty(fileInput, 'files', {
    value: files,
    writable: false
  })
}

let wapper: VueWrapper
describe('Uploader comp', () => {
  beforeAll(() => {
    wapper = shallowMount(Uploader, {
      props: {
        url: 'test.url'
      },
      global: {
        stubs: mockComponents
      }
    })
  })

  it('组件结构是否正确', () => {
    //上传按钮存在
    expect(wapper.find('button').exists()).toBeTruthy()
    //按钮文字
    expect(wapper.get('button').text()).toBe('点击上传')
    //默认隐藏文件选择窗口
    expect(wapper.get('input').isVisible()).toBeFalsy()
  })

  it('基本上传流程是否正确', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 'success' })
    const fileInput = wapper.get('input').element as HTMLInputElement
    // fileInput.files = [testFile] as unknown as FileList
    setInputValue(fileInput)
    await wapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    expect(wapper.get('button').text()).toBe('正在上传')
    //此时按钮禁止操作
    expect(wapper.get('button').attributes('disabled')).toBe('')
    //文件列表长度为1
    expect(wapper.findAll('li').length).toBe(1)
    //列表第一个元素包含上传中的类名
    const firstItem = wapper.get('li:first-child')
    expect(firstItem.classes()).toContain('upload-loading')
    await flushPromises()
    expect(wapper.get('button').text()).toBe('点击上传')
    //第一个元素包含上传成功的类名 且对应文件名正确
    expect(firstItem.classes()).toContain('upload-success')
    expect(firstItem.get('.filename').text()).toBe(testFile.name)
  })

  it('上传失败返回错误', async () => {
    mockedAxios.post.mockRejectedValueOnce({ error: 'error' })
    await wapper.get('input').trigger('change')
    expect(mockedAxios.post).toHaveBeenCalledTimes(2)
    expect(wapper.get('button').text()).toBe('正在上传')
    //此时按钮禁止操作

    expect(wapper.get('button').attributes('disabled')).toBe('')

    await flushPromises()
    expect(wapper.get('button').text()).toBe('点击上传')
    //文件列表长度为2
    expect(wapper.findAll('li').length).toBe(2)
    //列表最后一个元素包含上传失败的类名
    const lastItem = wapper.get('li:last-child')
    expect(lastItem.classes()).toContain('upload-error')
    //触发删除操作
    await lastItem.get('.delete-file').trigger('click')
    expect(wapper.findAll('li').length).toBe(1)
  })

  it('自定义插槽是否展示正确内容', async () => {
    console.log(555);
    
    mockedAxios.post.mockResolvedValueOnce({ data: { url: '123.url' } })
    console.log(111)

    // mockedAxios.post.mockResolvedValueOnce({ data: { url: 'xyz.url' } })
    const wapper = mount(Uploader, {
      props: {
        url: 'test.url'
      },
      slots: {
        default: '<button>custom button</button>',
        loading: '<div class="loading">custom loading</div>',
        uploaded: `<template #uploaded="{uploadedData}"><div class="custom-loaded">{{uploadedData.url}}</div></template>`
      },
      global: {
        stubs: mockComponents
      }
    })

    expect(wapper.get('button').text()).toBe('custom button')
    const fileInput = wapper.get('input').element as HTMLInputElement
    setInputValue(fileInput)
    await wapper.get('input').trigger('change')
    expect(wapper.get('.loading').text()).toBe('custom loading')
    await flushPromises()
    console.log("wapper.get('.custom-loaded')", wapper.get('.custom-loaded'))

    expect(wapper.get('.custom-loaded').text()).toBe('123.url')

    // await wapper.get('input').trigger('change')
    // expect(wapper.get('.loading').text()).toBe('custom loading')
    // await flushPromises()
    // expect(wapper.get('.custom-loaded').text()).toBe('xyz.url')
  })
})
