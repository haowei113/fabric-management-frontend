<template>
  <div>
    <!-- 顶部导航栏 -->
    <nav v-if="!isLoggedIn">
      <router-link to="/">首页</router-link>
      <router-link to="/register">注册</router-link>
      <router-link to="/login">登录</router-link>
    </nav>
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script>
import  authState  from '@/store/authState';
import axios from 'axios';

export default {
  name: 'App',
  computed: {
    isLoggedIn() {
      return authState.isLoggedIn; // 使用全局状态
    },
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/auth/validate-token', { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          authState.isLoggedIn = true;
          if (this.$route.path === '/') {
            this.$router.push('/dashboard');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          authState.isLoggedIn = false;
          this.$router.push('/login');
        });
    }
  },
};
</script>

<style>
nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>
