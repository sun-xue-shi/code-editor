<template>
  <div class="publish-channel-container">
    <a-row :style="{ marginBottom: '20px' }">
      <a-col :span="8" class="left-col">
        封面图
        <img :src="pageData.coverImg" :alt="pageData.title" />
      </a-col>
      <a-col :span="16" class="right-col">
        <a-row>
          <a-col :span="6">
            <!-- <img
              :src="
                (page.setting && page.setting.shareImg) ||
                'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png'
              "
              :alt="page.title"
            /> -->
          </a-col>
          <a-col :span="18" class="left-gap">
            <h4>{{ pageData.title }}</h4>
            <p>{{ pageData.desc }}</p>
          </a-col>
        </a-row>
        <a-tabs type="card" :style="{ marginTop: '20px' }">
          <a-tab-pane key="channels" tab="发布为作品">
            <a-row v-for="channel in channels" :key="channel.id" class="channel-item">
              <a-col :span="6">
                <canvas :id="`channel-barcode-${channel.id}`" class="barcode-container"></canvas>
              </a-col>
              <a-col :span="18" class="left-gap">
                <h4>{{ channel.name }}</h4>
                <a-row>
                  <a-col :span="18">
                    <a-input
                      :readonly="true"
                      :id="`channel-url-${channel.id}`"
                      v-model:value="channel.id"
                    />
                  </a-col>
                  <a-col :span="6">
                    <a-button
                      class="copy-button"
                      :data-clipboard-target="`#channel-url-${channel.id}`"
                    >
                      复制
                    </a-button>

                    <a-button
                      type="primary"
                      danger
                      size="small"
                      @click="handleDeleteChannel(channel.id)"
                      :disabled="channels.length === 1"
                    >
                      删除渠道
                    </a-button>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <a-form layout="inline" :model="form" ref="createForm" :style="{ marginTop: '20px' }">
              <a-form-item name="channelName" required>
                <a-input v-model:value="form.channelName" placeholder="渠道名称"></a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="createNewChannel"> 创建新渠道 </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="template" tab="发布为模版">
            <a-row class="channel-item">
              <a-col :span="6">
                <div id="channel-barcode-template" class="barcode-container"></div>
              </a-col>
              <a-col :span="18" class="left-gap">
                <h4>模版信息</h4>
                <a-row>
                  <a-col :span="18">
                    <a-input :readonly="true" id="channel-url-template" />
                  </a-col>
                  <a-col :span="6">
                    <a-button class="copy-button" data-clipboard-target="#channel-url-template">
                      复制
                    </a-button>
                  </a-col>
                </a-row>
              </a-col>
            </a-row>
            <div class="template-submit">
              <a-button type="primary" size="large"> 发布模版 </a-button>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { createChannel, deleteChannel, getChannels } from '@/request/work'
import { useEditStore } from '@/stores/edit'
import type { Channel } from '@/types/edit.'
import { message, type FormInstance } from 'ant-design-vue'
import { computed, onMounted, reactive, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import QRcode from 'qrcode'
import { watch } from 'vue'
import { last } from 'lodash-es'
import Clipboard from 'clipboard'
const form = reactive({
  channelName: ''
})

const createForm = ref<FormInstance>()
const route = useRoute()
const workId = route.params.id as string
const editStore = useEditStore()
const { editInfo } = editStore
let channels = ref<Channel[]>([])
const pageData = computed(() => editInfo.pageData)

watch(channels, async (newVal, oldVal) => {
  if (newVal.length > oldVal.length) {
    const newChannel = last(newVal)!

    await nextTick()

    const ele = document.getElementById(`channel-barcode-${newChannel.id}`) as HTMLCanvasElement
    QRcode.toCanvas(ele, pageData.value.coverImg, { width: 100 })
  }
})

async function createNewChannel() {
  await createForm.value?.validate()
  await createChannel({ name: form.channelName, workId })
  await getAllChannels()
}

async function getAllChannels() {
  const res = await getChannels({ id: workId })
  channels.value = res.data.list
}

async function handleDeleteChannel(id: string) {
  await deleteChannel({ id, workId }).then(() => {
    getAllChannels()
  })
}

function createQRcode() {
  channels.value.forEach((channel) => {
    const ele = document.getElementById(`channel-barcode-${channel.id}`) as HTMLCanvasElement
    QRcode.toCanvas(ele, pageData.value.coverImg, { width: 100 })
  })
}

onMounted(async () => {
  const clipboard = new Clipboard('.copy-button')
  clipboard.on('success', (e) => {
    message.success('复制成功', 1)
    e.clearSelection()
  })
  await getAllChannels()
  createQRcode()
})
</script>

<style>
.left-col img {
  width: 80%;
}
.right-col img {
  width: 80px;
}
.left-gap {
  padding-left: 5px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.delete-area {
  position: absolute;
  top: 10px;
  right: 20px;
}
.channel-item {
  padding: 10px 0;
  border-bottom: 1px solid #efefef;
}
.barcode-container {
  height: 80px;
  width: 80px;
}
.template-submit {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
