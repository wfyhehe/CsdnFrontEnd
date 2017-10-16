import Vue from 'vue'
import Router from 'vue-router'


const Article = (resolve) => {
  import('@/components/Article').then((module) => {
    resolve(module)
  })
}

const Author = (resolve) => {
  import('@/components/Author').then((module) => {
    resolve(module)
  })
}

const MyFav = (resolve) => {
  import('@/components/MyFav').then((module) => {
    resolve(module)
  })
}

Vue.use(Router);

export default new Router({
  mode: 'hash',
  routes: [{
    path: '/article',
    component: Article
  }, {
    path: '/author',
    component: Author
  }, {
    path: '/my_fav',
    component: MyFav
  }]
})
