<template>
  <div>
    <h1>上传面料</h1>
    <el-form :model="formData" ref="uploadForm" label-width="120px" enctype="multipart/form-data">
      <el-form-item label="面料名称">
        <el-input v-model="formData.name" placeholder="请输入面料名称"></el-input>
      </el-form-item>
      <el-form-item label="材质">
        <el-select v-model="formData.materialId" placeholder="请选择材质">
          <el-option
            v-for="material in materials"
            :key="material.id"
            :label="material.name"
            :value="material.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="颜色">
        <el-select
          v-model="formData.colorIds"
          multiple
          placeholder="请选择颜色">
          <el-option
            v-for="color in colors"
            :key="color.id"
            :label="color.name"
            :value="color.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="formData.description" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
          class="upload-demo"
          action="" 
          :auto-upload="false"
          :on-change="handleFileChange"
          :file-list="fileList"
          list-type="picture"><!-- 不需要立即上传到后端,所以 action为空-->
          <el-button type="primary">选择图片</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
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
        materialId: null, // 材质 ID
        colorIds: [], // 颜色 ID 列表
        description: "",
      },
      fileList: [], // 存储上传的文件
      materials: [], // 材质列表
      colors: [], // 颜色列表
    };
  },
  methods: {
    async fetchOptions() {
      try {
        // 使用 Promise.all 并行获取材质和颜色选项
        const [materialsRes, colorsRes] = await Promise.all([
          axios.get("/api/materials"), // 获取材质列表
          axios.get("/api/colors"), // 获取颜色列表
        ]);

        // 将返回的数据赋值给对应的变量
        this.materials = materialsRes.data;
        this.colors = colorsRes.data;
      } catch (error) {
        console.error("获取选项失败：", error.response || error.message);
        this.$message.error("获取材质和颜色选项失败，请稍后重试！");
      }
    },
    handleFileChange(file) {
      // 生成本地预览 URL
      const previewUrl = URL.createObjectURL(file.raw);

      // 更新 fileList 数据
      this.fileList = [
        {
          name: file.name,
          raw: file.raw,
          url: previewUrl, // 本地预览 URL
        },
      ];
    },
    async submitForm() {
      if (!this.fileList.length) {
        this.$message.error("请上传图片！");
        return;
      }

      const token = localStorage.getItem("token"); // 获取 JWT Token
      const formData = new FormData();

      // 添加表单数据
      formData.append(
        "data",
        JSON.stringify({
          name: this.formData.name,
          materialId: this.formData.materialId,
          colorIds: this.formData.colorIds,
          description: this.formData.description,
        })
      );

      // 添加图片文件
      formData.append("image", this.fileList[0].raw);

      try {
        const response = await axios.post("/api/fabrics", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        this.$message.success("上传成功！");
        console.log("上传成功：", response.data);
        this.resetForm();
      } catch (error) {
        console.error("上传失败：", error.response || error.message);
        this.$message.error("上传失败，请稍后重试！");
      }
    },
    resetForm() {
      this.formData = {
        name: "",
        materialId: null,
        colorIds: [],
        description: "",
      };
      this.fileList = [];
      this.$refs.uploadForm.resetFields();
    },
  },
  mounted() {
    this.fetchOptions(); // 页面加载时获取材质和颜色选项
  },
};
</script>

<style scoped>
.upload-demo {
  margin-bottom: 20px;
}
</style>