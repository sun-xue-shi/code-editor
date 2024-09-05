<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useTemplateStore } from '@/stores/template'
import { UserOutlined } from '@ant-design/icons-vue'
import Uploader from './Uploader.vue'

const templateStore = useTemplateStore()
const list = templateStore.templateInfo
</script>

<template>
  <div class="template-list-component">
    <Uploader url="http://local.test:7001/api/upload" listType="picture" />
    <ARow :gutter="16">
      <ACol :span="6" v-for="item in list" :key="item.id" class="poster-item">
        <router-link to="/edit">
          <ACard hoverable>
            <template #cover>
              <!-- <img :src="item.coverImg"  /> -->

              <div class="hover-item">
                <a-button size="large" type="primary">'编辑该作品'</a-button>
              </div>
            </template>
            <ACardMeta :title="item.title">
              <template #description>
                <div class="description-detail">
                  <span>作者:{{ item.author }}</span>
                  <span class="user-number"><UserOutlined />{{ item.copiedCount }} </span>
                </div>
              </template>
            </ACardMeta>
          </ACard>
          <div class="tag-list">
            <ATag color="red"> HOT </ATag>
            <ATag color="green"> NEW </ATag>
          </div>
        </router-link>
      </ACol>
    </ARow>
  </div>
</template>

<style scoped lang="less">
.poster-item {
  position: relative;
  margin-bottom: 20px;
}

.poster-item .ant-card {
  border-radius: 12px;
}

.tag-list {
  position: absolute;
  top: -4px;
  left: 6px;
}

.poster-item .ant-card-cover {
  height: 390px;
}

.poster-item .ant-card-cover > img {
  width: 100%;
}

.poster-item .blur-image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 15px;
}

.blur-image > img {
  width: 70%;
  text-align: center;
  margin: 0 auto;
}

.poster-item .ant-card-hoverable {
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.1);
}

.poster-item .ant-card-body {
  padding: 0;
}

.poster-item .ant-card-meta {
  margin: 0;
}

.poster-item .ant-card-meta-title {
  color: #333;
  padding: 10px 12px;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 0 !important;
}

.description-detail {
  display: flex;
  justify-content: space-between;
  padding: 13px 12px;
  color: #999;
}

.user-number {
  font-weight: bold;
}

.poster-title {
  height: 70px;
}

.poster-title h2 {
  margin-bottom: 0px;
}

.poster-item .ant-card-cover {
  position: relative;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.poster-item .ant-card-cover img {
  transition: all ease-in 0.2s;
}

.hover-item {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: none;
  background: rgba(0, 0, 0, 0.8);
  align-items: center;
  justify-content: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.poster-item:hover .hover-item {
  display: flex;
}

.poster-item:hover img {
  transform: scale(1.25);
}

.barcode-container img {
  border-radius: 0;
}
</style>
