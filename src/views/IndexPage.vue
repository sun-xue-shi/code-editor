<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Layout, LayoutContent, LayoutHeader, LayoutFooter } from 'ant-design-vue'
</script>

<template>
  <div class="homepage-container">
    <Layout class="layout">
      <LayoutHeader class="layout-header"><div class="header">Header</div></LayoutHeader>
      <LayoutContent class="layout-content">
        <RouterView />
      </LayoutContent>
      <LayoutFooter class="layout-footer">Footer</LayoutFooter>
    </Layout>
  </div>
</template>

<style scoped lang="less">
.layout {
  background-color: #fff;

  .layout-header {
    height: 15vh;

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
