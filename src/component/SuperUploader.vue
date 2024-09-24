<script setup lang="ts">
import Uploader from './Uploader.vue'
import { commonUploadCheck } from '@/utils/upload'
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons-vue'

const props = withDefaults(defineProps<{ text?: string; url: string }>(), {
  text: '上传图片'
})

const emit = defineEmits<{
  uploadSuccess: [data: any]
}>()

function handleSuccess(data: any) {
  emit('uploadSuccess', data)
}
</script>

<template>
  <div class="styled-upload-component">
    <Uploader
      :url="props.url"
      :beforeUpload="commonUploadCheck"
      @success="
        (data) => {
          handleSuccess(data)
        }
      "
    >
      <div class="uploader-container">
        <FileImageOutlined :style="{ fontSize: '30px' }" />
        <h4>{{ text }}</h4>
      </div>
      <template #loading>
        <div class="uploader-container">
          <LoadingOutlined :style="{ fontSize: '30px' }" spin />
          <h4>上传中</h4>
        </div>
      </template>
      <template #uploaded="dataProps">
        <div class="uploader-container">
          <img :src="dataProps.uploadedData.data.url" />
        </div>
      </template>
    </Uploader>
  </div>
</template>

<style scoped lang="less">
.uploader-container {
  text-align: center;
  padding: 10px;
  width: 100%;
  border: 2px dotted #efefef;
  color: #ccc;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  transition: all 0.25s ease-in-out;
  cursor: pointer;
}
.uploader-container:hover {
  border: 2px dotted #1890ff;
  color: #1890ff;
}
.uploader-container h4 {
  color: #999;
  transition: all 0.25s ease-in-out;
}
.uploader-container:hover h4 {
  color: #1890ff;
}
.uploader-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
