<template>
  <div class="editor" id="editor-layout-main">
    <!-- <Spin tip="读取中" class="editor-spinner"> </Spin> -->

    <ADrawer title="设置面板" placement="right" width="400" :closable="true"> 设置面板 </ADrawer>
    <!-- <div class="final-preview">
      <div class="final-preview-inner">
        <div class="preview-title">预览标题</div>
        <div class="iframe-container">预览</div>
      </div>
    </div> -->
    <a-modal
      title="发布成功"
      v-model:open="showModal"
      width="700px"
      :footer="null"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <channel-form />
    </a-modal>
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <InlineEditor :value="pageData.title" @change="titleChange" class="title">
            {{ pageData.title }}
          </InlineEditor>
        </div>
        <a-menu :selectable="false" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
          <a-menu-item key="1">
            <a-button type="primary">预览和设置</a-button>
          </a-menu-item>
          <a-menu-item key="2">
            <a-button type="primary" @click="saveWork"> 保存 </a-button>
          </a-menu-item>
          <a-menu-item key="3">
            <a-button type="primary" @click="publishWork">发布</a-button>
          </a-menu-item>
          <a-menu-item key="4">
            <AboutUser />
          </a-menu-item>
        </a-menu>
      </a-layout-header>
    </a-layout>
    <ALayout>
      <ALayoutSider width="350" style="background: #fff">
        <div class="sidebar-container">
          <ListComp @addItem="handleAddItem" />
        </div>
      </ALayoutSider>
      <ALayout style="padding: 0 24px 24px">
        <ALayoutContent class="preview-container">
          <!-- <p>{{ pageData.props }}</p> -->
          <HistoryOperate />

          <div
            class="preview-list"
            :style="pageData.props"
            id="canvas-area"
            @drop="handleDrop"
            @dragover="handleDragover"
          >
            <EditWrapper
              v-for="ele in elements"
              @update-position="updatePosition"
              :key="ele.id"
              :id="ele.id"
              :props="ele.props"
              @setActive="handleSetActive"
              :active="ele.id === (currentElement && currentElement.id)"
            >
              <div v-if="ele.props?.src" class="img">
                <ImageComp v-bind="ele.props" class="img" />
              </div>
              <TextComp v-bind="ele.props" v-else-if="ele.id" />
            </EditWrapper>
          </div>
        </ALayoutContent>
      </ALayout>
      <ALayoutSider width="350" style="background: #fff" class="settings-panel">
        <ATabs type="card" v-model:activeKey="activeKey">
          <ATabPane key="component" tab="属性设置" class="no-top-radius">
            <div v-if="currentElement">
              <GroupProps
                v-if="!currentElement.isLocked"
                :props="currentElement?.props"
                @change="handleChange"
              />
              <div v-else>
                <a-empty description="该元素已被锁定,无法编辑" />
              </div>
            </div>
          </ATabPane>
          <ATabPane key="layer" tab="图层设置">
            <layerSetting
              :list="elements"
              @change="handleChange"
              :select-id="currentElement && currentElement.id"
              @select="(id: string) => handleSetActive(id)"
            />
          </ATabPane>
          <ATabPane key="page" tab="页面设置">
            <div class="page-settings">
              <PropsTable :props="pageData?.props" @change="handleChangePage" />
            </div>
            {{ pageData?.props }}
          </ATabPane>
        </ATabs>
      </ALayoutSider>
    </ALayout>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { TextComp, ImageComp } from 'editor-components-sw'
import { useEditStore } from '@/stores/edit'
import ListComp from '@/component/ListComp.vue'
import EditWrapper from '@/component/EditWrapper.vue'
import LayerSetting from '@/component/LayerSetting.vue'
import GroupProps from '@/component/GroupProps.vue'
import PropsTable from '@/component/PropsTable.vue'
import HistoryOperate from './HistoryOperate.vue'
import InlineEditor from '@/component/InlineEditor.vue'
import AboutUser from '@/component/AboutUser.vue'
import { pickBy } from 'lodash-es'
import { initFastKeys } from '@/plugin/initHotKeys'
import { initRightMenu } from '@/plugin/initRightMenu'
import { createChannel, getChannels, getWork, publish, updateWork } from '@/request/work'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import type { ComponentData, WorkData } from '@/types/edit.'
import { pageDefaultPropsData } from '@/stores/common/constants'
import { message, Modal } from 'ant-design-vue'
import { useScreenshot } from '@/hooks/useScreenshot'
import ChannelForm from './ChannelForm.vue'

onMounted(() => {
  nextTick()
  getWorkInfo()
})

initFastKeys()
initRightMenu()

let timer = 0
const showModal = ref(false)
const route = useRoute()
const editStore = useEditStore()
const workId = route.params.id as string

const { addEditInfo, editInfo, getCurrentElement, setActive, updateComponent, updatePage } =
  editStore

const activeKey = ref('component')
const currentElement = computed<undefined | ComponentData>(() => getCurrentElement())
const elements = computed(() => editInfo.components)
const pageData = computed(() => editInfo.pageData)

const handleAddItem = (newData: ComponentData) => {
  addEditInfo(newData)
}

function handleSetActive(id: string) {
  setActive(id)
}

function handleChange(e: any) {
  updateComponent(e)
}

function handleChangePage(e: any) {
  updatePage(e)
}

function updatePosition(data: Record<string, any>) {
  const { id } = data
  const updateData = pickBy(data, (val, key) => key !== 'id')

  const keysArr = Object.keys(updateData)
  const valuesArr = Object.values(updateData).map((val) => val + 'px')

  updateComponent({ key: keysArr, value: valuesArr, id })
}

function getWorkInfo() {
  if (workId) {
    getWork(workId).then((res) => {
      const { content, ...rest } = res.data as WorkData
      editInfo.pageData = { ...editInfo.pageData, ...rest }
      editInfo.components = content.components

      if (content.props) {
        editInfo.pageData.props = { ...pageDefaultPropsData, ...content.props }
      }
    })
  }
}

function titleChange(value: string) {
  updatePage({ key: 'title', value, isRoot: true })
}

function handleDrop(event: DragEvent) {
  event.preventDefault()

  const container = document.getElementById('canvas-area') as HTMLElement

  const { x, y } = container.getBoundingClientRect()

  const newItemData = JSON.parse(event.dataTransfer!.getData('data'))
  const position = JSON.parse(event.dataTransfer!.getData('position'))

  const left = event.pageX - x - position.x + 'px'
  const top = event.pageY - y - position.y + 'px'

  newItemData.props.left = left
  newItemData.props.top = top

  addEditInfo(newItemData)
}

function handleDragover(event: DragEvent) {
  event.preventDefault()
}

async function publishWork() {
  setActive('')
  await nextTick()
  const ele = document.getElementById('canvas-area') as HTMLElement
  const url = await useScreenshot(ele)

  if (url) {
    updatePage({ key: 'coverImg', value: url as string, isRoot: true })
    // await saveWork()

    await publish(workId).then((res) => {
      showModal.value = true
    })

    const res = await getChannels({ id: workId })

    if (!res.data || res.data.list.length === 0) {
      const newChannels = await createChannel({ name: '默认', workId })
    }
  }
}

async function saveWork() {
  const data = {
    ...pageData.value,
    content: {
      components: editInfo.components,
      props: pageData.value.props
    }
  }

  await updateWork(workId, data).then(() => {
    message.success('保存成功!', 1)
    editInfo.history = []
    editInfo.isdirty = false
  })
}

onMounted(() => {
  timer = window.setInterval(
    () => {
      if (editInfo.isdirty) {
        saveWork()
      }
    },
    3 * 60 * 1000
  )
})

onUnmounted(() => {
  clearInterval(timer)
})

onBeforeRouteLeave((to, from, next) => {
  if (editInfo.isdirty) {
    Modal.confirm({
      title: '作品还未保存',
      okText: '保存',
      okType: 'primary',
      cancelText: '不保存',
      onOk: async () => {
        await saveWork()
        next()
      },
      onCancel: () => {
        next()
      }
    })
  } else {
    next()
  }
})
</script>

<style scoped>
.title {
  color: #fff;
  font-size: 16px;
}
.header {
  display: flex;
  justify-content: space-between;
}
.header .logo-img {
  margin-right: 20px;
  height: 40px;
}
.page-title {
  display: flex;
  width: 200px;
}
.header h4 {
  color: #ffffff;
}
.editor-spinner {
  position: fixed;
  right: 50%;
  top: 10px;
}
.img > * {
  width: 96px !important;
  height: 96px !important;
}
.preview-container {
  padding: 24px;
  margin: 0;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* position: relative; 如果设置了定位 那么子元素的offset拿到的就是相对于这个元素的便宜值 */
}
.preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: hidden;
  position: absolute;
  margin-top: 50px;
  max-height: 80vh;
}
.preview-list.active {
  border: 1px solid #1890ff;
}
.preview-list.canvas-fix .l-text-component,
.preview-list.canvas-fix .l-image-component,
.preview-list.canvas-fix .l-shape-component {
  box-shadow: none !important;
}
.preview-list.canvas-fix {
  position: absolute;
  max-height: none;
}

.sidebar-container {
  padding: 20px;
}
.body-container {
  width: 100%;
  height: 100%;
  background-size: cover;
}
.page-settings {
  padding: 16px;
}
.settings-panel .ant-tabs-top-content {
  max-height: calc(100vh - 68px - 56px);
  overflow-y: auto;
}
.final-preview {
  position: absolute;
  width: calc(100% - 400px);
  height: 100%;
  background: transparent;
  top: 0;
  left: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.final-preview-inner {
  width: 430px;
  height: 870px;
  padding: 60px 28px;
  position: relative;
  background: url('~@/assets/phone-back.png') no-repeat;
  background-size: cover;
}
.final-preview-inner .preview-title {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
}
.iframe-container {
  width: 50%;
  height: 706px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iframe-placeholder {
  background: url('~@/assets/loading.svg') 50% 50% no-repeat;
  background-size: 50px;
}
.settings-panel .ant-list-bordered {
  border-radius: 0;
}
.settings-panel .ant-collapse {
  border-radius: 0;
}
.ant-collapse-header,
.ant-collapse-item {
  border-radius: 0 !important;
}
.settings-panel .ant-tabs-tab {
  border-radius: 0 !important;
}
</style>
