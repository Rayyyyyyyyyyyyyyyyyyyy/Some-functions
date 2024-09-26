import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/tailwind.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/assets/styles/index.css'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import router from '@/router'
import svgIconPlugin from '@/plugins/svgIcon'
import App from './App.vue'


const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(createPinia())
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(svgIconPlugin, { imports: [] })

app.mount('#app')
