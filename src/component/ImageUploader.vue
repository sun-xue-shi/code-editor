<script setup lang="ts">
import { useEditStore } from '@/stores/edit'
import { message, type UploadChangeParam } from 'ant-design-vue'
import { imageDefaultProps, type ComponentData } from 'editor-components-sw'
import { v4 } from 'uuid'

const editStore = useEditStore()
const { editInfo, updatePage } = editStore

const props = withDefaults(
  defineProps<{
    isPageUploader: boolean
  }>(),
  {
    isPageUploader: false
  }
)

function handleChange(info: UploadChangeParam) {
  const { status, response } = info.file

  if (status === 'done') {
    const imageUrl = response.data.url[0].replace('\\', '\\\\')

    if (!props.isPageUploader) {
      const imageData = {
        id: v4(),
        name: 'image-comp',
        isHidden: false,
        isLocked: false,
        layerName: '默认图层',
        props: {
          ...imageDefaultProps,
          src: info.file.response.data.url[0],
          width: '100px',
          position: ''
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
      updatePage(editInfo, data)
    }

    message.success(info.file.name + '文件上传成功')
  } else if (status === 'error') {
    message.error(info.file.name + '文件上传失败')
  }
}
</script>

<template>
  <div class="uploader">
    <a-upload-dragger
      name="files"
      list-type="picture"
      action="http://localhost:3000/file/upload"
      @change="handleChange"
      :maxCount="1"
    >
      <a-button> upload </a-button>
      <p>最多只能上传三张图片</p>
    </a-upload-dragger>
  </div>
</template>

<style scoped lang="less"></style>
