<template>
  <el-row class="pageHeader">
    <el-col :span="4">
      <div class="logo-box">
        <div class="grid-content logo-icon">
          <a href="/"><img src="../assets/img/logo.jpg"/></a>
        </div>
        <div class="logo-text"><span>Tool</span></div>
      </div>
    </el-col>
    <el-col :span="14">
      <div class="grid-content"></div>
    </el-col>
    <el-col :span="2">
      <el-select v-model="value" placeholder="中文" style="width: 65%">
        <el-option
            v-for="item in cities"
            :key="item.value"
            :value="item.value"
        >
          <span style="float: left">{{ item.value }}</span>
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="1">
      <div class="grid-content time-background">
        <el-button :icon="showPassword ? Sunny : Moon" @click="changeBackground()" native-type="button" circle>
        </el-button>
      </div>
    </el-col>
    <el-col :span="1">
      <div class="grid-content login-box">
        <RouterLink to="/login" active-class="active">
          <el-button>登录</el-button>
        </RouterLink>
      </div>
    </el-col>
    <el-col :span="1">
      <div class="grid-content login-box">
        <el-button>试一试</el-button>
      </div>
    </el-col>
  </el-row>


</template>
<script setup>
import {Sunny} from "@element-plus/icons-vue";
import {Moon} from "@element-plus/icons-vue";
import {ref} from 'vue'

const showPassword = ref(true)
const value = ref('')
const cities = [
  {
    value: '中文'
  },
  {
    value: 'English'
  }
]
const changeBackground = () => {
  // 切换图标显示
  showPassword.value = !showPassword.value;
}

</script>

<style scoped>
.el-row {
  width: 100%;
  height: 64px;
  justify-items: center;
  align-items: center;
}

.pageHeader {
  background-color: #f5f5f5;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
  margin-top: 0px;
  left: 0px;
  right: 0px;
}

.logo-box {
  display: flex;
  line-height: 0;
  align-items: center;
}

.logo-text {
  display: flex;
  margin-left: 8px;
}

.logo-icon {
  padding-left: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.logo-icon span {
  font-size: 14px;
  color: black;
}

.time-background {
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.time-background el-button {
  border: 0px;
}

.logo-icon img {
  width: 100%;
  height: auto;
  border-radius: 50%; /* 与外层div相同的圆形形状 */
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>