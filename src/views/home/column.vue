<template>
  <div id='column'>
    <div class="container-title">当前位置：栏目管理</div>
    <el-row v-loading='loading'>
      <el-col :span='3' class='title-col'>
        <div class="height1"></div>
        <div class="height2"><span>栏目名称</span></div>
        <div class="height3"><span>栏目主图<br/>（主页）</span></div>
        <div class="height4"><span>栏目Banner<br/>（列表页）</span></div>
        <div class="height5" style="border:0"></div>
      </el-col>
      <el-col v-for='(i,n) in list' :key='n' :span='7' class='column-col'>
        <div class="td height1">
          <div class='column-title'>栏目{{n+1}}</div>
        </div>
        <div class="td height2">
          <el-input size='small' placeholder='输入栏目名称' v-model='i.name'></el-input>
        </div>
        <div class="td height3">
          <div class="column-img logo-img" :style="'width:' + (n !== 0 ? '76px' : 'auto') + ';background-image:url(' + i.themeLogo + ')' "></div>
          <el-upload
            action=""
            :auto-upload="false"
            accept='image/*'
            :on-change='(file) =>onChange(file,i,1)'
            :show-file-list='false'>
            <el-button class='column-viewBtn' type='warning' size='mini'>浏览图片</el-button>
            <div slot="tip">
              图片格式：jpg或png<br/>
               图片大小：2MB以内<br/>
                图片尺寸：{{n === 0 ? '1380*460' : '674*615'}}
            </div>
          </el-upload>
        </div>

        <div class="td height4">
          <div class="column-img banner-img" :style="'background-image:url(' + i.themeBanner + ')' "></div>
          <el-upload
            action=""
            accept='image/*'
            :on-change='(file) =>onChange(file,i,2)'
            :auto-upload="false"
            :show-file-list='false'>
            <el-button class='column-viewBtn' type='warning' size='mini'>浏览图片</el-button>
            <div slot="tip">
              图片格式：jpg或png<br/>
               图片大小：2MB以内<br/>
                图片尺寸：1440*596
            </div>
          </el-upload>
        </div>
        <div class="td height5" style="border:0">
          <el-button :loading='i.loading' @click='upload(i)' class='column-uploadBtn' type='warning' size='mini'>上传</el-button>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import {filePath} from '@/utils/constants'

export default {
  data () {
    return {
      loading: false,
      list: []
    }
  },
  methods: {
    getList () {
      this.loading = true
      this.$ajax({
        url: '/server/theme/list',
        done: (data = []) => {
          data.forEach(i => {
            i.loading = false
            i.themeBanner = filePath + i.themeBanner
            i.themeLogo = filePath + i.themeLogo
          })
          this.list = data
        },
        always: () => {
          this.loading = false
        }
      })
    },
    onChange (file, i, type) {
      const isJPG = file.raw.type.indexOf('jpeg') !== -1
      const isPNG = file.raw.type.indexOf('png') !== -1
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
        return
      }
      if (type === 1) {
        i.themeLogo = file.url
        i.uploadFile1 = file.raw
      } else {
        i.themeBanner = file.url
        i.uploadFile2 = file.raw
      }
    },
    upload (i) {
      if (!i.name) {
        this.$message.error('请输入栏目名称')
        return
      }
      i.loading = true
      var form = new FormData()
      form.append('title', i.name)
      form.append('theme_id', i.id)
      i.uploadFile1 && form.append('logoFile', i.uploadFile1) // 有文件时才上车
      i.uploadFile2 && form.append('bannerFile', i.uploadFile2)
      this.$ajax({
        url: '/server/theme/upload',
        method: 'post',
        data: form,
        done: () => {
          this.$message.success('上传成功')
        },
        always: () => {
          i.loading = false
        }
      })

      //    if (!i.name) {
      //      this.$message.error('请输入栏目名称')
      //    } else if (!i.uploadFile1) {
      //      this.$message.error('请选择栏目主页图片')
      //    } else if (!i.uploadFile2) {
      //      this.$message.error('请选择栏目Banner图片')
      //    } else {
      //      // console.log(i.uploadFile1, i.uploadFile2)
      //      i.loading = true
      //      var form = new FormData()
      //      form.append('title', i.name)
      //      form.append('theme_id', i.id)
      //      form.append('logoFile', i.uploadFile1)
      //      form.append('bannerFile', i.uploadFile2)
      //      this.$ajax({
      //        url: '/server/theme/upload',
      //        method: 'post',
      //        data: form,
      //        always: () => {
      //          i.loading = false
      //        }
      //      })
      //    }
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less">
  @import '~@/less/varibles';
  #column{
    @border-color:#afafaf;
    .height1{height: 53px;}
    .height2{height: 55px;}
    .height3{height: 209px;}
    .height4{height: 226px;}
    .height5{height: 50px;}
    .td{
      padding: 11px 56px;border-bottom: 1px solid @border-color;box-sizing: border-box;
    }
    .title-col{
      padding: 8px 0;background:@gray2;text-align: center;
      div{
        border-bottom:1px solid @border-color;box-sizing: border-box;position: relative;
        span{height: 20px;position: absolute;margin:auto;top:0;bottom: 0;left:0;right:0}
      }
    }
    .column-col{
      padding: 8px 0;
      .column-title{line-height: 30px;text-align: center;background: @dark;color: #ffffff;}
      .column-img{background: no-repeat center;background-size: cover;}
      .logo-img{height: 70px;}
      .banner-img{height: 87px;}
      .column-input{margin:20px 0 30px;}
      .column-viewBtn{margin:10px 0;}
      .column-uploadBtn{width: 160px;}
      &:hover{background: @gray2;}

    }

  }
</style>
