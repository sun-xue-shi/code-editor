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
      cropper = new Cropper(cropperImage.value, {
        crop(e) {
          console.log(e)
        }
      })
    } else {
      cropper && cropper.destroy()
    }
  }
})

function handleModal() {
  console.log(props)

  isShowModal.value = true
}
</script>

<template>
  <div class="image-cropper">
    <a-modal v-model:open="isShowModal" title="裁剪图片" ok-text="确认" cancel-text="取消">
      <div>
        <img id="image" :src="value" ref="cropperImage" />
      </div>
    </a-modal>

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
</style>
