<script setup>
  import {ref} from "vue";
  import { UploadFilled } from '@element-plus/icons-vue'
  import {useRoute} from "vue-router";
  const formLabelAlign = ref({
    name: '',
    region: '',
    type: ''
  })
  const route = useRoute()
  const requestDate = ref({
    "projectId":route.params.projectId
  })
  console.log(requestDate)
</script>

<template>
  <h1>上传数据</h1>
  <el-form
      label-position="top"
      label-width="auto"
      :model="formLabelAlign"
      style="max-width: 600px"
  >
    <el-form-item label="内容格式">
      <el-input v-model="formLabelAlign.name" />
    </el-form-item>
    <el-form-item label="文本标题">
      <el-input v-model="formLabelAlign.region" />
    </el-form-item>
    <el-form-item label="实体标题">
      <el-input v-model="formLabelAlign.type" />
    </el-form-item>
    <el-form-item label="编码方式">
      <el-input v-model="formLabelAlign.type" />
    </el-form-item>
    <el-upload
        class="upload-demo"
        drag
        action="http://localhost:8080/uploadContentFile"
        multiple
        method="POST"
        :data="requestDate"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        拖拽文件到此处 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          txt/json files is allowed
        </div>
      </template>
    </el-upload>
  </el-form>
</template>

<style scoped>

</style>