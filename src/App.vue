<template>
    <div id="app">
        <navigator></navigator>
        <router-view></router-view>
    </div>
</template>

<script>
  import Navigator from '@/base/Navigator'
  import ElCol from "element-ui/packages/col/src/col";

  export default {
    name: 'app',
    components: {
      ElCol,
      Navigator
    }
  }
</script>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    #app {
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    #app h1, h2, h3, .pagination, .buttons {
        text-align: center;
    }

    .el-table .row-unaudited {
        background-color: rgba(126, 119, 130, 0.47);
        /*background: #c9e5f5;*/
    }

    .el-table .row-passed {
        background-color: rgba(131, 255, 131, 0.29);
    }

    .el-table .row-not-passed {
        background-color: rgba(255, 73, 73, 0.29);
    }

    .el-table .deleted-row {
        background-color: rgba(255, 73, 73, 0.34);
    }
</style>
