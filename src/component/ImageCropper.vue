<script setup lang="ts">
import { ref, h, watch, nextTick } from 'vue'
import { ScissorOutlined } from '@ant-design/icons-vue'
import Cropper from 'cropperjs'
import { uploadCropper } from '@/request/file'

const props = defineProps<{ value: string }>()

const emit = defineEmits<{
  change: [value: string]
}>()

let cropper: Cropper
const isShowModal = ref(false)
const cropperImage = ref<HTMLImageElement | null>(null)
let cropperData = ref({})
let cropperUrl = ref('')

watch(isShowModal, async (newVal) => {
  if (newVal) {
    await nextTick()

    if (cropperImage.value) {
      cropper = new Cropper(cropperImage.value, {
        crop(event) {
          const { height, width, x, y } = event.detail
          cropperData.value = {
            height: Math.floor(height),
            width: Math.floor(width),
            x: Math.floor(x),
            y: Math.floor(y)
          }
        },
        aspectRatio: 16 / 9,
        viewMode: 1,
        checkCrossOrigin: false,
        checkOrientation: false
      })
    }
  }
})

function handlleOk() {
  if (cropperData.value) {
    cropper.getCroppedCanvas().toBlob((blob) => {
      if (blob) {
        const formData = new FormData()
        formData.append('files', blob, 'image.png')
        uploadCropper(formData).then((res) => {
          emit('change', res.data?.data.url[0])
          cropperUrl.value = res.data?.data.url[0]
          isShowModal.value = false
          cropper.destroy()
        })
      }
    })
  }
}
</script>

<template>
  <a-modal
    v-model:open="isShowModal"
    title="裁剪图片"
    ok-text="确认"
    cancel-text="取消"
    @ok="handlleOk"
  >
    <div>
      <img id="image" :src="value" ref="cropperImage" crossorigin="anonymous" />
    </div>
  </a-modal>

  <div class="review-image">
    <img v-if="cropperUrl" :src="cropperUrl" />
    <img v-else :src="value" />
  </div>

  <div class="image-cropper">
    <div class="handle-image">
      <a-button type="primary" :icon="h(ScissorOutlined)" @click="isShowModal = true"
        >裁剪图片</a-button
      >
    </div>
  </div>
</template>

<style scoped lang="less">
img {
  display: block;
  max-width: 100%;
}

.ant-modal div[aria-hidden='true'] {
  display: none !important;
}
</style>
