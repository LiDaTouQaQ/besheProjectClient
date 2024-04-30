<script setup>
import {ElInput, ElTable} from "element-plus";
import {ElMessage, ElMessageBox} from 'element-plus'
import {h, onMounted, ref} from "vue";
import axios from "axios";
import {useRoute, useRouter} from "vue-router";

const entityList = ref([])
const focusMenu = ref("entity")
const router = useRouter()
const route = useRoute()
const entityName = ref("")
let projectId = route.params.projectId

const currentPage4 = ref(1)
const pageSize4 = ref(10)
const total = ref(0)
const small = ref(false)
const background = ref(false)

function getAllEntityList(page,pageSize) {
  const url = "http://localhost:8080/entity/getAll"
  axios.post(url, {projectId,page:currentPage4.value,pageSize:pageSize4.value}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((res) => {
    axios.post("http://localhost:8080/entity/getCount",{projectId}, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/Json'
      }
    }).then((response) => {
      console.log(response,res)
      total.value = response.data.data.count
      entityList.value = res.data.data
    })
  }).catch((error) => {
    alert("获取失败")
  })
}
function editName(item) {
  ElMessageBox.prompt('实体名称','修改',{
    confirmButtonText:"确认",
    showInput:true,
    inputPlaceholder:item.entityName
  }).then(({ value }) => {
    const url = "http://localhost:8080/entity/update"
    console.log(value)
    const param = {
      id:item.id,
      projectId: item.projectId,
      entityName: value
    }
    axios.post(url,param,{
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/Json'
      }
    }).then((response) => {
      getAllEntityList()
    }).catch((error) => {
      alert("获取失败")
    })
  }).catch( () => {
    ElMessage({
      type: 'info',
      message: "未修改内容"
    })
  })
}
function editColor(item) {
  ElMessageBox.prompt('实体颜色','修改',{
    confirmButtonText:"确认",
    showInput:true,
    inputPlaceholder:item.spanColor
  }).then(({ value }) => {
    const url = "http://localhost:8080/entity/update"
    console.log(value)
    const param = {
      id:item.id,
      projectId: item.projectId,
      spanColor: value
    }
    axios.post(url,param,{
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/Json'
      }
    }).then((response) => {
      getAllEntityList()
    }).catch((error) => {
      alert("获取失败")
    })
  }).catch( () => {
    ElMessage({
      type: 'info',
      message: "未修改内容"
    })
  })
}

onMounted(() => {
  getAllEntityList(currentPage4.value,pageSize4.value)
})

function createLabel() {
  router.push({
    name: "createLabel",
    query: {
      projectId: route.params.projectId,
      kindType:"实体"
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
      :data="entityList"
      style="width: 100%;height: 71vh"
      @selection-change=""
      max-height="100vh"
      row-key="id"
      @row-click=""
  >
    <el-table-column type="selection" width="55"/>
    <el-table-column label="名称" width="240" show-overflow-tooltip>
      <template #default="scope">
        <span>{{ scope.row.entityName }}</span>
      </template>
    </el-table-column>
    <el-table-column property="id" label="ID" width="240" show-overflow-tooltip></el-table-column>
    <el-table-column label="色彩" width="360" show-overflow-tooltip>
      <template #default="scope">
        <el-button :style="{backgroundColor: scope.row.spanColor,cursor: 'default',border: 'none'}" type="success"
                   round>{{ scope.row.spanColor }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="250">
      <template #default="scope">
        <el-button type="primary" @click="editName(scope.row,scope.$index)">名称</el-button>
        <el-divider direction="vertical" />
        <el-button type="primary" @click="editColor(scope.row,scope.$index)">颜色</el-button>
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
        @change="getAllEntityList(currentPage4,pageSize4)"
    />
  </div>
</template>

<style scoped>
.el-message-box__input {
  display: block;
}
</style>