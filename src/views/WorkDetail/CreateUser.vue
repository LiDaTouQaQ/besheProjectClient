<script setup>

import {UploadFilled} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()
import axios from "axios";
import {ElMessage} from "element-plus";

const route = useRoute()
const id = route.params.entityId
const projectId = route.params.projectId
const value = ref([])
const formLabelAlign = ref({
  id: route.query.entityId,
  projectId: route.query.projectId,
  userName: "",
  password: "",
  email: "",
  power: ""
})

function onSubmit() {
  axios.post("http://localhost:8080/user/addUserForNew", {
    userName: formLabelAlign.value.userName,
    password: formLabelAlign.value.password,
    email: formLabelAlign.value.email,
    projectId: projectId,
    power: formLabelAlign.value.power
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then(response => {
    if (response.data.msg === "success") {
      ElMessage({
        message: '添加成功',
        type: 'success',
      })
      setTimeout(() => {
        router.push({
          path: `/work/${projectId}/user`
        })
      }, 1000)
    } else {
      ElMessage({
        message: '添加失败',
        type: 'warning',
      })
    }
  })
}


</script>

<template>
  <h2>添加工人</h2>
  <el-form
      label-position="top"
      label-width="auto"
      :model="formLabelAlign"
      style="max-width: 600px"
  >
    <el-form-item label="工人名称">
      <el-input v-model="formLabelAlign.userName" :value="formLabelAlign.userName"/>
    </el-form-item>
    <el-form-item label="工人邮箱">
      <el-input v-model="formLabelAlign.email" :value="formLabelAlign.email"/>
    </el-form-item>
    <el-form-item label="工人密码">
      <el-input disabled v-model="formLabelAlign.password" :value="formLabelAlign.email"/>
    </el-form-item>
    <el-form-item label="工人身份">
      <el-radio-group v-model="formLabelAlign.power">
        <el-radio :value="2">审核员</el-radio>
        <el-radio :value="3">标注员</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">更新</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.el-tag {
  border: none;
  aspect-ratio: 1;
}
</style>