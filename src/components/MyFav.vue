<template>
    <div class="my-fav">
        <h2>我的收藏</h2>
        <h5>收藏的文章</h5>
        <el-collapse>
            <el-collapse-item v-for="(article, i) in articles">
                <template slot="title">
                    <span class="article-span">
                        <a :href="article.url" target="_blank" class="title">{{article.title}}</a>
                        <i class="like iconfont icon-xihuanfill" v-if="liked(article)"></i>
                        <i class="iconfont icon-xihuan">{{likeNum(article)}}</i>
                        <i class="iconfont icon-liuyan">{{article.comment_num}}</i>
                        <i class="iconfont icon-gonglve">{{article.view_num}}</i>
                    </span>
                </template>
                <div class="article-detail">
                    <p>作者：<a :href="`http://my.csdn.net/${article.author}`" target="_blank">{{article.author}}</a></p>
                    <p>发表时间：{{formatDate(new Date(article.create_date), 'yyyy年MM月dd日 hh:mm:ss')}}</p>
                    <p>爬取时间：{{formatDate(new Date(article.crawl_date), 'yyyy年MM月dd日 hh:mm:ss')}}</p>
                    <el-button size="small" v-if="!liked(article)" @click="like(article)">收藏</el-button>
                    <el-button size="small" v-if="liked(article)" @click="dislike(article)">取消收藏</el-button>
                </div>
            </el-collapse-item>
        </el-collapse>
        <h5>收藏的博主</h5>
        <el-collapse>
            <el-collapse-item v-for="(author, i) in authors">
                <template slot="title">
                    <span class="author-span">
                        <a :href="author.url" target="_blank" class="title">{{author.nick_name}}</a>
                        <i class="like iconfont icon-xihuanfill" v-if="liked(author)"></i>
                        <span>粉丝：{{author.fans_num}}</span>
                        <span>积分：{{author.blog_score}}</span>
                    </span>
                </template>
                <div class="author-detail">
                    <img :src="`${backEndUrl}/media/${author.avatar_path}`"/>
                    <p>用户名：{{author.username}}</p>
                    <p>个人描述：{{author.detail}}</p>
                    <p>个性签名：{{author.sign}}</p>
                    <p>博客积分：{{author.blog_score}}</p>
                    <p>下载积分：{{author.download_score}}</p>
                    <p>论坛积分：{{author.bbs_score}}</p>
                    <p>代码积分：{{author.code_score}}</p>
                    <p>爬取时间：{{formatDate(new Date(author.crawl_date), 'yyyy年MM月dd日 hh:mm:ss')}}</p>
                    <el-button size="small" v-if="!liked(author)" @click="like(author)">收藏</el-button>
                    <el-button size="small" v-if="liked(author)" @click="dislike(author)">取消收藏</el-button>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
  import axios from 'axios'
  import {backEndUrl, SUCCESS} from '@/common/config'
  import {debounce} from '@/common/util'
  import ElButton from "../../node_modules/element-ui/packages/button/src/button.vue"
  import ElOption from "../../node_modules/element-ui/packages/select/src/option.vue"
  import {formatDate} from "../common/util";
  import {addLikeList, deleteLikeList, getLikeList} from "../common/cache";


  export default {
    components: {
      ElOption,
      ElButton
    },
    data() {
      return {
        backEndUrl,
        authors: [],
        articles: [],
        likeList: [],
      }
    },
    computed: {
      searchFormJson() {
        return JSON.stringify(this.searchForm)
      },

    },
    watch: {
      searchFormJson: debounce(function () {
        this.getAuthors()
      }, 500)
    },
    methods: {
      getObject(id) {
        this.loading = true
        let self = this
        let articleUrl = `${backEndUrl}/article/${id}`
        let authorUrl = `${backEndUrl}/author/${id}`

        axios.get(articleUrl, {
          params: {}
        }, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          self.articles.push(response.data)
        }).catch((err) => {
        })

        axios.get(authorUrl, {
          params: {}
        }, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          self.authors.push(response.data)
        }).catch((err) => {
        })
      },
      formatDate(date, fmt) {
        return formatDate(date, fmt)
      },
      likeNum(article) {
        return article.like_num != null ? article.like_num : article.dig_num - 3 * article.bury_num
      },
      liked(object) {
        return this.likeList.indexOf(object.url_object_id) >= 0
      },
      like(object) {
        addLikeList(object.url_object_id)
        this.likeList = getLikeList()
      },
      dislike(object) {
        deleteLikeList(object.url_object_id)
        this.likeList = getLikeList()
      }
    },
    mounted() {
      this.likeList = getLikeList()
      console.log(this.likeList)
      for (let like of this.likeList) {
        this.getObject(like)
      }
    }
  }
</script>

<style scoped>
    a {
        text-decoration: none;
        color: #324057;
        font-weight: bold;
    }

    a:hover {
        text-decoration: underline;
        color: #13AC66;
        font-weight: bold;
    }

    .search {
        margin: 0px 30px;
    }

    .article-span i {
        padding-right: 15px;
        color: #475669;
        float: right;
    }

    .article-span .like {
        padding-left: 15px;
        color: #b10000;
        float: none;
    }

    .author-span span {
        padding-right: 15px;
        color: #475669;
        float: right;
    }

    .author-span .like {
        padding-left: 15px;
        color: #b10000;
        float: none;
    }

    .pagination {
        margin: 20px;
    }

    h1, h2, h3 {
        margin: 30px
    }

    h5 {
        margin: 50px 0px 20px 20px;

    }
</style>
