import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'


Vue.use(VueRouter)

  const routes = [
    { path:'/login',name:'login',component: Login },
    { path:'/home',name:'home',component: Home,redirect:'/Welcome', children:[
      { path:'/Welcome',component:Welcome,},
      { path:'/users',component:Users, }
    ]},
    { path:'/',redirect:'/login' }
    
]


const router = new VueRouter({
  mode: 'history',
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {
  //1.to是将要访问的路径
  //2.from是从哪个路径访问
  //3.next是一个函数，表示放行
  if(to.path==='/login')return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr)return next('/login');
  next()
})

export default router
