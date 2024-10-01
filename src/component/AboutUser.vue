<template>
  <!-- <a-button type="primary" v-if="!user.isLogin" class="user-profile-component">
    <router-link to="/login">登录</router-link>
  </a-button> -->
  <div class="header-operation">
    <a-button type="primary"> 创建设计 </a-button>
    <a-button type="primary" class="user-profile-component">
      <router-link to="/mywork">我的作品</router-link>
    </a-button>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">{{ user?.username }}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="2"><router-link to="/mywork">我的作品</router-link></a-menu-item>
          <a-menu-item key="3"><router-link to="/setting">个人设置</router-link></a-menu-item>
          <a-menu-item key="4" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const { user, removeUser } = userStore

function logout() {
  //将token信息用store存，登出直接全部清空
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  removeUser()
  message.success('已退出登录')
  router.push('/login')
}
</script>

<style>
.user-profile-dropdown {
  border-radius: 2px !important;
}
.user-operation > * {
  margin-left: 30px !important;
}

.header-operation {
  display: flex;
  justify-content: space-between;
  width: 400px;
}
</style>
