<script setup>
import {ElTable} from "element-plus";
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";

const workerList = ref([])
const router = useRouter()
const route = useRoute()
let projectId = route.params.projectId
console.log(projectId)
onMounted(() => {
  axios.post("http://localhost:8080/user/getProjectUser", {projectId}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then(response => {
    console.log(response)
    workerList.value = response.data.data
  })
})

function deleteContent(item) {
  if(item.power === "创建人"){
    alert("不允许删除项目BOSS")
  }else{
    alert("没有权限删除")
  }
}
function addWorker(){
  router.push({
    name:"createUser",
    query:{
      projectId: route.params.projectId,
    }
  })
}
function deleteWorker(){
  if(selection.value.length === 0){
    alert("选择需要删除的对象")
    return
  }
  let url = "http://localhost:8080/user/deleteProjectUser"
  axios.post(url,{ids:selection.value,projectId},{
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then(response => {
    console.log(response)
  })
}
const selection = ref([])
function tableSelection(item){
  let s = []
  for(const select of item ){
    s.push(select.id)
  }
  selection.value = s
}
</script>

<template>
  <div style="margin-top: 20px">
    <el-button @click="addWorker">添加工人</el-button>
    <el-button @click="deleteWorker">删除</el-button>
  </div>
  <el-table
      :data="workerList"
      style="width: 100%;height: 71vh"
      @selection-change="tableSelection"
      max-height="100vh"
      row-key="id"
      @row-click=""
  >
    <el-table-column type="selection" width="55"/>
    <el-table-column property="userName" label="人员名称" width="120" show-overflow-tooltip></el-table-column>
    <el-table-column property="id" label="ID" width="120" show-overflow-tooltip></el-table-column>
    <el-table-column property="power" label="人员职责" width="200" show-overflow-tooltip/>
    <el-table-column property="email" label="联系方式" width="200" show-overflow-tooltip/>
    <el-table-column label="操作" width="250">
      <template #default="scope">
        <el-button type="primary">编辑</el-button>
        <el-popconfirm title="确定删除该员工吗?" @confirm="deleteContent(scope.row,scope.$index)">
          <template #reference>
            <el-button type="primary">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>


</template>

<style scoped>

</style>