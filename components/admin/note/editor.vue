<template>
  <div class="form">
    <div class="formtit">
      <el-input placeholder="标签" class="inputtags" v-model="note.tags"></el-input>
      <div class="rightbtn">
        <i class="fa fa-edit" title="编辑" v-show="act=='show'" @click="act='edit'"></i>
        <i class="fa fa-eye" title="查看" v-show="act!='show'" @click="act='show'"></i>
        <i class="fa fa-save" @click="save" title="保存"></i>
      </div>
    </div>
    <el-input placeholder="请输入标题" v-model="note.title"></el-input>
    <mavon-editor class="editor" v-model="note.content"></mavon-editor>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props: ['cateid', 'noteid'],
  data() {
    return {
      act: 'show',
      note: {
        tags: '',
        title: '',
        content: '',
        addtime: new Date(),
        id: 0
      }
    }
  },
  watch: {
    cateid(newval, oldval) {
      this.note.cid = newval
    },
    noteid(newval, oldval) {
      if (newval === 0) {
        this.act = 'add'
        this.note.id = 0
        this.note.tags = ''
        this.note.title = ''
        this.note.content = ''
        this.note.addtime = new Date()
      } else {
        this.act = 'show'
        this.getnote(newval)
      }
    }
  },
  created() {

  },
  methods: {
    async getnote(id) {
      let result = await axios.get('/api/notes/' + id)
      this.note = result.data
    },
    save() {
      var params = {
        title: this.note.title,
        content: this.note.content,
        cid: this.note.cid,
        tags: this.note.tags,
        addtime: new Date(this.note.addtime).getTime(),
        id: this.note.id
      }
      var url = ''
      if (this.note.id === 0) {
        url = '/api/notes/add'
        axios.post(url, params).then((res) => {
          if (res.data.id) {
            this.$message({
              message: '添加成功',
              duration: 2000,
              onClose: () => {
                this.note.id = res.data.id
                this.act = 'show'
                this.$emit('updatenotes')
              }
            })
          }
        })
      } else {
        url = '/api/notes/update'
        axios.post(url, params).then((res) => {
          if (res.data.rows > 0) {
            this.$message({
              message: '更新成功',
              duration: 2000,
              onClose: () => {
                this.act = 'show'
                this.$emit('updatenotes')
              }
            })
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.form{
  height: 100%;
}
.inputtags{
  width: 500px;
}
.rightbtn{
  float: right;
  line-height: 35px;
  margin-right: 10px;
}
.rightbtn i{
  cursor: pointer;
}
.editor{
  height: calc(100% - 80px);
}
</style>
