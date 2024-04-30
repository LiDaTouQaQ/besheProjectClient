<script setup>

</script>

<template>
  <div>
    <div><h1>欢迎使用本数据标注工具</h1></div>
    <div style="max-width: 600px">
      <el-steps direction="vertical" :active="1" space="100px">
        <el-step title="导入数据集" />
        <el-step title="添加成员" />
        <el-step title="添加关系" />
        <el-step title="实体标注" />
        <el-step title="关系标注" />
        <el-step title="查看统计" />
        <el-step title="导出数据集" />
      </el-steps>
    </div>
  </div>

</template>

<style scoped>

</style>