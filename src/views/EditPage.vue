<template>
  <div class="editor" id="editor-layout-main">
    <!-- <Spin tip="读取中" class="editor-spinner"> </Spin> -->

    <ADrawer title="设置面板" placement="right" width="400" :closable="true"> 设置面板 </ADrawer>
    <a-modal
      title="发布成功"
      v-model:open="showModal"
      width="700px"
      :footer="null"
      :maskClosable="false"
      :destroyOnClose="true"
    >
      <publishResult />
    </a-modal>
    <!-- <AModal title="发布成功" width="700px" :footer="null"> 发布成功弹窗 </AModal> -->
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <InlineEditor class="title"> {{ editInfo.page.title }} </InlineEditor>
        </div>
        <a-menu :selectable="false" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
          <a-menu-item key="1">
            <!-- <a-button type="primary">预览和设置</a-button> -->
          </a-menu-item>
          <a-menu-item key="2">
            <a-button type="primary" @click="handleSave"> 保存 </a-button>
          </a-menu-item>
          <a-menu-item key="3">
            <a-button type="primary" @click="handlePublic">发布</a-button>
          </a-menu-item>
          <a-menu-item key="4">
            <AboutUser />
          </a-menu-item>
        </a-menu>
      </a-layout-header>
    </a-layout>
    <ALayout>
      <ALayoutSider width="300" style="background: #fff">
        <div class="sidebar-container">
          <ListComp @addItem="handleAddItem" />
        </div>
      </ALayoutSider>
      <ALayout style="padding: 0 24px 24px">
        <ALayoutContent class="preview-container">
          <HistoryArea @undo="handleUndo" @redo="handleRedo" />

          <div class="preview-list" id="canvas-area">
            <div
              class="body-container"
              :style="page.props"
              @dragover="handleDragover($event)"
              @drop="handleDrop($event)"
            >
              <EditWrapper
                v-for="ele in elements"
                :key="ele.id"
                :id="ele.id"
                @setActive="handleSetActive"
                @update-position="handleUpdatePosition"
                :active="ele.id === (currentElement && currentElement.id)"
                :props="ele?.props"
                :class="{ isHidden: ele.isHidden }"
              >
                <div v-if="ele.props.src">
                  <ImageComp v-bind="ele.props" class="img" style="position: static" />
                </div>

                <TextComp v-bind="ele.props" v-else />
              </EditWrapper>
            </div>
          </div>
        </ALayoutContent>
      </ALayout>
      <ALayoutSider width="300" style="background: #fff" class="settings-panel">
        <ATabs type="card">
          <ATabPane key="component" tab="属性设置" class="no-top-radius">
            <div v-if="currentElement">
              <EditGroup
                v-if="!currentElement.isLocked"
                :props="currentElement?.props"
                @change="handleChange"
              />
            </div>
            <div v-else>
              <a-empty>
                <template #description>
                  <p>该元素被锁定无法编辑</p>
                </template>
              </a-empty>
            </div>
            {{ currentElement && currentElement.props }}
          </ATabPane>
          <ATabPane key="layer" tab="图层设置">
            <LayerList
              :list="elements"
              @change="handleChange"
              :select-id="currentElement && currentElement.id"
              @select="handleSetActive"
            />
          </ATabPane>
          <ATabPane key="page" tab="页面设置">
            <div class="page-settings">
              <PropsTable :props="page.props" @change="pageChange" />
            </div>
          </ATabPane>
        </ATabs>
      </ALayoutSider>
    </ALayout>
  </div>
</template>

<script setup lang="ts">
import { TextComp, ImageComp } from 'editor-components-sw'
import ListComp from '@/component/ListComp.vue'
import { useEditStore } from '@/stores/edit'
import EditWrapper from '@/component/EditWrapper.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { CompData, PositionType } from '@/types/edit.'
import PropsTable from '@/component/PropsTable.vue'
import LayerList from '@/component/LayerList.vue'
import EditGroup from '@/component/EditGroup.vue'
import { pickBy } from 'lodash-es'
import initHotkeys from '@/plugins/hotkeys/initHotkeys'
import HistoryArea from '@/component/HistoryArea.vue'
import initRightMenu from '@/plugins/hotkeys/initRightMenu'
import type { AllComponentProps } from '@/types/props'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import { Modal } from 'ant-design-vue'
import { useScreenshot } from '@/hooks/useScreenshot'
import myRequest from '@/axios'
import publishResult from '@/component/publishResult.vue'
import { useTemplateStore } from '@/stores/template'

initHotkeys()
initRightMenu()

const route = useRoute()
const workId = route.params.id as string
const editStore = useEditStore()
const {
  addEditInfo,
  editInfo,
  getCurrentElement,
  setActive,
  updateComponent,
  updatePage,
  undo,
  redo,
  getWorkDetail,
  updateWork
} = editStore
let timer = 0
const elements = computed(() => editInfo.components)
const currentElement = computed<undefined | CompData>(() => getCurrentElement(editInfo))
const page = computed(() => {
  return editInfo.page
})
const handleAddItem = (newData: CompData) => {
  addEditInfo(newData)
}
const showModal = ref(false)

function handleSetActive(id: string) {
  setActive(editInfo, id)
}
function handleChange(e: any) {
  updateComponent(editInfo, e)
}
async function pageChange(e: any) {
  updatePage(editInfo, e)
}
async function handleUpdatePosition(data: PositionType) {
  const { id } = data
  const updateData = pickBy(data, (v, k) => k !== 'id')
  const keyArr = Object.keys(updateData)
  const valueArr = Object.values(updateData).map((value) => value + 'px')
  updateComponent(editInfo, {
    key: keyArr as Array<keyof AllComponentProps>,
    value: valueArr,
    id,
    isRoot: false
  })
}
function handleUndo() {
  undo(editInfo)
}
function handleRedo() {
  redo(editInfo)
}

getWorkDetail(workId)

function handleSave() {
  const data = {
    content: {
      components: editInfo.components,
      props: editInfo.page.props
    }
  }
  updateWork(workId, data)
}
onMounted(() => {
  timer = window.setInterval(
    () => {
      if (editInfo.isNeedSave) {
        handleSave()
      }
    },
    3 * 60 * 1000
  )
})

onUnmounted(() => {
  clearInterval(timer)
})

onBeforeRouteLeave((to, from, next) => {
  if (editInfo.isNeedSave) {
    Modal.confirm({
      title: '作品还未保存',
      okText: '保存',
      okType: 'primary',
      cancelText: '不保存',
      onOk: async () => {
        await handleSave()
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

async function handlePublic() {
  setActive(editInfo, '')
  const canvasEle = document.getElementById('canvas-area') as HTMLElement
  let url = ''
  await useScreenshot(canvasEle).then((res: any) => {
    url = res.data.data.url[0]
  })
  if (url) {
    updatePage(editInfo, { key: 'coverImg', value: url as string, isRoot: true })

    await myRequest
      .patch({
        url: `work/publish-work/${workId}`
      })
      .then(() => {
        showModal.value = true
      })
  }
}

function handleDragover(e: DragEvent) {
  e.preventDefault()
}

function handleDrop(e: DragEvent) {
  e.preventDefault()

  const container = document.getElementById('canvas-area') as HTMLElement

  const { x, y } = container.getBoundingClientRect()
  const newProps = JSON.parse(e.dataTransfer!.getData('data'))
  const position = JSON.parse(e.dataTransfer!.getData('position'))

  const left = e.pageX - x - position.x + 'px'
  const top = e.pageY - y - position.y + 'px'

  newProps.props.left = left
  newProps.props.top = top

  addEditInfo(newProps)
}
</script>

<style scoped>
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
}
.header h4 {
  color: #ffffff;
}
.editor-spinner {
  position: fixed;
  right: 50%;
  top: 10px;
}
.preview-container {
  padding: 24px;
  margin: 0;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.preview-list {
  padding: 0;
  margin: 0;
  min-width: 420px;
  height: 600px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  margin-top: 50px;
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
.img > * {
  width: 96px !important;
  height: 96px !important;
}
.isHidden {
  display: none;
}
.title {
  color: #fff;
}
</style>
