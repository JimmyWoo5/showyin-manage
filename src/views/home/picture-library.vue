<template>
  <div id='picture-library'>
    <div class="container-title">当前位置： 背景图片管理 <i class='el-icon-arrow-right'></i> 图片库</div>
    <div style='padding: 50px 42px;min-height: 200px;' v-loading='loading'>

      <el-form ref="form" label-width='40px'>
        <div v-for='(i,n) in list' :key='n' class='list-wrapper'>
          <div class='list-title'>栏目{{n+1}}：{{i.name}}</div>
          <el-row class='list-content'>
            <el-col v-for='(i2, n2) in i.imageList' :key='n2' :span='4'  class='list-item-wrapper'>
              <div class="list-item-content">
                <div class="img" :style="'background-image:url(' + filePath + i2.imgUrl + ')' "></div>
                <el-form-item
                  label='名称'
                  :prop='i2.name'>
                  <el-input v-show='i2.isSave' size='mini' v-model.trim='i2.title'></el-input>
                  <div class='ellipse' v-show='!i2.isSave'><span style="margin-left: 15px;">{{i2.title}}</span></div>
                </el-form-item>
                <el-form-item label='类别'>
                  <el-select v-show='i2.isSave' size='mini' placeholder="请选择类别" v-model='i2.themeId'>
                    <el-option v-for='(i,n) in types' :key='n' :label="i.name" :value='i.id'></el-option>
                  </el-select>
                  <div class='ellipse' v-show='!i2.isSave'><span style="margin-left: 15px;">{{i2.typeName}}</span></div>
                </el-form-item>
                <el-button type='warning' size='mini' @click='onEditClick(i2)'>{{i2.isSave ? '保存' : '编辑'}}</el-button>
                <el-button @click='del(i2)' style='float: right;' type='warning' size='mini'>删除</el-button>

              </div>

            </el-col>
          </el-row>
        </div>
      </el-form>

    </div>

  </div>
</template>

<script>
import {filePath} from '@/utils/constants'
export default {
  data () {
    return {
      loading: false,
      types: [],
      filePath: filePath,
      list: []
    }
  },
  methods: {
    getTypes () {
      this.loading = true
      this.$ajax({
        url: '/server/theme/list',
        done: (data = []) => {
          this.types = data
          this.getList()
        }
      })
    },
    getList () {
      this.loading = true
      this.$ajax({
        url: '/server/image/list',
        done: (data = []) => {
          data.forEach(i => {
            i.imageList && i.imageList.forEach(i2 => {
              i2.isSave = false
              i2.typeName = this.transferType(i2.themeId) // 计算themeId对应的name
            })
          })
          this.list = data
        },
        always: () => {
          this.loading = false
        }
      })
    },
    onEditClick (i) {
      if (i.isSave) {
        this.loading = true
        this.$ajax({
          url: '/server/image/update',
          method: 'post',
          params: {
            image_id: i.id,
            name: i.title,
            theme_id: i.themeId
          },
          done: () => {
            this.$message.success('保存成功')
            i.isSave = false
            this.getList()
          },
          always: () => {
            this.loading = false
          }
        })
      }
      i.isSave = true
    },
    del (i) {
      this.$confirm(`确定删除${i.title}`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true
        this.$ajax({
          url: '/server/image/delete',
          method: 'post',
          params: {image_id: i.id},
          done: () => {
            this.$message.success('删除成功')
            this.getList()
          },
          always: () => {
            this.loading = false
          }
        })
      }).catch(() => {})
    },
    transferType (id) {
      var name
      this.types.forEach(i => {
        if (i.id === id) {
          name = i.name
        }
      })
      console.log(id)
      return name
    }
  },
  mounted () {
    this.getTypes()
  //  this.list.forEach(i => {
  //    i.items.forEach(i2 => {
  //      i2.isSave = 0
  //    })
  //  }) // 0 编辑 ，1 保存
  //  console.log(this.list)
  }
}
</script>

<style lang="less">
  @import '~@/less/varibles';
  #picture-library{
    .el-form-item{margin:0}
    .list-wrapper{
      border-bottom:1px solid #ffffff;
      .list-title{line-height: 50px;padding-left: 12px;background: @dark2;color: #ffffff;}
      .list-content{padding: 0 7px;background: @gray;}
      .list-item-wrapper{
        .list-item-content{
          padding:6px 6px 10px;margin:17px 7px;background:#ffffff;
          .img{width:100%;height: 144px;background: no-repeat center;background-size: contain;}
        }
      }
    }

  }
</style>
