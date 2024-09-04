<script setup lang="ts">
import type { UploaderFile, ActionType } from '@/types/upload'
import { v4 as uid } from 'uuid'
import { computed, reactive, ref } from 'vue'
import axios from 'axios'

const props = defineProps<ActionType>()

const fileInput = ref<null | HTMLInputElement>(null)
const uploadFlifes = ref<UploaderFile[]>([])
const isUploading = computed(() => {
  return uploadFlifes.value.some((file) => file.status === 'loading')
})

function triggerUpload() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files
  if (file) {
    const uploadFile = file[0]
    const formData = new FormData()
    formData.append(uploadFile.name, uploadFile)
    const fileObj = reactive<UploaderFile>({
      uid: uid(),
      size: uploadFile.size,
      name: uploadFile.name,
      status: 'loading',
      raw: uploadFile
    })
    uploadFlifes.value.push(fileObj)
    axios
      .post(props.url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res: any) => {
        fileObj.status = 'success'
        console.log(res.data)
      })
      .catch(() => {
        fileObj.status = 'error'
      })
      .finally(() => {
        if (fileInput.value) {
          fileInput.value.value = ''
        }
      })
  }
}

function removeFile(id: string) {
  uploadFlifes.value = uploadFlifes.value.filter((file) => file.uid === id)
}
</script>

<template>
  <div class="file-upload">
    <button @click="triggerUpload" :disabled="isUploading">
      <span v-if="isUploading">正在上传</span>
      <span v-else>点击上传</span>
    </button>
    <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
    <ul class="upload-list">
      <li
        :class="`upoaded-file upload-${file.status}`"
        v-for="file in uploadFlifes"
        :key="file.uid"
      >
        <span class="filename">{{ file.name }}</span>
        <button @click="removeFile(file.uid)" class="delete-file">Del</button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
.upload-list {
  margin: 0;
  padding: 0;
  list-style: none;
  li {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    font-size: 14px;
    line-height: 1.8;
    margin-top: 5px;
    border-radius: 4px;
    min-width: 200px;
    position: relative;
    &:first-child {
      margin-top: 10px;
    }
  }
}
.filename {
  margin-left: 5px;
  margin-right: 40px;
}
.uplod-uploading {
  color: yellow;
}
.upload-success {
  color: green;
}
.upload-error {
  color: red;
}
</style>
