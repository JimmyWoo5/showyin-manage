<template>
  <div id='temp-manage'>
    <div class="container-title">当前位置： 模板管理 <i class='el-icon-arrow-right'></i> 模板页面管理</div>
    <el-row v-loading='loading'>
      <el-col :span='6' style='padding: 20px 20px 10px;'>
        <div class="editor-title">编辑说明文字</div>
        <vue-editor
          placeholder='...'
          v-model='data.tempText'
          :editor-toolbar='customToolbar'>
        </vue-editor>
        <div style="text-align: center;margin-top: 10px;">
          <el-button :loading='confirmLoading' @click='confirm' class='size110-btn' type='warning' size='mini'>确定</el-button>
        </div>
      </el-col>
      <el-col v-for='(i,n) in data.detailList' :key='n' :span='6' class='temp-wrapper'>
        <div class='temp-content'>
          <div class="temp-content-title">音频样例0{{n+1}}</div>
          <div class='temp-inner-content'>
            <div class="thumbnail-wrapper">
              <!--<img class='thumbnail-img' src="static/img/temp-default.png" />-->
              <div class='thumbnail-img' :style="'background-image:url(' + i.thumb + ')' "></div>
                <el-upload
                class='thumbnail-upload'
                action=""
                :auto-upload="false"
                accept='image/*'
                :on-change='(file) =>onPicChange(file,i)'
                :show-file-list='false'>
                <el-button class='size93-btn' type='warning' size='mini' style='margin-bottom: 4px;'>选择缩略图</el-button>
                <div slot="tip">
                  格式：jpg或png<br/>
                   大小：1MB以内<br/>
                    尺寸：377*377
                </div>
              </el-upload>
              <el-input size='small' placeholder='输入音频样例名称' v-model='i.title' style='margin:10px 0 8px;'></el-input>
              <el-select v-model='i.themeId' size='small' placeholder="选择音频类别" style='width:100%'>
                <el-option v-for='(i,n) in types' :key='n' :label="i.name" :value='i.id'></el-option>
              </el-select>
              <el-input v-model='i.originName' disabled size='small' placeholder='选择样例音频' style='margin:16px 0 8px;'></el-input>
              <el-upload
                style='margin-bottom: 16px;text-align: right;'
                accept='audio/*'
                action=""
                :auto-upload="false"
                :on-change='(file) =>onAudioChange(file,i)'
                :show-file-list='false'>
                <el-button class='size93-btn' type='warning' size='mini'>选择样例音频</el-button>
              </el-upload>
              <el-input
                type="textarea"
                resize='none'
                :rows="7"
                placeholder="此处输入关于这段音频样例的说明文字。说明文字不要超过130个字（包含标点符号）"
                v-model="i.describe">
              </el-input>

            </div>

          </div>
        </div>
        <div style="text-align: center;margin-bottom: 10px;">
          <el-button :loading='i.loading' @click='upload(i)' class='size110-btn' type='warning' size='mini'>上传</el-button>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import {VueEditor} from 'vue2-editor'
import {filePath} from '@/utils/constants'
export default {
  components: {VueEditor},
  data () {
    return {
      loading: false,
      confirmLoading: false,
      data: {},
      types: [],
      customToolbar: []
    }
  },
  methods: {
    getTypes () {
      this.$ajax({
        url: '/server/theme/list',
        done: (data = []) => {
          this.types = data
        }
      })
    },
    getList () {
      this.loading = true
      this.$ajax({
        url: '/server/temp/list',
        done: (data = {}) => {
          data.detailList && data.detailList.forEach(i => {
            i.thumb = filePath + i.thumb
            i.loading = false
          })
          this.data = data
        },
        always: () => {
          this.loading = false
        }
      })
    },
    onPicChange (file, i) {
      const isJPG = file.raw.type.indexOf('jpeg') !== -1
      const isPNG = file.raw.type.indexOf('png') !== -1
      const isLt2M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 1MB!')
        return
      }
      i.thumb = file.url
      i.imgFile = file.raw // 图片
    },
    onAudioChange (file, i) {
      i.originName = file.name
      i.audioFile = file.raw // 音频
    },
    confirm () {
      this.confirmLoading = true
      this.$ajax({
        url: '/server/temp/update',
        method: 'post',
        data: {
          id: this.data.id,
          tempText: this.data.tempText
        },
        done: () => {
          this.$message.success('编辑成功')
        },
        always: () => {
          this.confirmLoading = false
        }
      })
    },
    upload (i) {
      if (!i.title) {
        this.$message.error('请输入音频名称')
      } else if (!i.describe) {
        this.$message.error('请输入说明文字')
      } else {
        i.loading = true
        var form = new FormData()
        form.append('id', i.id)
        form.append('theme_id', i.themeId)
        form.append('name', i.title)
        form.append('describe', i.describe)
        i.imgFile && form.append('imageFile', i.imgFile) // 有文件时才上车
        i.audioFile && form.append('voiceFile', i.audioFile) // 有文件时才上车
        this.$ajax({
          url: '/server/temp/upload',
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
    }
  },
  mounted () {
    this.getTypes()
    this.getList()
  }
}
</script>

<style lang="less">
  @import '~@/less/varibles';
  #temp-manage{
    .size93-btn{width:93px;}
    .size110-btn{width:110px;}
    .temp-wrapper{
      background:@gray2;font-size: 12px;
      .temp-content{margin:20px 20px 10px;background: #ffffff;border:1px solid @gray}
      .temp-content-title{padding-left: 16px;background: @gray;line-height: 28px;border:solid #ffffff;border-width: 1px 1px 0;}
      .temp-inner-content{
        padding: 10px 8px;
        .introduction{background: @gray3;padding: 2px 4px;border:1px solid @gray;height: 152px;}
      }
      .thumbnail-wrapper{
        overflow:hidden;
        .thumbnail-img{width:110px;height:110px;float: left;background: no-repeat center;background-size: cover;}
        .thumbnail-upload{float: right;margin-top: 24px;}
      }
    }
    .editor-title{background: @dark2;height: 30px;line-height: 30px;font-size: 12px;color: #FFFFFF;padding-left: 12px;}
    /*富文本样式重置*/
    #quill-container{border-color: @dark2;}
    .ql-toolbar.ql-snow{height: 0;padding: 0;border:none;}
    .ql-editor{height: 470px;font-size: 12px}
  }
</style>
