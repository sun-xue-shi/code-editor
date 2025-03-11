<script setup lang="ts">
import { RouterView } from 'vue-router'
import UserInfo from '@/component/UserInfo.vue'
import { ref } from 'vue'
import type { addInfo } from '@/types/template'
import { useTemplateStore } from '@/stores/template'
import { v4 } from 'uuid'

const open = ref<boolean>(false)
const localStorageInfo = localStorage.getItem('userInfo')
const userId = JSON.parse(localStorageInfo!)._id
const author = JSON.parse(localStorageInfo!).username
const templateStore = useTemplateStore()

const formState = ref<addInfo>({
  uuid: v4(),
  title: '',
  desc: '',
  coverImg: '',
  user: userId,
  copiedCount: 10,
  content: {},
  author: author
})
function addBtn() {
  open.value = true
}
const handleOk = () => {
  templateStore.addTemplate(formState.value)
  open.value = false
}
</script>

<template>
  <div class="homepage-container">
    <ALayout class="layout">
      <ALayoutHeader class="layout-header"
        ><div class="header">
          <UserInfo />
        </div>
        <div class="addTemplate">
          <a-button type="primary" @click="addBtn">添加</a-button>
        </div>
      </ALayoutHeader>
      <ALayoutContent class="layout-content">
        <RouterView />
      </ALayoutContent>
      <ALayoutFooter class="layout-footer">Footer</ALayoutFooter>
    </ALayout>
  </div>
  <div class="dialogBox">
    <a-modal v-model:open="open" title="创建空白海报" @ok="handleOk" width="600px">
      <div>
        <a-form
          ref="formRef"
          name="advanced_search"
          class="ant-advanced-search-form"
          :model="formState"
          @finish="handleOk"
          labelAlign="left"
        >
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item
                label="标题"
                name="title"
                :rules="[{ required: true, message: 'Please input the postaer title!' }]"
              >
                <a-input v-model:value="formState.title" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="描述"
                name="desc"
                :rules="[{ required: true, message: 'Please input the postaer description!' }]"
              >
                <a-input v-model:value="formState.desc" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item
                label="允许复制数量"
                name="copiedCount"
                :rules="[{ required: true, message: 'Please input the postaer copiedCount!' }]"
              >
                <a-input v-model:value="formState.copiedCount" />
              </a-form-item>
            </a-col>
          </a-row>
          <!-- <a-row>
            <a-col>
              <a-form-item
                label="图片"
                name="coverImg"
                :rules="[{ required: true, message: 'Please upload the postaer coverImg!' }]"
              >
                <a-input v-model:value="formState.coverImg" />
              </a-form-item>
            </a-col>
          </a-row> -->
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.layout {
  background-color: #fff;

  .layout-header {
    height: 15vh;
    display: flex;
    .header {
      width: 200px;
      height: 200px;
      color: #fff;
      font-size: 20px;
    }
  }

  .layout-content {
    margin: 50px;
    height: 70vh;
  }

  .layout-footer {
    height: 15vh;
  }
}
</style>
