<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="homepage-container">
    <ALayout class="layout">
      <ALayoutHeader class="layout-header"><div class="header">Header</div></ALayoutHeader>
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
