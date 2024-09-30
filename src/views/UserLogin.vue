<template>
  <div class="login-page">
    <a-row>
      <a-col :span="12" class="aside">
        <div class="aside-inner">
          <h2>低代码海报编辑器</h2>
          <span class="author">Sun Zilong && Wei Mengyu</span>
        </div>
      </a-col>

      <a-col :span="12" class="login-area">
        <div class="welcome">
          <h2>欢迎登录</h2>
          <p class="subTitle">使用和验证码登录到慕课乐高</p>
        </div>
        <a-tabs v-model:activeKey="activeTabKey">
          <a-tab-pane :key="1" tab="邮箱登录">
            <a-form :model="emailForm" ref="publishForm" layout="vertical">
              <a-form-item label="用户名" required name="username">
                <a-input placeholder="用户名" v-model:value="emailForm.username">
                  <template v-slot:prefix>
                    <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="邮箱" required name="email">
                <a-input placeholder="请输入邮箱" v-model:value="emailForm.email">
                  <template v-slot:prefix>
                    <MailOutlined style="color: rgba(0, 0, 0, 0.25)" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="验证码" required name="code">
                <a-input placeholder="请输入验证码" v-model:value="emailForm.code">
                  <template v-slot:prefix>
                    <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" size="large" @click="emailLogin"> 登录 </a-button>
                <a-button size="large" :style="{ marginLeft: '20px' }" @click="sendcode">
                  获取验证码
                </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane :key="2" tab="账号登录">
            <a-form :model="pwdForm" ref="publishForm" layout="vertical">
              <a-form-item label="用户名" required name="username">
                <a-input placeholder="用户名" v-model:value="pwdForm.username">
                  <template v-slot:prefix>
                    <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="密码" required name="password">
                <a-input placeholder="请输入密码" v-model:value="pwdForm.password">
                  <template v-slot:prefix>
                    <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" size="large"> 登录 </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { loginByEmail, loginCaptcha } from '@/request/user'
import { useUserStore } from '@/stores/user'
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message, type FormInstance } from 'ant-design-vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const activeTabKey = ref(1)
const publishForm = ref<FormInstance>()

const emailForm = reactive({
  username: '',
  email: '',
  code: '',
  type: 1
})

const pwdForm = reactive({
  username: '',
  password: '',
  type: 2
})

async function sendcode() {
  if (!emailForm.email) {
    return message.error('请输入邮箱!')
  }
  await loginCaptcha({ receiver: emailForm.email, type: 1 }).then(() => {
    message.success('发送成功,60s后可重新发送')
  })
}

async function emailLogin() {
  await publishForm.value?.validate()
  await loginByEmail(emailForm).then((res) => {
    if (res.data) {
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)

      userStore.setUser(res.data.userInfo)

      message.success('登录成功,2s后跳转主页')
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
  })
}
</script>

<style>
.logo-area {
  position: absolute;
  top: 30px;
  width: 150px;
}
.aside {
  height: 100vh;
  background-color: #1a1919;
  background-size: cover;
  background-repeat: no-repeat;
}
.aside .logo-img {
  width: 200px;
  margin-bottom: 20px;
}
.aside h2 {
  color: #cccccc;
  font-size: 29px;
}
.aside-inner {
  width: 60%;
  text-align: center;
}
.login-area {
  height: 100vh;
}
.login-area .ant-form {
  width: 350px;
}
.text-white-70 {
  color: #999;
  display: block;
  font-size: 19px;
}
.aside,
.login-area {
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-area h2 {
  color: #333333;
  font-size: 29px;
}
.login-area .subTitle {
  color: #666666;
  font-size: 19px;
}
.login-area .ant-form-item-label {
  display: none;
}
.login-area .ant-input-prefix {
  left: auto;
  right: 30px;
  font-size: 19px;
}
.login-area .ant-input {
  font-size: 17px;
  padding: 20px 45px 20px 30px;
  border-color: #ebf2ff;
}

.welcome {
  position: absolute;
  top: 20%;
  left: 30%;
}

.subTitle {
  margin-top: 10px;
}

.author {
  color: #666666;
  font-size: 15px;
  font-weight: 700;
  line-height: 35px;
}
</style>
