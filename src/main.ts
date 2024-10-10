import './styles/reset.css'
import 'cropperjs/dist/cropper.css'
import { createApp } from 'vue'
import App from './App.vue'
import SWComp from 'editor-components-sw'
import router from './router'
import pinia from './stores'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(SWComp)

app.mount('#app')
