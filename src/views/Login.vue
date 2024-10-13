<script setup lang="ts">
import { useLoginStore } from '@/stores/login'
import type { FormState } from '@/types/login'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'

const loginStore = useLoginStore()
const { login, getLoginCode } = loginStore
const formState = reactive<FormState>({
  username: '',
  password: '',
  code: '',
  email: '',
  type: 2
})

function emailLogin() {
  formState.type = 1
}
function passwordLogin() {
  formState.type = 2
}
function commitBtn() {
  login(formState)
}
function getCode() {
  if (formState.email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,})$/
    if (regex.test(formState.email)) {
      getLoginCode(formState.email)
    } else {
      message.error('邮箱格式不正确')
    }
  } else {
    message.warn('邮箱不能为空')
  }
}
</script>

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
          <p class="subTitle">使用账号或邮箱验证码登录系统</p>
        </div>
        <div class="login">
          <a-form
            :model="formState"
            name="basic"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
            class="form"
          >
            <a-form-item
              label="用户名"
              name="username"
              :rules="[{ required: true, message: 'Please input your username!' }]"
            >
              <a-input v-model:value="formState.username" />
            </a-form-item>
            <a-form-item
              label="邮箱"
              name="email"
              :rules="[{ required: true, message: 'Please input your email!' }]"
              v-if="formState.type === 1"
            >
              <div class="email">
                <a-input v-model:value="formState.email" />
                <a-button type="primary" @click="getCode">获取验证码</a-button>
              </div>
            </a-form-item>
            <a-form-item
              v-if="formState.type === 2"
              label="密码"
              name="password"
              :rules="[{ required: true, message: 'Please input your password!' }]"
            >
              <a-input-password v-model:value="formState.password" />
            </a-form-item>
            <a-form-item
              v-if="formState.type === 1"
              label="验证码"
              name="code"
              :rules="[{ required: true, message: 'Please input your code!' }]"
            >
              <a-input v-model:value="formState.code" />
            </a-form-item>

            <a-form-item>
              <div class="checkBoxItem" @click="emailLogin" v-if="formState.type === 2">
                邮箱登录
              </div>
              <div class="checkBoxItem" @click="passwordLogin" v-if="formState.type === 1">
                密码登录
              </div>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
              <a-button type="primary" html-type="submit" class="buttom" @click="commitBtn"
                >登录</a-button
              >
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

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
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.login-area h2 {
  color: #333333;
  font-size: 29px;
  margin-bottom: 3px;
}
.login-area .subTitle {
  color: #666666;
  font-size: 19px;
}
.welcome {
  margin-bottom: 80px;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
.form {
  width: 100%;
  .checkBoxItem {
    padding-left: 67px;
    cursor: pointer;
  }
  .checkBoxItem:hover {
    color: blue;
  }
  .email {
    display: flex;
  }
  .buttom {
    width: 200px;
  }
}
</style>
