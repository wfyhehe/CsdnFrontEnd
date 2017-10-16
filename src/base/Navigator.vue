<template>
    <div class="navigator">
        <el-menu class="navigator-menu"
                 :router="true"
                 mode="horizontal"
                 theme="dark">
            <p class="title">CSDN博客爬虫爬取信息</p>
            <el-menu-item :index="menu.path? '/' + menu.path : ''"
                          class="tag"
                          v-for="(menu, i) in menus"
                          :key="i">
                {{menu.name}}
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        menus: [{
          name: '文章页',
          path: 'article'
        }, {
          name: '博主页',
          path: 'author'
        }, {
          name: '我的收藏',
          path: 'my_fav'
        }],
      }
    },
    methods: {
    },
    mounted() {
    }
  }
</script>

<style scoped>
    * {
        margin: 0;
    }

    .navigator {
        font-family: 微软雅黑;
        font-size: x-small;
        color: #D3DCE6;
    }

    .title {
        text-align: center;
        margin: 20px 10px;
        cursor: pointer;
        float: left;
        color: #F9FAFC;
        font-size: large;
        font-family: 方正综艺简体;
    }

    .navigator-menu .tag{
        padding: 4px 30px;
        font-size: medium;
    }
    .navigator .navigator-menu {
    }
</style>
