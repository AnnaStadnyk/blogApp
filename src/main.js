import './assets/main.css'

import { createApp, markRaw} from 'vue'
import { createPinia } from 'pinia'
import { initializeApp } from 'firebase/app'

import App from './App.vue'
import router from './router'
import CKEditor from '@ckeditor/ckeditor5-vue'
import TheButton from './components/UI/TheButton.vue'

const pinia = createPinia()

pinia.use(({ store }) => {
  store.router = markRaw(router)
})

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(CKEditor)
app.component('TheButton', TheButton)

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
}

initializeApp(firebaseConfig)

app.mount('#app')
