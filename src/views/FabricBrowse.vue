<template>
  <div>
    <h1>面料仓库</h1>

    <!-- 筛选条件 -->
    <div class="filters" style="margin-bottom: 20px;">
      <el-input
        v-model="filters.name"
        placeholder="请输入面料名称"
        style="width: 200px; margin-right: 10px;"
        @input="fetchFabrics"
      />
      <el-select
        v-model="filters.materialId"
        placeholder="请选择材质"
        style="width: 200px; margin-right: 10px;"
        @change="fetchFabrics"
        clearable
      >
        <el-option :label="'全部'" :value="null" /> <!-- 添加清除选项 -->
        <el-option
          v-for="material in materials"
          :key="material.id"
          :label="material.name"
          :value="material.id"
        />
      </el-select>
      <el-select
        v-model="filters.colorId"
        placeholder="请选择颜色"
        style="width: 200px; margin-right: 10px;"
        @change="fetchFabrics"
        clearable
      >
        <el-option :label="'全部'" :value="null" /> <!-- 添加清除选项 -->
        <el-option
          v-for="color in colors"
          :key="color.id"
          :label="color.name"
          :value="color.id"
        />
      </el-select>
      <el-select
        v-model="filters.supplierId"
        placeholder="请选择供应商"
        style="width: 200px; margin-right: 10px;"
        @change="fetchFabrics"
        clearable
      >
        <el-option :label="'全部'" :value="null" /> <!-- 添加清除选项 -->
        <el-option
          v-for="supplier in suppliers"
          :key="supplier.id"
          :label="supplier.name"
          :value="supplier.id"
        />
      </el-select>
    </div>

    <!-- 面料表格 -->
    <el-table :data="fabrics" style="width: 100%">
      <el-table-column prop="imagePath" label="照片" width="200">
        <template #default="scope">
          <img :src="getImageUrl(scope.row.imagePath)" alt="面料图片" style="max-width: 100%; height: auto;" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="面料名称" width="220" />
      <el-table-column prop="materialName" label="材质" width="180" />
      <el-table-column prop="colorNames" label="颜色" width="180" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="收藏" width="120">
        <template #default="scope">
          <el-button
            type="success"
            size="small"
            @click="addToFavorites(scope.row.fabricId)"
          >
            收藏
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
      materials: [], // 材质列表
      colors: [], // 颜色列表
      suppliers: [], // 供应商列表
      page: 0, // 当前页码
      size: 5, // 每页显示数量
      hasMore: true, // 是否有更多数据
      filters: {
        name: "", // 面料名称
        materialId: null, // 材质 ID
        colorId: null, // 颜色 ID
        supplierId: null, // 供应商 ID
      },
    };
  },
  methods: {
    async fetchFabrics() {
      try {
        const params = {
          page: this.page,
          size: this.size,
          sort: "name,asc",
          name: this.filters.name || undefined,
          materialId: this.filters.materialId || undefined,
          colorId: this.filters.colorId || undefined,
          supplierId: this.filters.supplierId || undefined,
        };
        const response = await axios.get("/api/fabrics/search", { params });
        this.fabrics = response.data.content;
        this.hasMore = !response.data.last; // 判断是否还有更多数据
      } catch (error) {
        console.error("获取面料失败：", error.response || error.message);
        this.$message.error("获取面料失败，请稍后重试！");
      }
    },
    async fetchOptions() {
      try {
        // 并行获取材质、颜色和供应商列表
        const [materialsRes, colorsRes, suppliersRes] = await Promise.all([
          axios.get("/api/materials"),
          axios.get("/api/colors"),
          axios.get("/api/suppliers"),
        ]);
        this.materials = materialsRes.data;
        this.colors = colorsRes.data;
        this.suppliers = suppliersRes.data;
      } catch (error) {
        console.error("获取筛选选项失败：", error.response || error.message);
        this.$message.error("获取筛选选项失败，请稍后重试！");
      }
    },
    getImageUrl(imagePath) {
      if (!imagePath) {
        console.error("imagePath 未定义！");
        return "";
      }
      return `${axios.defaults.baseURL}/uploads/${imagePath}`;
    },
    async addToFavorites(fabricId) {
      try {
        await axios.post(`/api/fabrics/${fabricId}/favorite`);
        this.$message.success("收藏成功！");
      } catch (error) {
        console.error("收藏失败：", error.response || error.message);
        this.$message.error("收藏失败，请勿重复收藏！");
      }
    },
    changePage(newPage) {
      this.page = newPage;
      this.fetchFabrics();
    },
  },
  mounted() {
    this.fetchOptions(); // 页面加载时获取筛选选项
    this.fetchFabrics(); // 页面加载时获取面料列表
  },
};
</script>