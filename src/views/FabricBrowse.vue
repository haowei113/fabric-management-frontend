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
          <img
            :src="getImageUrl(scope.row.imagePath)"
            alt="面料图片"
            style="max-width: 100%; height: auto; cursor: pointer;"
            @click="showImage(scope.row.imagePath)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="面料名称" width="220" />
      <el-table-column prop="materialName" label="材质" width="180" />
      <el-table-column prop="colorNames" label="颜色" width="180" />
      <el-table-column prop="supplierName" label="供应商" width="180" >
        <template #default="scope">
          <el-button 
            type="text" 
              @click="scope.row.supplierId ? showSupplierInfo(scope.row.supplierId) : $message.error('nosupplier')">
            {{ scope.row.supplierName }}
          </el-button>
        </template>
      </el-table-column>
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

    <el-dialog v-model="dialogVisible" width="50%" :close-on-click-modal="true">
      <img :src="dialogImageUrl" alt="放大图片" style="width: 100%; height: auto;" />
    </el-dialog>

    <!-- 分页 -->
    <div class="pagination">
      <button :disabled="page === 0" @click="changePage(page - 1)">上一页</button>
      <span>第 {{ page + 1 }} 页</span>
      <button :disabled="!hasMore" @click="changePage(page + 1)">下一页</button>
    </div>

    <!-- 供应商信息弹窗 -->
    <el-dialog v-model="supplierDialogVisible" title="供应商信息" width="30%">
      <div v-if="supplierInfo">
        <p><strong>供应商名称：</strong>{{ supplierInfo.supplierName }}</p>
        <p><strong>联系方式：</strong>{{ supplierInfo.phone }}</p>
        <p><strong>邮箱：</strong>{{ supplierInfo.email }}</p>
        <p><strong>描述：</strong>{{ supplierInfo.description }}</p>
      </div>
      <template v-slot:footer>
        <el-button @click="supplierDialogVisible = false">关闭</el-button>
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
      dialogVisible: false, // 控制弹窗显示
      supplierDialogVisible: false, // 供应商弹窗状态
      supplierInfo: null, // 当前供应商信息
      dialogImageUrl: "", // 弹窗中显示的图片 URL
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
    showImage(imagePath) {
      this.dialogImageUrl = this.getImageUrl(imagePath); // 设置弹窗图片 URL
      this.dialogVisible = true; // 显示弹窗
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
    async showSupplierInfo(supplierid) {
      try {
        console.log("传递的 supplierId:", supplierid); // 打印传递的 supplierId
        const response = await axios.get(`/api/suppliers/${supplierid}`);
        console.log("获取的供应商信息:", response.data); // 打印返回的供应商信息
        this.supplierInfo = response.data; // 获取供应商信息
        this.supplierDialogVisible = true; // 显示弹窗
        console.log("supplierDialogVisible 设置为:", this.supplierDialogVisible); // 确认状态
      } catch (error) {
        console.error("获取供应商信息失败：", error.response || error.message);
        this.$message.error("获取供应商信息失败，请稍后重试！");
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