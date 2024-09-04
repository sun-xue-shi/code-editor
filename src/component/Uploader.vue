<script setup lang="ts">
import type { UploaderFile, ActionType } from '@/types/upload'
import { v4 as uid } from 'uuid'
import { computed, reactive, ref } from 'vue'
import axios from 'axios'
import { DeleteOutlined, FileOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { last } from 'lodash-es'

const props = defineProps<ActionType>()

const fileInput = ref<null | HTMLInputElement>(null)
const uploadFlifes = ref<UploaderFile[]>([])
const isUploading = computed(() => {
  return uploadFlifes.value.some((file) => file.status === 'loading')
})
const lastFileData = computed(() => {
  const lastFile = last(uploadFlifes.value)
  if (lastFile) {
    return {
      loaded: lastFile.status === 'success',
      data: lastFile.response
    }
  }
  return false
})
const isDragOver = ref(false)
let events: { [key: string]: (e: DragEvent) => void } = {
  click: triggerUpload
}

if (props.drag) {
  events = {
    ...events,
    dragover: (e: DragEvent) => {
      handleDrag(e, true)
    },
    dragleave: (e: DragEvent) => {
      handleDrag(e, false)
    },
    drop: handleDrop
  }
}

function triggerUpload() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

function postFile(uploadFile: File) {
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
      fileObj.response = res.data
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

function uploadFiles(files: null | FileList) {
  if (files) {
    const uploadFile = files[0]
    if (props.beforeUpload) {
      const result = props.beforeUpload(uploadFile)
      if (result && result instanceof Promise) {
        result
          .then((res) => {
            if (res instanceof File) {
              postFile(res)
            } else {
              throw new Error('beforeUpload Promise should return File object')
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } else if (result === true) {
        postFile(uploadFile)
      }
    } else {
      postFile(uploadFile)
    }
    postFile(uploadFile)
  }
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  uploadFiles(target.files)
}

function removeFile(id: string) {
  uploadFlifes.value = uploadFlifes.value.filter((file) => file.uid === id)
}

function handleDrag(e: DragEvent, over: boolean) {
  e.preventDefault()
  isDragOver.value = over
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false
  if (e.dataTransfer) {
    uploadFiles(e.dataTransfer.files)
  }
}
</script>

<template>
  <div class="file-upload">
    <div v-on="events" class="upload-area" :class="{ 'is-dragover': drag && isDragOver }">
      <slot v-if="isUploading" name="loading">
        <button disabled>正在上传</button>
      </slot>
      <slot
        name="uploaded"
        v-else-if="lastFileData && lastFileData.loaded"
        :uploadedData="lastFileData.data"
      >
        <button>点击上传</button>
      </slot>
      <slot v-else name="default">
        <button>点击上传</button>
      </slot>
    </div>
    <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
    <ul class="upload-list">
      <li
        :class="`upoaded-file upload-${file.status}`"
        v-for="file in uploadFlifes"
        :key="file.uid"
      >
        <span v-if="file.status === 'loading'" class="file-icon"><LoadingOutlined /></span>
        <span v-else class="file-icon"><FileOutlined /></span>
        <span class="filename">{{ file.name }}</span>
        <button @click="removeFile(file.uid)" class="delete-file"><DeleteOutlined /></button>
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
.file-icon {
  svg {
    margin-left: 5px;
    color: rgba(0, 0, 0, 0.45);
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
&.upload-error {
  color: #f5222d;
  svg {
    color: #f5222d;
  }
}
</style>
