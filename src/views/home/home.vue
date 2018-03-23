<template>
  <div id="home">
    <div class='main-menu' v-bar style="height: 100%;">
      <div>
        <div class="logo"><img src="static/img/logo.png"/></div>
        <el-menu
          router
          :default-active="activeIndex"
          background-color="#494949"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="/column">
            <img src="static/img/menu-column.png"/>
            <span slot="title">栏目管理</span>
          </el-menu-item>
          <el-menu-item index="/banner">
            <img src="static/img/menu-banner.png"/>
            <span slot="title">Banner管理</span>
          </el-menu-item>

          <el-submenu index='/temp'>
            <template slot="title">
              <img src="static/img/menu-song.png"/>
              <span>模板管理</span>
            </template>
            <el-menu-item index="/temp-online">
              <span slot="title">在线模板列表</span>
            </el-menu-item>
            <el-menu-item index="/temp-offline">
              <span slot="title">下架模板列表</span>
            </el-menu-item>
            <el-menu-item index="/temp-upload">
              <span slot="title">上传模板</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index='/picture'>
            <template slot="title">
              <img src="static/img/menu-pic.png"/>
              <span>背景图片管理</span>
            </template>
            <el-menu-item index="/picture-library">
              <span slot="title">图片库</span>
            </el-menu-item>
            <el-menu-item index="/picture-upload">
              <span slot="title">图片上传</span>
            </el-menu-item>
          </el-submenu>

          <el-menu-item index="/temp-manage">
            <img src="static/img/menu-temp.png"/>
            <span slot="title">模板列表管理</span>
          </el-menu-item>

        </el-menu>
      </div>

    </div>
    <el-row class='header'>
      <el-col :span='12' class='header-left'>后台内容管理系统</el-col>
      <el-col :span='12' class='header-right'>
        <img src="static/img/head-default.png"/> 你好，{{userInfo.name}}，欢迎登陆
        <img src="static/img/login-out.png"/>
        <el-button @click='loginOut' style='color: #FFFFFF;' type='text'>退出</el-button>
      </el-col>
    </el-row>
    <router-view class='main-content' />

  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '',
      userInfo: {}
    }
  },
  methods: {
    getUserInfo () {
      this.$ajax({
        url: '/server/account/info',
        done: (data = {}) => {
          this.userInfo = data
        }
      })
    },
    loginOut () {
      this.$confirm(`确定退出?`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$ajax({
          url: '/server/account/logout',
          done: () => {
            this.$message.success('退出成功')
            this.$router.push('/login')
          }
        })
      }).catch(() => {})
    }
  },
  mounted () {
    this.activeIndex = this.$route.path
    this.getUserInfo()
  }
}
</script>

<style lang="less">
  @import '~@/less/varibles';
  #home{
    @width:200px;

    .logo{
      height: @topHeight;text-align: center;
      img{width:150px;height: 40px;margin-top: 20px;}
    }

    .main-menu{
      position: fixed!important;left:0;top:0;width: @width;
      .el-menu{
        height: calc(100% - 80px);
        img{margin-right: 10px;}
        .el-menu-item{min-width: 0;}
      }
    }

    .header{
      background: linear-gradient(to right, @dark2, #676767, @dark2);
      width: calc(100% - 218px);height: @topHeight;color: #ffffff;padding-top:20px;position: fixed;top:0;left:@width;z-index:1000;
      .header-left{font-size: 20px;}
      .header-right{
        text-align: right;
        img{position: relative;top:6px;margin: 0 5px 0 34px;}
      }
    }
    .main-content{background: #ffffff;margin: @topHeight 18px 18px @width;}

  }
</style>
