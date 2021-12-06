import { createApp } from 'vue';
import App from "./app.vue";
import router from './router/index.js';
import icon from './icon.json'
import store from './store/index'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Pagination from "@/components/Pagination";

import './style/index.scss'
import 'highlight.js/styles/color-brewer.css'
import { parseTime } from "./utils/ruoyi";


import demoBlock from './components/demo-block/index.vue'
var app = createApp(App);

app.component('DemoBlock', demoBlock)
app.component('Pagination', Pagination)

app.config.globalProperties.$icon = icon
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.addDateRange = (val) => val
app.config.globalProperties.getDicts = (val) => { return new Promise((resolver)=>{ resolver([]) }) }
app.use(store).use(router).use(ElementPlus)

app.mount('#app');
