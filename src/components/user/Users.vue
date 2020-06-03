<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 搜索与添加区域 gutter="20"为各组件的间距，span为各组件的占的长度-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4"></el-col>
        <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
      </el-row>
      <!-- 用户列表区域 label为字段名 prop为每列的属性-->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- slot-scope可以取得该行的数据 -->
          <template slot-scope="scope">
            <!-- v-model绑定当前行的mg_state作为开关 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop width="180px">
          <template slot-scope="scope">
            <!-- 编辑用户信息 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除用户 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- tooltip提示框：effect设置背景色 content为文本内容 placement为上部 :enterable="false"鼠标进入提示则提示消失  -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <!-- 设置用户 -->
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 page-sizes→每页显示个数选择器的选项设置-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 添加用户的对话框 width占屏50% visible.sync绑定dialogVisible布尔变量,该变量决定是否打开对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClosed()"
      >
        <!-- 内容主题区域 model为表单数据对象 rules为表单数据规则对象 ref为表单数据引用 -->
        <el-form :rules="addFormRules" ref="addFormRef" :model="addForm" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户信息的对话框 -->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed()">
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式:在JavaScript中正则表达式用法为/正则表达式特殊字符/修饰符(可选)
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

      if (regEmail.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };

    //验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      //验证手机号的正则表达式
      const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };

    return {
      //用户列表数据
      queryInfo: {
        query: "",
        pagenum: 1, //当前页数
        pagesize: 10 //每页有几条数据
      },
      userlist: [],
      total: 0,
      //添加用户的对话框是否打开
      addDialogVisible: false,
      //添加用户的表单数据对象
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //添加用户的表单验证规则对象
      addFormRules: {
        username: [
          //用户名
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "用户名长度在3~10之间", trigger: "blur" }
        ],
        password: [
          //密码
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "密码长度在6~15之间", trigger: "blur" }
        ],
        email: [
          //邮箱
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          //手机号
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //修改用户信息的表单是否打开
      editDialogVisible: false,
      //查询到的用户信息对象：这里不需要定义，直接靠后台接口提供就好
      editForm: {},
      //修改用户信息表单的验证规则
      editFormRules: {
        email: [
          //邮箱
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          //手机号
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },

    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获得用户列表数据
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      this.userlist = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },

    //监听pagesize改变
    handleSizeChange(newSize) {
      //取得当前设置新的页数
      this.queryInfo.pagesize = newSize;
      //刷新用户列表数据
      this.getUserList();
    },

    //监听 页码值 改变的时间
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    //监听 switch 开关状态的改变
    async userStateChanged(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },

    //监听添加用户对话框的关闭时间
    addDialogClosed() {
      //PS：感觉这个没必要加，不小心点到边上就没了啊
      //resetFields()专注清空表单数据
      //this.$refs.addFormRef.resetFields()
    },

    //添加用户预校验方法
    addUser() {
      //validate方法用于表单验证，valid变量是一个布尔值，验证通过则为true，这里还需要绑定addFormRef表单数据
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        //验证成功，添加用户的网络请求
        const { data: res } = await this.$http.post("users", this.addForm);

        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败！");
          return;
        }

        this.$message.success("添加用户成功");
        //隐藏添加用户的对话框
        this.addDialogVisible = false;
        //重新获取用户列表数据
        this.getUserList();
      });
    },

    //展示编辑用户的对话框
    async showEditDialog(id) {
      //取得当前行的id后查询用户信息
      const { data: res } = await this.$http.get('users/' + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      //查询到信息后报错到editForm修改信息表单数据对象中
      this.editForm = res.data;
      //打开对话框
      this.editDialogVisible = true;
    },
    
    //监听表单关闭事件，关闭时清空表单的数据和验证信息
    editDialogClosed(){
      //refs是引用对象，通过引用对象找到editFormRef来完成操作
      //this.$refs.editFormRef.resetFields();
    },

    //编辑用户信息的预验证处理
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid => {
        if(!valid)return
        //发起修改用户信息请求
        const {data:res} = await this.$http.put('users/'+this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        //更新用户信息是否成功
        if(res.meta.status !==200){
          return this.$message.error('更新用户信息失败！')
        }
        //关闭对话框
        this.editDialogVisible = false
        //刷新用户列表
        this.getUserList();
        //提示修改成功
        this.$message.success('更新用户信息成功')
      })
    },

    //通过用户id删除用户
    async removeUserById(id){
        //弹框询问用户是否删除数据
         const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(error =>{
          return error
        })
        
        if(confirmResult!== 'confirm'){
          return this.$message.info('已取消删除')
        }
        
        const {data:res} = await this.$http.delete('users/'+id)

        if(res.meta.status!=200){
          return this.$message.error('删除用户信息失败')
        }

        this.$message.success('删除成功')

        this.getUserList()
    }
  }
};
</script>

<style lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>