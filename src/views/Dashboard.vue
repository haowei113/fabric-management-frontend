<template>
  <div class="dashboard">
    <!-- 左侧导航栏 -->
    <aside class="sidebar">
      <ul>
        <li v-for="item in menuItems" :key="item.name">
          <router-link :to="item.path">{{ item.label }}</router-link>
        </li>
      </ul>
    </aside>

    <!-- 右侧内容区域 -->
    <div class="content">
      <header class="header">
        <div class="user-info">
          <!-- 用户名和下拉箭头 -->
          <button class="dropdown-toggle" @click="toggleDropdown" ref="dropdownButton">
            {{ username }} ▼
          </button>
          <!-- 下拉框 -->
          <ul v-if="dropdownVisible" class="dropdown-menu" ref="dropdownMenu">
            <li class="dropdown-item" @click="logout">退出登录</li>
          </ul>
        </div>
      </header>
      <router-view /> <!-- 动态加载功能页面 -->
    </div>
  </div>
</template>

<script>
import authState from '@/store/authState';

export default {
  name: 'DashboardPage',
  data() {
    return {
      username: localStorage.getItem('username') || '用户', // 从 localStorage 获取用户名
      userType: localStorage.getItem('userType') || 'regular', // 从 localStorage 获取用户类型
      dropdownVisible: false, // 控制下拉框显示
    };
  },
  computed: {
    menuItems() {
      // 根据用户类型动态生成菜单
      if (this.userType === 'supplier') {
        return [
          { name: 'profile', label: '个人信息', path: '/dashboard/profile' },
          { name: 'browse', label: '浏览面料仓库', path: '/dashboard/browse' },
          { name: 'upload', label: '上传面料', path: '/dashboard/upload' },
          { name: 'myFabrics', label: '我的上传面料', path: '/dashboard/my-uploads' },
          { name: 'favorites', label: '收藏面料', path: '/dashboard/favorites' },
          { name: 'imageRetrieval', label: '图像检索', path: '/dashboard/imageretrieval' },
        ];
      } else {
        return [
          { name: 'profile', label: '个人信息', path: '/dashboard/profile' },
          { name: 'browse', label: '浏览面料仓库', path: '/dashboard/browse' },
          { name: 'favorites', label: '收藏面料', path: '/dashboard/favorites' },
          { name: 'imageRetrieval', label: '图像检索', path: '/dashboard/imageretrieval' },
        ];
      }
    },
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
    },
    handleClickOutside(event) {
      const dropdownButton = this.$refs.dropdownButton;
      const dropdownMenu = this.$refs.dropdownMenu;

      // 如果点击的目标不在按钮或下拉框内，则关闭下拉框
      if (
        dropdownButton &&
        !dropdownButton.contains(event.target) &&
        dropdownMenu &&
        !dropdownMenu.contains(event.target)
      ) {
        this.dropdownVisible = false;
      }
    },
    logout() {
      // 清除 token 和用户信息
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userType');
      authState.isLoggedIn = false; // 更新登录状态
      this.$router.push('/login'); // 跳转到登录页面
    },
  },
  mounted() {
    // 添加全局点击事件监听器
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    // 移除全局点击事件监听器
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 200px;
  background-color: #f4f4f4;
  padding: 20px;
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  margin-bottom: 10px;
}
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.header {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background-color: #ddd;
}
.user-info {
  position: relative;
  display: flex;
  align-items: center;
}
.dropdown-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  list-style: none;
  padding: 5px 0;
  margin: 0;
  z-index: 1000;
  width: 150px;
  text-align: left;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.dropdown-item {
  padding: 10px;
  cursor: pointer;
  white-space: nowrap;
}
.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>