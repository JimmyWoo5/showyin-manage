<template>
  <div id='banner'>
    <div class="container-title">当前位置：banner管理</div>
    <el-row style='min-height:300px ;' v-loading='loading'>

      <el-col v-for='(i,n) in list' :key='n' :span='8' class='column-wrapper'>
        <div class='column-content'>
          <div class='column-title'>栏目{{n+1}}</div>
          <div class="column-img" :style="'background-image:url(' + i.bannerUrl + ')' "></div>
          <el-upload
            accept='image/*'
            :auto-upload="false"
            :on-change='(file) =>onPicChange(file,i)'
            action=""
            :show-file-list='false'>
            <el-button style='margin:10px 0;' class='size122-btn' type='warning' size='mini'>浏览Banner图片</el-button>
            <div slot="tip">
              图片格式：jpg或png<br/>
               图片大小：4MB以内<br/>
                图片尺寸：建议1158*658
            </div>
          </el-upload>
          <el-cascader
            v-model='i.tempArr'
            placeholder='选择关联模板'
            style='margin:30px 0 10px;'
            size='small'
            expand-trigger="click"
            :options="tempList"
            :props="props">
          </el-cascader>
          <el-button :loading='i.loading' @click='upload(i)' style='margin-top: 30px;' class='size122-btn' type='warning' size='mini'>上传</el-button>
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
      list: [],
      tempList: [],
      props: {
        value: 'id',
        label: 'voiceName',
        children: 'voiceList'
      }
    }
  },
  methods: {
    getList () {
      this.loading = true
      this.$ajax({
        url: '/server/banner/list',
        done: (data = []) => {
          data.forEach(i => {
            i.loading = false
            i.bannerUrl = filePath + i.bannerUrl
            i.tempArr = [i.voiceInfo.themeId, i.voiceId]
          })
          this.list = data
        },
        always: () => {
          this.loading = false
        }
      })
    },
    getTempList () {
      this.$ajax({
        url: '/server/voice/list',
        params: {s: 1},
        done: (data = []) => {
          data.forEach(i => {
            i.voiceName = i.name
          })
          this.tempList = data
        }
      })
    },
    onPicChange (file, i) {
      const isJPG = file.raw.type.indexOf('jpeg') !== -1
      const isPNG = file.raw.type.indexOf('png') !== -1
      const isLt2M = file.size / 1024 / 1024 < 4
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 4MB!')
        return
      }
      i.bannerUrl = file.url
      i.uploadFile = file.raw
    },
    //  onTempChange (file, i) {
    //    console.log(file)
    //    i.name = file.name
    //    // i.audioName = file.name
    //    i.uploadFile2 = file.raw
    //  },
    upload (i) {
      i.loading = true
      var form = new FormData()
      form.append('banner_id', i.id)
      form.append('voice_id', i.tempArr[1])
      i.uploadFile && form.append('file', i.uploadFile) // 有文件时才上车
      this.$ajax({
        url: '/server/banner/upload',
        method: 'post',
        data: form,
        done: () => {
          this.$message.success('上传成功')
        },
        always: () => {
          i.loading = false
        }
      })
    }
  },
  mounted () {
    this.getList()
    this.getTempList()
  }
}
</script>

<style lang="less">
  @import '~@/less/varibles';
  #banner{
    .column-content{
      padding: 66px 42px;
      &:hover{background: @gray2;}
      .column-title{height:32px;line-height: 32px;text-align: center;background: @dark;color: #ffffff;}
      .column-img{background: no-repeat center;background-size: cover;height: 120px;}
    }
  }
</style>
