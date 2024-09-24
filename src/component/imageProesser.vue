<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { ScissorOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import Cropper from 'cropperjs'
import axios from 'axios'
import SuperUploader from './SuperUploader.vue'
const emit = defineEmits<{
  (e: 'change', value: string): void
}>()
interface ImageProps {
  delete?: boolean
  value: string
}

const props = withDefaults(defineProps<ImageProps>(), {
  delete: false
})

const cropperImg = ref<null | HTMLImageElement>(null)
const showModal = ref(false)
const backgroundUrl = computed(() => `url(${props.value})`)
const showDelete = ref(false)
let cropper: Cropper
watch(showModal, async (newValue) => {
  if (newValue) {
    await nextTick()
    if (cropperImg.value) {
      cropper = new Cropper(cropperImg.value, {
        aspectRatio: 16 / 9,
        viewMode: 1,
        checkCrossOrigin: false
      })
      console.log(cropper.getCroppedCanvas(), 'getCanvasData')

      cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          const formData = new FormData()
          formData.append('croppedImage', blob, 'name')
          axios
            .post('http://localhost:3000/file/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then((res) => {
              emit('change', res.data?.data.url)
              showModal.value = false
            })
        }
      })
    }
  } else {
    if (cropper) {
      cropper.destroy()
    }
  }
})

function handleDelete() {
  emit('change', '')
}
</script>

<template>
  <div class="imgage-processer">
    <a-modal
      :open="showModal"
      title="裁剪图片"
      @ok="showModal = false"
      @cancel="showModal = false"
      okText="确认"
      cancelText="取消"
    >
      <div class="image-cropper">
        <img :src="props.value" alt="" id="processed-image" ref="cropperImg" />
      </div>
    </a-modal>
    <div class="image-preview" :style="{ backgroundImage: backgroundUrl }"></div>
    <div class="image-process">
      <div>
        <SuperUploader url="http://localhost:3000/file/upload" />
      </div>
      <a-button @click="showModal = true" style="width: 100%">
        <template v-slot:icon><ScissorOutlined />裁剪图片</template>
      </a-button>
      <a-buttom v-if="showDelete" type="danger" @click="handleDelete">
        <template v-slot:icon><DeleteOutlined />删除图片</template>
      </a-buttom>
    </div>
  </div>
</template>

<style scoped lang="less">
.imgage-processer {
  display: flex;
  justify-content: space-between;
}
.image-preview {
  width: 150px;
  height: 84px;
  border: 1px dashed #e6ebed;
  background-repeat: no-repeat; /* 防止背景图重复 */
  background-position: center; /* 图片居中 */
  background-size: contain; /* 保持纵横比，完整展示 */
}

.image-cropper img {
  display: block;
  height: 100%;
  width: 100%;
}

.image-process {
  padding: 5px 0px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
