import './assets/main.css'
import store from './store'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);
app.use(store);
app.mount('#app')
