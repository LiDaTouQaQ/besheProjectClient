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
const colors = [
  {
    value: '#E63415',
    label: 'red',
  },
  {
    value: '#FF6600',
    label: 'orange',
  },
  {
    value: '#FFDE0A',
    label: 'yellow',
  },
  {
    value: '#1EC79D',
    label: 'green',
  },
  {
    value: '#14CCCC',
    label: 'cyan',
  },
  {
    value: '#4167F0',
    label: 'blue',
  },
  {
    value: '#6222C9',
    label: 'purple',
  },
]
// colors.forEach((color) => {
//   value.value.push(color.value)
// })

const formLabelAlign = ref({
  id:route.query.entityId,
  projectId:route.query.projectId,
  entityName:route.query.entityName,
  spanColor:route.query.spanColor,
})

function onSubmit(){
  axios.post("http://localhost:8080/entity/update",formLabelAlign.value,{
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then(response => {
    if(response.data.msg === "success"){
      ElMessage({
        message: '更新成功',
        type: 'success',
      })
      setTimeout(()=>{
        router.push({
          path:`/work/${projectId}/entity`
        })
      },1000)
    }else{
      ElMessage({
        message: '更新失败',
        type: 'warning',
      })
    }
  })
}

function colorChange(item){
  formLabelAlign.value.spanColor = item
}

</script>

<template>
  <h2>修改标签</h2>
  <el-form
      label-position="top"
      label-width="auto"
      :model="formLabelAlign"
      style="max-width: 600px"
  >
    <el-form-item label="标签ID">
      <el-input disabled v-model="formLabelAlign.id" :value="formLabelAlign.id" />
    </el-form-item>
    <el-form-item label="标签名称">
      <el-input v-model="formLabelAlign.entityName" :value="formLabelAlign.entityName" />
    </el-form-item>
    <el-form-item label="标签颜色">
      <el-tag :color="formLabelAlign.spanColor" style="margin-right: 10px;width: 120px" size="large" />
      <span :style="{ color: formLabelAlign.spanColor }">{{ formLabelAlign.spanColor }}</span>
      <el-select v-model="value" placeholder="选择颜色" style="width: 240px;margin-left: 10px" @change="colorChange">
        <el-option
            v-for="item in colors"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        >
          <div class="flex items-center">
            <el-tag :color="item.value" style="margin-right: 8px" size="small" />
            <span :style="{ color: item.value }">{{ item.label }}</span>
          </div>
        </el-option>
        <template #tag>
          <el-tag v-for="color in value" :key="color" :color="color" />
        </template>
      </el-select>
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