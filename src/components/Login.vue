<template>
  <div id="login" class="login_container">

    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登陆表单区域:model→用于绑定数据，可以把loginForm理解为一个对象 -->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0px" class="login_form" >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input  prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input  prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            //loginForm为一个对象
            loginForm:{
                username:"admin",
                password:"123456",
            },
            //表单验证规则对象:规则里面的名字必须跟上面mode对象里的名字保持一致
            loginFormRules:{
                //验证用户名是否合法
                username:[
                    { required: true, message: 'Please input Activity name', trigger: 'blur' },
                    { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
                ],
                //验证密码是否合法
                password:[
                    { required: true, message: 'Please input Activity name', trigger: 'blur' },
                    { min: 6, max: 15, message: 'Length should be 6 to 15', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        //清空按钮
        resetLoginForm(){
            // console.log(this);
            this.$refs.loginFormRef.resetFields();
        },
        //登陆按钮
        login(){
            this.$refs.loginFormRef.validate(async valid => {
                //1.表单预检验
                if(!valid) return;
                //2.校验通过，发送请求得到data
                const { data:res } =await this.$http.post('login',this.loginForm);
                //3.如果状态码不为200，则登录失败
                if(res.meta.status !== 200) return this.$message.error("登录失败");
                //4.否则登陆成功
                this.$message.success("登录成功");
                console.log(res)
                //5.取得token并保存到sessionStorage中
                window.sessionStorage.setItem("token",res.data.token)
                //6.跳转到导航页面
                this.$router.push("/home")
            })
        }
    },
    name: "Login"
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}


.btns {
  display: flex;
  justify-content: flex-end;
}
</style>