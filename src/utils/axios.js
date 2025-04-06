import axios from 'axios';

// 创建 Axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:8080', // 替换为你的后端 API 地址
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 从 localStorage 获取 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 添加到请求头
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（可选）
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;