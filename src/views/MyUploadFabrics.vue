<template>
  <div>
    <h1>我的上传面料</h1>
    <el-table :data="fabrics" style="width: 100%">
      <!-- 图片列 -->
      <el-table-column prop="imagePath" label="照片" width="200">
        <template #default="scope">
          <img :src="getImageUrl(scope.row.imagePath)" alt="面料图片" style="max-width: 100%; height: auto;" />
        </template>
      </el-table-column>

      <!-- 面料名称列 -->
      <el-table-column prop="name" label="面料名称" width="180" />

      <!-- 材质列 -->
      <el-table-column prop="materialName" label="材质" width="180" />

      <!-- 颜色列 -->
      <el-table-column prop="colorNames" label="颜色" width="180">
        <template #default="scope">
          <div>
            <el-tag
              v-for="(color, index) in scope.row.colorNames"
              :key="index"
              type="info"
              style="margin-right: 5px;"
            >
              {{ color }}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <!-- 描述列 -->
      <el-table-column prop="description" label="描述" />

      <!-- 操作列 -->
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <!-- 修改按钮 -->
          <el-button type="primary" size="small" @click="editFabric(scope.row)">
            修改
          </el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" size="small"  @click="confirmDelete(scope.row)">
            删除
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

    <!-- 删除确认弹窗 -->
    <el-dialog
      title="确认删除"
      v-model="deleteDialogVisible"
      width="30%"
      @close="cancelDelete"
    >
      <span>确定要删除该面料吗？</span>
      <template #footer>
        <el-button @click="cancelDelete">取消</el-button>
        <el-button type="danger" @click="deleteFabric">确认删除</el-button>
      </template>
    </el-dialog>
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
      deleteDialogVisible: false, // 删除确认弹窗的显示状态
      fabricToDelete: null, // 待删除的面料
    };
  },
  methods: {
    // 获取面料列表
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
    // 获取供应商 ID
    async fetchSupplierId() {
      try {
        const response = await axios.get("/api/user");
        this.supplierId = response.data.supplierId; // 获取当前用户的供应商 ID
        this.fetchFabrics(); // 获取面料列表
      } catch (error) {
        console.error("获取用户信息失败：", error.response || error.message);
        this.$message.error("获取用户信息失败，请稍后重试！");
      }
    },
    // 修改面料
    editFabric(fabric) {
      this.$router.push({ name: "FabricDetails", params: { id: fabric.fabricId } });
    },
    // 打开删除确认弹窗
    confirmDelete(fabric) {
      console.log("点击了删除按钮"); // 输出提示信息
      console.log("待删除的面料信息：", fabric); // 输出当前行的面料信息
      this.fabricToDelete = fabric;
      this.deleteDialogVisible = true;
      console.log("deleteDialogVisible 设置为：", this.deleteDialogVisible); // 检查弹窗状态

    },
    // 取消删除
    cancelDelete() {
      this.fabricToDelete = null;
      this.deleteDialogVisible = false;
    },
    // 删除面料
    async deleteFabric() {
      if (!this.fabricToDelete) return;
      try {
        await axios.delete(`/api/fabrics/${this.fabricToDelete.fabricId}`);
        this.$message.success("删除成功！");
        this.deleteDialogVisible = false;
        this.fetchFabrics(); // 重新获取面料列表
      } catch (error) {
        console.error("删除面料失败：", error.response || error.message);
        this.$message.error("删除面料失败，请稍后重试！");
      }
    },
    // 分页切换
    changePage(newPage) {
      this.page = newPage;
      this.fetchFabrics();
    },
    // 获取图片 URL
    getImageUrl(imagePath) {
      if (!imagePath) {
        return "";
      }
      return `${axios.defaults.baseURL}/uploads/${imagePath}`;
    },
  },
  mounted() {
    this.fetchSupplierId(); // 页面加载时获取供应商 ID 并查询面料
  },
};
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  text-align: center;
}
.pagination button {
  margin: 0 5px;
}
</style>