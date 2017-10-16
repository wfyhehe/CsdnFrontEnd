<template>
    <div class="article">
        <h2>CSDN文章</h2>
        <!--<el-button class="add" size="small" @click="turnToMobileInbound"><i class="el-icon-plus"></i> 转到入库界面</el-button>-->
        <div class="search">
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="标题/作者">
                    <el-input v-model="searchForm.search"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="浏览次数">
                    <el-input style="width: 80px;" v-model="searchForm.viewNumMin"></el-input>
                    -
                    <el-input style="width: 80px;" v-model="searchForm.viewNumMax"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="评论次数">
                    <el-input style="width: 80px;" v-model="searchForm.commentNumMin"></el-input>
                    -
                    <el-input style="width: 80px;" v-model="searchForm.commentNumMax"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="发表时间范围">
                    <el-date-picker
                            v-model="searchForm.createTime"
                            format="yyyy-MM-dd HH-mm-ss"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            placeholder="选择时间范围">
                    </el-date-picker>
                </el-form-item>
                <br/>
                <el-form-item label="排序规则">
                    <el-select v-model="searchForm.ordering" clearable placeholder="排序规则">
                        <el-option
                                v-for="(item, i) in orderings"
                                :key="i"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br/>

            </el-form>
        </div>
        <el-collapse v-loading.body="loading">
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
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="getArticles"
                class="pagination"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count">
        </el-pagination>
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
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 3)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        searchForm: {
          createTime: '',
          search: '',
          viewNumMin: '',
          viewNumMax: '',
          commentNumMin: '',
          commentNumMax: '',
          ordering: ''
        },
        articles: [],
        orderings: [{
          label: '阅读次数 高到低',
          value: '-view_num'
        }, {
          label: '阅读次数 低到高',
          value: 'view_num'
        }, {
          label: '评论次数 高到低',
          value: '-comment_num'
        }, {
          label: '评论次数 低到高',
          value: 'comment_num'
        }, {
          label: '发表时间 最近',
          value: '-create_date'
        }, {
          label: '发表时间 最早',
          value: 'create_date'
        }],
        likeList: [],
        loading: true,
        pageIndex: 1,
        pageSize: 10,
        count: 0
      }
    },
    computed: {
      searchFormJson() {
        return JSON.stringify(this.searchForm)
      },

    },
    watch: {
      searchFormJson: debounce(function () {
        this.getArticles()
      }, 500)
    },
    methods: {
      getArticles(index) {
        if (index % 1 !== 0) {
          index = null
        }
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/article/`
        axios.get(searchUrl, {
          params: {
            search: self.searchForm.search,
            view_num_min: self.searchForm.viewNumMin,
            view_num_max: self.searchForm.viewNumMax,
            comment_num_min: self.searchForm.commentNumMin,
            comment_num_max: self.searchForm.commentNumMax,
            start_time:
              self.searchForm.createTime ?
                formatDate(new Date(self.searchForm.createTime[0]), 'yyyy-MM-dd hh:mm:ss.S') :
                null,
            end_time:
              self.searchForm.createTime ?
                formatDate(new Date(self.searchForm.createTime[1]), 'yyyy-MM-dd hh:mm:ss.S') :
                null,
            ordering: self.searchForm.ordering,
            page_index: index || self.pageIndex,
            page_size: self.pageSize
          }
        }, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          self.articles = response.data.results
          self.count = response.data.count
          self.loading = false
        }).catch((err) => {
          self.$message.error(err)

        })
      },
      likeNum(article) {
        return article.like_num != null ? article.like_num : article.dig_num - 3 * article.bury_num
      },
      formatDate(date, fmt) {
        return formatDate(date, fmt)
      },
      liked(article) {
        return this.likeList.indexOf(article.url_object_id) >= 0
      },
      like(article) {
        addLikeList(article.url_object_id)
        this.likeList = getLikeList()
      },
      dislike(article) {
        deleteLikeList(article.url_object_id)
        this.likeList = getLikeList()
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.getArticles()
      }
    },
    mounted() {
      this.getArticles()
      this.likeList = getLikeList()
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

    .pagination {
        margin: 20px;
    }

    h1, h2, h3 {
        margin: 30px;
    }
</style>
