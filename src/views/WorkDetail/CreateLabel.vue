<script setup>

import {UploadFilled} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
const router = useRouter()
import axios from "axios";
import {ElMessage} from "element-plus";
const route = useRoute()
const id = route.params.entityId
const projectId = route.query.projectId
const kindType = route.query.kindType
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
  kindType: kindType,
  projectId:route.query.projectId,
  entityName:"",
  spanColor:"",
})

function onSubmit(){
  if(formLabelAlign.value.entityName === "" || formLabelAlign.value.spanColor === ""){
    ElMessage({
      message: '输入内容',
      type: 'warning',
    })
    return
  }
  if(kindType === "实体"){
    axios.post("http://localhost:8080/entity/createOne",{
      projectId:formLabelAlign.value.projectId,
      entityName:formLabelAlign.value.entityName,
      num:0,
      spanColor:formLabelAlign.value.spanColor
    },{
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/Json'
      }
    }).then(response => {
      if(response.data.msg === "success"){
        ElMessage({
          message: '添加成功',
          type: 'success',
        })
        setTimeout(()=>{
          router.push({
            path:`/work/${projectId}/entity`
          })
        },1000)
      }else{
        ElMessage({
          message: '添加失败',
          type: 'warning',
        })
      }
    })
  }else if(kindType === "关系"){
    axios.post("http://localhost:8080/relation/create",{
      projectId:formLabelAlign.value.projectId,
      relationName:formLabelAlign.value.entityName,
      num:0,
      spanColor:formLabelAlign.value.spanColor
    },{
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/Json'
      }
    }).then(response => {
      if(response.data.msg === "success"){
        ElMessage({
          message: '添加成功',
          type: 'success',
        })
        setTimeout(()=>{
          router.push({
            path:`/work/${projectId}/relation`
          })
        },1000)
      }else{
        ElMessage({
          message: '添加失败',
          type: 'warning',
        })
      }
    })
  }

}

function colorChange(item){
  formLabelAlign.value.spanColor = item
}
</script>

<template>
<h2>创建标签</h2>
  <el-form
      label-position="top"
      label-width="auto"
      :model="formLabelAlign"
      style="max-width: 600px"
  >
    <el-form-item label="标签类型">
      <el-input disabled v-model="formLabelAlign.kindType" :value="formLabelAlign.kindType" />
    </el-form-item>
    <el-form-item label="标签名称" required>
      <el-input v-model="formLabelAlign.entityName" :value="formLabelAlign.entityName" />
    </el-form-item>
    <el-form-item label="标签颜色" required>
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
      <el-button type="primary" @click="onSubmit">新增</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>