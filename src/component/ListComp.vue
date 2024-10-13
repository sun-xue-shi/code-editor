<script setup lang="ts">
import { TextComp } from 'editor-components-sw'
import SuperUploader from './SuperUploader.vue'
import type { TextComponentProps } from '@/types/props'
import type { CompData } from '@/types/edit.'
import { v4 } from 'uuid'
import type { UploadResponse } from '@/types/upload'
import { message } from 'ant-design-vue'

const textPropsList = [
  {
    text: '大标题',
    fontSize: '30px',
    fontWeight: 'bold',
    tag: 'h2',
    lineHeight: '2'
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
    tag: 'p'
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



const emit = defineEmits<{
  (e: 'add-item', newData: CompData): void
  (e: 'image-upload', newData: CompData): void
}>()

const addItem = (props: Partial<TextComponentProps>) => {
  const newData: CompData = {
    id: v4(),
    name: 'ListComp',
    props
  }
  emit('add-item', newData)
}

const imageUpload = (response: UploadResponse) => {
  const newData: CompData = {
    id: v4(),
    name: 'img',
    props: {
      src: response.data.url,
      width: '100px'
    }
  }
  emit('add-item', newData)
  message.success('上传成功')
}
const offsetPosition = {
  x: 0,
  y: 0
}
function createProps(props: TextComponentProps) {
  const newProps: CompData = {
    id: v4(),
    name: 'text-comp',
    layerName: '',
    isHidden: false,
    isLocked: false,
    props: {
      ...props
    }
  }
  return newProps
}
function handleMouseDowm(e: MouseEvent, index: number) {
  const ele = document.getElementById(`draggableEle-${index}`) as HTMLElement
  const { clientX, clientY } = e
  const { x, y } = ele.getBoundingClientRect()
  offsetPosition.x = clientX - x
  offsetPosition.y = clientY - y
}
function handleDragStart(e: DragEvent, item: TextComponentProps) {
  const newProps = createProps(item)
  e.dataTransfer?.setData('data', JSON.stringify(newProps))
  e.dataTransfer?.setData('position', JSON.stringify(offsetPosition))
}
</script>

<template>
  <div class="list-comp">
    <div class="list-item" v-for="(item, index) in textPropsList" :key="item.tag">
      <TextComp
        :id="`draggableEle-${index}`"
        v-bind="item"
        @click="addItem(item)"
        :style="{ position: 'static' }"
        draggable="true"
        @mousedown="handleMouseDowm($event, index)"
        @dragstart="handleDragStart($event, item)"
      />
    </div>
    <SuperUploader
      url="http://localhost:3000/file/upload"
      listType="picture"
      @uploadSuccess="imageUpload"
    />
  </div>
</template>

<style scoped lang="less">
.list-comp > * {
  margin-top: 10px;
}
.list-item {
  position: relative;
  cursor: pointer;
}
</style>
