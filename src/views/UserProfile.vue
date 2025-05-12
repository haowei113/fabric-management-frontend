<template>
    <h1>个人信息</h1>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="username">用户名：</label>
        <input id="username" v-model="form.username" type="text" disabled style="width:100%;"/>
      </div>
      <div class="form-group">
        <label for="email">邮箱：</label>
        <input id="email" v-model="form.email" type="email" style="width:100%;"/>
      </div>
      <div class="form-group">
        <label for="phone">手机号：</label>
        <input id="phone" v-model="form.phone" type="text" style="width:100%;"/>
      </div>

      <div v-if="form.userType === 'supplier'" class="form-group">
        <label for="supplierName">供应商名称：</label>
        <input id="supplierName" v-model="form.supplierName" type="text"  style="width:100%;"/>
        <label for="description">供应商描述：</label>
        <textarea id="description" v-model="form.description" rows=3 style="resize: none; width:100%;"></textarea>
      </div>

      <button type="submit">保存修改</button>
    </form>
</template>

<script>
import axios from '@/utils/axios';

export default {
  name: 'UserProfile',
  data() {
    return {
      form: {
        username: '', // 用户名
        email: '', // 邮箱
        phone: '', // 手机号
        userType: '', // 用户类型
        supplierName: '', // 供应商名称（仅供应商用户）
        description: '', // 供应商描述（仅供应商用户）
      },
    };
  },
  methods: {
    async fetchProfile() {
      try {
        const userResponse = await axios.get('/api/user'); // 获取用户信息
        this.form.username = userResponse.data.username;
        this.form.email = userResponse.data.email;
        this.form.phone = userResponse.data.phone;
        this.form.userType = userResponse.data.usertype;

        // 如果是供应商，获取供应商信息
        if (this.form.userType === 'supplier') {
          this.form.supplierName = userResponse.data.suppliername;
          this.form.description = userResponse.data.description;
        }
      } catch (error) {
        console.error('获取用户信息失败：', error);
        alert('获取用户信息失败，请稍后重试！');
      }
    },
    async updateProfile() {
      try {
        await axios.put('/api/user', this.form); // 提交修改后的信息
        alert('个人信息更新成功！');
      } catch (error) {
        console.error('更新个人信息失败：', error);
        alert('更新个人信息失败，请稍后重试！');
      }
    },
  },
  mounted() {
    this.fetchProfile(); // 页面加载时获取用户信息
  },
};
</script>

<style scoped>
.user-profile {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
}
h1 {
  text-align: center;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>