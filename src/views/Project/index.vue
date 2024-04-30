<script setup>
import ProjectHeader from "@/components/ProjectHeader.vue";

import {onMounted, reactive, ref} from 'vue'
import {ElMessage, ElTable} from 'element-plus'
import axios from "axios";
import {useRouter} from "vue-router";

const currentPage4 = ref(1)
const pageSize4 = ref(10)
const total = ref(0)
const small = ref(false)
const background = ref(false)
const router = useRouter()

const selection = ref([])

const userId = ref("1")
const projectData = ref([])
const getAllProject = () => {
  const url = `http://localhost:8080/project/get`
  axios.post("http://localhost:8080/project/getCount",{"createBy": userId.value},{
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((response) => {
    console.log(response)
    total.value = response.data.data.total
  })
  axios.post(url, {"createBy": userId.value,page:(currentPage4.value),pageSize:pageSize4.value}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((response) => {
    projectData.value = response.data.data
  }).catch((error) => {
    ElMessage({
      message: '项目信息获取失败',
      type: 'warning',
    })
  })
}

onMounted(() => {
  getAllProject()
})
function worked(row, event, column){
  router.push(
      {
        "path": `/work/${row.projectId}/home`
      }
  )
}

function tableSelection(item){
  let s = []
  for(const select of item ){
    s.push(select.projectId)
  }
  selection.value = s
}

function deleteProject(){
  if(selection.value.length === 0){
    alert("选择需要删除的项目")
    return
  }
  const url = "http://localhost:8080/project/delete"
  axios.post(url,{projectId:selection.value}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((response) => {
    alert(response.data.msg)
    getAllProject()
  })
}

</script>

<template>
  <el-container>
    <el-header>
      <ProjectHeader/>
    </el-header>
    <el-main>
      <div style="margin-top: 20px">
        <RouterLink to="/create/project">
          <el-button type="primary" style="margin-right: 10px">创建</el-button>
        </RouterLink>
        <el-button @click="deleteProject">删除</el-button>
      </div>
      <el-table
          ref="multipleTableRef"
          :data="projectData"
          style="width: 100%;height: 71vh"
          @selection-change="tableSelection"
          row-key="projectId"
          @row-click="worked"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column property="projectName" label="项目名称" width="120">
        </el-table-column>
        <el-table-column property="remark" label="描述" width="120"/>
        <el-table-column property="类型" label="类型" show-overflow-tooltip/>
        <el-table-column property="createDate" label="创建时间" show-overflow-tooltip/>
        <el-table-column property="createBy" label="创建人" show-overflow-tooltip/>
        <el-table-column property="tag" label="标签" show-overflow-tooltip/>
      </el-table>
      <div class="demo-pagination-block">
        <el-pagination
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[10, 20, 30, 40]"
            :small="small"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        />
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>