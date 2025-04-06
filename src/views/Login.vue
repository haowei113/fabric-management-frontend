<template>
  <div class="login">
    <h1>登录</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">用户名：</label>
        <input id="username" v-model="form.username" type="text" required />
      </div>
      <div>
        <label for="password">密码：</label>
        <input id="password" v-model="form.password" type="password" required />
      </div>
      <button type="submit">登录</button>
    </form>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import authState  from '@/store/authState';
import { jwtDecode } from 'jwt-decode'; // 引入 jwt-decode

export default {
  name: 'UserLogin',
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('/api/auth/login', this.form); // 提交登录信息
        const token = response.data.token; // 后端返回的 token 在 response.data.token 中
        const userType = response.data.userType; // 后端返回的用户类型

        // 解码 token 获取 username
        const decodedToken = jwtDecode(token); // 解码 token
        const username = decodedToken.sub; //  username 在 token 的 payload 中为 sub

        localStorage.setItem('token', token); // 保存 token 到 localStorage
        localStorage.setItem('userType', userType); // 保存用户类型到 localStorage
        localStorage.setItem('username', username); // 保存用户名到 localStorage
        
        authState.isLoggedIn = true; // 更新登录状态
        alert('登录成功！');
        this.$router.push('/dashboard'); // 跳转到首页或其他页面
      } catch (error) {
        console.error(error);
        alert('登录失败，请检查用户名和密码！');
      }
    },
  },
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
}
form div {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input, button {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>