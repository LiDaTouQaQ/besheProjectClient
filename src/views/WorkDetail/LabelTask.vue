<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import axios from "axios";
import {nextTick} from 'vue'
import {Check, CircleCheck, Close, Cpu, DeleteFilled, Operation} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

const route = useRoute()
const contentId = route.params.contentId
const projectId = route.params.projectId
const projectContentDetail = ref({})
const textChunks = ref([])
const is_complete = ref(false)
const testContent = ref("")
const textSelect = ref("")
const entityList = ref([])
const input = ref("")
const size = ref(40)

// 当前选中的文本
const nowSelectText = ref('')
const nowIndexNum = ref(0)
const nowTextStart = ref(0)
const nowTextEnd = ref(0)

const menuX = ref(0)
const menuY = ref(0)

const entityMenuOpened = ref(false)

const relationStart = ref(false)
const relationLists = ref([])
const focusRelation = ref({
  check:true
})

function getDetailContent() {
  const url = "http://localhost:8080/projectContent/getDetail"
  axios.post(url, {projectId, contentId}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((response) => {
    if (response.data.code === "10000") {
      projectContentDetail.value = response.data.data
      console.log("projectContentDetail", projectContentDetail.value)
      if (projectContentDetail.value.isComplete === "0") {
        is_complete.value = false
      } else {
        is_complete.value = true
      }
      testContent.value = projectContentDetail.value.testContent
      splitText()
    } else {
      alert(response.data.msg)
    }
  })
  //     .catch((error) => {
  //   alert(error.data.msg)
  // })
  const entityUrl = "http://localhost:8080/entity/getAll"
  axios.post(entityUrl, {projectId,page:"1",pageSize:"1000"}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((response) => {
    entityList.value = response.data.data
  }).catch((error) => {
    alert(error.data.msg)
  })
}

function changeIsComplete() {
  is_complete.value = !is_complete.value
  projectContentDetail.value.isComplete = is_complete.value ? "1" : "0"
  const param = {
    projectId,
    contentId,
    isComplete: projectContentDetail.value.isComplete,
    completeBy: localStorage.getItem("userId")
  }
  console.log(param)
  axios.post("http://localhost:8080/projectContent/update", param, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((response) => {

  })
}

// 解析实体，提供实体页面位置
function splitText() {
  const chunkSize = size.value
  let chunks = [];
  for (let i = 0; i < testContent.value.length; i += chunkSize) {
    chunks.push({"chunk": testContent.value.slice(i, i + chunkSize), "entityList": [], "relationList": []})
  }
  getEntityPosition()
  // 获取实体
  for (const entity of projectContentDetail.value.entityEntityList) {
    let lineNum = entity.lineNum
    chunks[lineNum].entityList.push(entity)
  }
  // 获取关系
  for (const relation of projectContentDetail.value.relationEntityList) {
    let lineNum = relation.lineNum
    if (lineNum === undefined) {
      continue
    }
    chunks[lineNum].relationList.push(relation)
  }
  textChunks.value = chunks
  // 设定每一个svg高度
  for (const item of textChunks.value) {
    let height = 60
    let maxEntityCount = 0
    for (const entity of item.entityList) {
      if (entity.entityCount > maxEntityCount) {
        maxEntityCount = entity.entityCount
      }
      // 处理数字和英文不等宽的情况
      let text = item.chunk.slice(0, entity.start - entity.lineNum * 40)
      let otherFontNum = countCharacters(text)
      if (otherFontNum > 0) {
        // console.log("半字体文本", entity.start, text)
        // console.log("半字体数量", otherFontNum)
        entity.lineX -= otherFontNum * 10 - 20
        entity.lineY -= otherFontNum * 10 - 20
        otherFontNum = 0
      }
    }
    let maxRelationCount = 0
    for(const relation of item.relationList){
      if(relation.height4 > maxEntityCount){
        maxRelationCount = relation.height4
      }
    }
    height += maxEntityCount
    item.height = height +50+ maxRelationCount
  }
  console.log("textChunks", textChunks.value)
}

function handleSelection(index, event) {
  nowIndexNum.value = index
  event.preventDefault()
  const selection = window.getSelection()
  console.log("index", index)
  nowTextStart.value = selection.anchorOffset
  nowTextEnd.value = selection.focusOffset
  let text = selection.toString()
  if (text === nowSelectText.value) {
    return
  }
  nowSelectText.value = text
  if (text !== "") {
    let range = selection.getRangeAt(0)
    nextTick(() => {
      menuX.value = event.clientX + 5
      menuY.value = event.clientY + 5
      textSelect.value = text
      entityMenuOpened.value = true
    })
  } else {
    entityMenuOpened.value = false
  }
}

function confirmEntity(item, event) {
  entityMenuOpened.value = false
  let textNum = nowIndexNum.value * 40
  console.log(nowTextStart.value, nowTextEnd.value)
  let startText = nowTextStart.value + textNum
  let endText = nowTextEnd.value + textNum
  if (startText > endText) {
    startText -= size.value
  }
  const param = {
    projectId: item.projectId,
    projectContentId: contentId,
    entityName: item.entityName,
    start: startText,
    end: endText,
    entityContent: testContent.value.slice(startText, endText),
    entityId: item.id
  }
  console.log("param", param)
  nowTextStart.value = 0
  nowTextEnd.value = 0
  nowIndexNum.value = 0
  const url = "http://localhost:8080/projectContent/insertEntity"
  axios.post(url, param, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((response) => {
    if(response.data.msg === "success"){
      ElMessage({
        message: '添加成功',
        type: 'success',
      })
      getDetailContent()
    }else{
      ElMessage({
        message: '添加失败',
        type: 'warning',
      })
    }
  }).catch((error) => {
    alert(error.data.msg)
  })
}

function countCharacters(text) {
  const characters = text.split('');
  let sum = 0;
  characters.forEach(char => {
    if (/\d|\s|[a-z]/.test(char)) {
      sum++;
    }
  });
  return sum;
}

function getEntityPosition() {
  let fontSize = 20
  if (projectContentDetail.value.entityEntityList === null) {
    return
  }
  console.log("projectContentDetail", projectContentDetail.value)
  for (const entity of projectContentDetail.value.entityEntityList) {
    let start = entity.start
    let end = entity.end
    let entityFontNum = entity.entityContent.length
    let height = parseInt(start / size.value)
    let startPosition = start % size.value
    let endPosition = end & size.value
    let startX = parseInt(start / size.value)
    let startY = parseInt(end / size.value)
    let secondHeight = height + (startX - startY)
    let endLength = endPosition
    if (secondHeight !== height) {
      endLength = size.value
    }
    startPosition = startPosition * fontSize
    endPosition = startPosition + entityFontNum * fontSize
    entity.entityFontNum = entityFontNum
    entity.lineX = startPosition
    entity.lineY = endPosition
    entity.entityCount = 0
    entity.isMoreLine = (secondHeight !== height)
    entity.lineNum = height
  }
  // 判断是否存在一段话有多个实体的情况
  for (const entity of projectContentDetail.value.entityEntityList) {
    for (const en of projectContentDetail.value.entityEntityList) {
      if (entity.entityCount === en.entityCount && entity.lineNum === en.lineNum && entity.lineX === en.lineX && entity.lineY === en.lineY && en.id !== entity.id) {
        en.entityCount += fontSize + 10
      }
    }
  }
  // 确定关系的位置
  for (const relation of projectContentDetail.value.relationEntityList) {
    let formId = relation.form
    let to = relation.to
    let formEntity = {}
    let toEntity = {}
    for (const entity of projectContentDetail.value.entityEntityList) {
      if (entity.toRelationId == formId) {
        formEntity = entity
        continue
      }
      if (entity.toRelationId == to) {
        toEntity = entity
      }
    }
    if (formEntity.lineNum === toEntity.lineNum) {
      let relationStart = (formEntity.lineY - formEntity.lineX) / 2 + formEntity.lineX
      let relationEnd = (toEntity.lineY - toEntity.lineX) / 2 + toEntity.lineX
      relation.relationStart = relationStart
      relation.relationEnd = relationEnd
      relation.lineNum = formEntity.lineNum
      relation.height1 = -20
      relation.height2 = 18
      relation.height3 = 30
      relation.height4 = 17
      relation.path_d = `M ${relationStart} 50
      v ${relation.height1}
      A 12 12 0 0 1 ${relationStart + 12} ${relation.height2}
      H ${relationEnd}
      A 12 12 0 0 1 ${relationEnd + 12} ${relation.height3}
      v ${relation.height4}`
      relation.rectY = 8
      relation.textY = 25
      relation.rectWidth = relation.relationName.length * 20
    }
  }
  // 处理关系存在覆盖的问题
  for (const re1 of projectContentDetail.value.relationEntityList) {
    for (const re2 of projectContentDetail.value.relationEntityList) {
      if (re1.lineNum === re2.lineNum && re1.height1 === re2.height1 && re1.id !== re2.id) {
        re1.height1 -= 20
        re1.height2 -= 20
        re1.height3 -= 20
        re1.height4 += 20
        re1.rectY -= 20
        re1.textY -= 20
        re1.path_d = `M ${re1.relationStart} 50
          v ${re1.height1}
          A 12 12 0 0 1 ${re1.relationStart + 12} ${re1.height2}
          H ${re1.relationEnd}
          A 12 12 0 0 1 ${re1.relationEnd + 12} ${re1.height3}
          v ${re1.height4}`
        break
      }
    }
  }

}

function inputEntity(item) {
  const url = "http://localhost:8080/entity/createOne"
  axios.post(url, {projectId, entityName: item, num: 1, spanColor: '#1EC79D'}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((response) => {
    console.log(response)
    if (response.data.code === "10000") {
      const entity = response.data.data
      confirmEntity(entity)
    }
  })
}

function getRelationList() {
  const url = "http://localhost:8080/relation/getAll"
  axios.post(url, {projectId,page:"1",pageSize:"1000"}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((res) => {
    relationLists.value = res.data.data
    addFocusType()
  }).catch((error) => {
    alert("获取失败")
  })
}
function addFocusType(){
  for(const item of relationLists.value){
    item.focus = false
  }
}
function changeFocusRelation(item){
  console.log(item)
  addFocusType()
  item.focus = true
  focusRelation.value = item
}
function selectEntity(item){
  console.log("selectEntity",item)
  if(relationStart.value){
    console.log("开始标注")
  }else{
    console.log("未开始标注")
  }
}
onMounted(() => {
  getDetailContent()
  getRelationList()
})
function closeEntityMenus(){
    nowSelectText.value = ""
    entityMenuOpened.value = false
}
</script>

<template>
  <div @click="closeEntityMenus">
    <div class="task-btn">
      <el-tooltip
          class="box-item"
          effect="dark"
          :content="is_complete ? '完成' : '未完成'"
          placement="bottom"
      >
        <el-button class="work_button" key="plain" text :icon="is_complete  ? Check : Close"
                   @click="changeIsComplete()"></el-button>
      </el-tooltip>
      <el-tooltip
          class="box-item"
          effect="dark"
          content="过滤"
          placement="bottom"
      >
        <el-button class="work_button" key="plain" text :icon="Operation"></el-button>
      </el-tooltip>
      <el-tooltip
          class="box-item"
          effect="dark"
          content="自动标注"
          placement="bottom"
      >
        <el-button class="work_button" key="plain" text :icon="Cpu"></el-button>
      </el-tooltip>
      <el-tooltip
          class="box-item"
          effect="dark"
          content="删除"
          placement="bottom"
      >
        <el-button class="work_button" key="plain" text :icon="DeleteFilled"></el-button>
      </el-tooltip>
    </div>
    <div class="content">
      <div class="task-content">

        <div class="task-work-content">
          <div v-for="(item, index) in textChunks" :key="index" class="text-chunk">
<!--            @mouseup="handleSelection(index,$event)"-->
            <svg width="100%" :height="item.height">
              <g transform="translate(0, 24)">
                <g v-for="(re,index) in item.relationList" :key="index">
                  <path :d="re.path_d" stroke="#74b8dc" stroke-width="1" fill="none"
                        marker-end="url(#arrowhead)"></path>
                  <g>
                    <rect :x="(re.relationStart+re.relationEnd)/2-40" :y="re.rectY" :width="re.rectWidth" height="20"
                          fill="white"></rect>
                    <text :x="(re.relationStart+re.relationEnd)/2" :y="re.textY" fill="currentColor"
                          text-anchor="middle">
                      {{ re.relationName }}
                    </text>
                  </g>
                </g>
                <g transform="translate(0, 50)">
                  <text x="0" style="white-space: pre;"  @mouseup="handleSelection(index,$event)" @click.stop>{{ item.chunk }}</text>
                  <g v-for="(en, index) in item.entityList" :key="index" @click="selectEntity(en)" @click.stop>
                    <line :x1="en.lineX" :y1="en.lineNum+5+en.entityCount" :x2="en.lineY"
                          :y2="en.lineNum+5+en.entityCount"
                          stroke-width="5" :stroke="en.color"></line>
                    <g style="cursor: pointer;" transform="translate(0, 24)">
                      <circle r="3" :fill="en.color" :cx="en.lineX-5" :cy="en.entityCount"></circle>
                      <text :x="en.lineX" :y="en.lineNum+5+en.entityCount" fill="currentColor">{{en.entityName }}</text>
                    </g>
                  </g>
                </g>

              </g>
            </svg>
          </div>
        </div>
      </div>
      <div class="relation-content task-work-content">
        <div>
          <el-switch
              v-model="relationStart"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              active-text="标注关系"
              inactive-text="标注实体"
          />
        </div>
        <div>
          <el-tag
              v-for="item in relationLists"
              :key="item.id"
              :type="item.focus ? 'warning':'primary'"
              effect="dark"
              round
              size="large"
              style="margin: 5px 5px;font-size: 12px;cursor:pointer;"
              @click="changeFocusRelation(item)"
          >
            {{ item.relationName }}
          </el-tag>
        </div>
      </div>
    </div>
    <div class="entityMenuBox" v-show="entityMenuOpened" :style="{top : menuY+'px',left : menuX+'px'}">
      <div>
        <el-input v-model="input" style="width: 240px" @change="inputEntity" placeholder="确定实体"/>
      </div>
      <div>
        <el-scrollbar height="400px">
          <div v-for="item in entityList" :key="item.id" class="entityNameDiv" @click="confirmEntity(item,$event)">
            {{ item.entityName }}
          </div>
        </el-scrollbar>
      </div>
    </div>

  </div>
</template>

<style scoped>
.task-btn {
  border-radius: 4px;
  display: inline-flex;
  max-width: 100%;
  flex: 0 1 auto;
  position: relative;
  transition: .3s cubic-bezier(.25, .8, .5, 1);
  box-sizing: inherit;
  font-size: 20px;
}

.work_button {
  font-size: 30px;
}

.task-work-content {
//font-family: "Roboto", sans-serif !important; font-size: 20px !important; font-weight: 500; line-height: 2rem; opacity: .6;
  padding: 16px !important;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
}

.text-chunk {
  margin-bottom: 30px;
//position: relative;
}

.task-content {
  width: 850px;
}

.el-input {
  padding: 10px 10px;
}

.entityMenuBox {
  border-radius: 4px;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, .2), 0 8px 10px 1px rgba(0, 0, 0, .14), 0 3px 14px 2px rgba(0, 0, 0, .12);
  contain: content;
  display: inline-block;
  max-width: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  background: #fff;
}

.entityNameDiv {
  align-items: center;
  align-self: center;
  display: flex;
  flex: 1 1;
  flex-wrap: wrap;
  overflow: hidden;
  padding: 12px 10px;
  cursor: pointer;
}

.el-scrollbar div:hover {
  background-color: #f6f6f6;
}
.content{
  display: flex;
}
.relation-content{
  margin-left: 20px;
  width: 290px;
  height: 400px;
  overflow: auto;
}
</style>