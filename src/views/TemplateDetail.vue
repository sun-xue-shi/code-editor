<template>
  <div class="work-detail-container">
    <Row type="flex" justify="center">
      <Col :span="8" class="cover-img"> 海报图片 </Col>
      <Col :span="8">
        <h2>海报标题</h2>
        <p>描述</p>
        <div class="author">头像： 该模版由 <b>xxx</b> 创作</div>
        <div class="bar-code-area">
          <span>扫一扫，手机预览</span>
          <div ref="container">二维码图片</div>
        </div>
        <div class="use-button">
          <Button type="primary" size="large"> 创建中... </Button>
          <Button size="large" :style="{ marginLeft: '20px' }"> 下载图片海报 </Button>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script setup lang="ts">
import { Button, Col, Row } from 'ant-design-vue'
</script>

<style scoped lang="less">
.work-detail-container {
  margin-top: 50px;
}
.cover-img {
  margin-right: 30px;
}
.cover-img img {
  width: 100%;
}
.use-button {
  margin: 30px 0;
}
.ant-avatar {
  margin-right: 10px;
}
.bar-code-area {
  margin: 20px 0;
}
</style>
