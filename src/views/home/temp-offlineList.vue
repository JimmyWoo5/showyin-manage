<template>
  <div id='temp-offline'>
    <div class="container-title">当前位置： 模板管理 <i class='el-icon-arrow-right'></i> 上线模板列表</div>
    <div style='padding: 50px 42px;min-height: 300px;' v-loading='loading'>
      <div v-for='(i,n) in list' :key='n' class='templist-wrapper'>
        <div class='templist-title'>栏目{{n+1}}：{{i.name}}</div>
        <el-row v-for='(i2, n2) in i.voiceList' :key='n2'>
          <el-col :span='12' class='col-left'>
            <div>{{n2+1}}.</div>
            <!--<img class='song-logo' src="static/img/song-default.png"/>-->
            <div class='song-logo' :style="'background-image:url(' + filePath + i2.voiceLogo + ')' "></div>
            <div>{{i2.voiceName}}</div>
          </el-col>
          <el-col :span='1' :offset='1'><img @click='play(i2)' class='ctrl-btn' :src="'static/img/' + (i2.isPlay? 'play' : 'pause') + '.svg'" /></el-col>
          <el-col :span='1' :offset='1'><el-button :disabled='n2===0' type='text' @click='move(i2,1)'>上移</el-button></el-col>
          <el-col :span='1' :offset='1'><el-button :disabled='n2===i.voiceList.length-1' type='text' @click='move(i2,-1)'>下移</el-button></el-col>
          <el-col :span='1' :offset='1'><el-button type='text' @click='move(i2,0)'>置顶</el-button></el-col>
          <el-col :span='1' :offset='1'><el-button @click='online(i2)' type='text'>上架</el-button></el-col>
          <el-col :span='1' :offset='1'><el-button type='text' @click='del(i2)'>删除</el-button></el-col>
        </el-row>
      </div>
    </div>
    <audio :src="url" ref="player"></audio>
  </div>
</template>

<script>
import NProgress from 'nprogress'
import {filePath} from '@/utils/constants'
export default {
  data () {
    return {
      filePath: filePath,
      loading: false,
      url: '',
      list: [],
      nowItem: {}
    }
  },
  methods: {
    getList () {
      this.$refs.player.pause()
      this.loading = true
      this.$ajax({
        url: '/server/voice/list',
        params: {s: 2},
        done: (data = []) => {
          data.forEach(i => {
            i.voiceList && i.voiceList.forEach(i => {
              i.isPlay = false
            })
          })
          this.list = data
        },
        always: () => {
          this.loading = false
        }
      })
    },
    play (i) {
      if (this.nowItem.id !== i.id) {
        this.nowItem.isPlay = false
      }

      this.nowItem = i

      i.isPlay = !i.isPlay

      if (i.isPlay) {
        NProgress.start()
        this.$refs.player.src = filePath + i.backMusicPath
        this.$refs.player.onloadedmetadata = () => {
          NProgress.done()
          this.$refs.player.play()
        }
      } else {
        this.$refs.player.pause()
      }
    },
    move (i, code) {
      this.$ajax({
        url: '/server/voice/sort',
        method: 'post',
        params: {
          voice_id: i.id,
          order: code
        },
        done: () => {
          this.$message.success('操作成功')
          this.getList()
        }
      })
    },
    online (i) {
      this.loading = true
      this.$ajax({
        url: '/server/voice/online',
        method: 'post',
        params: {
          voice_id: i.id,
          s: 1
        },
        done: () => {
          this.$message.success('上架成功')
          this.getList()
        },
        always: () => {
          this.loading = false
        }
      })
    },
    del (i) {
      this.$confirm(`确定删除${i.voiceName}`, '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$ajax({
          url: '/server/voice/delete',
          method: 'post',
          params: {
            voice_id: i.id
          },
          done: () => {
            this.$message.success('删除成功')
            this.getList()
          }
        })
      }).catch(() => {})
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="less">
  @import '~@/less/varibles';
  #temp-offline{

    .templist-wrapper{
      border-bottom:1px solid #ffffff;
      .templist-title{line-height: 50px;padding-left: 12px;background: @dark2;color: #ffffff;}
      .el-row{border-bottom:1px solid @gray;height: 58px;line-height: 58px;}
      .col-left{
        padding-left: 20px;
        .song-logo{width: 42px;height: 42px;}
        div,.song-logo{float: left;}
        .song-logo{margin: 8px 10px 0;width: 42px;height: 42px;background: no-repeat center;background-size: cover;}
      }
      .ctrl-btn{width: 24px;height: 24px;float: left;margin-top: 16px;cursor: pointer;}
    }

  }
</style>
