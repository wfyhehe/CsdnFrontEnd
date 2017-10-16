<template>
    <div class="author">
        <h2>CSDN博主</h2>
        <!--<el-button class="add" size="small" @click="turnToMobileInbound"><i class="el-icon-plus"></i> 转到入库界面</el-button>-->
        <div class="search">
            <el-form :inline="true" :model="searchForm">
                <el-form-item label="昵称/标签">
                    <el-input v-model="searchForm.search"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="粉丝数量">
                    <el-input style="width: 80px;" v-model="searchForm.fansNumMin"></el-input>
                    -
                    <el-input style="width: 80px;" v-model="searchForm.fansNumMax"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="关注数量">
                    <el-input style="width: 80px;" v-model="searchForm.focusNumMin"></el-input>
                    -
                    <el-input style="width: 80px;" v-model="searchForm.focusNumMax"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="博客积分">
                    <el-input style="width: 80px;" v-model="searchForm.blogScoreMin"></el-input>
                    -
                    <el-input style="width: 80px;" v-model="searchForm.blogScoreMax"></el-input>
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
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="getAuthors"
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
  import {imageStore} from "../common/config";


  export default {
    components: {
      ElOption,
      ElButton
    },
    data() {
      return {
        backEndUrl,
        searchForm: {
          search: '',
          fansNumMin: '',
          fansNumMax: '',
          focusNumMin: '',
          focusNumMax: '',
          blogScoreMin: '',
          blogScoreMax: '',
          ordering: ''
        },
        authors: [],
        orderings: [{
          label: '粉丝数量 高到低',
          value: '-fans_num'
        }, {
          label: '粉丝数量 低到高',
          value: 'fans_num'
        }, {
          label: '博客分数 高到低',
          value: '-blog_score'
        }, {
          label: '博客分数 低到高',
          value: 'blog_score'
        }, {
          label: '关注数量 高到低',
          value: '-focus_num'
        }, {
          label: '关注数量 低到高',
          value: 'focus_num'
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
        this.getAuthors()
      }, 500)
    },
    methods: {
      getAuthors(index) {
        if (index % 1 !== 0) {
          index = null
        }
        this.loading = true
        let self = this
        let searchUrl = `${backEndUrl}/author/`
        axios.get(searchUrl, {
          params: {
            search: self.searchForm.search,
            fans_num_min: self.searchForm.fansNumMin,
            fans_num_max: self.searchForm.fansNumMax,
            focus_num_min: self.searchForm.focusNumMin,
            focus_num_max: self.searchForm.focusNumMax,
            blog_score_min: self.searchForm.blogScoreMin,
            blog_score_max: self.searchForm.blogScoreMax,
            ordering: self.searchForm.ordering,
            page_index: index || self.pageIndex,
            page_size: self.pageSize
          }
        }, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }).then((response) => {
          self.authors = response.data.results
          self.count = response.data.count
          self.loading = false
        }).catch((err) => {
          self.$message.error(err)
        })
      },
      formatDate(date, fmt) {
        return formatDate(date, fmt)
      },
      liked(author) {
        return this.likeList.indexOf(author.url_object_id) >= 0
      },
      like(author) {
        addLikeList(author.url_object_id)
        this.likeList = getLikeList()
      },
      dislike(author) {
        deleteLikeList(author.url_object_id)
        this.likeList = getLikeList()
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.getAuthors()
      }
    },
    mounted() {
      this.getAuthors()
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
        margin: 30px;
    }
</style>
