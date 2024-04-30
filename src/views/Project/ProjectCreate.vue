<script setup>

import ProjectHeader from "@/components/ProjectHeader.vue";

import {reactive, ref} from 'vue'
import axios from 'axios'
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const userId = ref("1");
// do not use same name with ref
const form = reactive({
  projectName: '',
  remark: '',
  tag: '',
  date2: '',
  isAllowAdd: false,
  isOrder: false,
  isRelation: false,
  createBy: userId
})
const router = useRouter()

function createProject() {
  const url = "http://localhost:8080/project/create"
  axios.post(url, form, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((response) => {
    console.log(response)
    ElMessage({
      message: '创建成功',
      type: 'success',
    })
    setTimeout(() => {
      router.push({path: "/project"})
    }, 1000)
  }).catch((error) => {
    ElMessage({
      message: '项目创建失败',
      type: 'warning',
    })
  })
}
</script>

<template>
  <el-container>
    <el-header>
      <ProjectHeader/>
    </el-header>
    <el-main>
      <el-form :model="form" label-width="auto" style="max-width: 600px">
        <el-form-item label="项目名称">
          <el-input v-model="form.projectName"/>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input v-model="form.remark"/>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tag"/>
        </el-form-item>
        <el-form-item label="允许成员添加标签">
          <el-switch v-model="form.isAllowAdd"/>
        </el-form-item>
        <el-form-item label="任务是否乱序">
          <el-switch v-model="form.isOrder"/>
        </el-form-item>
        <el-form-item label="是否关系抽取">
          <el-switch v-model="form.isRelation"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createProject">创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>