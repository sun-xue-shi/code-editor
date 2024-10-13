// export const BASE_URL = "http://codercba.com:8000"
export const BASE_URL = 'http://localhost:3000'
export const TIME_OUT = 8000

// 自动判断生产环境与开发环境的方法

// import.meta.env.DEV   是否开发环境
// import.meta.env.PROD  是否生产环境
// import。meta.env.SSR   是否是服务端渲染（server side render）

// let BASE_URL = ""
// if (import.meta.env.MODE === "production") {
//   BASE_URL = "http://codercba.com:5000"
// } else {
//   BASE_URL = "http://152.136.185.210:4000"
// }

// export { BASE_URL }
