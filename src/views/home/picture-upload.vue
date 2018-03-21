<template>
  <div id='picture-upload'>
    <div class="container-title">当前位置： 背景图片管理 <i class='el-icon-arrow-right'></i> 图片库</div>
    <div style="padding:56px 95px;">
      <div style="width: 216px;">
        <div class="img" :style="'background-image:url(' + imgUrl + ')' "></div>
        <el-upload
          accept='image/*'
          :auto-upload="false"
          :on-change='(file) =>onChange(file)'
          action=""
          :show-file-list='false'>
          <el-button style='margin-top: 8px;' class='size122-btn' type='warning' size='mini'>浏览图片</el-button>
          <div slot="tip" style="margin: 8px 0 14px">
            图片格式：jpg或png<br/>
             图片大小：2MB以内<br/>
              图片尺寸：建议1080*1200
          </div>
        </el-upload>
        <el-input size='small' placeholder='此处输入图片名称' v-model.trim='name'></el-input>
        <el-select size='small' placeholder="选择图片类别" v-model='type' style='margin: 10px 0 26px;width: 100%;'>
          <el-option v-for='(i,n) in types' :key='n' :label="i.name" :value='i.id'></el-option>
        </el-select>
        <el-button :loading='loading' @click='upload' type='warning' size='mini' style='width: 100%;'>上传</el-button>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      name: '',
      type: '',
      imgUrl: 'static/img/library-default.png',
      types: []
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
    onChange (file) {
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
      this.uploadFile = file.raw
    },
    upload () {
      if (!this.uploadFile) {
        this.$message.error('请选择图片')
      } else if (!this.name) {
        this.$message.error('请输入图片名称')
      } else if (!this.type) {
        this.$message.error('请选择图片类别')
      } else {
        this.loading = true
        var form = new FormData()
        form.append('name', this.name)
        form.append('theme_id', this.type)
        form.append('file', this.uploadFile)
        this.$ajax({
          url: '/server/image/upload',
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
  #picture-upload{
    .img{width:100%;height: 240px;background: no-repeat center;background-size: cover;}
  }
</style>
