<script setup lang="ts">
import { message } from 'ant-design-vue'
import ImageProesser from './imageProesser.vue'
import SuperUploader from './SuperUploader.vue'
import type { UploadResponse } from '@/types/upload'

interface BackgroundProcesserType {
  value: string
}
const emit = defineEmits<{ change: [url: string] }>()

defineProps<BackgroundProcesserType>()

function onImageUploaded(data: { res: UploadResponse; file: File }) {
  const { res } = data
  message.success('上传成功')
  emit('change', res.data.url)
}

function handleUploadUrl(url: string) {
  emit('change', url)
}
</script>

<template>
  <div class="background-processer">
    {{ undefined }}
    <SuperUploader
      v-if="!value"
      url="http://localhost:3000/file/upload"
      @uploadSuccess="onImageUploaded"
    />
    <ImageProesser v-if="value" :value="value" @change="handleUploadUrl" :delete="true" />
  </div>
</template>

<style scoped lang="less"></style>
