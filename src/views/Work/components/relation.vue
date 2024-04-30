<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";
import {ElTable} from "element-plus";
import {useRoute, useRouter} from "vue-router";

const relationList = ref([])
const router = useRouter()
const route = useRoute()
let projectId = route.params.projectId

const currentPage4 = ref(1)
const pageSize4 = ref(10)
const total = ref(0)
const small = ref(false)
const background = ref(false)

function getRelationList(page,pageSize) {
  const url = "http://localhost:8080/relation/getAll"
  axios.post(url, {projectId,page,pageSize}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((res) => {
    axios.post("http://localhost:8080/relation/getCount",{projectId}, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/Json'
      }
    }).then((response) => {
      console.log(response,res)
      total.value = response.data.data.count
      relationList.value = res.data.data
    })
  }).catch((error) => {
    alert("获取失败")
  })
}

onMounted(() => {
  getRelationList(currentPage4.value,pageSize4.value)
})

function createLabel(){
  router.push({
    name:"createLabel",
    query:{
      projectId: route.params.projectId,
      kindType: "关系"
    }
  })
}
</script>

<template>
  <div style="margin-top: 20px">
    <el-select
        placeholder="操作"
        style="width: 120px; margin: 10px 20px"
    >
      <el-option key="add" label="创建标签" value="add" @click="createLabel"/>
<!--      <el-option key="import" label="导入标签" value="import"/>-->
<!--      <el-option key="export" label="导出标签" value="export"/>-->
    </el-select>
    <el-button style="margin-left: 20px" @click="">删除</el-button>
  </div>
  <el-table
      ref="multipleTableRef"
      :data="relationList"
      style="width: 100%;height: 71vh"
      @selection-change=""
      max-height="100vh"
      row-key="id"
      @row-click=""
  >
    <el-table-column type="selection" width="55"/>
    <el-table-column label="名称" width="240" show-overflow-tooltip>
      <template #default="scope">
        <span>{{scope.row.relationName}}</span>
      </template>
    </el-table-column>
    <el-table-column property="id" label="ID" width="240" show-overflow-tooltip></el-table-column>
    <el-table-column label="色彩" width="360" show-overflow-tooltip>
      <template #default="scope">
        <el-button :style="{backgroundColor: scope.row.spanColor,cursor: 'default',border: 'none'}" type="success" round>{{ scope.row.spanColor }}</el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="250">
      <template #default="scope">
        <el-button type="primary" @click="edit(scope.row,scope.$index)">编辑</el-button>
        <el-divider direction="vertical" />
        <el-button type="primary" @click="deleteEntity(scope.row,scope.$index)" @click.stop>删除</el-button>
      </template>
    </el-table-column>
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
        @change="getRelationList(currentPage4,pageSize4)"
    />
  </div>
</template>

<style scoped>

</style>