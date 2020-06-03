<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/头像3.jpg" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 unique-opened→每次只能打开一个菜单项 collapse→是否折叠or展开菜单-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 侧边栏的折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744"
        text-color="#fff"
        active-text-color="#4098FF"
        :unique-opened="true"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        :default-active="activePath"
        ><!-- 路由跳转：跳转到每项二级菜单默认的index地址 -->
          <!-- 一级菜单:index→item.id是一个数字，将其转化为字符串使用 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单  @click="saveNavState()"→当鼠标点击菜单的时候保存当前的路由 -->
            <el-menu-item :index="'/'+subItem.path+''"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容主体区域 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    data(){
        return {
            //左侧菜单数据
            menulist:[],
            //图标对象的id
            iconsObj:{
                '125':'el-icon-s-custom',
                '103':'el-icon-key',
                '101':'el-icon-s-goods',
                '102':'el-icon-s-order',
                '145':'el-icon-s-data',
            },
            //菜单是否折叠
            isCollapse:false,
            //被激活的链接地址
            activePath:'',
        }
    },

    created(){
        this.getMenuList()
        this.activePath - window.sessionStorage.getItem('activePath')
    },

  methods: {
    //清空
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获得所有菜单
    async getMenuList(){
        const { data:res } =await this.$http.get('menus')
        //如果获取请求失败则弹出消息
        if(res.meta.status!== 200)return this.$message.error(res.meta.msg)
        //成功获取菜单信息
        this.menulist = res.data
        console.log(res)
    },
    //点击按钮:折叠和展开菜单
    toggleCollapse(){
        //取反操作
        this.isCollapse = !this.isCollapse;
    },
    //二级菜单按钮：当点击时保存当前路由到sessionStorage中
    saveNavState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
    }
  }
};
</script>

<style lang="less" scoped>
//用el组件给整个页面布局
.home-container {
  height: 100%;
}

//给头部布局
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0; //取消在element图片中自带的padding距离
  align-items: center; //防止按钮沾边
  color: #fff;
  font-size: 25px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}

//给侧边栏，头部和主体上色
.el-header {
  background-color: #373d41;
}
.el-aside {
  background-color: #333744;
  .el-menu{
      border-right:none;
  }
}
.el-main {
  background-color: #eaedf1;
}

//一级菜单的图标跟字体保持间距
.iconfont{
    margin-right:10px;
}
//侧边栏的折叠与展开
.toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color:#fff;
    text-align: center;
    letter-spacing: 0.2em;  //字母之间设置空格
    cursor:pointer;
}
</style>