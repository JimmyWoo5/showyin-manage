<template>
  <div id="login">
    <div class="logo">
      <img src="static/img/logo.png"/>
      <div>后台内容管理系统</div>
    </div>
    <h1 class="title">登录</h1>
    <el-form :model="form" :rules="rules" ref="form" class='form'>
      <el-form-item prop="username">
        <el-input @keyup.enter.native='login' placeholder='用户名' v-model.trim="form.username">
          <img style='margin-right: 10px;' src="static/img/user.png" slot='suffix' />
        </el-input>

      </el-form-item>
      <el-form-item prop="psw">
        <el-input @keyup.enter.native='login' type="password" placeholder='密码' v-model.trim="form.psw">
          <img style='margin-right: 10px;' src="static/img/lock.png" slot='suffix' />
        </el-input>
      </el-form-item>
      <div style="text-align: center;">
        <el-button :loading='loading' style='width:100px' type='warning' @click="login">确定</el-button>
      </div>
    </el-form>

  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      form: {
        username: '',
        psw: ''
      },
      rules: {
        username: [{required: true, message: '请输入用户名'}],
        psw: [{required: true, message: '请输入密码'}]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.$ajax({
            url: '/server/account/login',
            method: 'post',
            data: {
              email: this.form.username,
              password: this.form.psw
            },
            done: (data) => {
              console.log(data)
              this.$message.success('登录成功')
              this.$store.commit('updateStatus', 0)
              localStorage.setItem('token', data)
              this.$store.commit('updateToken', data)
              this.$router.push('/column')
            },
            always: () => {
              this.loading = false
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
  #login{
    width:400px;color: #FFFFFF;margin:5% auto 0;
    .logo{
      text-align: center;font-size:20px;
      img{width:150px;height: 40px;}
    }
    .title{font-size: 18px;background: #e6a23c;height: 62px;line-height: 62px;padding: 0 20px;margin-top: 32px;}
    .form{background: #FFFFFF;padding: 20px;}
  }
</style>
