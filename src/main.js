import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'

// 全局注册 Chart.js 的 registerables 和 annotation 插件，组件中无需重复注册
Chart.register(...registerables, annotationPlugin)
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { faUser, faSearch, faBars } from '@fortawesome/free-solid-svg-icons'

// 添加需要的图标
// library.add(faUser, faSearch, faBars)

createApp(App)
    .use(router)
    .mount('#app')
