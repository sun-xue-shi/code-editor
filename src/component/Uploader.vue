<script setup lang="ts">
import type { UploaderFile, ActionType } from '@/types/upload'
import { v4 as uid } from 'uuid'
import { computed, reactive, ref } from 'vue'
import axios from 'axios'
import { last } from 'lodash-es'

const props = withDefaults(defineProps<ActionType>(), {
  drag: true,
  listType: 'picture',
  showUploadList: true,
  autoUpload: true
})

const emit = defineEmits<{
  success: [data: any]
}>()

const fileInput = ref<null | HTMLInputElement>(null)
const fileList = ref<UploaderFile[]>([])
const isUploading = computed(() => {
  return fileList.value.some((file) => file.status === 'loading')
})
const lastFileData = computed(() => {
  const lastFile = last(fileList.value)
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

function postFile(readyFile: UploaderFile) {
  const formData = new FormData()
  formData.append('files', readyFile.raw)
  readyFile.status = 'loading'

  axios
    .post(props.url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res: any) => {
      readyFile.status = 'success'
      readyFile.response = res.data
      emit('success', res.data)
    })
    .catch(() => {
      readyFile.status = 'error'
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
              addFileToList(res)
            } else {
              throw new Error('beforeUpload Promise should return File object')
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } else if (result === true) {
        addFileToList(uploadFile)
      }
    } else {
      addFileToList(uploadFile)
    }
  }
}
function addFileToList(uploadFile: File) {
  const fileObj = reactive<UploaderFile>({
    uid: uid(),
    size: uploadFile.size,
    name: uploadFile.name,
    status: 'ready',
    raw: uploadFile,
    url: ''
  })

  if (props.listType === 'picture') {
    try {
      fileObj.url = URL.createObjectURL(uploadFile)
    } catch (error) {
      console.log('上传失败', error)
    }
  }
  fileList.value.push(fileObj)
  if (props.autoUpload) {
    fileList.value.forEach((file) => (file.status = 'loading'))
    postFile(fileObj)
  }
}

function uploadToFile(e: Event) {
  e.stopPropagation()
  fileList.value
    .filter((file) => file.status === 'ready')
    .forEach((readyFile) => postFile(readyFile))
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  uploadFiles(target.files)
}

// function removeFile(id: string) {
//   fileList.value = fileList.value.filter((file) => file.uid !== id)
// }

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
        <a-button disabled size="small">正在上传</a-button>
      </slot>
      <slot
        name="uploaded"
        v-else-if="lastFileData && lastFileData.loaded"
        :uploadedData="lastFileData.data"
      >
        <a-button size="small">点击上传</a-button>
      </slot>
      <slot v-else name="default">
        <a-button size="small">点击上传</a-button>
        <a-button v-if="!props.autoUpload" @click="uploadToFile" size="small">点击提交</a-button>
      </slot>
    </div>
    <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" />
    <!-- <ul v-if="showUploadList" :class="`upload-list upload-list-${listType}`">
      <li :class="`upoaded-file upload-${file.status}`" v-for="file in fileList" :key="file.uid">
        <img :src="file.url" :alt="file.name" class="preview-picture" />
        <div :class="`file-handle ${file.url}`">
          <span v-if="file.status === 'loading'" class="file-icon"><LoadingOutlined /></span>
          <span v-else class="file-icon"><FileOutlined /></span>
          <span class="filename">{{ file.name }}</span>
          <button @click="removeFile(file.uid)" class="delete-file"><DeleteOutlined /></button>
        </div>
      </li>
    </ul> -->
  </div>
</template>

<style scoped lang="less">
.upload-list {
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

.preview-picture {
  width: 20%;
  height: 50px;
  margin-right: 5px;
}
.upoaded-file {
  display: flex;
  justify-content: left;
  padding: 8px;
}
.upoaded-file:hover {
  background-color: #ccc;
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
.file-upload .upload-area {
  background: #eaedf0;
  border: 1px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
  padding: 20px;
  width: 200px;
  height: 100px;
  text-align: center;
  &:hover {
    border: 1px dashed #1890ff;
  }
  &.is-dragover {
    border: 2px dashed #1890ff;
    background: rgba(#1890ff, 0.2);
  }
}

.upload-area {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
