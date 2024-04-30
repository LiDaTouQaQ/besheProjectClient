<template>
  <div style="margin-top: 20px">
    <el-button @click="createContent">创建/导入
    </el-button>
    <el-select
        placeholder="导出"
        style="width: 120px; margin: 0px 20px"
        @change="exportChange"
    >
      <el-option key="exportAllExcel" label="全部导出为Excel" value="excel"/>
      <el-option key="exportNeo4j" label="导出到图数据库" value="Neo4j"/>
      <el-option key="exportJSON" label="导出为JSON" value="Json"/>
    </el-select>
    <el-button @click="">删除</el-button>
  </div>
  <el-table
      :data="projectContentData"
      style="width: 100%;height: 71vh"
      @selection-change="tableSelection"
      max-height="100vh"
      row-key="id"
      @row-click="labelTask"
  >
    <el-table-column type="selection" width="55"/>
    <el-table-column property="projectName" label="项目名称" width="120" show-overflow-tooltip></el-table-column>
    <el-table-column property="contentId" label="ID" width="120" show-overflow-tooltip></el-table-column>
    <el-table-column property="testContent" label="文本内容" width="400" show-overflow-tooltip/>
    <el-table-column label="是否完成" width="120" show-overflow-tooltip>
      <template #default="scope">
        <el-button :type="(scope.row.isComplete === '1') ? 'success' : 'warning'" round>
          {{ (scope.row.isComplete === '1') ? '完成' : '未完成' }}
        </el-button>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="250">
      <template #default="scope">
        <el-button type="primary" @click="editContent(scope.row,scope.$index)" @click.stop>编辑</el-button>
        <el-divider direction="vertical"/>
        <el-button type="primary" @click="deleteContent(scope.row,scope.$index)" @click.stop>删除</el-button>
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
        @change="getAllProjectContent(currentPage4,pageSize4)"
    />
  </div>
</template>

<script setup>
import {h, onMounted, ref} from 'vue'
import {ElInput, ElMessage, ElMessageBox, ElTable} from 'element-plus'
import {useRoute, useRouter} from "vue-router";
import axios from "axios";

const router = useRouter()
const route = useRoute()
const projectContentData = ref([])
const selects = ref([])
const testContent = ref("")

const currentPage4 = ref(1)
const pageSize4 = ref(10)
const total = ref(0)
const small = ref(false)
const background = ref(false)


let projectId = route.params.projectId
console.log(route.params.projectId)

function createContent() {
  router.push({
    path: "createContent",
    params: {
      projectId: route.params.projectId
    }
  })
}

function exportContent() {

}

function editContent(item) {
  testContent.value = item.testContent
  ElMessageBox({
    title: '修改',
    // Should pass a function if VNode contains dynamic props
    message: () =>
        h(ElInput, {
          modelValue: testContent.value,
          type: "textarea",
          autosize: true,
          "onUpdate:modelValue" : (val) => {testContent.value = val}
        }),
    confirmButtonText: "确认",
  }).then(() => {
    ElMessageBox.confirm(
        '修改内容后，所有标注都被删除，需要重新标注',
        '警告',
        {
          confirmButtonText: 'OK',
          cancelButtonText: '取消',
          type: 'warning',
        }
    ).then(() => {
      const url = "http://localhost:8080/projectContent/update"
      console.log(testContent.value)
      const param = {
        id: item.id,
        projectId: item.projectId,
        contentId: item.contentId,
        testContent: testContent.value
      }
      axios.post(url, param, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          'Content-Type': 'application/Json'
        }
      }).then((response) => {
        ElMessage({
          type: 'success',
          message: '成功修改',
        })
      }).catch((error) => {
        alert("修改失败")
      })
    }).catch(() => {
          ElMessage({
            type: 'info',
            message: "未变动",
          })
        })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: "未变动"
    })
  })
}

function labelTask(row, column, event) {
  let contentId = row.contentId
  router.push({
    name: "labelTask",
    params: {
      contentId
    }
  })
}

function deleteContent(row, index) {
  const url = "http://localhost:8080/projectContent/deleteOne"
  axios.post(url, {
    "projectId": projectId, "contentId": row.contentId
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((response) => {
    // alert("获取成功"
    console.log(response)
    if (response.data.code === "10000") {
      projectContentData.value.splice(index, 1)
    } else {
      alert(response.data.msg)
    }
  }).catch((error) => {
    alert(error.data.msg)
  })
}

function getAllProjectContent(page,pageSize) {
  const url = "http://localhost:8080/projectContent/getAll"
  axios.post(url, {projectId,page:currentPage4.value,pageSize:pageSize4.value}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((res) => {
    axios.post("http://localhost:8080/projectContent/getCount",{projectId}, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/Json'
      }
    }).then((response) => {
      console.log(response,res)
      total.value = response.data.data.count
      projectContentData.value = res.data.data
    })
  }).catch((error) => {
    alert("获取失败")
  })
}

onMounted(() => {
  getAllProjectContent(currentPage4.value,pageSize4.value)
})

function exportChange(item) {
  if (projectId.length === 0) {
    alert("选择需要导出的数据")
    return
  }
  let url = ""
  if (item === "excel") {
    url = "http://localhost:8080/projectContent/exportRelationByContentId"
    axios.post(url, {
      "projectId": projectId,
      "contentIds": selects.value
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/Json'
      }, responseType: "blob"
    }).then((response) => {
      alert("开始下载")
      let blob = new Blob([response.data], {type: 'application/vnd.ms-excel;charset=utf-8'})
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      let fileName = response.headers['content-disposition'].split('=')[1]
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    })
  } else if (item === "Neo4j") {
    url = "http://localhost:8080/projectContent/exportRelationByContentIdNeo4j"
    axios.post(url, {
      "projectId": projectId,
      "contentIds": selects.value
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/Json'
      }
    }).then(response => {
      alert(response.data.msg)
    })
  } else if (item === "Json") {
    url = "http://localhost:8080/projectContent/exportRelationByContentIdJSON"
    axios.post(url, {
      "projectId": projectId,
      "contentIds": selects.value
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/Json'
      }, responseType: "blob"
    }).then((response) => {
      alert("开始下载")
      let blob = new Blob([response.data], {type: 'application/vnd.ms-excel;charset=utf-8'})
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      let fileName = response.headers['content-disposition'].split('=')[1]
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
    })
  }

}

function tableSelection(item) {
  let s = []
  for (const select of item) {
    s.push(select.contentId)
  }
  selects.value = s
}
</script>

<style scoped>

</style>
