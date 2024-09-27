<script setup lang="ts">
import { ScissorOutlined } from '@ant-design/icons-vue'
import { ref, h, watch, nextTick } from 'vue'
import Cropper from 'cropperjs'
import { uploadCropper } from '@/request/file'
import { useEditStore } from '@/stores/edit'

const editStore = useEditStore()
const { updatePage } = editStore

const props = withDefaults(
  defineProps<{ value: string; isPageCropper: boolean; showDelete: boolean }>(),
  {
    isPageCropper: false,
    showDelete: true
  }
)

const emit = defineEmits<{
  change: [value: string]
}>()

let cropper: Cropper
let cropperData = ref({})
let cropperUrl = ref('')

const isShowModal = ref(false)
const cropperImage = ref<HTMLImageElement | null>(null)

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
          const imageUrl = res.data?.data.url[0].replace('\\', '\\\\')

          if (props.isPageCropper) {
            const data = {
              key: 'backgroundImage',
              value: `url('${imageUrl}')`
            }
            updatePage(data)
          }
          emit('change', res.data?.data.url[0])
          cropperUrl.value = res.data?.data.url[0]
          isShowModal.value = false
          cropper.destroy()
        })
      }
    })
  }
}

function handelDelete() {
  if (props.isPageCropper) {
    const data = {
      key: 'backgroundImage',
      value: ''
    }
    updatePage(data)
  }

  emit('change', '')
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

  <div class="cropper" v-if="value">
    <div class="review-image">
      <img v-if="cropperUrl" :src="cropperUrl" width="100%" />
      <img v-else :src="value" width="100%" />
    </div>

    <div class="image-cropper">
      <a-button
        type="primary"
        class="cropper-btn"
        size="small"
        :icon="h(ScissorOutlined)"
        @click="isShowModal = true"
        >裁剪图片</a-button
      >

      <a-button type="primary" size="small" :icon="h(ScissorOutlined)" @click="handelDelete"
        >删除图片
      </a-button>
    </div>
  </div>
</template>

<style scoped lang="less">
img {
  display: block;
  max-width: 100%;
}

.review-image {
  // display: inline-block;
  width: 120px;
  margin-left: 5px;
}

.cropper {
  display: flex;
  justify-content: space-around;
}

.image-cropper {
  flex-direction: column;
  margin-left: 30px;
  margin-top: 10px;
  justify-content: space-between;
  align-items: center;
}

.cropper-btn {
  margin-bottom: 5px;
}

.ant-modal div[aria-hidden='true'] {
  display: none !important;
}
</style>
