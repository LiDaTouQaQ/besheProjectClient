<script setup>
import ProjectHeader from "@/components/ProjectHeader.vue";
import {House, Switch, UserFilled, Histogram, Tickets, HelpFilled, Refresh} from "@element-plus/icons-vue";
import {info} from "sass";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()
const route = useRoute()
const projectId = route.params.projectId
const workTitle = [
  {
    "id": "1",
    "icon": House,
    "title": "主页",
    "path": `/work/${projectId}/home`
  },
  {
    "id": "2",
    "icon": Histogram,
    "title": "数据集",
    "path": `/work/${projectId}/projectContent`

  },
  {
    "id": "4",
    "icon": Switch,
    "title": "关系",
    "path": `/work/${projectId}/relation`

  },
  {
    "id": "3",
    "icon": Tickets,
    "title": "实体",
    "path": `/work/${projectId}/entity`

  },
  {
    "id": "5",
    "icon": UserFilled,
    "title": "成员",
    "path": `/work/${projectId}/user`

  },
  {
    "id": "6",
    "icon": HelpFilled,
    "title": "统计",
    "path": `/work/${projectId}/statistics`

  },
  // {
  //   "id": "7",
  //   "icon": Refresh,
  //   "title": "设置",
  //   "path": `/work/${projectId}/setting`
  // }
]

</script>

<template>
  <el-container>
    <el-header>
      <ProjectHeader/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <div class="work-title" v-for="item in workTitle" :key="item.id">
          <RouterLink :to="item.path">
            <div>
              <el-button style="font-size:17px" :icon="item.icon" key="info" type="info" text>{{ item.title }}
              </el-button>
            </div>
          </RouterLink>
        </div>
      </el-aside>
      <el-main>
        <div class="work-detail">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-aside {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, .2), 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12);
  height: 90vh;
  margin-left: 20px;
  overflow: hidden;
}

.work-title {
  height: 40px;
  font-size: 16px;
  width: 200px;
  justify-content: center;
  align-content: center;
  justify-items: center;
  align-items: center;
  padding-top: 10px;

}

.el-button {
  width: 100%;
  height: 100%;
}

.work-detail {
  margin-left: auto;
  margin-right: auto;
  padding: 12px;
  height: 84vh;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
  overflow: auto;
}
</style>