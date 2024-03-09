import { createApp } from 'vue'


import './style.css'
import App from './App.vue'

import { ReqisterPlugins } from '@/plugins'


const app = createApp(App)
ReqisterPlugins(app)
app.mount("#app")

