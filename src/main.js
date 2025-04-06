import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

// 注册 Element Plus
app.use(ElementPlus);

// 注册路由
app.use(router);

// 挂载应用
app.mount('#app');