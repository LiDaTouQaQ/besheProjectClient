<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <PageHeader/>
      </el-header>
      <el-main>
        <div class="login-box">
          <div class="login-header">
            <span><span>登录</span></span>
          </div>
          <div class="login-detail">
            <div class="login-input">
              <div class="login-title"><i>邮箱</i></div>
              <div class="login-msg">
                <el-icon :color="userFocus ? 'blue' : 'gray'" size="16px">
                  <UserFilled/>
                </el-icon>
                <el-input
                    v-model="userName"
                    style="width: 240px"
                    placeholder="输入邮箱"
                    clearable
                    @focus="userFocus=!userFocus"
                    @blur="userFocus=!userFocus"
                />
              </div>
            </div>
            <div class="login-input">
              <div class="login-title"><i>密码</i></div>
              <div class="login-msg">
                <el-icon :color="passFocus ? 'blue' : 'gray'" size="16px">
                  <Lock/>
                </el-icon>
                <el-input
                    v-model="password"
                    style="width: 240px"
                    type="password"
                    placeholder="输入密码"
                    show-password
                    @focus="passFocus=!passFocus"
                    @blur="passFocus=!passFocus"
                />
              </div>
            </div>
            <div class="login-button">
              <el-button
                  key="info"
                  type="info"
                  text
                  @click="login()">登录
              </el-button>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import PageHeader from "@/components/PageHeader.vue";
import {onMounted, ref} from 'vue'
import axios from 'axios'
import {useRouter} from "vue-router";
import {ElMessage} from "element-plus";

const router = useRouter()
const userFocus = ref(false)
const passFocus = ref(false)
const userName = ref("")
const password = ref("")

function loginToken(){
  const url = "http://localhost:8080/user/login"
  axios.post(url, {
    token:localStorage.getItem("userToken")
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((response) => {
    let data = response.data
    console.log(data)
    if (data.code === "10000") {
      ElMessage({
        message: '登录成功',
        type: 'success',
      })
      localStorage.setItem("userId", data.data.id)
      setTimeout(() => {
        router.push({path: '/project'})
      }, 1000)
    } else {
      ElMessage({
        message: data.msg,
        type: 'warning',
      })
    }
  }).catch((error) => {
    ElMessage({
      message: '登录失败',
      type: 'warning',
    })
  })
}
function login() {
  const url = "http://localhost:8080/user/login"
  axios.post(url, {
    "email": userName.value,
    "password": password.value
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      'Content-Type': 'application/Json'
    }
  }).then((response) => {
    let data = response.data
    console.log(data)
    localStorage.setItem("userId", data.data.id)
    if (data.code === "10000") {
      ElMessage({
        message: '登录成功',
        type: 'success',
      })
      setTimeout(() => {
        localStorage.setItem("userToken", data.data.token)
        router.push({path: '/project'})
      }, 1000)
    } else {
      alert(data.msg)
    }
  }).catch((error) => {
    ElMessage({
      message: '登录失败',
      type: 'warning',
    })
  })
}
onMounted(()=>{
  loginToken()
})
</script>

<style scoped>
.el-main {
  display: flex;
  justify-content: center;
}

.login-box {
  flex: 0 0 33.3333333333%;
  width: 33.33%;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
  border-radius: 4px;
  margin-top: 150px;
}

.el-icon {
  padding: 8px;
  margin-top: 2px;
}

.login-header {
  width: 100%;
  height: 50px;
  background-color: #1976d2;
  color: #f5fafc;
  align-content: center;
  font-size: 20px;
}

.login-header span {
  margin-left: 5px;
}

.login-detail {
  margin-top: 40px;
  padding-left: 100px;
}

.login-title {
  margin-left: 32px;
  font-size: 16px;
  padding-top: 20px;
}

.login-button {
  align-items: center;
  display: flex;
  padding: 8px;
  float: right;
}

.el-button {
  height: 36px;
  min-width: 64px;
  margin-right: 15px;
  padding: 5px 5px;
}
</style>
