<template>
    <h1>我的收藏</h1>
    <el-table :data="favorites" style="width: 100%" stripe>
      <!-- 图片列 -->
      <el-table-column prop="imagePath" label="照片" width="200">
        <template #default="scope">
          <img
            :src="getImageUrl(scope.row.imagePath)"
            alt="面料图片"
            style="max-width: 100%; height: auto; cursor: pointer;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="面料名称" width="220" />
      <el-table-column prop="materialName" label="材质" width="180" />
      <el-table-column prop="colorNames" label="颜色" width="180" />
      <el-table-column prop="supplierName" label="供应商" width="180" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="收藏" width="120">
        <template #default="scope">
          <el-button
            type="danger"
            size="small"
            @click="removeFromFavorites(scope.row.fabricId)"
          >
            取消收藏
          </el-button>
        </template>
      </el-table-column>
    </el-table>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "FavoritesFabric",
  data() {
    return {
      favorites: [], // 收藏的面料列表
    };
  },
  methods: {
    // 获取收藏的面料列表
    async fetchFavorites() {
      try {
        const response = await axios.get("/api/fabrics/favorites");
        console.log("接口返回的数据：", response.data);
        if (Array.isArray(response.data.content)) {
          this.favorites = response.data.content; // 提取收藏的面料列表
        } else {
          console.error("接口返回的数据格式不正确！");
          this.favorites = [];
        }
      } catch (error) {
        console.error("获取收藏面料失败：", error.response || error.message);
        this.$message.error("获取收藏面料失败，请稍后重试！");
        this.favorites = [];
      }
    },
    // 取消收藏
    async removeFromFavorites(fabricId) {
      try {
        await axios.delete(`/api/fabrics/${fabricId}/favorite`);
        this.$message.success("取消收藏成功！");
        this.fetchFavorites(); // 重新获取收藏列表
      } catch (error) {
        console.error("取消收藏失败：", error.response || error.message);
        this.$message.error("取消收藏失败，请稍后重试！");
      }
    },
    // 获取图片 URL
    getImageUrl(imagePath) {
      if (!imagePath) {
        console.error("imagePath 未定义！");
        return "";
      }
      return `${axios.defaults.baseURL}/uploads/${imagePath}`;
    },
  },
  mounted() {
    this.fetchFavorites(); // 页面加载时获取收藏的面料列表
  },
};
</script>

<style scoped>
.favorites {
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
  font-size: 24px;
  font-weight: bold;
}
</style>