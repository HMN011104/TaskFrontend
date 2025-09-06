import { createApp } from 'vue'
import './assets/style.css'
import App from './App.vue'
import router from './router/index.js'

// Tạo app và gắn router
const app = createApp(App)
app.use(router)
app.mount('#app')
