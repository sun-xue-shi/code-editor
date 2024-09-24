<script setup lang="ts">
import { ref, h, watch, nextTick } from 'vue'
import { ScissorOutlined } from '@ant-design/icons-vue'
import Cropper from 'cropperjs'

const props = defineProps<{ value: string }>()

let cropper: Cropper
const isShowModal = ref(false)
const cropperImage = ref<HTMLImageElement | null>(null)

watch(isShowModal, async (newVal) => {
  if (newVal) {
    await nextTick()
    console.log('cropperImage.value', cropperImage.value)

    if (cropperImage.value) {
      console.log(111)

      cropper = new Cropper(cropperImage.value, {
        crop(event) {
          console.log('event', event)
        },
        aspectRatio: 16 / 9,
        viewMode: 1,
        checkCrossOrigin: false,
        checkOrientation: false
      })
    } else {
      cropper && cropper.destroy()
    }
  }
})

function handleModal() {
  isShowModal.value = true
}
</script>

<template>
  <a-modal v-model:open="isShowModal" title="裁剪图片" ok-text="确认" cancel-text="取消">
    <div>
      <img id="image" :src="value" ref="cropperImage" />
    </div>
  </a-modal>
  <img :src="value" alt="" />
  <div class="image-cropper">
    <div class="handle-image">
      <a-button type="primary" :icon="h(ScissorOutlined)" @click="handleModal">裁剪图片</a-button>
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
