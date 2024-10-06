<script setup lang="ts">
import { CHUNK_SIZE } from '@/common/constants'
import { mergeFile, uploadBigFile, uploadFile } from '@/request/file'
import { useEditStore } from '@/stores/edit'
import type { ComponentData } from '@/types/edit.'
import { getFileHash } from '@/utils/upload'
import { message, type UploadChangeParam } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue/es/upload'
import type { FileType } from 'ant-design-vue/es/upload/interface'
import { imageDefaultProps } from 'editor-components-sw'
import { v4 } from 'uuid'

const editStore = useEditStore()
const { updatePage } = editStore

const props = withDefaults(
  defineProps<{
    isPageUploader: boolean
  }>(),
  {
    isPageUploader: false
  }
)

// const beforeUpload: UploadProps['beforeUpload'] = (file: FileType, files: FileType[]) => {
//   return new Promise((resolve) => {
//     const data = new FormData()
//     const hash = '1213516565'
//     data.set('name', '15615165.jpg')
//     data.set('hash', hash)
//     data.append('files', files)

//     resolve(file)
//   })
// }

const customRequest = async (info: any) => {
  console.log(info)

  const file = info.file as File

  const hash = (await getFileHash(file)) as string

  /* 文件切片 */
  const chunks = []
  let startPos = 0
  while (startPos < file.size) {
    chunks.push(file.slice(startPos, startPos + CHUNK_SIZE))
    startPos += CHUNK_SIZE
  }

  const uploadTask: any[] = []
  chunks.map((chunk, index) => {
    const fileData = new FormData()
    fileData.set('name', hash + '@' + index)
    fileData.set('hash', hash)
    fileData.append('files', chunk)
    uploadTask.push(uploadBigFile(fileData))
  })

  await Promise.all(uploadTask).then(async (res) => {
    const mergeRes = await mergeFile({ name: file.name, hash })

    console.log('res', res)

    console.log('mergeRes', mergeRes)
    info.onSuccess(res)
  })

  // console.log('mergeRes.data.url.length - 1', mergeRes.data.url.length - 1)

  // console.log('mergeRes.data.url', mergeRes.data.url)

  // const imageUrl = mergeRes.data.url[4].replace('\\', '\\\\')

  // if (!props.isPageUploader) {
  //   const imageData = {
  //     id: v4(),
  //     name: 'image-comp',
  //     isHidden: false,
  //     isLocked: false,
  //     layerName: '默认图层',
  //     props: {
  //       ...imageDefaultProps,
  //       src: mergeRes.data.url[4],
  //       width: '100px',
  //       height: '100px',
  //       position: 'absolute'
  //     }
  //   }

  //   let imageCount = 0
  //   editStore.editInfo.components.forEach((component: ComponentData) => {
  //     if (component.name === 'image-comp') imageCount++
  //   })

  //   if (imageCount >= 3) {
  //     message.warn('画布区最多只能上传三张图片!')
  //     return
  //   }

  //   editStore.addEditInfo(imageData)
  // } else {
  //   const data = {
  //     key: 'backgroundImage',
  //     value: `url('${imageUrl}')`,
  //     isPage: true
  //   }
  //   updatePage(data)
  // }

  // message.success(info.file.name + '文件上传成功', 1)
}

// function handleChange(info: UploadChangeParam) {
//   const { status, response } = info.file

//   if (status === 'done') {

//   } else if (status === 'error') {
//     message.error(info.file.name + '文件上传失败', 1)
//   }
// }
</script>

<template>
  <div class="uploader">
    <a-upload-dragger name="files" list-type="picture" :customRequest="customRequest" :maxCount="1">
      <a-button> upload </a-button>
      <p>最多只能上传三张图片</p>
    </a-upload-dragger>
  </div>
</template>

<style scoped lang="less"></style>
