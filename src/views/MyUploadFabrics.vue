<template>
  <div>
    <h1>我的上传面料</h1>
    <el-table :data="fabrics" style="width: 100%">
      <el-table-column prop="name" label="面料名称" width="180" />
      <el-table-column prop="materialName" label="材质" width="180" />
      <el-table-column prop="colorNames" label="颜色" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="primary" size="small" @click="viewDetails(scope.row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <button :disabled="page === 0" @click="changePage(page - 1)">上一页</button>
      <span>第 {{ page + 1 }} 页</span>
      <button :disabled="!hasMore" @click="changePage(page + 1)">下一页</button>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  data() {
    return {
      fabrics: [], // 面料列表
      page: 0, // 当前页码
      size: 5, // 每页显示数量
      hasMore: true, // 是否有更多数据
      supplierId: null, // 当前登录用户的供应商 ID
    };
  },
  methods: {
    async fetchFabrics() {
      try {
        const params = {
          supplierId: this.supplierId, // 自动添加供应商 ID
          page: this.page,
          size: this.size,
          sort: "name,asc",
        };
        const response = await axios.get("/api/fabrics/search", { params });
        this.fabrics = response.data.content;
        this.hasMore = !response.data.last; // 判断是否还有更多数据
      } catch (error) {
        console.error("获取面料失败：", error.response || error.message);
        this.$message.error("获取面料失败，请稍后重试！");
      }
    },
    async fetchSupplierId() {
      try {
        // 假设后端提供了获取当前用户信息的接口
        const response = await axios.get("/api/user");
        this.supplierId = response.data.supplierId; // 获取当前用户的供应商 ID
        this.fetchFabrics(); // 获取面料列表
      } catch (error) {
        console.error("获取用户信息失败：", error.response || error.message);
        this.$message.error("获取用户信息失败，请稍后重试！");
      }
    },
    viewDetails(fabric) {
      // 跳转到详情页面，传递面料 ID
      this.$router.push({ name: "FabricDetails", params: { id: fabric.fabricId } });
    },
    changePage(newPage) {
      this.page = newPage;
      this.fetchFabrics();
    },
  },
  mounted() {
    this.fetchSupplierId(); // 页面加载时获取供应商 ID 并查询面料
  },
};
</script>