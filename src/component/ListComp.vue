<script setup lang="ts">
import { v4 } from 'uuid'
import { message, type UploadChangeParam } from 'ant-design-vue'
import { TextComp, type ComponentData } from 'editor-components-sw'
import type { TextComponentProps } from '@/types/props'
import { useEditStore } from '@/stores/edit'
import { TextPropsList } from '@/common/constants'

const editStore = useEditStore()

const emit = defineEmits<{
  (e: 'add-item', newData: ComponentData): void
  (e: 'image-upload', newData: ComponentData): void
}>()

const addItem = (props: Partial<TextComponentProps>) => {
  const newData: ComponentData = {
    id: v4(),
    name: 'ListComp',
    props
  }
  emit('add-item', newData)
}

function handleChange(info: UploadChangeParam) {
  const { status } = info.file

  if (status === 'done') {
    console.log(info.file)
    const imageData = {
      id: v4(),
      name: 'image-comp',
      isHidden: false,
      isLocked: false,
      layerName: '默认图层',
      props: {
        src: info.file.response.data.url[0],
        width: '100px'
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

    message.success(info.file.name + '文件上传成功')
  } else if (status === 'error') {
    message.error(info.file.name + '文件上传失败')
  }
}
</script>

<template>
  <div class="list-comp">
    <div class="list-item" v-for="item in TextPropsList" :key="item.tag">
      <TextComp v-bind="item" @click="addItem(item)" />
    </div>
    <div class="uploader">
      <a-upload-dragger
        name="files"
        list-type="picture"
        action="http://localhost:3000/file/upload"
        @change="handleChange"
        :maxCount="1"
        headers="'X-Requested-With' : null"
      >
        <a-button> upload </a-button>
        <p>最多只能上传三张图片</p>
      </a-upload-dragger>
    </div>
  </div>
</template>

<style scoped lang="less">
.list-comp > * {
  margin-top: 10px;
}
</style>
