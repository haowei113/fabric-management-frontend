<template>
  <div class="register">
    <h1>注册</h1>
    <form @submit.prevent="handleRegister">
      <div>
        <label for="username">用户名：</label>
        <input id="username" v-model="form.username" type="text" required />
      </div>
      <div>
        <label for="password">密码：</label>
        <input id="password" v-model="form.password" type="password" required />
      </div>
      <div>
        <label for="email">邮箱：</label>
        <input id="email" v-model="form.email" type="email" required />
      </div>
      <div>
        <label for="userType">用户类型：</label>
        <select id="userType" v-model="form.userType" @change="handleUserTypeChange" required>
          <option value="regular">普通用户</option>
          <option value="supplier">供应商</option>
        </select>
      </div>
      <div v-if="form.userType === 'supplier'">
        <label for="supplierName">供应商名称：</label>
        <input id="supplierName" v-model="form.supplierName" type="text" required />
      </div>
      <div v-if="form.userType === 'supplier'">
        <label for="description">描述：</label>
        <textarea id="description" v-model="form.description" required></textarea>
      </div>
      <div>
        <label for="phone">电话：</label>
        <input id="phone" v-model="form.phone" type="text" required />
      </div>
      <button type="submit">注册</button>
    </form>
  </div>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'UserRegister',
  data() {
    return {
      form: {
        username: '',
        password: '',
        email: '',
        userType: 'regular', // 默认普通用户
        phone: '',
        supplierName: '',
        description: '',
      },
    };
  },
  methods: {
    handleUserTypeChange() {
      // 清空供应商相关字段
      if (this.form.userType !== 'supplier') {
        this.form.supplierName = '';
        this.form.description = '';
      }
    },
    async handleRegister() {
      try {
        await axios.post('/api/auth/register', this.form); // 提交注册信息
        alert('注册成功！即将跳转到登录页面');
        this.$router.push('/login'); // 跳转到登录页面
      } catch (error) {
        console.error(error);
        alert('注册失败，请检查输入信息！');
      }
    },
  },
};
</script>

<style scoped>
.register {
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
input, select, textarea, button {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>