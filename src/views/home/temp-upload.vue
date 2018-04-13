<template>
  <div id='temp-upload'>
    <div class="container-title">当前位置： 模板管理 <i class='el-icon-arrow-right'></i> 上传模板</div>
    <div style="padding:56px 95px;width: 600px;">
      <el-row style='margin-bottom:60px'>
        <el-col :span='8'>
          <el-input :maxlength='20' v-model='name' size='small' placeholder='此处输入音频名称' style='margin: 23px 0;'></el-input>
          <el-select v-model='type' size='small' placeholder="选择音频类别" style='width:100%'>
            <el-option v-for='(i,n) in types' :key='n' :label="i.name" :value='i.id'></el-option>
          </el-select>
        </el-col>
        <el-col :span='14' :offset='2' class="thumbnail-wrapper">
          <div class="thumbnail-img" :style="'background-image:url(' + imgUrl + ')' "></div>
          <el-upload
            class='thumbnail-upload'
            action=""
            :auto-upload="false"
            accept='image/*'
            :on-change='(file) =>onPicChange(file)'
            :show-file-list='false'>
            <el-button class='size122-btn' type='warning' size='mini'>选择缩略图</el-button>
            <div slot="tip">
              图片格式：jpg或png<br/>
               图片大小：2MB以内<br/>
                图片尺寸：建议428*428
            </div>
          </el-upload>
        </el-col>
      </el-row>
        <el-row :gutter='8'>
          <el-col v-for='(i,n) in audios' :key='n' :span='8'>
            <el-input disabled placeholder='选择音频' size='small' v-model='i.name'></el-input>
            <el-upload
              accept='audio/*'
              action=""
              :auto-upload="false"
              :on-change='(file) =>onAudioChange(file,i)'
              :show-file-list='false'>
              <el-button style='margin:10px 0' class='size122-btn' type='warning' size='mini'>选择音频段落{{n+1}}</el-button>
            </el-upload>
          </el-col>
        </el-row>
        <div>
          音频格式：MP3<br/>
          上传说明：音频上传位置分为段落1、段落2、段落3。其中，段落1和段落3默认为模板中预设的人声、音效或其他相关内容，段落2预设为可供用户自主录音的背景音频，在最终体验中，系统会自动将3段音频顺序链接、合成一段成品音频。如果在用户自主录音部分之前/之后没有预设音频，则不用上传段落1或段落2，系统合成时会自动忽略此段。
        </div>
      <el-button :loading='loading' @click='upload' style='margin-top: 50px;' class='size122-btn' type='warning' size='mini'>上传</el-button>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      audios: [
        {name: ''},
        {name: ''},
        {name: ''}
      ],
      name: '',
      type: '',
      types: [],
      imgUrl: 'static/img/temp-default.png'
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
    onPicChange (file) {
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
      this.imgUrl = file.url
      this.imgFile = file.raw
    },
    onAudioChange (file, i) {
      i.name = file.name
      i.uploadFile = file.raw
    },
    upload () {
      if (!this.name) {
        this.$message.error('请输入音频名称')
      } else if (!this.type) {
        this.$message.error('请选择音频类别')
      } else if (!this.imgFile) {
        this.$message.error('请选择缩略图')
      } else if (!this.audios[1].uploadFile) {
        this.$message.error('请选择音频段落2')
      } else {
        this.loading = true
        var form = new FormData()
        form.append('voice_name', this.name)
        form.append('theme_id', this.type)
        form.append('thumbFile', this.imgFile) // 图片
        this.audios[0].uploadFile && form.append('voiceFile1', this.audios[0].uploadFile) // 段1 有才传
        form.append('voiceFile2', this.audios[1].uploadFile) // 段2
        this.audios[2].uploadFile && form.append('voiceFile3', this.audios[2].uploadFile) // 段3 有才传
        this.$ajax({
          url: '/server/voice/upload',
          method: 'post',
          data: form,
          done: () => {
            this.$message.success('上传成功')
          },
          always: () => {
            this.loading = false
          }
        })
      }
    }
  },
  mounted () {
    this.getTypes()
  }
}
</script>

<style lang="less">
  @import '~@/less/varibles';
  #temp-upload{
    .thumbnail-wrapper{
      .thumbnail-img{width:110px;height:110px;float: left;margin-right: 22px;background: no-repeat center;background-size: cover;}
      .thumbnail-upload{float: left;margin-top: 20px;}
    }

  }
</style>
