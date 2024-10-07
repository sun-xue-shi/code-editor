import Request from './index'

export interface LoginCaptcha {
  receiver: string
  type: number
}

export interface EmailLoginData {
  username: string
  email: string
  code: string
  type: number
}

export interface PwdLoginData {
  username: string
  password: string
  type: number
}

export async function loginCaptcha(data: LoginCaptcha) {
  return await Request.get('user/login-code', {
    params: data
  })
}

export async function login(data: EmailLoginData | PwdLoginData) {
  return await Request.post('user/login', data)
}

export async function refreshToken() {
  console.log('刷新token')

  const res = await Request.get('/user/refresh', {
    params: {
      token: localStorage.getItem('refreshToken')
    }
  })

  localStorage.setItem('accessToken', res.data.accessToken)
  localStorage.setItem('refreshToken', res.data.refreshToken)

  return res
}
