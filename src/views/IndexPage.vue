<script setup lang="ts">
import { RouterView } from 'vue-router'
import AboutUser from '@/component/AboutUser.vue'
</script>

<template>
  <div class="homepage-container">
    <ALayout class="layout">
      <ALayoutHeader class="layout-header">
        <div class="header">
          <AboutUser /></div
      ></ALayoutHeader>
      <ALayoutContent class="layout-content">
        <RouterView />
      </ALayoutContent>
      <ALayoutFooter class="layout-footer">Footer</ALayoutFooter>
    </ALayout>
  </div>
</template>

<style scoped lang="less">
.layout {
  background-color: #fff;

  .layout-header {
    display: flex;
    justify-content: flex-end;

    height: 15vh;

    .header {
      width: 400px;
      height: 100px;
      margin-top: 20px;
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
