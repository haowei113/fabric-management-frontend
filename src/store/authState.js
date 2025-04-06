import { reactive } from 'vue';

const authState = reactive({
  isLoggedIn: !!localStorage.getItem('token'), // 初始化时检查 token
});

export default authState;