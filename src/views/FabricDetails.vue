<template>
    <div>
      <h1>面料详情</h1>
      <el-form :model="formData" label-width="120px">
        <el-form-item label="面料名称">
          <el-input v-model="formData.name" placeholder="请输入面料名称" />
        </el-form-item>
        <el-form-item label="材质">
          <el-select v-model="formData.materialId" placeholder="请选择材质">
            <el-option
              v-for="material in materials"
              :key="material.id"
              :label="material.name"
              :value="material.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="颜色">
          <el-select v-model="formData.colorIds" multiple placeholder="请选择颜色">
            <el-option
              v-for="color in colors"
              :key="color.id"
              :label="color.name"
              :value="color.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="图片">
          <img :src="formData.imagePath" alt="面料图片" style="max-width: 300px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveFabric">保存</el-button>
          <el-button type="danger" @click="deleteFabric">删除</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import axios from "@/utils/axios";
  
  export default {
    data() {
      return {
        formData: {
          name: "",
          materialId: null,
          colorIds: [],
          description: "",
          imagePath: "",
        },
        materials: [], // 材质列表
        colors: [], // 颜色列表
      };
    },
    methods: {
      async fetchFabricDetails() {
        try {
          const response = await axios.get(`/api/fabrics/${this.$route.params.id}`);
          this.formData = response.data;
        } catch (error) {
          console.error("获取面料详情失败：", error.response || error.message);
          this.$message.error("获取面料详情失败，请稍后重试！");
        }
      },
      async fetchOptions() {
        try {
          const [materialsRes, colorsRes] = await Promise.all([
            axios.get("/api/materials"),
            axios.get("/api/colors"),
          ]);
          this.materials = materialsRes.data;
          this.colors = colorsRes.data;
        } catch (error) {
          console.error("获取选项失败：", error.response || error.message);
          this.$message.error("获取材质和颜色选项失败，请稍后重试！");
        }
      },
      async saveFabric() {
        try {
          await axios.put(`/api/fabrics/${this.$route.params.id}`, this.formData);
          this.$message.success("保存成功！");
        } catch (error) {
          console.error("保存失败：", error.response || error.message);
          this.$message.error("保存失败，请稍后重试！");
        }
      },
      async deleteFabric() {
        try {
          await axios.delete(`/api/fabrics/${this.$route.params.id}`);
          this.$message.success("删除成功！");
          this.$router.push({ name: "MyUploadFabrics" }); // 返回到列表页面
        } catch (error) {
          console.error("删除失败：", error.response || error.message);
          this.$message.error("删除失败，请稍后重试！");
        }
      },
    },
    mounted() {
      this.fetchFabricDetails(); // 页面加载时获取面料详情
      this.fetchOptions(); // 获取材质和颜色选项
    },
  };
  </script>