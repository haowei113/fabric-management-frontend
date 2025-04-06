import DashboardPage from '@/views/Dashboard.vue';
import HomePage from '@/views/Home.vue';
import UserLogin from '@/views/Login.vue'; // 引入登录页面
import UserRegister from '@/views/Register.vue'; // 引入注册页面
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/register', name: 'Register', component: UserRegister }, // 注册页面路由
  { path: '/login', name: 'Login', component: UserLogin }, // 登录页面路由
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    children: [
      { path: 'profile', name: 'Profile', component: () => import('@/views/UserProfile.vue') }, // 查看个人信息
      { path: 'browse', name: 'Browse', component: () => import('@/views/FabricBrowse.vue') }, // 浏览面料仓库
      { path: 'favorites', name: 'Favorites', component: () => import('@/views/FavoritesFabric.vue') }, // 查看收藏面料
      { path: 'upload', name: 'Upload', component: () => import('@/views/SupplierUpload.vue') }, // 上传面料（供应商）
      { path: 'my-uploads', name: 'MyUploads', component: () => import('@/views/MyUploadFabrics.vue') }, // 查看本人上传面料（供应商）
      { path: 'fabric/:id', name: 'FabricDetails', component: () => import('@/views/FabricDetails.vue') }, // 详情页面路由
      { path: 'imageretrieval', name: 'ImageRetrieval', component: () => import('@/views/ImageRetrieval.vue') }, // 图像检索
    ],
    meta: { requiresAuth: true }, // 需要登录权限
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('token'); // 检查是否有 token

  if (to.meta.requiresAuth && !isLoggedIn) {
    // 如果访问需要权限的页面但未登录，跳转到登录页面
    next('/login');
  } else {
    next(); // 允许访问
  }
});

export default router