<script setup lang="ts">
import { CHUNK_SIZE } from '@/common/constants'
import { checkFile, mergeFile, uploadBigFile } from '@/request/file'
import { useEditStore } from '@/stores/edit'
import type { ComponentData } from '@/types/edit.'
import { message } from 'ant-design-vue'
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

const customRequest = async (info: any) => {
  const file = info.file as File
  let hash = ''

  /* 文件切片 */
  const chunks: Blob[] = []
  let startPos = 0
  while (startPos < file.size) {
    chunks.push(file.slice(startPos, startPos + CHUNK_SIZE))
    startPos += CHUNK_SIZE
  }

  let chunkStatusArr = new Array(chunks.length).fill(0)
  const checkRes = await checkFile({ name: file.name, hash, chunkTotal: chunks.length })

  if (checkRes.data.checkStatus === 'less') {
    chunkStatusArr = [...checkRes.data.chunkStatusArr]
  } else if (checkRes.data.checkStatus === 'uploaded') {
    //秒传
    handleUpdateImage(checkRes.data.url, file.name)
    info.onSuccess(checkRes)
    return
  }

  const worker = new Worker('../../md5Worker.ts', { type: 'module' })
  worker.postMessage(file)
  worker.onmessage = async (e) => {
    hash = e.data
    worker.terminate()

    const uploadTask: any[] = []
    chunks.map((chunk, index) => {
      if (chunkStatusArr[index] === 0 && hash) {
        const fileData = new FormData()
        fileData.set('name', hash + '@' + index)
        fileData.set('hash', hash)
        fileData.append('files', chunk)
        uploadTask.push(uploadBigFile(fileData))
      }
    })

    if (uploadTask.length > 0) {
      await Promise.all(uploadTask).then(async (res) => {
        const mergeRes = await mergeFile({ name: file.name, hash })
        handleUpdateImage(mergeRes.data.url, file.name)
        info.onSuccess(res)
      })
    }
  }
}

function handleUpdateImage(url: string, fileName: string) {
  const imageUrl = url.replace('\\', '\\\\')

  if (!props.isPageUploader) {
    const imageData = {
      id: v4(),
      name: 'image-comp',
      isHidden: false,
      isLocked: false,
      layerName: '默认图层',
      props: {
        ...imageDefaultProps,
        src: url,
        width: '100px',
        height: '100px',
        position: 'absolute'
      }
    }

    let imageCount = 0
    editStore.editInfo.components.forEach((component: ComponentData) => {
      if (component.name === 'image-comp') imageCount++
    })

    if (imageCount >= 3) {
      message.warn('画布区最多只能上传三张图片!')
      return
    }

    editStore.addEditInfo(imageData)
  } else {
    const data = {
      key: 'backgroundImage',
      value: `url('${imageUrl}')`,
      isPage: true
    }
    updatePage(data)
  }

  message.success(fileName + '文件上传成功', 1)
}
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
